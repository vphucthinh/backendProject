import express from 'express';
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import {makeInvoker} from "awilix-express";

const foodController = makeInvoker((container) => ({
    addFood: (req, res) => container.foodController.addFood(req, res),
    removeFood: (req, res) => container.foodController.removeFood(req, res),
    listFood: (req, res) => container.foodController.listFood(req, res),
    updateFood: (req, res) => container.foodController.updateFood(req, res),
}));

const foodRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - image
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the food item
 *         name:
 *           type: string
 *           description: The name of the food item
 *         description:
 *           type: string
 *           description: A brief description of the food item
 *         price:
 *           type: number
 *           description: The price of the food item
 *         image:
 *           type: string
 *           description: The URL of the food item's image
 *         category:
 *           type: string
 *           description: The category to which the food item belongs
 *       example:
 *         id: d5fE_asz
 *         name: Pizza
 *         description: A delicious cheese and tomato pizza
 *         price: 10.5
 *         image: "uploads/1627384953821pizza.jpg"
 *         category: Italian
 */

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: The food managing API
 */

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/v1/food/add:
 *   post:
 *     summary: Adds a new food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: The food item was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
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

foodRouter.post("/add", authMiddleware, upload.single("image"), foodController("addFood"));

/**
 * @swagger
 * /api/v1/food/list:
 *   get:
 *     summary: Returns the list of all the food items
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
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

foodRouter.get("/list", authMiddleware, foodController("listFood"));

/**
 * @swagger
 * /api/v1/food/remove:
 *   delete:
 *     summary: Removes a food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: The food item was successfully removed
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

foodRouter.delete("/remove", authMiddleware, foodController("removeFood"));

/**
 * @swagger
 * /api/v1/food/update:
 *   put:
 *     summary: update a food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: The food item was successfully updated
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

foodRouter.put("/remove", authMiddleware, foodController("updateFood"));

export default foodRouter;
