let DEFAULT_REQUEST_OPTIONS = {
  method: 'GET',
  redirect: 'follow'
};

let API_BASE_URL = 'http://localhost:3001';

function getChats() {
  return fetch(`${API_BASE_URL}/api/chats`, DEFAULT_REQUEST_OPTIONS);
}

module.exports = {
  getChats
};
