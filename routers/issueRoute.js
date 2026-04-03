import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {createIssue, getIssueById, getIssues, getNearbyIssues, toggleUpvote, updateStatus } from "../controller/issueController.js";
import upload from '../middleware/upload.js';
const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createIssue);
router.get("/", getIssues);
router.get("/:id", getIssueById);
router.post("/upvote", authMiddleware, toggleUpvote);
router.post("/status", authMiddleware, updateStatus);
router.get("/nearby", getNearbyIssues);

export default router;