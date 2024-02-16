"use client"; // This is a client component 👈🏽

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { ServerStorage } from '../../types/storage';

interface SidebarProps extends RoomsProps {
}

export default function Sidebar({ currentRoom, setCurrentRoom, storage, setStorage }:SidebarProps) {
    return (
        <div className='min-w-[300px]'>
            <div className='flex flex-col gap-8'>

                <Header />
                <Rooms currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} storage={storage} setStorage={setStorage} />
            </div>
        </div >
    );
}

function Header() {
    return (
        <h1 className='text-2xl font-bold'>
            Current online people:
        </h1>
    )
}


interface RoomsProps {
    currentRoom: string,
    setCurrentRoom: Dispatch<SetStateAction<string>>;
    storage: ServerStorage
    setStorage: Dispatch<SetStateAction<ServerStorage>>
}
//every 10s
const updateRoomTime = 10 * 1000

function Rooms({ currentRoom, setCurrentRoom, storage, setStorage }: RoomsProps) {
    // const [rooms, setRooms] = useState<roomInfo[]>([])
    const socket = useSocket();

    useEffect(() => {
        function addRoomsToStorage(rooms: ServerStorage) {
            setStorage((prevStorage) => ({
                ...prevStorage,
                ...rooms
            }));
        }

        const fetchOnlineUsers = () => {
            if (!socket) return
            socket.emit('getOnlineUsers', (newRoomStorage: ServerStorage) => {
                addRoomsToStorage(newRoomStorage)
            })
        }

        fetchOnlineUsers()


        // TODO : Use socket on instead when a new user join
        const intervalId = setInterval(() => {
            fetchOnlineUsers()
        }, updateRoomTime);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, [socket]);


    return (
        <div className='flex flex-col'>
            {Object.entries(storage).map(([roomId, roomStorage], index) => {
                const name = roomStorage?.name 
                const isSelected = roomId === currentRoom

                return (
                    <button key={index} className={`p-8 ${isSelected && 'bg-blue-200'}`} onClick={() => setCurrentRoom(roomId)}>
                        {name}
                    </button>
                )
            }
            )}
        </div>
    )
}