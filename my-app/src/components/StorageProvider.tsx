// components/SocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ServerStorage } from '../../types/storage';
import { useSocket } from './SocketProvider';

type UseridToNameMap = Record<string, string | undefined>

// Define the type for the context value
type ServerStorageContextType = {
    storage: ServerStorage;
    setStorage: React.Dispatch<React.SetStateAction<ServerStorage>>;
    onlineUserInfo: UseridToNameMap;
};

// Create the context
const StorageContext = createContext<ServerStorageContextType>({
    storage: {},
    setStorage: () => { },
    onlineUserInfo: {}
});

// Create the provider component
export const StorageProvider = ({ children }) => {
    const socket = useSocket();
    const [storage, setStorage] = useState<ServerStorage>({});
    const [onlineUserInfo, setOnlineUserInfo] = useState<UseridToNameMap>({});


    useEffect(() => {
        if (!socket) return;

        socket.emit("fetchMessages", (messages: ServerStorage) => {
            console.log('fetch messages :>> ', messages);
            setStorage(messages);
        });

        socket.emit("fetchAllUserInfo", (userInfos: UseridToNameMap) => {
            setOnlineUserInfo(userInfos);
        });


    }, [socket]);

    // Define the context value
    const contextValue: ServerStorageContextType = {
        storage,
        setStorage,
        onlineUserInfo
    };

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    );
};

// Custom hook to access the socket context
export const useStorage = () => {
    const { storage, setStorage } = useContext(StorageContext);
    return { storage, setStorage };
};

export const useOnlineUserInfo = () => {
    const { onlineUserInfo } = useContext(StorageContext);
    return onlineUserInfo;
};

export default StorageProvider;
