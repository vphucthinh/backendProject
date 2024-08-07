import paginationMapper from '../mappers/paginationMapper.js';
import BaseService from "./baseService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


class UserService extends BaseService {
    constructor({ userRepository }) {
        super(userRepository, 'user', paginationMapper.toPagination);
        this.repo = userRepository;
    }

    /**
     * Utility function to create a JWT token
     *
     * @param {string} id - The user ID
     * @param {string} username - the username
     * @returns {string} - The JWT token
     */
     createToken(id, username) {
        return jwt.sign({ id: id, username: username}, process.env.JWT_SECRET, { expiresIn: '1d' });
    }

    /**
     * Login user
     *
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @returns {Promise<Object>} - The user object and JWT token
     * @throws {Error} - Throws an error if the login fails
     */
    async loginUser(email, password) {
        const user = await this.repo.findOne({ email });

        if (!user) {
            throw new Error("User does not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = this.createToken(user._id);
        return { user, token };
    }

    /**
     * Register user
     *
     * @param {string} name - The user's name
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @returns {Promise<Object>} - The new user object and JWT token
     * @throws {Error} - Throws an error if the registration fails
     */
    async registerUser(name, email, password) {
        const exists = await this.repo.findOne({ email });

        if (exists) {
            throw new Error("User already exists");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Please enter a valid email");
        }

        if (password.length < 8) {
            throw new Error("Please enter a strong password");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Create and save the new user
        let newUser;
        try {
            newUser = await this.repo.createAndSave({
                name,
                email,
                password: hashedPassword,
            });
            console.log("User saved to database:", newUser);
        } catch (error) {
            console.error("Error saving user to database:", error);
            throw new Error("Error saving user to database");
        }

        // Generate a JWT token
        const token = this.createToken(newUser._id,name);
        return { newUser, token };
    }

    /**
     * Fetch user profile
     *
     * @param {string} userId - The user ID
     * @returns {Promise<Object>} - The user profile object
     * @throws {Error} - Throws an error if the user profile retrieval fails
     */
    async getProfile(userId) {
        const userProfile = await this.repo.find({ _id: userId });

        if (!userProfile) {
            throw new Error("User does not exist");
        }

        return userProfile;
    }

    /**
     * Get users by their IDs
     *
     * @param {Array<string>} ids - The array of user IDs
     * @returns {Promise<Array<Object>>} - A promise that resolves to the array of user objects
     * @throws {Error} - Throws an error if the operation fails
     */
    async getUserByIds(ids) {
        try {
            const users = await this.repo.find({ _id: { $in: ids } });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async updateUserProfile(userId, updateData) {
        try {
            // Update the user profile and return the updated document
            const profile = await this.repo.update({ _id: userId }, updateData);
            console.log(profile)

            // If the profile is not found, return null
            if (!profile) {
                throw new Error('User not found');

            }

            return profile;
        } catch (error) {
            // Handle any errors that occur during the update process
            console.error(error);
            throw error;
        }
    }


    async deleteUser(id) {
        try {
            // Find the user by ID
            const user = await this.repo.findOne({ _id: id });

            // If the user is not found, return a 404 response
            if (!user) {
                throw new Error("User does not exist");
            }

            // Delete the user
            await this.repo.delete({ _id: id });

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}

export default UserService;
