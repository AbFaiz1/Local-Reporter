import mongoose from "mongoose";
import dotenv from "dotenv";
import Issue from "../models/Issue.js";

dotenv.config();

const normalizeLocation = location => {
  if (Array.isArray(location) && location.length === 2) {
    const [lng, lat] = location.map(Number);

    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return {
        type: "Point",
        coordinates: [lng, lat]
      };
    }
  }

  if (location?.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
    const [rawLng, rawLat] = location.coordinates;
    const lng = Number(rawLng);
    const lat = Number(rawLat);

    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return {
        type: "Point",
        coordinates: [lng, lat]
      };
    }
  }

  return null;
};

try {
  await mongoose.connect(process.env.MONGOOSE_URI);

  const issues = await Issue.find({}).lean();
  let fixedCount = 0;
  let invalidCount = 0;

  for (const issue of issues) {
    const normalizedLocation = normalizeLocation(issue.location);

    if (!normalizedLocation) {
      invalidCount += 1;
      console.log(`Skipping invalid location for issue ${issue._id}`);
      continue;
    }

    const changed =
      issue.location?.type !== normalizedLocation.type ||
      !Array.isArray(issue.location?.coordinates) ||
      issue.location.coordinates.some((value, index) => Number(value) !== normalizedLocation.coordinates[index]);

    if (!changed) {
      continue;
    }

    await Issue.updateOne(
      { _id: issue._id },
      { $set: { location: normalizedLocation } }
    );

    fixedCount += 1;
    console.log(`Fixed location for issue ${issue._id}`);
  }

  console.log(`Done. Fixed ${fixedCount} issues. Skipped ${invalidCount} invalid issues.`);
} catch (error) {
  console.error("Failed to repair issue locations:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
