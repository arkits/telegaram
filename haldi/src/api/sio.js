import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../store';

const SioClient = observer(() => {
  const [socket, setSocket] = useState(null);
  const store = useContext(StoreContext);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3001`);

    newSocket.on('connect', (data) => {
      // console.log('[sio] Connected SIO');
      store.setSioConnected(true);
    });

    newSocket.on('chatUpdate', (data) => {
      //  console.log('[sio] chatUpdate', data);
      store.addChat(data);
    });

    newSocket.on('chatMessage', (data) => {
      console.log('[sio] chatMessage', data);
      store.addMessageToChat(data);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  return null;
});

export default SioClient;
