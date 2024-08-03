import fs from 'fs';

class FoodController {
    constructor({ foodService }) {
        this.service = foodService;
    }

    /**
     * Add a new food item
     *
     * @param {Object} req - The request object containing the food details and file
     * @param {Object} res - The response object
     */
    addFood = async (req, res) => {
        try {
            await this.service.addFood(req, res);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * List all food items
     *
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */
    listFood = async (req, res) => {
        try {
            await this.service.listFood(req, res);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * Remove a food item
     *
     * @param {Object} req - The request object containing the food item ID
     * @param {Object} res - The response object
     */
    removeFood = async (req, res) => {
        try {
            const isExistFoodId = req.body.id
            if(isExistFoodId){
                await this.service.removeFood(req, res);
            }
            else {
                res.status(404).json({ success: false, message: "Not Found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    updateFood = async (req, res) => {
        try {
            const isExistFoodId = req.body.foodId
            console.log(req.body)
            if(isExistFoodId) {
                await this.service.updateFood(req, res);
            }
            else {
                res.status(404).json({ success: false, message: "Not Found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }
}

export default FoodController;
