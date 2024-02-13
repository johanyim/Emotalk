import { useState } from "react";
import Image from "next/image";

export default function UploadAndDisplayImage({ selectedImage, setSelectedImage }) {
    const [url, setUrl] = useState<any>();

    return (
        <div>
            <h1>Upload Image</h1>
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    const image = event.target.files[0]
                    setSelectedImage(image);
                    setUrl(URL.createObjectURL(image))
                }}
            />
            {selectedImage && (
                <div className="flex gap-8">
                    <Image
                        width={200}
                        height={200}
                        src={url}
                        alt="uploaded image"
                    />
                    <button onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
            )}

        </div>
    );
};

