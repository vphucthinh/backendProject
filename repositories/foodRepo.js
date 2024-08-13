import BaseRepository from './baseRepo.js';
import foodModel from "../models/foodModel.js";
import cloudinary from "cloudinary";

class FoodRepository  extends BaseRepository {
    constructor() {
        super(foodModel);
    }

    /*async uploadImage(filePath) {
        return await cloudinary.uploader.upload(filePath, {
            folder: 'uploads',
        });
    }*/
}

export default FoodRepository;
