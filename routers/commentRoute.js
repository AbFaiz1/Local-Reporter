import express from "express";
import { addComment, getComments } from "../controller/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/:issueId", getComments);
export default router;
