"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState(['Test', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6']);
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState('O_O');

  const sendMessage = () => {
    // Send message warning
    if (messageInput === '') return
    setMessageInput('');
    setMessages([...messages, messageInput])
  };

  const getEmotion = async () => {
    // POST request to python 
    // I forgot how to write POST request exactly, let me know if it doesnt work
    console.log('sending request');

    const content = {
      messageInput,
      selectedImage
    }

    const res = await fetch('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(content),
      headers: {
        'content-type': 'application/json'
      }
    })

    useEffect(() => {
        fetch("/api/emotion").then(res => res.json()).then(data => {setEmotion(data.emotion)})
    }, [])

    console.log('res :>> ', res);
    setEmotion('Happy')
    // const emotion = res.body.emotion;
    // setEmotion(emotion)
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-4">Emotalk</h1>
      <div className="mb-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">{message}</div>
        ))}
      </div>


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

      <div className=" ">
        <label className=" text-emerald-500">Detected Emotion: {emotion}</label>
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
