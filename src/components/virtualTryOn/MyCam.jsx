import { useRef, useState, useEffect } from "react";
import VideoFrame from "./VideoFrame";

export default function MyCam({ selectedDress }) {
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Store the image URL here

  const fileUploadRef = useRef();

  // Cleanup memory when imageSrc changes or component unmounts
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const handleImageUploadTrigger = (e) => {
    e.preventDefault();
    fileUploadRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImageSrc(imgUrl);
      setCameraError(null); // Clear error since we now have an image
    }
  };

  // Logic to determine what to show
  let mainDisplay;

  if (imageSrc) {
    // Priority 1: Show the uploaded image
    mainDisplay = (
      <img
        src={imageSrc}
        className="w-full max-h-[90vh] object-cover"
        alt="Uploaded"
      />
    );
  } else if (loading) {
    // Priority 2: Show loading state
    mainDisplay = <p className="text-red-700 min-h-full">Loading...</p>;
  } else if (cameraError) {
    // Priority 3: Show error and upload button
    mainDisplay = (
      <div className="flex flex-col justify-center items-center gap-4 text-center min-h-full">
        <p className="text-red-500 font-semibold">{cameraError}</p>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()} // Simple retry example
        >
          Retry Permission
        </button>

        {/* Simplified Form */}
        <div>
          <button
            onClick={handleImageUploadTrigger}
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Upload a Picture
          </button>
          <input
            ref={fileUploadRef}
            type="file"
            onChange={handleFileChange}
            hidden
            accept="image/*"
          />
        </div>
      </div>
    );
  } else {
    // Default: Show the Video Stream
    mainDisplay = (
      <VideoFrame
        selectedDress={selectedDress}
        onLoading={setLoading}
        onCamError={setCameraError}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh]">
      {mainDisplay}
    </div>
  );
}
