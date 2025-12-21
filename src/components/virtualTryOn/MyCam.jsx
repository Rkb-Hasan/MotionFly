import { useEffect, useRef, useState } from "react";
import ImageFrame from "./ImageFrame";
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

  return (
    <div className="relative flex flex-col items-center justify-center max-h-[88vh] border-4 border-yellow-400">
      {/* CAMERA ALWAYS MOUNTED */}
      {imageSrc ? (
        <ImageFrame selectedDress={selectedDress} imageSrc={imageSrc} />
      ) : (
        <VideoFrame
          selectedDress={selectedDress}
          onLoading={setLoading}
          onCamError={setCameraError}
        />
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
          <p className="text-white text-lg">Loading camera…</p>
        </div>
      )}

      {/* ERROR OVERLAY */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-40 gap-4">
          <p className="text-red-500 font-semibold">{cameraError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry Permission
          </button>

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
      )}
    </div>
  );
}
