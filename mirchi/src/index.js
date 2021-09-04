const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const logger = require('./domain/logger');

const apiRouter = require('./api/router');
const { initTelegram } = require('./domain/telegram');
const { createSio } = require('./api/sio');

initTelegram();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

const server = http.createServer(app);

createSio(server);

app.use(cors());

app.use('/api', apiRouter);

server.listen(SERVER_PORT, () => {
  logger.info(`🔥 Telegaram HTTP Server running on http://localhost:${SERVER_PORT}`);
});
