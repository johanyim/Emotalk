"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import React from 'react'

export default function Login() {
    return (
    <div className='h-screen w-screen bg-indigo-200 flex items-center justify-center rounded-lg'>
        <div className='bg-white rounded-lg border-4 border-indigo-300 p-6 space-y-12 md:space-y-10'>
            <div className="font-semibold text-2xl flex justify-center">Login</div>
            <form className='space-y-4 md:space-y-6 sm:p-8'>
                <div>
                    <label htmlFor="email" className="block mb-2 text-xl text-gray-900 dark:text-white">Email</label>
                    <input type="email" placeholder="Email" id="email"/>
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-xl text-gray-900 dark:text-white">Password</label>
                    <input type="password" placeholder="Password" id="password"/>
                </div>
            </form>
            <a href="./register">Register</a>
        </div>
    </div>
    )
}

