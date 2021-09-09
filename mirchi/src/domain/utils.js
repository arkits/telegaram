const logger = require('./logger');

function serializeJson(data) {
  return JSON.parse(
    JSON.stringify(
      data,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );
}

function trimLocalPathPrefix(path) {
  let toReturn = path;

  if (process.env.TDLIB_DB_PATH) {
    toReturn = path.split(process.env.TDLIB_DB_PATH)[1];
  }

  return toReturn;
}

module.exports = {
  serializeJson,
  trimLocalPathPrefix
};
