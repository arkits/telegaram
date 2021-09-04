const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient();
logger.debug('Creating prisma client');

async function getChats() {
  const chats = await prisma.chat.findMany({
    orderBy: {
      timeLastActive: 'desc'
    },
    take: 50,
    where: {
      NOT: {
        timeLastActive: null
      }
    }
  });
  return chats;
}

async function getMessagesByChat(chatId) {
  const messages = await prisma.message.findMany({
    where: {
      chatId: BigInt(chatId)
    },
    take: 50,
    orderBy: {
      createdAt: 'desc'
    }
  });
  return messages;
}

async function getAllActiveUsers() {
  const users = await prisma.user.findMany({});
  return users;
}

async function handleUpdateNewChat(update) {
  const chat = await prisma.chat.upsert({
    where: {
      id: update.chat.id
    },
    update: {
      title: update.chat.title,
      type: update.chat.type._,
      timeLastActive: new Date()
    },
    create: {
      id: update.chat.id,
      title: update.chat.title,
      type: update.chat.type._,
      timeLastActive: new Date()
    }
  });
  return;
}

async function handleUpdateNewMessage(update) {
  // Persist the Chat
  await prisma.chat.upsert({
    where: {
      id: update.message.chatId
    },
    create: {
      id: update.message.chatId,
      timeLastActive: new Date()
    },
    update: {
      timeLastActive: new Date()
    }
  });

  // Persist the Sender
  try {
    if (update?.message?.sender?.userId) {
      await prisma.user.upsert({
        where: {
          id: update.message.sender.userId
        },
        create: {
          id: update.message.sender.userId
        },
        update: {}
      });
    } else {
      logger.info('No sender in updateNewMessage... ignoring');
    }
  } catch (error) {
    logger.error(
      'Caught Error in handleUpdateNewMessage - Persist the Sender - update=%s error=%s',
      JSON.stringify(update),
      error
    );
  }

  // Persist the Message
  const message = await prisma.message.create({
    data: {
      content: update.message.content,
      messageId: update.message.id,
      authorId: update.message.sender.userId,
      chatId: update.message.chatId
    }
  });

  return message;
}

async function handleUpdateUser(update) {
  const user = await prisma.user.upsert({
    where: {
      id: update.user.id
    },
    update: {
      username: update?.user?.username,
      firstName: update?.user?.firstName,
      lastName: update?.user?.lastName,
      status: update?.user?.status._,
      type: update?.user?.type?._
    },
    create: {
      id: update.user.id,
      username: update?.user?.username,
      firstName: update?.user?.firstName,
      lastName: update?.user?.lastName,
      status: update?.user?.status._,
      type: update?.user?.type?._
    }
  });
  return;
}

async function handleUpdateSupergroup(update) {
  // The update.supergroupId value comes as 'small' number without the '-100' prefix
  let groupId = `-100${update?.supergroup?.id}`;

  await prisma.chat.upsert({
    where: {
      id: BigInt(groupId)
    },
    update: {
      memberCount: update.supergroup.memberCount
    },
    create: {
      id: BigInt(groupId),
      memberCount: update.supergroup.memberCoun
    }
  });
}

async function handleUpdateSupergroupFullInfo(update) {
  // The update.supergroupId value comes as 'small' number without the '-100' prefix
  let groupId = `-100${update.supergroupId}`;

  await prisma.chat.upsert({
    where: {
      id: BigInt(groupId)
    },
    update: {
      memberCount: update?.supergroupFullInfo.memberCount,
      minithumbnail: update?.supergroupFullInfo?.photo?.minithumbnail?.data,
      description: update?.supergroupFullInfo?.description
    },
    create: {
      id: BigInt(groupId),
      memberCount: update?.supergroupFullInfo.memberCount,
      minithumbnail: update?.supergroupFullInfo?.photo?.minithumbnail?.data,
      description: update?.supergroupFullInfo?.description
    }
  });
}

async function handleUpdate(update) {
  logger.debug('persisting update=%s', JSON.stringify(update));

  await prisma.update.create({
    data: {
      update: JSON.parse(JSON.stringify(update))
    }
  });
}

/*
{"_":"updateUserStatus","userId":XXXXX,"status":{"_":"userStatusRecently"}}
*/
async function handleUpdateUserStatus(update) {
  await prisma.user.upsert({
    where: {
      id: update.userId
    },
    update: {
      status: update?.status?._
    },
    create: {
      id: update.userId,
      status: update?.status?._
    }
  });
}

module.exports = {
  getChats,
  getMessagesByChat,
  getAllActiveUsers,
  handleUpdate,
  handleUpdateNewMessage,
  handleUpdateNewChat,
  handleUpdateUser,
  handleUpdateSupergroup,
  handleUpdateUserStatus,
  handleUpdateSupergroupFullInfo
};
