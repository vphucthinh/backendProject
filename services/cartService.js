import BaseService from "./baseService.js";
import paginationMapper from "../mappers/paginationMapper.js";

class CartService extends BaseService  {
    constructor({userRepository}) {
        super(userRepository,'cart',paginationMapper.toPagination );

    }
    /**
     * Add items to user cart
     *
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
     addToCart = async (req, res) => {
        try {
            const userData = await this.repo.findById(req.body.userId);
            const cartData = userData.cartData;
            if (!cartData[req.body.itemId]) {
                cartData[req.body.itemId] = 1;
            } else {
                cartData[req.body.itemId] += 1;
            }
            await this.repo.findByIdAndUpdate(req.body.userId, { cartData });
            res.status(200).json({ success: true, message: "Added To Cart" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Remove items from user cart
     *
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
     removeFromCart = async (req, res) => {
        try {
            const userData = await this.repo.findById(req.body.userId);
            const cartData = userData.cartData;
            if (cartData[req.body.itemId] > 0) {
                cartData[req.body.itemId] -= 1;
            }
            await this.repo.findByIdAndUpdate(req.body.userId, { cartData });
            res.status(200).json({ success: true, message: "Removed From Cart" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Fetch user cart data
     *
     * @param {Object} req - The request object containing userId
     * @param {Object} res - The response object
     */
    getCart = async (req, res) => {
        try {
            // Get the userId from the URL parameters
            const { userId } = req.params;

            // Find the user by ID
            const userData = await this.repo.findById(userId);

            // If the user is not found, return a 404 error
            if (!userData) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Extract the cart data from the user data
            const cartData = userData.cartData;

            // Return the cart data
            res.status(200).json({ success: true, cartData });
        } catch (error) {
            // Handle any errors that occur during the process
            console.error(error);
            res.status(500).json({ success: false, message: 'Error' });
        }
    };

}

export default CartService;