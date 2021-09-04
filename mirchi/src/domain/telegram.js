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
let airgram = null;

async function initTelegram() {
  logger.info('Initializing Telegram');

  airgram = new Airgram({
    apiId: process.env.TDLIB_API_ID,
    apiHash: process.env.TDLIB_API_HASH,
    command: process.env.TDLIB_PATH,
    logVerbosityLevel: process.env.TDLIB_LOG_LEVEL
  });

  airgram.use(
    new Auth({
      code: () => prompt('Please enter the secret code:'),
      phoneNumber: () => prompt('Please enter your phone number:'),
      password: () => prompt('Please enter your password:')
    })
  );

  airgram.use((ctx, next) => {
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

  airgram.on('updateConnectionState', (ctx, next) => {
    let tdlibConnectionState = ctx.update.state._;
    if (tdlibConnectionState.startsWith('connectionState')) {
      tdlibConnectionState = tdlibConnectionState.split('connectionState')[1];
    }

    logger.info('updateConnectionState=%s', tdlibConnectionState);

    garamCache.tdlibConnectionState = tdlibConnectionState;
    getIo().emit('tdlibConnectionState', tdlibConnectionState);
  });

  airgram.on('updateNewChat', async (ctx, next) => {
    logger.debug('[update] updateNewChat chat.id=%s', ctx.update.chat.id);
    try {
      await handleUpdateNewChat(ctx.update);
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

  airgram.on('updateNewMessage', async (ctx, next) => {
    logger.debug(
      '[update] updateNewMessage sender=%s chat.id=%s',
      ctx.update.message.sender.userId,
      ctx.update.message.chatId
    );
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

  airgram.on('updateUser', async (ctx, next) => {
    logger.debug('[update] updateUser id=%s', ctx.update.user.id);
    try {
      await handleUpdateUser(ctx.update);
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

  airgram.on('updateUserStatus', async (ctx, next) => {
    logger.debug('[update] updateUserStatus id=%s', ctx.update.userId);
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

  airgram.on('updateSupergroup', async (ctx, next) => {
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

  airgram.on('updateSupergroupFullInfo', async (ctx, next) => {
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
  return airgram;
}

async function getMe() {
  let me = await airgram.api.getMe();
  return toObject(me);
}

async function getChats() {
  let chats = await airgram.api.getChats({
    limit: 20,
    offsetChatId: 0,
    offsetOrder: '9223372036854775807'
  });
  return toObject(chats);
}

async function getUserInfo(userId) {
  let userInfo = await airgram.api.getUser({
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
