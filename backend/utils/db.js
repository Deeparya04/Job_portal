import mongoose from "mongoose";
import { seedDatabase } from "./seedData.js";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jobportal";
        console.log(`Connecting to MongoDB...`);
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected successfully!');
        
        // Seed initial demo data if database is fresh
        await seedDatabase();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('\nTIP: Make sure MongoDB is running locally (mongodb://127.0.0.1:27017/jobportal) or set a valid MONGO_URI in backend/.env (e.g. MongoDB Atlas cluster).\n');
    }
}
export default connectDB;