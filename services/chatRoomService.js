import baseService from "./baseService.js";
import paginationMapper from "../mappers/paginationMapper.js";

class ChatRoomService extends baseService {
    constructor({chatRoomRepository}){
       super(chatRoomRepository, "chatRoom",paginationMapper.toPagination);
    }

    initiateChat = async function (
        userIds, chatInitiator
    ) {
        try {
            const availableRoom = await this.repo.findOne({
                userIds: {
                    $size: userIds.length,
                    $all: [...userIds],
                },
            });
            if (availableRoom) {
                return {
                    isNew: false,
                    message: 'retrieving an old chat room',
                    chatRoomId: availableRoom._id,
                };
            }

            const newRoom = await this.create({ userIds, chatInitiator });
            return {
                isNew: true,
                message: 'creating a new chatroom',
                chatRoomId: newRoom._id,
            };
        } catch (error) {
            console.log('error on start chat method', error);
            throw error;
        }
    }

    getChatRoomByRoomId = async function (roomId) {
        try {
            const room = await this.repo.findOne({ _id: roomId });
            return room;
        } catch (error) {
            throw error;
        }
    }

    getChatRoomsByUserId = async function (userId) {
        try {
            const rooms = await this.repo.find({ userIds: { $all: [userId] } });
            return rooms;
        } catch (error) {
            throw error;
        }
    }
}

export default ChatRoomService