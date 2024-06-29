import express from 'express';
// controllers
import deleteController from '../controllers/delete.js';

const deleteChatRoom = express.Router();

deleteChatRoom.delete('/room/:roomId', deleteController.deleteRoomById)
deleteChatRoom.delete('/message/:messageId', deleteController.deleteMessageById)

export default deleteChatRoom;