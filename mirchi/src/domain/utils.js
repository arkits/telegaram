function serializeJson(data) {
  return JSON.parse(
    JSON.stringify(
      data,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );
}

module.exports = {
  serializeJson
};
