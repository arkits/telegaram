import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
class Store {
  secondsPassed = 0;
  chats = {};
  selectedChatIdx = null;
  sioConnected = false;
  users = {};
  tdlibConnectionState = '';

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
      prettyLastMessageAuthor =
        lastMessageAuthor?.username || lastMessageAuthor?.firstName || lastMessageAuthor?.id;
    }

    return `${prettyLastMessageAuthor}: ${lastMessageText?.substring(0, 20)}`;
  }

  addChat(chat) {
    chat['subtitle'] = this._generateSubtitle(chat);
    this.chats[chat.id] = chat;
  }

  addMessageToChat(message) {
    let chat = this.chats[message.chatId];

    chat['messages'] = [message].concat(chat?.messages);
    chat['lastMessage'] = message;
    chat['subtitle'] = this._generateSubtitle(chat);

    this.chats[chat.id] = chat;
  }

  setSioConnected(sioConnected) {
    this.sioConnected = sioConnected;
  }

  setSelectedChatIdx(idx) {
    this.selectedChatIdx = idx;
  }

  addUser(user) {
    this.users[String(user.id)] = user;
  }

  setTdlibConnectionState(connectionState) {
    this.tdlibConnectionState = connectionState;
  }
}

export const StoreContext = createContext(new Store());
