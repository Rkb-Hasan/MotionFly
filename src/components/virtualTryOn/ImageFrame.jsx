import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export default function ImageFrame({ imageSrc, selectedDress }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandMarkerRef = useRef(null);
  const [poseReady, setPoseReady] = useState(false);
  const [dressReady, setDressReady] = useState(false);
  // const [detecting, setDetecting] = useState(false);
  const dressImgRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const initPose = async () => {
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
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const leftShoulderX = leftShoulder.x * canvasWidth;
      const rightShoulderX = rightShoulder.x * canvasWidth;

      const shoulderY = leftShoulder.y * canvasHeight;

      const hipY = ((leftHip.y + rightHip.y) / 2) * canvasHeight;

      const shoulderWidth = Math.abs(rightShoulderX - leftShoulderX);

      const torsoHeight = hipY - shoulderY;

      const dressWidth = shoulderWidth * 1.4;
      const dressHeight = torsoHeight;

      const centerX = (leftShoulderX + rightShoulderX) / 2;
      const dressX = centerX - dressWidth / 2;

      // slightly below shoulders
      const dressY = shoulderY + torsoHeight * 0.05;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      // ctx.strokeRect(dressX, dressY, dressWidth, dressHeight);
      if (dressImgRef.current && dressImgRef.current.complete) {
        ctx.drawImage(
          dressImgRef.current,
          dressX,
          dressY,
          dressWidth,
          dressHeight
        );
      }
    };

    if (image.complete) {
      runDetection();
    } else {
      image.onload = runDetection;
    }
  }, [imageSrc, poseReady]);

  useEffect(() => {
    if (!selectedDress) return;

    setDressReady(false); // reset on change

    const img = new Image();
    img.src = selectedDress;

    img.onload = () => {
      dressImgRef.current = img;
      setDressReady(true);
    };
  }, [selectedDress]);

  return (
    <div className="relative  flex max-w-[40%] max-h-[40%] justify-center items-center ">
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

      {/* dress overlay */}
      {/* {selectedDress && (
        <img
          src={selectedDress}
          alt="Dress overlay"
          className="absolute top-[55%]
        left-1/2
        -translate-x-1/2
        w-[40%]
        h-[50%]
        pointer-events-none
        z-10
      "
        />
      )} */}
    </div>
  );
}
