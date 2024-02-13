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

//every 10s
const updateRoomTime = 10*1000

function ShowOnlinePeople() {
    const [names, setnames] = useState(['A', 'V', 'C'])
    const socket = useSocket();

    useEffect(() => {
        fetchPeople()
        const intervalId = setInterval(() => {
            fetchPeople()
        }, updateRoomTime);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, [socket]); // Empty dependency array to run the effect only once


    const fetchPeople = () => {
        if (!socket) return
        socket.emit('getCurrentPeople', people => {
            setnames(people)
        })
    }

    return (
        <div className='flex flex-col gap-8'>
            {names.map((name, index) =>
                <div key={index}>
                    {name}
                </div>
            )}
        </div>
    )
}