const { Server } = require('socket.io');

const { getChats, getMessagesByChat, getAllActiveUsers } = require('../domain/db');
const { serializeJson } = require('../domain/utils');
const logger = require('../domain/logger');
const { garamCache } = require('../domain/cache');
const { toObject } = require('@airgram/core');
const { response } = require('express');
const { trimLocalPathPrefix } = require('../domain/utils');

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

    let me = await garamCache.airgram.api.getMe();
    me = toObject(me);
    io.emit('meUpdate', me);

    // New connection action - END

    // SIO Events
    socket.on('req_chatRefresh', (payload) => {
      logger.info('[sio] req_chatRefresh', payload);

      // getChat
      garamCache.airgram.api
        .getChat({
          chatId: parseInt(payload?.chatId)
        })
        .then((res) => {
          logger.debug('getChat res=%s', JSON.stringify(res));

          // Display Chat Photo
          if (res?.response?.photo?.small?.local?.path) {
            // Photo has already been downloaded locally
            io.emit('event_chatPhotoUpdate', {
              chatId: payload?.chatId,
              profilePhotoPath: trimLocalPathPrefix(res?.response?.photo?.small?.local?.path)
            });
          } else {
            // Download Photo remotely and emit SIO

            let photoFileId = res?.response?.photo?.small?.id;
            if (photoFileId === null) {
              logger.error('photoFileId - photoId not found res=%s', JSON.stringify(res));
              return;
            }

            garamCache.airgram.api
              .downloadFile({
                fileId: photoFileId,
                priority: 1,
                synchronous: true
              })
              .then((res) => {
                logger.debug('downloadFile - res=%s', JSON.stringify(res));

                if (res?.response?._ === 'error') {
                  logger.error('downloadFile - returned error! res=%s', JSON.stringify(res));
                  return;
                }

                if (!res?.response?.local?.path) {
                  logger.error(
                    'downloadFile - res did not have local.path! res=%s',
                    JSON.stringify(res)
                  );
                  return;
                }

                io.emit('event_chatPhotoUpdate', {
                  chatId: payload?.chatId,
                  profilePhotoPath: trimLocalPathPrefix(res?.response?.local?.path)
                });
              });
          }
        });

      /*
      garamCache.airgram.api
        .getChatHistory({
          chatId: parseInt(payload?.chatId),
          fromMessageId: 0,
          limit: 100
        })
        .then((res) => {
          logger.info('getChatHistory response=%s', JSON.stringify(res));
        });
        */

      io.emit('req_chatRefresh', payload);
    });

    socket.on('req_sendMessage', (req) => {
      logger.info('[sio] req_sendMessage', JSON.stringify(req));
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
        .then((res) => {
          logger.info('[sio] response sendMessage', JSON.stringify(res));
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
