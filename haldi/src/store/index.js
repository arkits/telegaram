import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
class Store {
  secondsPassed = 0;
  chats = {};
  selectedChatIdx = null;
  sioConnected = false;

  constructor() {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }

  addChat(chat) {
    let lastMessageText = chat?.lastMessage?.content?.text?.text;
    if (!lastMessageText) {
      lastMessageText = chat?.lastMessage?.content?._;
    }
    chat['subtitle'] = lastMessageText;

    this.chats[chat.id] = chat;
  }

  addMessageToChat(message) {
    let chat = this.chats[message.chatId];
    chat['messages'] = [message].concat(chat?.messages);
    chat['lastMessage'] = message;

    let lastMessageText = message?.content?.text?.text;
    if (!lastMessageText) {
      lastMessageText = message?.content?._;
    }
    chat['subtitle'] = lastMessageText;

    this.chats[chat.id] = chat;
  }

  setSioConnected(sioConnected) {
    this.sioConnected = sioConnected;
  }

  setSelectedChatIdx(idx) {
    this.selectedChatIdx = idx;
  }
}

export const StoreContext = createContext(new Store());
