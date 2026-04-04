import Issue from "../models/Issue.js";

const ISSUE_POPULATE_FIELDS = "username email";
const MAX_NEARBY_DISTANCE_METERS = 5000;

const isValidGeoPoint = location => {
  const coordinates = location?.coordinates;

  return (
    location?.type === "Point" &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every(value => Number.isFinite(Number(value))) &&
    Math.abs(Number(coordinates[0])) <= 180 &&
    Math.abs(Number(coordinates[1])) <= 90
  );
};

const getDistanceInMeters = (fromLat, fromLng, toLat, toLng) =>
  Math.round(
    Math.sqrt(
      ((toLat - fromLat) * 111000) ** 2 +
      ((toLng - fromLng) * 111000 * Math.cos((fromLat * Math.PI) / 180)) ** 2
    )
  );

const serializeIssue = issue => {
  const issueDoc = issue.toObject ? issue.toObject({ virtuals: true }) : issue;

  return {
    ...issueDoc,
    description: issueDoc.description || issueDoc.discription || "",
    upvoteCount: Array.isArray(issueDoc.upvote) ? issueDoc.upvote.length : 0
  };
};

export const createIssue = async (req, res) => {
  try {
    const { description, category, lat, lng } = req.body;
    const userId = req.userId;
    const image = req.file?.path;
    const numericLat = parseFloat(lat);
    const numericLng = parseFloat(lng);

    if (!description?.trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    if (!Number.isFinite(numericLat) || !Number.isFinite(numericLng)) {
      return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
    }

    if (Math.abs(numericLat) > 90 || Math.abs(numericLng) > 180) {
      return res.status(400).json({ success: false, message: "Location coordinates are out of range" });
    }

    const issue = new Issue({
      user: userId,
      description: description.trim(),
      category,
      image,
      location: {
        type: "Point",
        coordinates: [numericLng, numericLat]
      }
    });

    await issue.save();

    res.json({ success: true, issue: serializeIssue(issue) });

  } catch (error) {
    console.error("createIssue error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating issue"
    });
  }
};

export const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { category, status, search, sortBy } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.discription = { $regex: search, $options: "i" };
    }

    let issues = await Issue.find(query)
      .populate("user", ISSUE_POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    if (sortBy === "upvotes") {
      issues = issues.sort((a, b) => (b.upvote?.length || 0) - (a.upvote?.length || 0));
    }

    if (sortBy === "oldest") {
      issues = issues.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    issues = issues.slice(skip, skip + limit).map(serializeIssue);

    res.json({
      success: true,
      page,
      issues
    });

  } catch (err) {
    res.json({ success: false, message: "Error fetching issues" });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id)
      .populate("user", ISSUE_POPULATE_FIELDS);

    if (!issue) {
      return res.json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue: serializeIssue(issue) });

  } catch (err) {
    res.json({ success: false, message: "Error fetching issue" });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const { issueId } = req.body;
    const userId = req.userId;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.json({ success: false, message: "Issue not found" });
    }

    const alreadyVoted = issue.upvote.some(id => id.toString() === userId);

    if (alreadyVoted) {
      // remove vote
      issue.upvote = issue.upvote.filter(
        id => id.toString() !== userId
      );
    } else {
      
      issue.upvote.push(userId);
    }

    await issue.save();

    res.json({
      success: true,
      totalUpvote: issue.upvote.length,
      hasUpvoted: issue.upvote.some(id => id.toString() === userId)
    });

  } catch (err) {
    res.json({ success: false, message: "Error updating vote" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { issueId, status } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.json({ success: false, message: "Issue not found" });
    }

    issue.status = status;

    await issue.save();

    res.json({ success: true, issue });

  } catch (err) {
    res.json({ success: false, message: "Error updating status" });
  }
};
export const getNearbyIssues = async (req, res) => {
  try {
    const { lat, lng, category, status, search, sortBy } = req.query;

    const numericLat = parseFloat(lat);
    const numericLng = parseFloat(lng);

    if (!Number.isFinite(numericLat) || !Number.isFinite(numericLng)) {
      return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
    }

    let issues;

    try {
      issues = await Issue.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [numericLng, numericLat]
            },
            $maxDistance: MAX_NEARBY_DISTANCE_METERS
          }
        }
      }).populate("user", ISSUE_POPULATE_FIELDS);
    } catch (geoError) {
      console.error("getNearbyIssues geospatial fallback:", geoError);

      const allIssues = await Issue.find({})
        .populate("user", ISSUE_POPULATE_FIELDS);

      issues = allIssues.filter(issue => isValidGeoPoint(issue.location));
    }

    issues = issues
      .map(issue => {
        const serializedIssue = serializeIssue(issue);
        const [issueLng, issueLat] = serializedIssue.location?.coordinates || [];

        const distance = Number.isFinite(issueLng) && Number.isFinite(issueLat)
          ? getDistanceInMeters(numericLat, numericLng, issueLat, issueLng)
          : null;

        return {
          ...serializedIssue,
          distance
        };
      })
      .filter(issue => issue.distance == null || issue.distance <= MAX_NEARBY_DISTANCE_METERS)
      .filter(issue => !category || issue.category === category)
      .filter(issue => !status || issue.status === status)
      .filter(issue => !search || issue.description.toLowerCase().includes(search.toLowerCase()));

    if (sortBy === "upvotes") {
      issues.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sortBy === "distance") {
      issues.sort((a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER));
    } else {
      issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, issues });

  } catch (err) {
    res.json({ success: false, message: "Error fetching nearby issues" });
  }
};

export const getMyIssues = async (req, res) => {
  try {
    const userId = req.userId;

    const issues = await Issue.find({ user: userId })
      .populate("user", ISSUE_POPULATE_FIELDS)
      .sort({ createdAt: -1 });

    const serializedIssues = issues.map(serializeIssue);
    const totalUpvotes = serializedIssues.reduce((sum, issue) => sum + issue.upvoteCount, 0);

    res.json({
      success: true,
      issues: serializedIssues,
      totalUpvotes
    });
  } catch (err) {
    res.json({ success: false, message: "Error fetching user issues" });
  }
};
