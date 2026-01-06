import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export default function ImageFrame({ imageSrc, selectedDress }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandMarkerRef = useRef(null);
  const [poseReady, setPoseReady] = useState(false);
  const [dressReady, setDressReady] = useState(false);
  const dressImgRef = useRef(null);
  const [tryLoader, setTryLoader] = useState({ state: true, message: "" });
  useEffect(() => {
    let ignore = false;

    const initPose = async () => {
      setTryLoader({
        ...tryLoader,
        state: true,
        message: "pose initializing..",
      });
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        if (ignore) return;
        console.log("frominit");
        poseLandMarkerRef.current = await PoseLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            numPoses: 1,
          }
        );
        setPoseReady(true);
        setTryLoader({ ...tryLoader, message: "pose initilized..." });
      } catch (err) {
        console.log(err);
      }
    };

    initPose();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!poseReady || !dressReady || !canvasRef.current || !imgRef.current)
      return;

    const image = imgRef.current;

    const runDetection = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const results = poseLandMarkerRef.current.detect(image);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(results);

      if (!results?.landmarks?.length) {
        console.warn("No pose detected");
        return;
      }
      // draw the skeleton
      const drawingUtils = new DrawingUtils(ctx);

      drawingUtils.drawLandmarks(results.landmarks[0], {
        color: "#FFF000",
        lineWidth: 2,
      });

      drawingUtils.drawConnectors(
        results.landmarks[0],
        PoseLandmarker.POSE_CONNECTIONS,
        { color: "#00FF00", lineWidth: 8 }
      );

      // draw the dress
      const landmarks = results.landmarks[0];

      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Shoulder X positions
      const leftShoulderX = leftShoulder.x * canvasWidth;
      const rightShoulderX = rightShoulder.x * canvasWidth;

      // Shoulder midpoint (normalized)
      const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
      const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;

      // Ear midpoint (normalized)
      const earMidY = (leftEar.y + rightEar.y) / 2;

      // ---- CLAVICLE / COLLAR ANCHOR ----
      const collarY = shoulderMidY - (shoulderMidY - earMidY) * 0.55;
      const collarYPx = collarY * canvasHeight;

      // Hip midpoint (pixels)
      const hipYPx = ((leftHip.y + rightHip.y) / 2) * canvasHeight;

      // ---- SIZE CALCULATION ----
      const shoulderWidth = Math.abs(rightShoulderX - leftShoulderX);
      const torsoHeight = hipYPx - collarYPx;

      const dressWidth = shoulderWidth * 1.35;
      const dressHeight = torsoHeight;

      // ---- POSITION ----
      const centerXPx = shoulderMidX * canvasWidth;
      const dressX = centerXPx - dressWidth / 2;
      const dressY = collarYPx;

      // Debug box
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.strokeRect(dressX, dressY, dressWidth, dressHeight);

      // Draw dress
      if (dressImgRef.current?.complete) {
        ctx.drawImage(
          dressImgRef.current,
          dressX,
          dressY,
          dressWidth,
          dressHeight
        );
      }
      setTryLoader({ ...tryLoader, state: false, message: "" });
    };

    if (image.complete) {
      setTryLoader({ ...tryLoader, message: "running the detection" });
      runDetection();
    } else {
      image.onload = runDetection;
    }
  }, [imageSrc, poseReady, dressReady]);

  useEffect(() => {
    if (!selectedDress) return;

    const img = new Image();
    img.src = selectedDress;

    img.onload = () => {
      dressImgRef.current = img;
      setDressReady(true);
    };
  }, [selectedDress]);

  return (
    <div className="relative  flex max-w-[40%] max-h-[40%] justify-center items-center ">
      {tryLoader.state && <p className="text-red-400">{tryLoader.message}</p>}
      <img
        ref={imgRef}
        src={imageSrc}
        className="max-w-full max-h-full object-cover "
        alt="Uploaded"
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
