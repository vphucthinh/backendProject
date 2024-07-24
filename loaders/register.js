import { asClass, createContainer, InjectionMode } from 'awilix';
import userRepo from "../repositories/userRepo.js";
import orderRepo from "../repositories/orderRepo.js";
import foodRepo from "../repositories/foodRepo.js";
import chatMessageRepo from "../repositories/chatMessageRepo.js";
import chatRoomRepo from "../repositories/chatRoomRepo.js";

import UserService from "../services/userService.js";
import OrderService from "../services/orderService.js";

import UserController from '../controllers/userController.js';
import OrderController from "../controllers/orderController.js";


const container = createContainer({
    injectionMode: InjectionMode.PROXY,
});

// Repository register
container.register({
    userRepository: asClass(userRepo).singleton(),
    orderRepository: asClass(orderRepo).singleton(),
    foodRepository: asClass(foodRepo).singleton(),
    chatMessageRepository: asClass(chatMessageRepo).singleton(),
    chatRoomRepository: asClass(chatRoomRepo).singleton(),
});

// Mapper register
container.register({

});

// Service register
container.register({
    userService: asClass(UserService).singleton(),
    orderService: asClass(OrderService).singleton(),
});

// Controller register
container.register({
    userController: asClass(UserController).singleton(),
    orderController: asClass(OrderController).singleton(),
});

export default container
