"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState(['Test', 'Test2', 'Test3','Test4','Test5','Test6']);
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const sendMessage = () => {
    // Send message warning
    if (messageInput === '') return
    setMessageInput('');
    setMessages([...messages, messageInput])
  };

  const getEmotion = () => {

  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-4">Emotalk</h1>
      <div className="mb-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg mr-2"
      />
      <UploadAndDisplayImage selectedImage = {selectedImage} setSelectedImage={setSelectedImage}/>
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}

const UploadAndDisplayImage = ({selectedImage, setSelectedImage}) => {

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