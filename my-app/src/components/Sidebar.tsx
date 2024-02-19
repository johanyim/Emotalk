"use client"; // This is a client component 👈🏽

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { ServerStorage } from '../../types/storage';

interface SidebarProps extends RoomsProps {
}

export default function Sidebar({ currentRoom, setCurrentRoom, storage, setStorage }: SidebarProps) {
    return (
        <div className='min-w-[300px]'>
            <div className='flex flex-col gap-8'>

                <Header />
                <Rooms currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} storage={storage} setStorage={setStorage}/>
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
    const [tempRooms, setTempRooms] = useState<ServerStorage>({})
    const socket = useSocket();

    useEffect(() => {
        function addRoomsToStorage(rooms: ServerStorage) {
            setTempRooms(rooms);
        }

        const fetchOnlineUsers = () => {
            if (!socket) return
            socket.emit('fetchOnlineRooms', (newRoomStorage: ServerStorage) => {
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
        <div className='flex flex-col gap-8'>
            <h2>Your rooms</h2>
            <ChatList list={storage} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom}></ChatList>

            <h2>Other Online Users</h2>
            <ChatList list={tempRooms} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom}></ChatList>
        </div>
    )
}


interface ChatListProps {
    list: ServerStorage
    currentRoom: string,
    setCurrentRoom: Dispatch<SetStateAction<string>>;

}

function ChatList({ list, currentRoom, setCurrentRoom }: ChatListProps) {
    return (
        <div className='flex flex-col'>
            {Object.entries(list).map(([roomId, roomStorage], index) => {
                const name = roomStorage?.name || roomStorage?.members?.join(',') ||'BUG'
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