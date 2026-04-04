import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoute.js"
import issueRoute from "./routers/issueRoute.js"
import commentRoute from "./routers/commentRoute.js";
import { rateLimit } from "express-rate-limit";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", rateLimit)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issue", issueRoute);
app.use("/api/comments", commentRoute);

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