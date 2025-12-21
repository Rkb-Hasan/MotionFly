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
  useEffect(() => {
    let ignore = false;

    const initPose = async () => {
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
    };

    initPose();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!poseReady || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const image = imgRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const results = poseLandMarkerRef.current.detect(image);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(results);
    if (results.landmarks?.length) {
      const drawingUtils = new DrawingUtils(ctx);

      drawingUtils.drawLandmarks(results.landmarks[0], {
        color: "#FFF000",
        lineWidth: 2,
      });

      drawingUtils.drawConnectors(
        results.landmarks[0],
        PoseLandmarker.POSE_CONNECTIONS,
        { color: "#00FF00", lineWidth: 3 }
      );
    }
  }, [imageSrc, poseReady]);

  return (
    <div className="flex max-w-[40%] max-h-[40%] justify-center items-center ">
      <img
        ref={imgRef}
        src={imageSrc}
        className="max-w-full max-h-full object-cover "
        alt="Uploaded"
      />

      <canvas ref={canvasRef} className="absolute top-0 left-0" />

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
