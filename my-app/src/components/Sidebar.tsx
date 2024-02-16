"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

export default function Sidebar({currentRoom, setCurrentRoom}) {
    return (
        <div className='min-w-[300px]'>
            <div className='flex flex-col gap-8'>

                <Header />
                <ShowOnlinePeople currentRoom={currentRoom} setCurrentRoom={setCurrentRoom}/>
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


interface roomInfo {
    id:string
    name?:string
}
//every 10s
const updateRoomTime = 10 * 1000

function ShowOnlinePeople({currentRoom, setCurrentRoom}) {
    const [rooms, setRooms] = useState<roomInfo[]>([])
    const socket = useSocket();

    useEffect(() => {
        const fetchRooms = () => {
            if (!socket) return
            socket.emit('getRooms', (rooms:roomInfo[]) => {
                setRooms(rooms)
            })
        }

        fetchRooms()
        const intervalId = setInterval(() => {
            fetchRooms()
        }, updateRoomTime);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, [socket]);

    return (
        <div className='flex flex-col'>
            {rooms.map((rooms, index) => {
                const name = rooms.name
                const id = rooms.id
                const isSelected = id === currentRoom
                console.log('currentRoom :>> ', currentRoom, id);
                return (
                    <button key={index} className={`p-8 ${isSelected && 'bg-blue-200'}`} onClick={() => setCurrentRoom(id)}>
                        {name}
                    </button>
                )
            }
            )}
        </div>
    )
}