import express from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *         - amount
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         userId:
 *           type: string
 *           description: The id of the user who placed the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *           description: The items included in the order
 *         amount:
 *           type: number
 *           description: The total amount of the order
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zip:
 *               type: string
 *           description: The address where the order will be delivered
 *         status:
 *           type: string
 *           description: The current status of the order
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the order was placed
 *         payment:
 *           type: boolean
 *           description: The payment status of the order
 *       example:
 *         id: 60c72b2f9b1d4c23d8efb9a9
 *         userId: 5f8d0d55b54764421b7156c7
 *         items:
 *           - name: Pizza
 *             quantity: 2
 *             price: 20
 *           - name: Soda
 *             quantity: 1
 *             price: 5
 *         amount: 45
 *         address:
 *           street: 123 Main St
 *           city: Anytown
 *           state: CA
 *           zip: 90210
 *         status: Food Processing
 *         date: 2021-06-15T14:12:00Z
 *         payment: false
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Places a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The order was successfully placed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
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

orderRouter.post("/place", authMiddleware, placeOrder);

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     summary: Verifies an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The order was successfully verified
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

orderRouter.post("/verify", authMiddleware, verifyOrder);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     summary: Returns the orders of a user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The list of the user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

orderRouter.post("/userorders", authMiddleware, userOrders);

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     summary: Returns the list of all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

orderRouter.get("/list", authMiddleware, listOrders);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     summary: Updates the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: The order status was successfully updated
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

orderRouter.post("/status", authMiddleware, updateStatus);


export default orderRouter;
