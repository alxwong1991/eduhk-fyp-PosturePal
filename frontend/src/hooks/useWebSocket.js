import { useState, useEffect, useRef } from "react";
import { checkCamera as apiCheckCamera, createExerciseWebSocket } from "../api/websocket";

export function useWebsocket() {
  const [image, setImage] = useState("");
  const [counter, setCounter] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const webSocketRef = useRef(null); // ✅ Store WebSocket instance

  // ✅ Check camera and update state
  const checkCamera = async () => {
    const isReady = await apiCheckCamera();
    setIsCameraReady(isReady);
    return isReady;
  };

  const startWebSocketExercise = async (exerciseType, difficulty, onComplete) => {
    setCounter(0);
    setImage("");
    setExerciseFinished(false);

    // ✅ Ensure camera is ready before starting WebSocket
    const cameraReady = await checkCamera();
    if (!cameraReady) {
      console.error("Camera is not ready, aborting exercise.");
      return;
    }

    // ✅ Close previous WebSocket if it exists
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }

    try {
      const ws = createExerciseWebSocket(
        exerciseType,
        difficulty,
        (newImage, newCounter) => {
          setImage(`data:image/jpeg;base64,${newImage}`);
          setCounter(newCounter);
        },
        (totalReps) => {
          setExerciseFinished(true);
          setTimeout(() => {
            webSocketRef.current = null; // ✅ Ensure cleanup happens after WebSocket closes
          }, 100);
          if (onComplete) onComplete(totalReps);
        }
      );

      webSocketRef.current = ws; // ✅ Store WebSocket in ref
    } catch (error) {
      console.error("Error starting WebSocket exercise:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, []);

  return {
    image,
    counter,
    exerciseFinished,
    isCameraReady,
    startWebSocketExercise,
    checkCamera,
  };
}