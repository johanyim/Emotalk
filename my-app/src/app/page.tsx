"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import { Socket, io } from "socket.io-client"

import { socketClient } from "../socket/socket";
import UploadAndDisplayImage from "../components/UploadAndDisplayImage";
import WebcamCapture from '../components/WebCatpture';

import './emotions.css'
import Sidebar from '@/components/Sidebar';
import { SocketProvider, useSocket } from '@/components/SocketContext';
import { MessageStorage, ServerStorage } from '../../types/storage';

interface Message {
  id: string
  sender: string;
  message: string;
  emotion: string;
  room: string;
}

interface UserInfo {
  name: string
}

const defaultUser = {
  name: ''
}

export let socket: Socket | null = null;

export default function Home() {
  return (
    <SocketProvider>
      <Main />
    </SocketProvider>
  );
}

function Main() {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUser);
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState('O_O');

  const [currentRoom, setCurrentRoom] = useState('lobby');
  const socket = useSocket();
  const [storage, setStorage] = useState<ServerStorage>({});

  useEffect(() => {
    if (!socket) return

    socket.emit("fetchMessages", (messages: ServerStorage) => {
      console.log('messages :>> ', messages);
      setStorage(messages)
    })

  }, [socket]);

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
    <div className=' max-w-5xl  mx-auto p-6 rounded-lg shadow-md h-screen flex justify-between'>
      <Sidebar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      <div className="flex flex-col  justify-between p-6 bg-gray-100 rounded-lg shadow-md w-[60%]">
        <Header userInfo={userInfo} setUserInfo={setUserInfo} storage={storage}/>
        <Message currentRoom={currentRoom} emotion={emotion} storage={storage} setStorage={setStorage}/>


        <div className=" ">
          <div className=" mt-10">
            <span className=" text-emerald-500">Detected Emotion: {emotion}</span>
            <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            {/* <WebcamCapture setSelectedImage={setSelectedImage} /> */}
          </div>
        </div>
      </div >
    </div>
  );
}


function Message({ currentRoom, emotion, storage, setStorage }) {
  const [messageInput, setMessageInput] = useState('');

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return


    socket.on("receiveMessage", (newMessageInfo: Message) => {
      const room = newMessageInfo.room;
      const message = {  // Create the new message object
        id: newMessageInfo.id,
        sender: newMessageInfo.sender,
        message: newMessageInfo.message,
        emotion: newMessageInfo.emotion
      };

      console.log('receive messages :>> ', message, room);
      addMessageToStorage(message, room)
      // console.log('messages.lobby :>> ', messageStorage[currentRoom]);
    })

  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    // Send message warning
    if (messageInput.trim() === '' || !socket) return
    if (emotion === "neutral") {
      window.alert("Sorry, I don't know how you feel about that.")
      return
    }

    socket.emit('sendMessage', { message: messageInput, emotion, room: currentRoom });

    // Display own message
    const newMessage = {
      id: socket.id,
      sender: 'me',
      message: messageInput,
      emotion
    }

    addMessageToStorage(newMessage, currentRoom)
    setMessageInput('');
  };

  function addMessageToStorage(newMessage: MessageStorage, room: string) {
    setStorage((prevStorage:ServerStorage) => ({
      ...prevStorage,
      [room]: {
        ...prevStorage[room],
        messages: [...(prevStorage[room]?.messages || []), newMessage]
      }
    }));
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className="">
        {storage[currentRoom]?.messages?.map((messageObject:MessageStorage, index:number) => {
          const { id, sender, message, emotion } = messageObject;
          const fromSelf = id === socket?.id
          return (

            <div key={index} className={`mb-2 text-xl ${fromSelf && 'text-right'}`}>
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
  storage: ServerStorage
}

function Header({ userInfo, setUserInfo, storage }: HeaderProps) {
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
