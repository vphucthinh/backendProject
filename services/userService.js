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
     * @returns {string} - The JWT token
     */
     createToken(id) {
        return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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

        console.log(user);

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
        const token = this.createToken(newUser._id);
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

}

export default UserService;
