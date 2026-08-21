import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
};

app.use(cors(corsOptions));

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    return res.status(200).json({
        status: "ok",
        databaseConnected: isDbConnected,
        message: isDbConnected ? "Server and Database are healthy!" : "Server is running, but MongoDB is not connected."
    });
});

// Middleware to check database connection on API requests
app.use("/api/v1", (req, res, next) => {
    if (req.path === "/health") return next();
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "MongoDB database is not connected. Please ensure MongoDB is running locally or set a valid MONGO_URI in backend/.env",
            success: false,
            dbDisconnected: true
        });
    }
    next();
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});