import BaseRepository from './baseRepo.js';
import charRoomModel from '../models/chatRoomModel.js'

class ChatRoomRepository extends BaseRepository {
    constructor() {
        super(charRoomModel);
    }
}

export default ChatRoomRepository;
