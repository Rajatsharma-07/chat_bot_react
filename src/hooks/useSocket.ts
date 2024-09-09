import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // This will set connection with the server.
    const socketIo = io(url);

    // whenever our socket is connected this message will get printed in console
    socketIo.on('connect', () => {
      console.log('Connected to the server');
    });

    // whenever our socket is disconnected this message will get printed in console
    socketIo.on('message', (data) => {
      console.log('Message from server:', data);
    });

    setSocket(socketIo);

    // This useEffect ensures that whenever the page is removed from the dom (unmounted) then socket will automatically gets disconnected.
    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
