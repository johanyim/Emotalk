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
import { Chat } from '@/components/Chat';

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
      // setStorage(messages)
      setStorage((prevStorage) => ({
        ...messages,
        ...prevStorage
      }));
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
      <Sidebar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} storage={storage} setStorage={setStorage} />
      <div className="flex flex-col  justify-between p-6 bg-gray-100 rounded-lg shadow-md w-[60%]">
        <Header userInfo={userInfo} setUserInfo={setUserInfo} storage={storage} currentRoom={currentRoom} />
        <Chat currentRoom={currentRoom} emotion={emotion} storage={storage} setStorage={setStorage} />


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

interface HeaderProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  storage: ServerStorage
  currentRoom:string //roomid
}

function Header({ userInfo, setUserInfo, storage, currentRoom }: HeaderProps) {
  const socket = useSocket();

  //Socket Effect
  useEffect(() => {
    if (!socket) return
  socket.on("setName", (name: string) => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      name: name,
    }));
  });
  }, [socket]); 

  return (
    <div className="flex justify-between ">
      <h1 className="text-2xl font-bold mb-4">{storage[currentRoom]?.name ||'Emotalk'}</h1>
      <span>{userInfo?.name}</span>
    </div>
  )
}
