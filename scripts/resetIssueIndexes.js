import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGOOSE_URI, {
    serverSelectionTimeoutMS: 5000
  });

  const collection = mongoose.connection.db.collection("issues");
  const indexes = await collection.indexes();

  for (const index of indexes) {
    if (index.name === "_id_") {
      continue;
    }

    await collection.dropIndex(index.name);
    console.log(`Dropped index: ${index.name}`);
  }

  await collection.createIndex({ location: "2dsphere" }, { name: "location_2dsphere" });
  console.log("Created index: location_2dsphere");
  console.log("Issue indexes reset successfully.");
} catch (error) {
  console.error("Failed to reset issue indexes:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
