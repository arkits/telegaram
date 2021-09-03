const { Airgram, Auth, prompt, toObject } = require('airgram');
const { handleUpdateNewChat, handleUpdateNewMessage } = require('./db');

const logger = require('./logger');

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

  airgram.on('updateNewChat', async (ctx, next) => {
    logger.debug('[update] updateNewChat chat.id=%s', ctx.update.chat.id, ctx.update);
    try {
      await handleUpdateNewChat(ctx.update);
    } catch (error) {
      logger.error('Caught Error in updateNewChat middleware -', error);
    }
    return next();
  });

  airgram.on('updateNewMessage', async (ctx, next) => {
    logger.debug('[update] updateNewMessage update=', ctx.update);
    try {
      await handleUpdateNewMessage(ctx.update);
    } catch (error) {
      logger.error('Caught Error in updateNewMessage middleware -', error);
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
