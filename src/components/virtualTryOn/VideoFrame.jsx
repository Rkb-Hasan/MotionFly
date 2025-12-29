import { useCallback, useEffect, useRef, useState } from "react";
import Dot from "../../assets/icons/dot.svg";
import Play from "../../assets/icons/play.svg";
import Capture from "../../assets/icons/screenshot.svg";
import Stop from "../../assets/icons/stop.svg";

export default function VideoFrame({ selectedDress, onLoading, onCamError }) {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const cameraStartedRef = useRef(false);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    const videoContraints = {
      width: { max: 800 },
      height: { max: 450 },
      aspectRatio: { ideal: 1.7777777778 },
    };

    if (cameraStartedRef.current) return;
    cameraStartedRef.current = true;

    try {
      onLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoContraints,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err);
          }
        }
      }

      onCamError(null);
    } catch (err) {
      cameraStartedRef.current = false;

      if (err.name === "NotAllowedError") {
        onCamError("Camera permission denied. Please allow access.");
      } else {
        console.log(err);
        onCamError("Camera failed: " + err.message);
      }
    } finally {
      onLoading(false);
    }
  }, [onLoading, onCamError]);

  useEffect(() => {
    startCamera();

    return () => {
      cameraStartedRef.current = false;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }
    console.log("ee");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;

    const makeAnimation = () => {
      console.log("an");
      if (video.readyState >= 2) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(makeAnimation);
    };

    makeAnimation();
    return () => cancelAnimationFrame(rafId);
  }, []);

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
    <>
      <div>
        <div className="relative w-full max-h-[90vh]"></div>
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover rounded-lg transform rotate-y-180"
        />

        {/* canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none transform rotate-y-180"
        />
      </div>
      {/* capture and record */}
      <div className="absolute top-0 left-5 flex gap-4 my-4">
        <button onClick={handleCapture} className="  text-white rounded">
          <img className="w-5 h-5" src={Capture} alt="" />
        </button>

        {!recording ? (
          <button onClick={startRecording} className="  text-white rounded">
            <img className="w-5 h-5" src={Play} alt="" />
          </button>
        ) : (
          <>
            <button onClick={stopRecording} className=" text-white rounded">
              <img className="w-5 h-5" src={Stop} alt="" />
            </button>
            <button onClick={stopRecording} className=" text-white rounded">
              <img className="w-5 h-5 animate-pulse" src={Dot} alt="" />
            </button>
          </>
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
  );
}
