"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

export default function Sidebar() {

    return (
        <div className='min-w-[300px]'>
            <div className='flex flex-col gap-8'>

                <Header />
                <ShowOnlinePeople />
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


interface userInfo {
    id:string
    username?:string
}
//every 10s
const updateRoomTime = 10 * 1000

function ShowOnlinePeople() {
    const [users, setUsers] = useState<userInfo[]>([])
    const socket = useSocket();

    useEffect(() => {
        const fetchUsers = () => {
            if (!socket) return
            socket.emit('getCurrentPeople', (users:userInfo[]) => {
                setUsers(users)
            })
        }

        fetchUsers()
        const intervalId = setInterval(() => {
            fetchUsers()
        }, updateRoomTime);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, [socket]);

    return (
        <div className='flex flex-col'>
            {users.map((user, index) => {
                const name = user.username
                return (
                    <button key={index} className='p-8'>
                        {name}
                    </button>
                )
            }
            )}
        </div>
    )
}