import { Query } from "mongoose";
import Issue from "../models/Issue.js";

export const createIssue = async (req, res) => {
  try {
    const { description, category, lat, lng } = req.body;
    const userId = req.userId;
    const image = req.file?.path;

    const issue = new Issue({
      user: userId,
      description,
      category,
      image,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    await issue.save();

    res.json({ success: true, issue });

  } catch (error) {
    res.json({ success: false, message: "Error creating issue" });
  }
};

export const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { category, status, search, sortBy } = req.query;
    const query = {};
    if(category) query.category = category;
    if(status) query.status = status;
    
   if(search){}
    // sorting
        let sortOption = { createdAt: -1 };
      if( sortBy === "upvotes"){
        sortOption = { upvotes: -1};
      }
    const issues = await Issue.find(query)
      .populate("user", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

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
      .populate("user", "name email");

    if (!issue) {
      return res.json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue });

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

    const alreadyVoted = issue.upvote.includes(userId);

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
      totalUpvote: issue.upvote.length
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
    const { lat, lng } = req.query;

    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5 km
        }
      }
    }).populate("user", "username");

    res.json({ success: true, issues });

  } catch (err) {
    res.json({ success: false, message: "Error fetching nearby issues" });
  }
};