import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {createIssue, getIssueById, getIssues, getMyIssues, getNearbyIssues, toggleUpvote, updateStatus } from "../controller/issueController.js";
import upload from '../middleware/upload.js';
const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createIssue);
router.get("/", getIssues);
router.get("/nearby", getNearbyIssues);
router.get("/mine", authMiddleware, getMyIssues);
router.post("/upvote", authMiddleware, toggleUpvote);
router.post("/status", authMiddleware, updateStatus);
router.get("/:id", getIssueById);

export default router;
