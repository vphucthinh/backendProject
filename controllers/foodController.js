import fs from 'fs';

class FoodController {
    constructor({ foodService }) {
        this.foodService = foodService;
    }

    /**
     * Add a new food item
     *
     * @param {Object} req - The request object containing the food details and file
     * @param {Object} res - The response object
     */
    addFood = async (req, res) => {
        try {
            await this.foodService.addFood(req, res);
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
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
            await this.foodService.listFood(req, res);
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
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
            await this.foodService.removeFood(req, res);
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error" });
        }
    }
}

export default FoodController;
