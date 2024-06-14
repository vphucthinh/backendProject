import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const uri = process.env.DB_URI;

if (!uri) {
    console.error("MongoDB connection URI is not defined in environment variables.");
    process.exit(1); // Exit process with failure
}

export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};
