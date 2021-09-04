import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
class Store {
  secondsPassed = 0;
  chats = {};

  constructor() {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }

  addChat(chat) {
    this.chats[chat.id] = chat;
  }
}

export const StoreContext = createContext(new Store());
