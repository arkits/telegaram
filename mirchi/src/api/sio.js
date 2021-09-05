const { Server } = require('socket.io');

const { getChats, getMessagesByChat, getAllActiveUsers } = require('../domain/db');
const { serializeJson } = require('../domain/utils');
const logger = require('../domain/logger');
const { garamCache } = require('../domain/cache');

let io = null;

function createSio(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket) => {
    // New connection actions - START
    logger.info('[sio] New connection... Sending init payloads');

    // Publish Active Chats
    const chats = await getChats();
    chats.forEach(async (chat) => {
      let messages = await getMessagesByChat(chat.id);
      chat['messages'] = messages;
      chat['lastMessage'] = messages?.[0];
      io.emit('chatUpdate', serializeJson(chat));
    });

    // Publish Active User's data
    const users = await getAllActiveUsers();
    users.forEach((user) => {
      io.emit('userUpdate', serializeJson(user));
    });

    // Publish TDLib Connection State
    io.emit('tdlibConnectionState', garamCache.tdlibConnectionState);

    // New connection action - END

    // SIO Events
    socket.on('req_getMessages', (msg) => {
      logger.info('[sio] req_getMessages');
      io.emit('res_getMessages', msg);
    });

    socket.on('req_sendMessage', (req) => {
      logger.info('[sio] req_sendMessage', req);
      garamCache.airgram.api
        .sendMessage({
          chatId: parseInt(req?.chatId),
          inputMessageContent: {
            _: 'inputMessageText',
            text: {
              _: 'formattedText',
              text: req?.text
            }
          }
        })
        .then((payload) => {
          logger.info('[sio] response sendMessage', payload);
        })
        .catch((err) => {
          logger.error('[sio] response sendMessage', err);
        });
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
