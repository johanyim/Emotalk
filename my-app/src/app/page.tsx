"use client"; // This is a client component 👈🏽
import Webcam from "react-webcam";

import Image from "next/image";
import { useEffect, useState } from 'react';
import React from 'react';


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
  const videoConstraints = {
        width: 320,
        height: 180,
        facingMode: "user"
  };

    const WebcamCapture = () => {
        const webcamRef = React.useRef(null);
        const capture = React.useCallback(
            async () => {
                const imageSrc = webcamRef.current.getScreenshot();
                if (!imageSrc) return
                // POST request to python 
                console.log('sending request');

                // Convert base64 string to Blob
                const blob = blobConvert(imageSrc);

                // Create FormData object and append Blob
                const formData = new FormData();
                formData.append('image', blob, 'image.jpg');

                const response = await fetch('http://localhost:5000/read_emotion', {
                    method: 'POST',
                    body: formData,
                })

                const res = await response.json()
                setEmotion(res.emotion)
            },

            [webcamRef]
        );
        return (
            <>
            <Webcam
                audio={false}
                height={180}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={videoConstraints}
            />
          <button
            onClick={capture}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Get emotion (webcam)
          </button>
            </>
        );
    };

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

      <WebcamCapture/>

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


function blobConvert(imageSrc) {
    // Convert base64 string to Blob
    const byteCharacters = atob(imageSrc.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    return blob;
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
