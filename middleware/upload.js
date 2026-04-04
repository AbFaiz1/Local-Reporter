import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "issues",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "mp4"]
  })
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024
  }
});

export default upload;
