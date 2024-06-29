import express from 'express';
// controllers
import ChatRoomController from '../controllers/chatRoomController.js';
import authMiddleware from "../middleware/auth.js";

const chatRoomRouter = express.Router();

chatRoomRouter.get('/',authMiddleware, ChatRoomController.getRecentConversation)
chatRoomRouter.get('/:roomId',authMiddleware, ChatRoomController.getConversationByRoomId)
chatRoomRouter.post('/initiate',authMiddleware, ChatRoomController.initiate)
chatRoomRouter.post('/:roomId/message', authMiddleware, ChatRoomController.postMessage)
chatRoomRouter.put('/:roomId/mark-read', authMiddleware, ChatRoomController.markConversationReadByRoomId)

export default chatRoomRouter;