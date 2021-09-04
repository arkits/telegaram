const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');
const { serializeJson } = require('./utils');

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error']
});
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
  const chat = await prisma.chat.findUnique({
    where: {
      id: BigInt(update?.chat?.id)
    }
  });
  if (update?.chat?.id && chat?.id && BigInt(chat?.id) === BigInt(update?.chat?.id)) {
    await prisma.chat.update({
      where: {
        id: update?.chat?.id
      },
      data: {
        title: update?.chat?.title,
        type: update?.chat?.type?._,
        timeLastActive: new Date()
      }
    });
  } else {
    try {
      await prisma.chat.create({
        data: {
          id: BigInt(update.chat.id),
          title: update?.chat?.title,
          type: update?.chat?.type?._,
          timeLastActive: new Date()
        }
      });
    } catch (error) {
      logger.error(
        'Caught Error -  handleUpdateNewChat chat.create error=%s update=%s',
        error,
        JSON.stringify(serializeJson(update))
      );
    }
  }

  return;
}

async function handleUpdateUser(update) {
  const user = await prisma.user.findUnique({
    where: {
      id: BigInt(update?.user?.id)
    }
  });

  if (update?.user?.id && user?.id && BigInt(user?.id) === BigInt(update?.user?.id)) {
    await prisma.user.update({
      where: {
        id: update.user.id
      },
      data: {
        username: update?.user?.username,
        firstName: update?.user?.firstName,
        lastName: update?.user?.lastName,
        status: update?.user?.status._,
        type: update?.user?.type?._
      }
    });
  } else {
    try {
      await prisma.user.create({
        data: {
          id: BigInt(update.user.id),
          username: update?.user?.username,
          firstName: update?.user?.firstName,
          lastName: update?.user?.lastName,
          status: update?.user?.status._,
          type: update?.user?.type?._
        }
      });
    } catch (error) {
      logger.error(
        'Caught Error -  handleUpdateUser user.create - error=%s update=%s',
        error,
        JSON.stringify(serializeJson(update))
      );
    }
  }

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

  // A message can be sent from a User or a Chat
  let senderId = update?.message?.sender?.userId || update?.message?.sender?.chatId;

  // Persist the Sender
  try {
    if (senderId) {
      await prisma.user.upsert({
        where: {
          id: BigInt(senderId)
        },
        create: {
          id: BigInt(senderId)
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
      authorId: BigInt(senderId),
      chatId: update.message.chatId
    }
  });

  return message;
}

async function handleUpdateSupergroup(update) {
  // The update.supergroupId value comes as 'small' number without the '-100' prefix
  let groupId = `-100${update?.supergroup?.id}`;

  await prisma.chat.upsert({
    where: {
      id: BigInt(groupId)
    },
    update: {
      memberCount: update?.supergroup?.memberCount,
      timeLastActive: new Date()
    },
    create: {
      id: BigInt(groupId),
      memberCount: update?.supergroup?.memberCount,
      timeLastActive: new Date()
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
  logger.debug('Persisting update=%s', JSON.stringify(update));

  await prisma.update.create({
    data: {
      update: JSON.parse(JSON.stringify(update)),
      eventType: update?._
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
