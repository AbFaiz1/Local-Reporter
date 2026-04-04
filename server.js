import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoute.js"
import issueRoute from "./routers/issueRoute.js"
import commentRoute from "./routers/commentRoute.js";
import { limiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issue", issueRoute);
app.use("/api/comments", commentRoute);

app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);

    if (err?.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.code === "LIMIT_FILE_SIZE" ? "File is too large. Max size is 15MB." : err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: err?.message || "Internal server error"
    });
});

//Test Route
 app.get("/", (req, res)=> {
    res.send("Backend Is runnning");
 });

// Connect Mongoose
mongoose.connect(process.env.MONGOOSE_URI).then(()=> console.log("DB IS CONNECTED")).catch((err)=> console.log(err));

//PORT CONNECT
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});
