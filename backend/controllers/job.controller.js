import { Job } from "../models/job.model.js";

// Recruiter posts job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill in all required job fields.",
                success: false
            });
        }

        const requirementsArray = Array.isArray(requirements) 
            ? requirements 
            : requirements.split(",").map(r => r.trim()).filter(Boolean);

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience || 0,
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job posted successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Post job error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error posting job.",
            success: false
        });
    }
};

// Get all jobs (student / browse)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        let query = {};
        
        if (keyword.trim()) {
            query = {
                $or: [
                    { title: { $regex: keyword.trim(), $options: "i" } },
                    { description: { $regex: keyword.trim(), $options: "i" } },
                    { location: { $regex: keyword.trim(), $options: "i" } },
                    { jobType: { $regex: keyword.trim(), $options: "i" } },
                ]
            };
        }

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error retrieving jobs.",
            success: false
        });
    }
};

// Get job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "company" })
            .populate({ path: "applications" });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.error("Get job by ID error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error retrieving job details.",
            success: false
        });
    }
};

// Get jobs created by logged-in recruiter
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });
    } catch (error) {
        console.error("Get admin jobs error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error retrieving posted jobs.",
            success: false
        });
    }
};
