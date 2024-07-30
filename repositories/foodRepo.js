import BaseRepository from './baseRepo.js';
import foodModel from "../models/foodModel.js";

class FoodRepository  extends BaseRepository {
    constructor() {
        super(foodModel);
    }
}

export default FoodRepository;
