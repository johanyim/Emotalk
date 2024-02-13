"use client"; // This is a client component 👈🏽

import { useEffect, useState } from 'react';
import { Socket, io } from "socket.io-client"

import { socketClient } from "./socket/socket";
import UploadAndDisplayImage from "./components/UploadAndDisplayImage";
import WebcamCapture from './components/WebCatpture';

import './emotions.css'

interface Message {
  sender: string;
  message: string;
  emotion: string;
}

interface UserInfo {
  name: string
}

const defaultUser = {
  name:''
}

// import Register from './pages/Register'

// export default 
// Register;

export default 
function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInfo, setuserInfo] = useState<UserInfo>(defaultUser);

  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState('O_O');

  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  //Socket Effect
  useEffect(() => {
    const socket = socketClient();

    socket.on("setName", (name: string) => {
      setuserInfo({ name: name })
    })
    
    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    })

    setSocketInstance(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect(); // Disconnect previous socket
      }
      return socket;
    });
  }, []); // Empty dependency array to run the effect only once

  // Update automatically when image changes
  useEffect(() => {
    updateEmotion(selectedImage)
  }, [selectedImage]);

  const sendMessage = (e) => {
    e.preventDefault();
    // Send message warning
    if (messageInput.trim() === '' || !socketInstance) return
    if (emotion === "neutral") {
        window.alert("Sorry, I don't know how you feel about that.")
        return
    }

    socketInstance.emit('sendMessage', { message: messageInput, emotion });

    const newMessage = {
      sender: 'me',
      message: messageInput,
      emotion
    }
    setMessages(prevMessages => [...prevMessages, newMessage])

    setMessageInput('');
    // setMessages([...messages, messageInput])
  };

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
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md h-screen  flex flex-col  justify-between">
      <div className=" ">
        <div className="flex justify-between ">
          <h1 className="text-2xl font-bold mb-4">Emotalk</h1>
          <span>{userInfo?.name}</span>
        </div>
        <div className="">
          {messages.map((messageObject, index) => {
            const { sender, message, emotion } = messageObject;
            return (
                
              <div key={index} className={`mb-2 text-xl ${sender==='me' && 'text-right'}`}>
                 {sender}: <span className={`${emotion} message`}>{message}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className=" ">
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
        {/* <WebcamCapture setSelectedImage={setSelectedImage} /> */}

        <div className=" mt-10">
          <span className=" text-emerald-500">Detected Emotion: {emotion}</span>
          <div className="flex ">

            <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

          </div>
        </div>
      </div>
    </div >
  );
}


