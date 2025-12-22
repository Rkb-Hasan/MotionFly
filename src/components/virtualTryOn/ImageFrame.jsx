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
  const [detecting, setDetecting] = useState(false);

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
    if (!poseReady || !canvasRef.current || !imgRef.current) return;

    const image = imgRef.current;

    const runDetection = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      setDetecting(true);

      requestAnimationFrame(() => {
        const results = poseLandMarkerRef.current.detect(image);
        console.log(results);
        setDetecting(false);

        if (!results?.landmarks?.length) return;

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
      });
    };

    if (image.complete) {
      runDetection();
    } else {
      image.onload = runDetection;
    }
  }, [imageSrc, poseReady]);

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

      {detecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 w-full h-full border-amber-950 border-8">
          <p className="text-white text-lg animate-pulse">Detecting pose…</p>
        </div>
      )}

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
