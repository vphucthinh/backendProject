import baseService from "./baseService.js";
import paginationMapper from "../mappers/paginationMapper.js";

class ChatMessageService extends baseService {
    constructor({chatMessageRepository}) {
        super(chatMessageRepository, "chatMessage", paginationMapper.toPagination);

    }

    /**
     * This method will create a post in chat
     *
     * @param {String} chatRoomId - id of chat room
     * @param {Object} message - message you want to post in the chat room
     * @param {String} postedByUser - user who is posting the message
     */

    createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
        try {
            const post = await this.repo.create({
                chatRoomId,
                message,
                postedByUser,
                readByRecipients: { readByUserId: postedByUser }
            });
            console.log(post);
            const aggregate = await this.repo.aggregate([
                // get post where _id = post._id
                { $match: { _id: post._id } },
                // do a join on another table called users, and
                // get me a user whose _id = postedByUser
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postedByUser',
                        foreignField: '_id',
                        as: 'postedByUser',
                    }
                },
                { $unwind: '$postedByUser' },
                // do a join on another table called chatrooms, and
                // get me a chatroom whose _id = chatRoomId
                {
                    $lookup: {
                        from: 'chatrooms',
                        localField: 'chatRoomId',
                        foreignField: '_id',
                        as: 'chatRoomInfo',
                    }
                },
                { $unwind: '$chatRoomInfo' },
                { $unwind: '$chatRoomInfo.userIds' },
                // do a join on another table called users, and
                // get me a user whose _id = userIds
                {
                    $lookup: {
                        from: 'users',
                        localField: 'chatRoomInfo.userIds',
                        foreignField: '_id',
                        as: 'chatRoomInfo.userProfile',
                    }
                },
                { $unwind: '$chatRoomInfo.userProfile' },
                // group data
                {
                    $group: {
                        _id: '$chatRoomInfo._id',
                        postId: { $last: '$_id' },
                        chatRoomId: { $last: '$chatRoomInfo._id' },
                        message: { $last: '$message' },
                        type: { $last: '$type' },
                        postedByUser: { $last: '$postedByUser' },
                        readByRecipients: { $last: '$readByRecipients' },
                        chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                        createdAt: { $last: '$createdAt' },
                        updatedAt: { $last: '$updatedAt' },
                    }
                }
            ]);
            console.log(aggregate)
            return post;
        } catch (error) {
            throw error;
        }
    }

        /**
         * @param {String} chatRoomId - chat room id
         */
        getConversationByRoomId = async function (chatRoomId, options = {}) {
        try {
            return this.repo.aggregate([
                { $match: { chatRoomId } },
                { $sort: { createdAt: -1 } },
                // do a join on another table called users, and
                // get me a user whose _id = postedByUser
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postedByUser',
                        foreignField: '_id',
                        as: 'postedByUser',
                    }
                },
                { $unwind: "$postedByUser" },
                // apply pagination
                { $skip: options.page * options.limit },
                { $limit: options.limit },
                { $sort: { createdAt: 1 } },
            ]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {String} chatRoomId - chat room id
     * @param {String} currentUserOnlineId - user id
     */
    markMessageRead = async function (chatRoomId, currentUserOnlineId) {
        try {
            return this.repo.updateMany(
                {
                    chatRoomId,
                    'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
                },
                {
                    $addToSet: {
                        readByRecipients: { readByUserId: currentUserOnlineId }
                    }
                },
                {
                    multi: true
                }
            );
        } catch (error) {
            throw error;
        }
    }

        /**
         * @param {Array} chatRoomIds - chat room ids
         * @param {{ page, limit }} options - pagination options
         * @param {String} currentUserOnlineId - user id
         */
        getRecentConversation = async function (chatRoomIds, options, currentUserOnlineId) {
        try {
            return this.repo.aggregate([
                { $match: { chatRoomId: { $in: chatRoomIds } } },
                {
                    $group: {
                        _id: '$chatRoomId',
                        messageId: { $last: '$_id' },
                        chatRoomId: { $last: '$chatRoomId' },
                        message: { $last: '$message' },
                        type: { $last: '$type' },
                        postedByUser: { $last: '$postedByUser' },
                        createdAt: { $last: '$createdAt' },
                        readByRecipients: { $last: '$readByRecipients' },
                    }
                },
                { $sort: { createdAt: -1 } },
                // do a join on another table called users, and
                // get me a user whose _id = postedByUser
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postedByUser',
                        foreignField: '_id',
                        as: 'postedByUser',
                    }
                },
                { $unwind: "$postedByUser" },
                // do a join on another table called chatrooms, and
                // get me room details
                {
                    $lookup: {
                        from: 'chatrooms',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'roomInfo',
                    }
                },
                { $unwind: "$roomInfo" },
                { $unwind: "$roomInfo.userIds" },
                // do a join on another table called users
                {
                    $lookup: {
                        from: 'users',
                        localField: 'roomInfo.userIds',
                        foreignField: '_id',
                        as: 'roomInfo.userProfile',
                    }
                },
                { $unwind: "$readByRecipients" },
                // do a join on another table called users
                {
                    $lookup: {
                        from: 'users',
                        localField: 'readByRecipients.readByUserId',
                        foreignField: '_id',
                        as: 'readByRecipients.readByUser',
                    }
                },

                {
                    $group: {
                        _id: '$roomInfo._id',
                        messageId: { $last: '$messageId' },
                        chatRoomId: { $last: '$chatRoomId' },
                        message: { $last: '$message' },
                        type: { $last: '$type' },
                        postedByUser: { $last: '$postedByUser' },
                        readByRecipients: { $addToSet: '$readByRecipients' },
                        roomInfo: { $addToSet: '$roomInfo.userProfile' },
                        createdAt: { $last: '$createdAt' },
                    },
                },
                // apply pagination
                { $skip: options.page * options.limit },
                { $limit: options.limit },
            ]);
        } catch (error) {
            throw error;
        }
    }
}

export default ChatMessageService









