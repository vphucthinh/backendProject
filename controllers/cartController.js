class CartController {
    constructor({ cartService }) {
        this.service = cartService;
    }
    /**
     * Add an item to user cart
     *
     * @param {Object} req - The request object containing userId and itemId
     * @param {Object} res - The response object
     */
    addOneToItem = async (req, res) => {
        try {
            const checkedItem = await this.service.checkItemId(req.body.itemId);
            if(checkedItem) {
                await this.service.addOneToItem(req, res);
            }
            else {
                res.status(400).json({ success: true, message: "Item does not exist" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    addItemToCart = async (req, res) => {
        try {
            const checkedItem = await this.service.checkItemId(req.body.itemId);
            if(checkedItem) {
                await this.service.addItemToCart(req, res);
            }
            else {
                res.status(400).json({ success: false, message: "Item does not exist" });
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
    removeOneFromItem = async (req, res) => {
        try {
            const checkedItem = await this.service.checkItemId(req.body.itemId);
            if(checkedItem) {
                await this.service.removeOneFromItem(req, res);
            }
            else {
                res.status(400).json({ success: false, message: "Item does not exist" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    removeItemFromCart = async (req, res) => {
        try {
            const checkedItem = await this.service.checkItemId(req.body.itemId);
            if(checkedItem) {
                await this.service.removeItemFromCart(req, res);
            }
            else {
                res.status(400).json({ success: false, message: "Item does not exist" });
            }
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
