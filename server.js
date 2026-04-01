import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoute.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

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