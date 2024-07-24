import cartRouter from "./cartRoute.js";
import { static as expressStatic } from "express";
import userRouter from "./userRoute.js";
import orderRouter from "./orderRoute.js";
import profileRouter from "./profileRoute.js";
import chatRoomRouter from "./chatRoomRoute.js";
import foodRouter from "./foodRoute.js";

export const routes = (app) => {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With, content-type, x-access-token, authorization',
        );
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.removeHeader('X-Powered-By');
        next();
    });

    // app.use('/api/food', foodRouter);
    // app.use('/images', expressStatic('uploads'));
    app.use('/api/user', userRouter);
    // app.use('/api/cart', cartRouter);
    // app.use('/api/order', orderRouter);
    // app.use('/api/profile', profileRouter);
    // app.use('/api/chat', chatRoomRouter);
};
