"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import { Socket, io } from "socket.io-client"

import { socketClient } from "../socket/socket";
import UploadAndDisplayImage from "../components/UploadAndDisplayImage";
import WebcamCapture from '../components/WebCatpture';

import './emotions.css'
import Sidebar from '@/components/Sidebar';
import { SocketProvider, useSocket } from '@/components/SocketContext';

interface Message {
  sender: string;
  message: string;
  emotion: string;
}

interface UserInfo {
  name: string
}

const defaultUser = {
  name: ''
}

export let socket: Socket | null = null;

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUser);
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState('O_O');

  // Update automatically when image changes
  useEffect(() => {
    updateEmotion(selectedImage)
  }, [selectedImage]);

  const updateEmotion = async (image: Blob | File | null = null) => {
    if (!image) return
    // POST request to python 
    console.log('sending request');

    const formData = new FormData();
    formData.append('image', image, 'image.jpg');

    const response = await fetch('http://localhost:5000/read_emotion', {
      method: 'POST',
      body: formData,
    })

    const res = await response.json()
    setEmotion(res.emotion)
  }

  return (
    <SocketProvider>
      <div className=' max-w-5xl  mx-auto p-6 rounded-lg shadow-md h-screen flex justify-between'>
        <Sidebar />
        <div className="flex flex-col  justify-between p-6 bg-gray-100 rounded-lg shadow-md w-[60%]">
          <Header userInfo={userInfo} setUserInfo={setUserInfo} />
          <Message emotion={emotion} />


          <div className=" ">
            <div className=" mt-10">
              <span className=" text-emerald-500">Detected Emotion: {emotion}</span>
              <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
              {/* <WebcamCapture setSelectedImage={setSelectedImage} /> */}
            </div>
          </div>
        </div >
      </div>
    </SocketProvider>
  );
}


function Message({ emotion }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    })
  }, [socket]); // Empty dependency array to run the effect only once


  const sendMessage = (e) => {
    e.preventDefault();
    // Send message warning
    if (messageInput.trim() === '' || !socket) return
    if (emotion === "neutral") {
      window.alert("Sorry, I don't know how you feel about that.")
      return
    }

    socket.emit('sendMessage', { message: messageInput, emotion });

    //Display own message
    const newMessage = {
      sender: 'me',
      message: messageInput,
      emotion
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setMessageInput('');
  };

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className="">
        {messages.map((messageObject, index) => {
          const { sender, message, emotion } = messageObject;
          return (

            <div key={index} className={`mb-2 text-xl ${sender === 'me' && 'text-right'}`}>
              {sender}: <span className={`${emotion} message`}>{message}</span>
            </div>
          );
        })}
      </div>

      <form className="flex gap-4 ">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className={`${emotion} border border-gray-300 p-2 rounded-lg mr-2 w-full`}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  )
}

interface HeaderProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

function Header({ userInfo, setUserInfo }: HeaderProps) {
  const socket = useSocket();

  //Socket Effect
  useEffect(() => {
    if (!socket) return
    socket.on("setName", (name: string) => {
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        name: name,
      }));
    })
  }, [socket]); // Empty dependency array to run the effect only once

  return (
    <div className="flex justify-between ">
      <h1 className="text-2xl font-bold mb-4">Emotalk</h1>
      <span>{userInfo?.name}</span>
    </div>
  )
}