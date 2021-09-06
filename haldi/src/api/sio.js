import { useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../store';

const SioClient = observer(() => {
  const store = useContext(StoreContext);

  useEffect(() => {
    const newSocket = io(`${window.location.origin}`);

    newSocket.on('connect', (data) => {
      // console.log('[sio] Connected SIO');
      store.setSioConnected(true);
    });

    newSocket.on('disconnect', (data) => {
      // console.log('[sio] Disconnected SIO');
      store.setSioConnected(false);
    });

    newSocket.on('chatUpdate', (chat) => {
      //  console.log('[sio] chatUpdate', data);
      store.addChat(chat);

      // temp: auto select a Chat rather than having not selectedChat on launch
      if (store.selectedChatIdx === null && chat?.messages && chat?.messages.length > 0) {
        store.setSelectedChatIdx(chat.id);
      }
    });

    newSocket.on('chatMessage', (data) => {
      //  console.log('[sio] chatMessage', data);
      store.addMessageToChat(data);
    });

    newSocket.on('userUpdate', (user) => {
      //  console.log('[sio] userUpdate', user);
      store.addUser(user);
    });

    newSocket.on('tdlibConnectionState', (connectionState) => {
      //  console.log('[sio] userUpdate', user);
      store.setTdlibConnectionState(connectionState);
    });

    newSocket.on('meUpdate', (me) => {
      console.log('[sio] meUpdate', me);
      store.setMe(me);
    });

    store.setSocket(newSocket);

    return () => newSocket.close();
  }, [store]);

  return null;
});

export default SioClient;
