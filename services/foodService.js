import BaseService from "./baseService.js";
import fs from "fs";
import paginationMapper from "../mappers/paginationMapper.js";

class FoodService extends BaseService {
    constructor(foodRepository) {
        super(foodRepository,'food',paginationMapper.toPagination );
        this.repo = foodRepository;
    }

    /**
     * Add a new food item
     *
     * @param {Object} req - The request object containing the food details and file
     * @param {Object} res - The response object
     */
    addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    try{
        const food = new this.repo.createAndSave({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });
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
        const foods = await this.repo.find({});
        res.json({ success: true, data: foods });
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
             const food = await this.repo.findById(req.body.id);
             fs.unlink(`uploads/${food.image}`, () => {
             });

             await this.repo.findByIdAndDelete(req.body.id);
             res.json({success: true, message: "Food Removed"});
         } catch (error) {
             console.log(error);
             res.json({success: false, message: "Error"});
         }
     }

}