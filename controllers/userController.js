import UserService from "../services/userService.js";

class UserController {
    constructor({ userService }) {
        this.service = userService;
    }

    /**
     * Login user
     *
     * @param {Object} req - The request object containing email and password
     * @param {Object} res - The response object
     */
    async loginUser(req, res) {
        const { email, password } = req.body;
        console.log(email, password);

        try {
            const { user, token } = await this.service.loginUser(email, password);
            return res.status(200).json({ success: true, token });
        } catch (error) {
            console.error("Error during login: ", error.message);
            return res.status(401).json({ success: false, message: error.message });
        }
    }

    /**
     * Register user
     *
     * @param {Object} req - The request object containing name, email, and password
     * @param {Object} res - The response object
     */
    async registerUser(req, res) {
        const { name, password, email } = req.body;

        try {
            const { token } = await this.service.registerUser(name, email, password);
            return res.status(201).json({ success: true, token });
        } catch (error) {
            console.error("Error during registration: ", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Fetch user profile
     *
     * @param {Object} req - The request object containing userId
     * @param {Object} res - The response object
     */
    async getProfile(req, res) {
        try {
            const userId = req.query.userId || req.body.userId;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const userProfile = await this.service.getProfile(userId);
            return res.status(200).json({ success: true, data: userProfile });
        } catch (error) {
            console.error("Error fetching user profile: ", error.message);
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    /**
     * Get users by their IDs
     *
     * @param {Object} req - The request object containing an array of user IDs
     * @param {Object} res - The response object
     */
    async getUserByIds(req, res) {
        const { ids } = req.body;

        try {
            const users = await this.service.getUserByIds(ids);
            return res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error("Error fetching users by IDs: ", error.message);
            return res.status(500).json({ success: false, message: "An error occurred while fetching the users" });
        }
    }
}

export default UserController;
