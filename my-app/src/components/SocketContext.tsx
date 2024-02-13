// components/SocketContext.js

import { socketClient } from '@/socket/socket';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io';

// Create the context
const SocketContext = createContext<Socket | undefined>(undefined);

// Create the provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    const newSocket = socketClient(); // Initialize the socket
    setSocket(newSocket); // Set the socket state

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array to run the effect only once after the initial render


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  // if (!context) {
  //   throw new Error('useSocket must be used within a SocketProvider');
  // }
  return context;
};

export default SocketContext;
