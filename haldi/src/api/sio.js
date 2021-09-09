import { useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../store';

const DEBUG = false;

const SioClient = observer(() => {
  const store = useContext(StoreContext);

  useEffect(() => {
    const newSocket = io(`${window.location.origin}`);

    newSocket.on('connect', (data) => {
      console.log('[sio] Connected SIO');
      store.setSioConnected(true);
    });

    newSocket.on('disconnect', (data) => {
      if (DEBUG) console.log('[sio] Disconnected SIO');
      store.setSioConnected(false);
    });

    newSocket.on('chatUpdate', (chat) => {
      if (DEBUG) console.log('[sio] chatUpdate', chat);
      store.addChat(chat);

      // temp: auto select a Chat rather than having not selectedChat on launch
      if (store.selectedChatIdx === null && chat?.messages && chat?.messages.length > 0) {
        store.setSelectedChatIdx(chat.id);
      }
    });

    newSocket.on('chatMessage', (data) => {
      if (DEBUG) console.log('[sio] chatMessage', data);
      store.addMessageToChat(data);
    });

    newSocket.on('userUpdate', (user) => {
      if (DEBUG) console.log('[sio] userUpdate', user);
      store.addUser(user);
    });

    newSocket.on('tdlibConnectionState', (connectionState) => {
      if (DEBUG) console.log('[sio] tdlibConnectionState', connectionState);
      store.setTdlibConnectionState(connectionState);
    });

    newSocket.on('meUpdate', (me) => {
      if (DEBUG) console.log('[sio] meUpdate', me);
      store.setMe(me);
    });

    newSocket.on('event_chatPhotoUpdate', (payload) => {
      if (DEBUG) console.log('event_chatPhotoUpdate', payload);

      let chat = store.chats[payload?.chatId];
      chat = {
        ...chat
      };
      chat['profile_photo_path'] = payload?.profilePhotoPath;
      store.addChat(chat);
    });

    store.setSocket(newSocket);

    return () => newSocket.close();
  }, [store]);

  return null;
});

export default SioClient;
