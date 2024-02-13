import Webcam from "react-webcam";
import { useCallback, useEffect, useRef } from 'react';

const videoConstraints = {
    width: 320,
    height: 180,
    facingMode: "user"
};

export default function WebcamCapture({setSelectedImage}) {
    const webcamRef = useRef(null);
    const getScreenshot = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // Convert base64 string to Blob
        const blob = blobConvert(imageSrc);

        setSelectedImage(blob);
    }, [setSelectedImage]); 


    // Get screenshot every 0.5s
    useEffect(() => {
        const intervalId = setInterval(() => {
            getScreenshot();
        }, 500); 

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [getScreenshot]); 

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
        </>
    );
};

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
