import BaseService from "./baseService.js";
import paginationMapper from "../mappers/paginationMapper.js";

class CartService extends BaseService  {
    constructor({userRepository, foodRepository}) {
        super(userRepository,'cart',paginationMapper.toPagination );
        this.foodRepo = foodRepository;

    }
    /**
     * Add one unit of quantity for item in user cart
     * @description add one unit of quantity for item in user cart.
     *              If the item doesn't exist in cart , the item will be added in cart with one unit of quantity
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
     addOneToItem = async (req, res) => {
        try {
            const userData = await this.repo.findById(req.body.userId);
            const cartData = userData.cartData;

            if (!cartData[req.body.itemId]) {
                cartData[req.body.itemId] = 1;
            } else {
                cartData[req.body.itemId] += 1;
            }
            console.log(cartData);
            await this.repo.update(req.body.userId, { cartData });
            res.status(200).json({ success: true, message: "Added To Cart" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Add an item to user cart
     * @description add an item to user cart
     *              If the item exist in cart , the item will increase with given quantity
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */

    addItemToCart = async (req, res) => {
        try {
            const userData = await this.repo.findById(req.body.userId);
            const cartData = userData.cartData;

            if(!cartData[req.body.itemId]) {
                cartData[req.body.itemId] = req.body.quantity
                await this.repo.update(req.body.userId, { cartData });
                res.status(200).json({ success: true, message: "Item is added To Cart" });
            }
            else if(cartData[req.body.itemId]) {
                cartData[req.body.itemId] += req.body.quantity
                await this.repo.update(req.body.userId, { cartData });
                res.status(200).json({ success: true, message: "Item is added To Cart" });
            }
            else {
                res.status(400).json({ success: false, message: "Item does not exist in our list" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * reduce one unit of quantity from item in user cart
     * @description Reduce one unit of quantity from item.
     *              If item reach to zero , it will be deleted
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
     removeOneFromItem = async (req, res) => {
        try {
            const userData = await this.repo.findById(req.body.userId);
            const cartData = userData.cartData;
            if (cartData[req.body.itemId] > 0) {
                cartData[req.body.itemId] -= 1;

                await this.repo.update(req.body.userId, { cartData });
                res.status(200).json({ success: true, message: "Removed From Cart" });
            }
            else if(cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId]
                await this.repo.update(req.body.userId, { cartData });
            }
            else {
                res.status(400).json({ success: false, message: "The item doesn't exist" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Remove an item from user cart
     *
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
    removeItemFromCart = async (req, res) => {
        try {
            const userId = req.body.userId;
            const itemId = req.body.itemId;

            // Fetch the user's data
            const userData = await this.repo.findById(userId);
            const cartData = userData.cartData;

            // Check if the item exists in the cart
            if (cartData[itemId]) {
                // Remove the item from the cart
                delete cartData[itemId];

                // Update the user's data with the modified cartData
                await this.repo.update(userId, { cartData });

                res.status(200).json({ success: true, message: "Item removed from cart" });
            } else {
                res.status(400).json({ success: false, message: "The item doesn't exist in the cart" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error removing item from cart" });
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

     checkItemId = async (itemId) => {
        try{
            const result = await this.foodRepo.findById(itemId);
            if (!result) {
                return null;
            }
            else {
                return true;
            }

        } catch (error) {
            throw error;
        }
    }

}

export default CartService;