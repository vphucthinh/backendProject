import BaseService from "./baseService.js";
import fs from "fs";
import paginationMapper from "../mappers/paginationMapper.js";
import cloudinary from '../config/cloudinaryConfig.js';

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
        try {
            // Upload image to Cloudinary
            const imageUploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', // Optional: Folder in Cloudinary where images will be stored
            });

            // Check if food already exists
            const foundFood = await this.repo.find({ name: req.body.name });
            console.log(foundFood);

            if (foundFood.length === 0) {
                // Create and save new food item with Cloudinary image URL
                const food = await this.repo.createAndSave({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category,
                    image: imageUploadResponse.secure_url // Use Cloudinary URL instead of local filename
                });

                res.status(200).json({ success: true, message: "Success", food: food });
            } else {
                res.status(400).json({ success: false, message: "Food item already exists" });
            }
        } catch (error) {
            console.error('Error adding food:', error);
            res.status(500).json({ success: false, message: "Internal server error", error });
        }
    };

    /**
     * List all food items
     *
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */
    listFood = async (req, res) => {
        try {
            const foods = await this.repo.find({});
            res.status(200).json({ success: true, data: foods });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    /**
     * List all food items with pagination
     *
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     */

    listSomeFood = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const sort = req.query.sort ? JSON.parse(req.query.sort) : { _id: 1 }; // Optionally get sorting from query params

        try {
            const paginatedResult = await this.getPage(page, perPage, sort);
            res.status(200).json({ success: true,  paginatedResult });
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
             const food = await this.repo.findById(req.body.id);
             fs.unlink(`uploads/${food.image}`, () => {
             });

             await this.repo.delete(req.body.id);
             res.status(200).json({success: true, message: "Food Removed Successfully"});
         } catch (error) {
             console.log(error);
             res.status(500).json({success: false, message: "Error"});
         }
     }

    updateFood = async (req, res) => {
        try {
            // Destructure the id and the update data from the request body
            const {foodId,...updateData} = req.body;

            // Find the food item by ID and update it with the new data
            const updatedFood = await this.repo.update(foodId, updateData, {
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
     uploadImage = async (filePath) => {
        return await cloudinary.uploader.upload(filePath, {
            folder: 'uploads',
        });
    }

}

export default FoodService;