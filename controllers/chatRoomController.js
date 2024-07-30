import makeValidation from "@withvoid/make-validation";
import mongoose from "mongoose";

class ChatRoomController {
    constructor({
                    chatRoomService,
                    chatMessageService,
                    userService,
                }) {
        this.chatRoomService = chatRoomService;
        this.chatMessageService = chatMessageService;
        this.userService = userService;
    }

    isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
    }

    async initiate(req, res) {
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

            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user IDs',
                    errors: validation.errors
                });
            }

            const userIds = req.body.userIds;
            const foundUsers = await this.userService.find({ '_id': { $in: userIds } });

            if (foundUsers.length !== userIds.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more user IDs not found'
                });
            }

            const validUserIds = userIds.filter(this.isValidObjectId).map(id => new mongoose.Types.ObjectId(id));

            if (validUserIds.length !== userIds.length) {
                return res.status(400).json({ success: false, message: 'Invalid user IDs provided' });
            }

            const chatInitiator = req.body.userId;
            if (!this.isValidObjectId(chatInitiator)) {
                return res.status(400).json({ success: false, message: 'Invalid chat initiator ID' });
            }
            const chatInitiatorId = new mongoose.Types.ObjectId(chatInitiator);

            const allUserIds = [...validUserIds, chatInitiatorId];
            const chatRoom = await this.chatRoomService.initiateChat(allUserIds, chatInitiatorId);

            return res.status(200).json({ success: true, chatRoom });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }

    async postMessage(req, res) {
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
            const post = await this.chatMessageService.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);

            global.io.sockets.in(roomId).emit('new message', { message: post });
            return res.status(200).json({ success: true, post });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRecentConversation(req, res) {
        try {
            const currentLoggedUser = req.body.userId;
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const rooms = await this.chatRoomService.getChatRoomsByUserId(currentLoggedUser);
            const roomIds = rooms.map(room => room._id);
            const recentConversation = await this.chatMessageService.getRecentConversation(
                roomIds, options, currentLoggedUser
            );
            return res.status(200).json({ success: true, conversation: recentConversation });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getConversationByRoomId(req, res) {
        try {
            const { roomId } = req.params;
            const room = await this.chatRoomService.getChatRoomByRoomId(roomId);
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                });
            }
            const users = await this.userService.find({ '_id': { $in: room.userIds } });
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const conversation = await this.chatMessageService.getConversationByRoomId(roomId, options);
            return res.status(200).json({
                success: true,
                conversation,
                users,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async markConversationReadByRoomId(req, res) {
        try {
            const { roomId } = req.params;
            const room = await this.chatRoomService.getChatRoomByRoomId(roomId);
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                });
            }

            const currentLoggedUser = req.body.userId;
            const result = await this.chatMessageService.markMessageRead(roomId, currentLoggedUser);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default ChatRoomController;
