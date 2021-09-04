import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
class Store {
  secondsPassed = 0;
  chats = {};
  sioConnected = false;

  constructor() {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }

  addChat(chat) {
    this.chats[chat.id] = chat;
  }

  addMessageToChat(message) {
    let chat = this.chats[message.chatId];

    chat?.messages?.push(message);
    console.log('Appended message');

    this.chats[chat.id] = chat;
  }

  setSioConnected(sioConnected) {
    this.sioConnected = sioConnected;
  }
}

export const StoreContext = createContext(new Store());
