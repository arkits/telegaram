const express = require("express");
const config = require("config");

const logger = require("./domain/logger");

const apiRouter = require("./api/router");
const { initTelegram } = require("./domain/telegram");

initTelegram();

const SERVER_PORT = config.get("server.port");

const app = express();

app.use("/api", apiRouter);

app.listen(SERVER_PORT, () => {
  logger.info(
    `🔥 Telegaram HTTP Server running on http://localhost:${SERVER_PORT}`
  );
});
