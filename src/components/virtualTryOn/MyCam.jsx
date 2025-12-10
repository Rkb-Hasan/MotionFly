import { useCallback, useEffect, useRef, useState } from "react";

export default function MyCam() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const streamRef = useRef(null);
  const videoContraints = {
    width: { max: 800 },
    height: { max: 450 },
    aspectRatio: { ideal: 1.7777777778 },
  };

  const startCamera = useCallback(async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoContraints,
        audio: false,
      });
      streamRef.current = stream;
      // console.dir(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log(playErr);
        }
      }

      setCameraError(null);
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Please allow access.");
      } else {
        setCameraError("Camera failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startCamera();

    // Cleanup media stream on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");

    setCapturedImage(imageUrl);
  };

  const downloadCapturedImage = () => {
    const a = document.createElement("a");
    a.href = capturedImage;
    a.download = "capture.png";
    a.click();
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream);
    // console.dir(recorder);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      console.dir(blob);

      const url = URL.createObjectURL(blob);
      console.dir(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      // a.click();

      URL.revokeObjectURL(url);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center border bg-black p-3">
      {loading ? (
        <p className="text-red-700 min-h-[200px]">Loading...</p>
      ) : (
        <>
          {cameraError ? (
            <div className="flex flex-col justify-center items-center gap-4 text-center">
              <p className="text-red-500 font-semibold">{cameraError}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={startCamera}
              >
                Retry Permission
              </button>
            </div>
          ) : (
            <>
              <video
                controls
                ref={videoRef}
                className="w-full max-w-[850px] aspect-video object-cover rounded-lg border-4 border-yellow-400 transform rotate-y-180"
              />

              <div className="flex gap-4 my-4">
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 bg-gray-700 text-white rounded"
                >
                  Capture
                </button>

                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Stop Recording
                  </button>
                )}
              </div>

              {/* -------------------------
              IMAGE PREVIEW SECTION
          --------------------------- */}
              {capturedImage && (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <img
                    src={capturedImage}
                    alt="Preview"
                    className="w-full max-w-[400px] rounded-lg shadow border transform rotate-y-180"
                  />

                  <div className="space-x-2">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Remove Image
                    </button>
                    <button
                      onClick={downloadCapturedImage}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
