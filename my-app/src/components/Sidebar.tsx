"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';

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

function ShowOnlinePeople() {

    const [names, setnames] = useState(['A', 'V', 'C'])

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