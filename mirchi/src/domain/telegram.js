const { Airgram, Auth, prompt, toObject } = require('airgram');
const { getIo } = require('../api/sio');
const {
  handleUpdateNewChat,
  handleUpdateNewMessage,
  handleUpdateUser,
  handleUpdateSupergroup,
  handleUpdate,
  handleUpdateUserStatus,
  handleUpdateSupergroupFullInfo
} = require('./db');
const { garamCache } = require('../domain/cache');
const logger = require('./logger');
const { serializeJson } = require('./utils');

// Shared Airgram instance
// let airgram = null;

async function initTelegram() {
  logger.info('Initializing Telegram');

  garamCache.airgram = new Airgram({
    apiId: process.env.TDLIB_API_ID,
    apiHash: process.env.TDLIB_API_HASH,
    command: process.env.TDLIB_PATH,
    logVerbosityLevel: process.env.TDLIB_LOG_LEVEL
  });

  garamCache.airgram.use(
    new Auth({
      code: () => prompt('Please enter the secret code:'),
      phoneNumber: () => prompt('Please enter your phone number:'),
      password: () => prompt('Please enter your password:')
    })
  );

  garamCache.airgram.use((ctx, next) => {
    // there can be empty update sometimes...
    if (!ctx.update) {
      return next();
    }
    try {
      handleUpdate(ctx.update);
    } catch (error) {
      logger.error(
        'Caught Error in all updates middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update)
      );
    }
    return next();
  });

  garamCache.airgram.on('updateConnectionState', (ctx, next) => {
    let tdlibConnectionState = ctx.update.state._;
    if (tdlibConnectionState.startsWith('connectionState')) {
      tdlibConnectionState = tdlibConnectionState.split('connectionState')[1];
    }

    logger.info('updateConnectionState=%s', tdlibConnectionState);

    garamCache.tdlibConnectionState = tdlibConnectionState;
    getIo().emit('tdlibConnectionState', tdlibConnectionState);
  });

  garamCache.airgram.on('updateNewChat', async (ctx, next) => {
    logger.debug('[update] updateNewChat update=%s', JSON.stringify(ctx.update));
    try {
      const chat = await handleUpdateNewChat(ctx.update);
      getIo().emit('chatUpdate', serializeJson(chat));
    } catch (error) {
      logger.error(
        'Caught Error in updateNewChat middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });

  garamCache.airgram.on('updateNewMessage', async (ctx, next) => {
    logger.debug('[update] updateNewMessage update=%s', JSON.stringify(serializeJson(ctx.update)));
    try {
      const message = await handleUpdateNewMessage(ctx.update);
      getIo().emit('chatMessage', serializeJson(message));
    } catch (error) {
      logger.error(
        'Caught Error in updateNewMessage middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });

  garamCache.airgram.on('updateUser', async (ctx, next) => {
    logger.debug('[update] updateUser update=%s', JSON.stringify(serializeJson(ctx.update)));
    try {
      const user = await handleUpdateUser(ctx.update);
      getIo().emit('userUpdate', serializeJson(user));
    } catch (error) {
      logger.error(
        'Caught Error in updateUser middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });

  // {"_":"updateUserStatus","userId":XXX,"status":{"_":"userStatusOnline","expires":1630794480}}
  garamCache.airgram.on('updateUserStatus', async (ctx, next) => {
    logger.debug('[update] updateUserStatus update=%s', JSON.stringify(serializeJson(ctx.update)));
    try {
      await handleUpdateUserStatus(ctx.update);
    } catch (error) {
      logger.error(
        'Caught Error in updateUserStatus middleware  - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });

  garamCache.airgram.on('updateSupergroup', async (ctx, next) => {
    logger.debug('[update] updateSupergroup update=%s', JSON.stringify(serializeJson(ctx.update)));
    try {
      await handleUpdateSupergroup(ctx.update);
    } catch (error) {
      logger.error(
        'Caught Error in updateSupergroup middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });

  garamCache.airgram.on('updateSupergroupFullInfo', async (ctx, next) => {
    logger.debug(
      '[update] updateSupergroupFullInfo update=%s',
      JSON.stringify(serializeJson(ctx.update))
    );
    try {
      await handleUpdateSupergroupFullInfo(ctx.update);
    } catch (error) {
      logger.error(
        'Caught Error in updateSupergroupFullInfo middleware - error=%s update=%s',
        error,
        JSON.stringify(ctx.update),
        error?.meta
      );
    }
    return next();
  });
}

function getAirgram() {
  return garamCache.airgram;
}

async function getMe() {
  let me = await garamCache.airgram.api.getMe();
  return toObject(me);
}

async function getChats() {
  let chats = await garamCache.airgram.api.getChats({
    limit: 20,
    offsetChatId: 0,
    offsetOrder: '9223372036854775807'
  });
  return toObject(chats);
}

async function getUserInfo(userId) {
  let userInfo = await garamCache.airgram.api.getUser({
    userId: userId
  });
  return toObject(userInfo);
}

module.exports = {
  initTelegram,
  getAirgram,
  getMe,
  getChats,
  getUserInfo
};
