const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const logger = require('./domain/logger');

const apiRouter = require('./api/router');
const { initTelegram } = require('./domain/telegram');

initTelegram();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.use(cors());

app.use('/api', apiRouter);

app.listen(SERVER_PORT, () => {
  logger.info(`🔥 Telegaram HTTP Server running on http://localhost:${SERVER_PORT}`);
});
