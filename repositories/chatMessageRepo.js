import BaseRepository from './baseRepo.js';
import chatMessageModel from '../models/chatRoomModel.js'

class ChatMessageRepository extends BaseRepository {
    constructor() {
        super(chatMessageModel);
    }
}

export default ChatMessageRepository;
