const { Server } = require('socket.io');

const { getChats, getMessagesByChat, getAllActiveUsers } = require('../domain/db');
const { serializeJson } = require('../domain/utils');
const logger = require('../domain/logger');

let io = null;

function createSio(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket) => {
    logger.info('[sio] New connection... sending init data');

    const chats = await getChats();

    chats.forEach(async (chat) => {
      let messages = await getMessagesByChat(chat.id);
      chat['messages'] = messages;
      chat['lastMessage'] = messages?.[0];
      io.emit('chatUpdate', serializeJson(chat));
    });

    const users = await getAllActiveUsers();
    users.forEach((user) => {
      io.emit('userUpdate', serializeJson(user));
    });
  });
}

function getIo() {
  return io;
}

module.exports = {
  createSio,
  getIo
};
