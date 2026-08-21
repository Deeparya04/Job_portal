import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

export const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log("Database already contains data, skipping seeder.");
            return;
        }

        console.log("Seeding initial demo data...");

        const hashedPassword = await bcrypt.hash("123456", 10);

        // 1. Create Recruiter
        const recruiter = await User.create({
            fullname: "Demo Recruiter",
            email: "recruiter@example.com",
            phoneNumber: "9876543210",
            password: hashedPassword,
            role: "recruiter",
            profile: {
                bio: "Lead Technical Recruiter at Top Tech Companies",
                skills: ["Recruitment", "HR", "Talent Acquisition"],
                profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            }
        });

        // 2. Create Student
        const student = await User.create({
            fullname: "Demo Student",
            email: "student@example.com",
            phoneNumber: "9123456780",
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Full Stack Developer looking for exciting opportunities",
                skills: ["React", "Node.js", "JavaScript", "MongoDB", "Express", "Tailwind CSS"],
                profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
        });

        // 3. Create Companies
        const googleCompany = await Company.create({
            name: "Google",
            description: "A global leader in technology, specializing in internet-related services and products.",
            website: "https://google.com",
            location: "Bangalore",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            userId: recruiter._id
        });

        const microsoftCompany = await Company.create({
            name: "Microsoft",
            description: "Empowering every person and every organization on the planet to achieve more.",
            website: "https://microsoft.com",
            location: "Hyderabad",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
            userId: recruiter._id
        });

        const amazonCompany = await Company.create({
            name: "Amazon",
            description: "Earth's most customer-centric company, leader in e-commerce and cloud computing.",
            website: "https://amazon.com",
            location: "Delhi NCR",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            userId: recruiter._id
        });

        // 4. Create Jobs
        await Job.create([
            {
                title: "Frontend Developer (React)",
                description: "We are seeking a talented Frontend Developer proficient in React.js, Tailwind CSS, and Redux to build delightful user experiences.",
                requirements: ["React.js", "JavaScript", "Redux Toolkit", "Tailwind CSS", "HTML5/CSS3"],
                salary: 12,
                experienceLevel: 2,
                location: "Bangalore",
                jobType: "Full Time",
                position: 4,
                company: googleCompany._id,
                created_by: recruiter._id
            },
            {
                title: "Backend Developer (Node.js & MongoDB)",
                description: "Looking for an experienced Backend Engineer to architect scalable RESTful APIs, microservices, and database systems.",
                requirements: ["Node.js", "Express.js", "MongoDB", "REST APIs", "System Design"],
                salary: 15,
                experienceLevel: 3,
                location: "Hyderabad",
                jobType: "Full Time",
                position: 2,
                company: microsoftCompany._id,
                created_by: recruiter._id
            },
            {
                title: "Full Stack Engineer (MERN)",
                description: "Join our core team to develop end-to-end features using React, Node.js, Express, and MongoDB.",
                requirements: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
                salary: 18,
                experienceLevel: 3,
                location: "Delhi NCR",
                jobType: "Full Time",
                position: 3,
                company: amazonCompany._id,
                created_by: recruiter._id
            },
            {
                title: "Junior Web Developer",
                description: "Great opportunity for aspiring web developers to work on high-impact customer portals and internal tools.",
                requirements: ["JavaScript", "HTML/CSS", "React basics", "Git"],
                salary: 6,
                experienceLevel: 1,
                location: "Pune",
                jobType: "Full Time",
                position: 5,
                company: googleCompany._id,
                created_by: recruiter._id
            }
        ]);

        console.log("Demo data seeded successfully!");
        console.log("-> Demo Recruiter: recruiter@example.com / 123456");
        console.log("-> Demo Student:   student@example.com / 123456");
    } catch (error) {
        console.error("Error seeding database:", error.message);
    }
};
