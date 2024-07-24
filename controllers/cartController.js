import userModel from "../models/userModel.js"

/**
 * Add items to user cart
 *
 * @param {Object} req - The request object containing userId and itemId
 * @param {Object} res - The response object
 */
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        const cartData = userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
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
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        const cartData = userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
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
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        const cartData = userData.cartData;
        res.status(200).json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart }
