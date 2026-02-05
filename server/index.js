import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

//Test route
app.get("/",(req, res)=>res.send("MERN Starter API running..."));

//DB connection
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB connected")).catch(err=>console.error(err));

app.listen(5000,()=>console.log("Server running on port 5000"));