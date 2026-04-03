import mongoose from "mongoose";

const issueSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    discription: {
        type: String,
        required: true
    },
    category: {
    type: String,
    enum: ["road", "water", "electricity", "other"],
    required: true
  },
    status: {
        type: String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending"
    },
    image: {
        type: String 
    },
    location: {
       type: {
        type: String,
        enum: ["Point"],
        required: true
       },
       coordinates: {
        type: [Number], //lng lat
        required: true
       }
    },
    upvote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]   
    

}, {timestamps: true});

issueSchema.index({ location: "2dsphere" });
export default mongoose.model("Issue", issueSchema);