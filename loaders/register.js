import {asClass, asValue, createContainer, InjectionMode} from 'awilix';
import userRepo from "../repositories/userRepo.js";
import orderRepo from "../repositories/orderRepo.js";
import foodRepo from "../repositories/foodRepo.js";
import chatMessageRepo from "../repositories/chatMessageRepo.js";
import chatRoomRepo from "../repositories/chatRoomRepo.js";

import UserService from "../services/userService.js";
import OrderService from "../services/orderService.js";
import FoodService from "../services/foodService.js";
import CartService from "../services/cartService.js";
import ChatRoomService from "../services/chatRoomService.js";
import ChatMessageService from "../services/chatMessageService.js";

import UserController from '../controllers/userController.js';
import OrderController from "../controllers/orderController.js";
import FoodController from "../controllers/foodController.js";
import CartController from "../controllers/cartController.js";
import ChatRoomController from "../controllers/chatRoomController.js";


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
    foodService:asClass(FoodService).singleton(),
    cartService:asClass(CartService).singleton(),
    chatRoomService:asClass(ChatRoomService).singleton(),
    chatMessageService:asClass(ChatMessageService).singleton(),

});

// Controller register
container.register({
    userController: asClass(UserController).singleton(),
    orderController: asClass(OrderController).singleton(),
    foodController: asClass(FoodController).singleton(),
    cartController: asClass(CartController).singleton(),
    chatRoomController: asClass(ChatRoomController).singleton(),

});

export default container
