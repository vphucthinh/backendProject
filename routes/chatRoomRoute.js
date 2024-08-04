import express from 'express';
import authMiddleware from "../middleware/auth.js";
import {makeInvoker} from "awilix-express";

const chatRoomController = makeInvoker((container) => ({
    getRecentConversation: (req, res) => container.chatRoomController.getRecentConversation(req, res),
    getConversationByRoomId: (req, res) => container.chatRoomController.getConversationByRoomId(req, res),
    initiate: (req, res) => container.chatRoomController.initiate(req, res),
    postMessage: (req, res) => container.chatRoomController.postMessage(req, res),
    markConversationReadByRoomId: (req, res) => container.chatRoomController.markConversationReadByRoomId(req, res),

}));

const chatRoomRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReadByRecipient:
 *       type: object
 *       properties:
 *         readByUserId:
 *           type: string
 *           description: ID of the user who read the message
 *         readAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was read
 *     ChatMessage:
 *       type: object
 *       properties:
 *         chatRoomId:
 *           type: string
 *           description: ID of the chat room
 *         message:
 *           type: object
 *           description: Content of the message
 *         type:
 *           type: string
 *           description: Type of the message
 *           default: text
 *         postedByUser:
 *           type: string
 *           description: ID of the user who posted the message
 *         readByRecipients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReadByRecipient'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was last updated
 *     ChatRoom:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID of the chat room
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of users in the chat room
 *         chatInitiator:
 *           type: string
 *           description: ID of the user who initiated the chat room
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chat room was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chat room was last updated
 */

/**
 * @swagger
 * /api/v1/chatRoom:
 *   get:
 *     summary: Get recent conversations for the current user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ChatRoom
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversation:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.get('/',authMiddleware, chatRoomController("getRecentConversation"))

/**
 * @swagger
 * /api/v1/chatRoom/{roomId}:
 *   get:
 *     summary: Get conversation by room ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ChatRoom
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversation:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: No room exists for this ID
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.get('/:roomId',authMiddleware, chatRoomController("getConversationByRoomId"))

/**
 * @swagger
 * /api/v1/chatRoom/initiate:
 *   post:
 *     summary: Initiate a chat room
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ChatRoom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 chatRoom:
 *                   $ref: '#/components/schemas/ChatRoom'
 *       400:
 *         description: Invalid user IDs
 *       404:
 *         description: One or more user IDs not found
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.post('/initiate',authMiddleware, chatRoomController("initiate"))

/**
 * @swagger
 * /api/v1/chatRoom/{roomId}/message:
 *   post:
 *     summary: Post a message in a chat room
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ChatRoom
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageText:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 post:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.post('/:roomId/message', authMiddleware, chatRoomController("postMessage"))

/**
 * @swagger
 * /api/v1/chatroom/{roomId}/markRead:
 *   put:
 *     summary: Mark conversation as read by room ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ChatRoom
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: No room exists for this ID
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.put('/:roomId/markRead', authMiddleware, chatRoomController("markConversationReadByRoomId"))

export default chatRoomRouter;