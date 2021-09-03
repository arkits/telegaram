const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient();
logger.debug('Creating prisma client');

async function getChats() {
  const chats = await prisma.chat.findMany({
    orderBy: {
      timeLastActive: 'desc'
    },
    take: 50
  });
  return chats;
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
  const chat = await prisma.chat.upsert({
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
  const sender = await prisma.user.upsert({
    where: {
      id: update.message.sender.userId
    },
    create: {
      id: update.message.sender.userId
    },
    update: {}
  });

  // Persist the Message
  const message = await prisma.message.create({
    data: {
      content: update.message.content,
      messageId: update.message.id,
      authorId: update.message.sender.userId,
      chatId: update.message.chatId
    }
  });
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

module.exports = {
  getChats,
  handleUpdateNewMessage,
  handleUpdateNewChat,
  getMessagesByChat
};
