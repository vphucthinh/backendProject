import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import UserModel from "../models/userModel.js";

// Utility function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create a token for the authenticated user
        const token = createToken(user._id);
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error during login: ", error);
        return res.status(500).json({ success: false, message: "An error occurred during login" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create a token for the new user
        const token = createToken(user._id);
        return res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error during registration: ", error);
        return res.status(500).json({ success: false, message: "An error occurred during registration" });
    }
};

// Fetch user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch user profile by ID
        const userProfile = await userModel.findOne({ _id: userId });

        if (!userProfile) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Send success response with user profile data
        return res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        console.error("Error fetching user profile: ", error);
        return res.status(500).json({ success: false, message: "An error occurred while fetching the user profile" });
    }
};

const getUserByIds = async function (ids) {
    try {
        const users = await UserModel.find({ _id: { $in: ids } });
        return users;
    } catch (error) {
        throw error;
    }
}

export { loginUser, registerUser, getProfile, getUserByIds };
