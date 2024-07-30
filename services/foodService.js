import BaseService from "./baseService.js";
import fs from "fs";
import paginationMapper from "../mappers/paginationMapper.js";
import foodModel from "../models/foodModel.js";

class FoodService extends BaseService {
    constructor({ foodRepository }) {
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

    updateFood = async (req, res) => {
        try {
            // Destructure the id and the update data from the request body
            const { id, ...updateData } = req.body;

            // Find the food item by ID and update it with the new data
            const updatedFood = await this.repo.findByIdAndUpdate(id, updateData, {
                new: true, // Return the updated document
                runValidators: true // Ensure the update operation runs validators
            });

            // If the food item is not found, return a 404 error
            if (!updatedFood) {
                return res.status(404).json({ message: 'Food item not found' });
            }

            // Return the updated food item
            res.status(200).json(updatedFood);
        } catch (error) {
            // Handle any errors that occur during the update process
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };

}

export default FoodService;