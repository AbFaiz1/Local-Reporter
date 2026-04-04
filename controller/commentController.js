import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;

    const comment = await Comment.create({
      user: req.userId,
      issue: issueId,
      text
    });

    res.json({ success: true, comment });

  } catch (err) {
    res.json({ success: false, message: "Error adding comment" });
  }
};


export const getComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    const comments = await Comment.find({ issue: issueId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });

  } catch (err) {
    res.json({ success: false, message: "Error fetching comments" });
  }
};
