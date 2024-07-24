import BaseRepository from './baseRepo.js';
import userModel from '../models/userModel.js'

class UserRepository extends BaseRepository {
    constructor() {
        super(userModel);
    }
}

export default UserRepository;
