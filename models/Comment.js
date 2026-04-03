import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("Comment", commentSchema);