import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// Public routes (anyone can browse and view jobs)
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

// Protected routes (recruiter actions)
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;
