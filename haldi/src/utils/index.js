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

module.exports = {
  getPrettyUserName
};
