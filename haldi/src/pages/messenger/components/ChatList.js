import React, { useContext } from 'react';
import ChatListItem from './ChatListItem';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';

const ChatList = observer(({ concise }) => {
  const store = useContext(StoreContext);
  return Object.values(store.chats)
    .filter((v) => v?.messages?.length > 0)
    .map((item) => <ChatListItem key={item.id} {...item} concise={concise} />);
});

export default ChatList;
