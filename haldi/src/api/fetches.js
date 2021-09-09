let DEFAULT_REQUEST_OPTIONS = {
  method: 'GET',
  redirect: 'follow'
};

let API_BASE_URL = 'http://localhost:4206';

function getChats() {
  return fetch(`${API_BASE_URL}/api/chats`, DEFAULT_REQUEST_OPTIONS);
}

function getMessages(chatId) {
  return fetch(`${API_BASE_URL}/api/messages/${chatId}`, DEFAULT_REQUEST_OPTIONS);
}

module.exports = {
  getChats,
  getMessages,
  API_BASE_URL
};
