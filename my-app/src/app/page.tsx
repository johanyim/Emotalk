"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { useEffect, useState } from 'react';
import { Socket, io } from "socket.io-client"
// import socket from "./socket/socket";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState('O_O');

  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = socketClient();
    socket.on("displayMessage", (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    })
    setSocketInstance(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect(); // Disconnect previous socket
      }
      return socket;
    });
  }, []); // Empty dependency array to run the effect only once


  const sendMessage = () => {
    // Send message warning
    if (messageInput.trim() === '' || !socketInstance) return

    socketInstance.emit('sendMessage', messageInput);
    setMessageInput('');
    // setMessages([...messages, messageInput])
  };

  const getEmotion = async () => {

    if (!selectedImage) return
    // POST request to python 
    console.log('sending request');

    const formData = new FormData();
    formData.append('image', selectedImage, 'image.jpg');

    const response = await fetch('http://localhost:5000/read_emotion', {
      method: 'POST',
      body: formData,
    })

    const res = await response.json()
    setEmotion(res.emotion)
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-4">Emotalk</h1>
      <div className=" flex flex-col h-screen justify-between ">

        <div className=" ">
          <div className="">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">{message}</div>
            ))}
          </div>
        </div>
        
        <div className=" ">
          <div className=" ">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg mr-2"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>

          <div className=" mt-10">
            <span className=" text-emerald-500">Detected Emotion: {emotion}</span>
            <div className="flex ">

              <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
              <button
                onClick={getEmotion}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Get emotion
              </button>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

const UploadAndDisplayImage = ({ selectedImage, setSelectedImage }) => {

  return (
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>

      {selectedImage && (
        <div>
          <Image
            width={500}
            height={500}
            src={URL.createObjectURL(selectedImage)}
            alt="uploaded image"
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />
      <br />

      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};

const PORT = 3000
function socketClient() {
  const socket = io(`:${PORT + 1}`, { path: "/api/socket", addTrailingSlash: false })

  socket.on("connect", () => {
    console.log("Connected")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected")
  })

  socket.on("connect_error", async err => {
    console.log(`connect_error due to ${err.message}`)
    await fetch("/api/socket")
  })

  return socket
}