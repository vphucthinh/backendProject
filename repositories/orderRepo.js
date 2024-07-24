import BaseRepository from './baseRepo.js';
import orderModel from '../models/orderModel.js'

class OrderRepository  extends BaseRepository {
    constructor() {
        super(orderModel);
    }
}

export default OrderRepository;
