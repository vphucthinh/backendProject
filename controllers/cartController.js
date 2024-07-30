
class CartController {
    constructor({ cartService }) {
        this.service = cartService;
    }
    /**
     * Add items to user cart
     *
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
     addToCart = async (req, res) => {
        try {
           await this.service.addToCart(req, res);
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
            await this.service.removeFromCart(req, res);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Fetch user cart data
     *
     * @param {Object} req - The request object containing userId in params
     * @param {Object} res - The response object
     */
    getCart = async (req, res) => {
        try {
            await this.service.getCart(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error' });
        }
    };

}


export default CartController;
