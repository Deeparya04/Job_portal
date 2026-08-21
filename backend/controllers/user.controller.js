import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const getSecretKey = () => process.env.SECRET_KEY || "jobportal_jwt_secret_key_2026_secure";

// Helper to safely upload to Cloudinary or fallback to Data URI
const safeUpload = async (file) => {
    if (!file) return null;
    try {
        const fileUri = getDataUri(file);
        if (!fileUri) return null;

        // If cloudinary credentials exist, try uploading
        if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                return cloudResponse.secure_url;
            } catch (cloudErr) {
                console.warn("Cloudinary upload failed, falling back to Data URI:", cloudErr.message);
                return fileUri.content;
            }
        }
        return fileUri.content;
    } catch (err) {
        console.error("File upload error:", err.message);
        return null;
    }
};

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all required fields.",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'A user with this email already exists.',
                success: false,
            });
        }

        let profilePhotoUrl = "";
        const file = req.file;
        if (file) {
            profilePhotoUrl = (await safeUpload(file)) || "";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error during registration.",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Please provide email, password, and role.",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: `Account is registered as a ${user.role}, not ${role}.`,
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const secretKey = getSecretKey();
        const token = jwt.sign(tokenData, secretKey, { expiresIn: '1d' });

        const sanitizedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: 'lax' 
            })
            .json({
                message: `Welcome back, ${user.fullname}!`,
                user: sanitizedUser,
                token,
                success: true
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error during login.",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error during logout.",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        let resumeUrl = null;
        if (file) {
            resumeUrl = await safeUpload(file);
        }

        let skillsArray;
        if (skills) {
            if (Array.isArray(skills)) {
                skillsArray = skills;
            } else {
                skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
            }
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;
      
        if (resumeUrl && file) {
            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error updating profile.",
            success: false
        });
    }
};