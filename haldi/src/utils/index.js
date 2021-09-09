const { API_BASE_URL } = require('../api/fetches');

function getPrettyUserName(user) {
  if (user?.username) {
    return `@${user?.username}`;
  } else if (user?.firstName) {
    return `${user?.firstName} ${user?.lastName}`;
  } else if (user?.id) {
    return `id:${user.id}`;
  } else {
    return 'Unknown User';
  }
}

function getChatAvatarSrc(chat) {
  if (chat?.profile_photo_path) {
    return `${API_BASE_URL}${chat?.profile_photo_path}`;
  } else if (chat?.minithumbnail) {
    return `data:image/jpg;base64,${chat?.minithumbnail}`;
  } else {
    return '/';
  }
}

module.exports = {
  getPrettyUserName,
  getChatAvatarSrc
};
