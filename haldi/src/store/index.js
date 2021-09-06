import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { getPrettyUserName } from '../utils';
class Store {
  secondsPassed = 0;
  chats = {};
  selectedChatIdx = null;
  sioConnected = false;
  users = {};
  tdlibConnectionState = '';
  socket = null;
  me = {};

  constructor() {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }

  _generateSubtitle(chat) {
    let lastMessageText = chat?.lastMessage?.content?.text?.text;
    if (!lastMessageText) {
      lastMessageText = chat?.lastMessage?.content?._;
    }

    let lastMessageAuthorId = chat?.lastMessage?.authorId;
    let prettyLastMessageAuthor = lastMessageAuthorId;

    let lastMessageAuthor = this.users[String(lastMessageAuthorId)];
    if (lastMessageAuthor) {
      prettyLastMessageAuthor = getPrettyUserName(lastMessageAuthor);
    }

    return `${prettyLastMessageAuthor}: ${lastMessageText?.substring(0, 50)}`;
  }

  addChat(chat) {
    chat['subtitle'] = this._generateSubtitle(chat);
    this.chats[chat.id] = chat;
  }

  addMessageToChat(message) {
    let chat = this.chats[message.chatId];
    if (!chat) {
      return;
    }

    chat['messages'] = [message].concat(chat?.messages);
    chat['lastMessage'] = message;
    chat['subtitle'] = this._generateSubtitle(chat);

    this.chats[chat.id] = chat;
  }

  setSioConnected(sioConnected) {
    this.sioConnected = sioConnected;
  }

  setSelectedChatIdx(idx) {
    // update old chat
    let oldChat = this.chats[this?.selectedChatIdx];
    if (oldChat) {
      oldChat.active = false;
      this.addChat(oldChat);
    }

    this.selectedChatIdx = idx;

    // update new chat
    let chat = this.chats[idx];
    if (chat) {
      chat.active = true;
      this.chats[idx] = chat;
    }
  }

  addUser(user) {
    this.users[String(user.id)] = user;
  }

  setTdlibConnectionState(connectionState) {
    this.tdlibConnectionState = connectionState;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  setMe(me) {
    this.me = me;
  }
}

export const StoreContext = createContext(new Store());
