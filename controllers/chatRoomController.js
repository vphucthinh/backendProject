import makeValidation from "@withvoid/make-validation";
import ChatRoomModel from "../models/chatRoomModel.js";
import ChatMessageModel from "../models/chatMessageModel.js";
import {getUserByIds} from "./userController.js";
import mongoose, {isValidObjectId} from "mongoose";
import userModel from "../models/userModel.js";

export default {
    isValidObjectId : (id) => {
        return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
    },
     initiate : async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    userIds: {
                        type: types.array,
                        options: { unique: true, empty: false, stringOnly: true }
                    },
                }
            }));

            if (!validation.success) return res.status(400).json({ success: false, message: 'Invalid user IDs', errors: validation.errors });

            const userIds = req.body.userIds;
            const foundUsers = await userModel.find({ '_id': { $in: userIds } });

            if (foundUsers.length !== userIds.length) return res.status(404).json({ success: false, message: 'One or more user IDs not found' });

            const validUserIds = userIds.filter(isValidObjectId).map(id => new mongoose.Types.ObjectId(id));

            if (validUserIds.length !== userIds.length) {
                return res.status(400).json({ success: false, message: 'Invalid user IDs provided' });
            }

            // Validate chatInitiator and convert to ObjectId
            const chatInitiator = req.body.userId; // Ensure this is set by your auth middleware
            console.log(chatInitiator);
            if (!isValidObjectId(chatInitiator)) {
                return res.status(400).json({ success: false, message: 'Invalid chat initiator ID' });
            }
            const chatInitiatorId = new mongoose.Types.ObjectId(chatInitiator);

            const allUserIds = [...validUserIds, chatInitiatorId];
            const chatRoom = await ChatRoomModel.initiateChat(allUserIds, chatInitiatorId);

            return res.status(200).json({ success: true, chatRoom });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    },

    postMessage: async (req, res) => {
        try {
        const { roomId } = req.params;
        const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
                messageText: { type: types.string },
            }
        }));

        if (!validation.success) return res.status(400).json({ ...validation });

        const messagePayload = {
            messageText: req.body.messageText,
        };

        const currentLoggedUser = req.body.userId;
        const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);

        global.io.sockets.in(roomId).emit('new message', { message: post });
        return res.status(200).json({ success: true, post });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    } },

    getRecentConversation: async (req, res) => {
        try {
            const currentLoggedUser = req.body.userId;
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
            const roomIds = rooms.map(room => room._id);
            const recentConversation = await ChatMessageModel.getRecentConversation(
                roomIds, options, currentLoggedUser
            );
            return res.status(200).json({ success: true, conversation: recentConversation });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    getConversationByRoomId: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            console.log(room)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }
            const users = await getUserByIds(room.userIds);
            console.log(users)
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
            return res.status(200).json({
                success: true,
                conversation,
                users,
            });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, error });

        }
    },

    markConversationReadByRoomId: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }

            const currentLoggedUser = req.body.userId;
            console.log(currentLoggedUser)
            const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error });
        }
    },
}