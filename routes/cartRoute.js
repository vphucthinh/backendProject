import express from "express";
import authMiddleware from "../middleware/auth.js";
import {makeInvoker} from "awilix-express";

const cartController = makeInvoker((container) => ({
    addToCart: (req, res) => container.cartController.addToCart(req, res),
    removeFromCart: (req, res) => container.cartController.removeFromCart(req, res),
    getCart: (req, res) => container.cartController.getCart(req, res),
}));


const cartRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartAction:
 *       type: object
 *       required:
 *         - userId
 *         - itemId
 *       properties:
 *         userId:
 *           type: string
 *           description: The id of the user
 *         itemId:
 *           type: string
 *           description: The id of the item
 *       example:
 *         userId: 60c72b2f9b1e8e0f8d2e7b12
 *         itemId: 50c72b2f9b1e8e0f8d2e7b15
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the action was successful
 *         message:
 *           type: string
 *           description: Response message
 *       example:
 *         success: true
 *         message: "Action Success"
 *     CartData:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the action was successful
 *         cartData:
 *           type: object
 *           additionalProperties:
 *             type: number
 *       example:
 *         success: true
 *         cartData:
 *           50c72b2f9b1e8e0f8d2e7b15: 2
 *           50c72b2f9b1e8e0f8d2e7b16: 1
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart managing API
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add an item to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartAction'
 *     responses:
 *       200:
 *         description: The item was successfully added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 */

cartRouter.post("/add", authMiddleware, cartController("addToCart"))

/**
 * @swagger
 * /api/v1/cart/get/{userId}:
 *   get:
 *     summary: Fetch the user's cart data
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the user
 *     responses:
 *       200:
 *         description: The cart data was successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartData'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

cartRouter.get("/get/:userId", authMiddleware, cartController("getCart"))

/**
 * @swagger
 * /api/v1/cart/remove:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartAction'
 *     responses:
 *       200:
 *         description: The item was successfully removed from the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 */

cartRouter.delete("/remove", authMiddleware, cartController("removeFromCart"))


export default cartRouter;