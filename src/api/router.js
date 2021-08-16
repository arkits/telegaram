const express = require("express");
const logger = require("../domain/logger");

const { getMe, getChats } = require("../domain/telegram");
const ApiError = require("../models/api_error");

const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    service_name: "Telegaram",
    version: "0.0.1",
  });
});

router.get("/tg/me", async function (req, res) {
  try {
    let me = await getMe();
    res.json(me);
  } catch (err) {
    logger.error("Caught Error -", err);
    res.status(400);
    res.json(new ApiError(err));
  }
});

router.get("/tg/chats", async function (req, res) {
  try {
    let chats = await getChats();
    res.json(chats);
  } catch (err) {
    logger.error("Caught Error -", err);
    res.status(400);
    res.json(new ApiError(err));
  }
});

module.exports = router;