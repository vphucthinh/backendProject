import BaseRepository from './baseRepo.js';
import chatMessageModel from '../models/chatMessageModel.js'

class ChatMessageRepository extends BaseRepository {
    constructor() {
        super(chatMessageModel);
    }
}

export default ChatMessageRepository;
