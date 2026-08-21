import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Helper to safely upload file or fallback to Data URI
const safeUpload = async (file) => {
    if (!file) return null;
    try {
        const fileUri = getDataUri(file);
        if (!fileUri) return null;

        if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                return cloudResponse.secure_url;
            } catch (cloudErr) {
                console.warn("Cloudinary company logo upload failed, using Data URI fallback:", cloudErr.message);
                return fileUri.content;
            }
        }
        return fileUri.content;
    } catch (err) {
        console.error("Company logo upload error:", err.message);
        return null;
    }
};

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName || !companyName.trim()) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let existingCompany = await Company.findOne({ name: companyName.trim(), userId: req.id });
        if (existingCompany) {
            return res.status(400).json({
                message: "You have already registered a company with this name.",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName.trim(),
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Register company error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error registering company.",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in recruiter id
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            companies: companies || [],
            success: true
        });
    } catch (error) {
        console.error("Get company error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error retrieving companies.",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Get company by ID error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error retrieving company details.",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        if (file) {
            const logoUrl = await safeUpload(file);
            if (logoUrl) {
                updateData.logo = logoUrl;
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Update company error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error updating company.",
            success: false
        });
    }
};