import { useState, useEffect, useRef } from "react";
import { checkCamera as apiCheckCamera, createExerciseWebSocket } from "../api/websocket";

export function useWebsocket() {
  const [image, setImage] = useState("");
  const [counter, setCounter] = useState(0);
  const [calories, setCalories] = useState(null);  // ✅ Track calories only for logged-in users
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const webSocketRef = useRef(null);

  const checkCamera = async () => {
    const isReady = await apiCheckCamera();
    setIsCameraReady(isReady);
    return isReady;
  };

  const startWebSocketExercise = async (exerciseType, difficulty, onComplete) => {
    setCounter(0);
    setCalories(null);
    setImage("");
    setExerciseFinished(false);

    const cameraReady = await checkCamera();
    if (!cameraReady) {
      console.error("Camera is not ready, aborting exercise.");
      return;
    }

    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }

    try {
      const ws = createExerciseWebSocket(
        exerciseType,
        difficulty,
        (newImage, newCounter, newCalories) => {
          setImage(`data:image/jpeg;base64,${newImage}`);
          setCounter(newCounter);
          if (newCalories !== undefined) {
            setCalories(newCalories);  // ✅ Update calories only if available
          }
        },
        (data) => {
          setExerciseFinished(true);
          setTimeout(() => {
            webSocketRef.current = null;
          }, 100);
          if (onComplete) onComplete(data);
        }
      );

      webSocketRef.current = ws;
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
    calories,  // ✅ Only available for logged-in users
    exerciseFinished,
    isCameraReady,
    startWebSocketExercise,
    checkCamera,
  };
}