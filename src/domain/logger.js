const log4js = require("log4js");

// Configure logging to stdout and file
log4js.configure({
  appenders: {
    toFile: { type: "file", filename: "logs/telegaram.log" },
    stdOut: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: ["toFile", "stdOut"],
      level: "debug",
      enableCallStack: true,
    },
  },
});

const logger = log4js.getLogger();

module.exports = logger;
