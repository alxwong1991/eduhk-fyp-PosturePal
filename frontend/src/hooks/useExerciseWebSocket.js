import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

if (!API_BASE_URL || !WEBSOCKET_URL) {
  throw new Error("Missing required environment variables: VITE_API_BASE_URL or VITE_WEBSOCKET_URL");
}

export function useExerciseWebSocket() {
  const [image, setImage] = useState("");
  const [counter, setCounter] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [webSocket, setWebSocket] = useState(null);

  const checkCamera = async () => {
    try {
      await axios.get(`${API_BASE_URL}/check_camera`);
      setIsCameraReady(true);
      return true;
    } catch (error) {
      setIsCameraReady(false);
      throw new Error(error.response?.data?.detail || "Camera not working properly");
    }
  };

  const startWebSocketExercise = async (exerciseType, difficulty, onComplete) => {
    setCounter(0);
    setImage("");
    setExerciseFinished(false);

    try {
      await checkCamera();
      await axios.get(`${API_BASE_URL}/start_streaming`);

      // ✅ Pass difficulty as a query parameter to the WebSocket
      const ws = new WebSocket(`${WEBSOCKET_URL}/ws/start_${exerciseType}?difficulty=${difficulty}`);
      setWebSocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "update_frame") {
          setImage(`data:image/jpeg;base64,${data.image}`);
          setCounter(data.counter);
        }
        if (data.event === "exercise_complete") {
          setExerciseFinished(true);
          ws.close();
          setWebSocket(null);
          onComplete?.(data.total_reps);
        }
      };

      ws.onclose = () => {
        setImage("");
        setIsCameraReady(false);
        setWebSocket(null);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setWebSocket(null);
        throw new Error("Connection to exercise server failed");
      };

      return ws;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
      }
    };
  }, [webSocket]);

  return {
    image,
    counter,
    exerciseFinished,
    isCameraReady,
    startWebSocketExercise,
    checkCamera,
  };
}