const { Airgram, Auth, prompt, toObject } = require("airgram");
const config = require("config");

const logger = require("./logger");

// Shared Airgram instance
let airgram = null;

async function initTelegram() {
  logger.info("Initializing Telegram");

  airgram = new Airgram({
    apiId: config.get("telegram.tdlib.api_id"),
    apiHash: config.get("telegram.tdlib.api_hash"),
    command: config.get("telegram.tdlib.tdlib_path"),
    logVerbosityLevel: config.get("telegram.tdlib.log_level"),
  });

  airgram.use(
    new Auth({
      code: () => prompt("Please enter the secret code:"),
      phoneNumber: () => prompt("Please enter your phone number:"),
      password: () => prompt("Please enter your password:"),
    })
  );
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
    offsetOrder: "9223372036854775807",
  });
  return toObject(chats);
}

module.exports = {
  initTelegram,
  getAirgram,
  getMe,
  getChats,
};
