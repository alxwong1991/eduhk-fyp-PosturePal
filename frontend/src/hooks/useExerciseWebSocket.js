import { useState } from 'react';
import axios from 'axios';

export function useExerciseWebSocket(API_BASE_URL, WEBSOCKET_URL) {
  const [image, setImage] = useState("");
  const [counter, setCounter] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const checkCamera = async () => {
    try {
      await axios.get(`${API_BASE_URL}/check_camera`);
      setIsCameraReady(true);
      return true;
    } catch (error) {
      setIsCameraReady(false);
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || "Camera not working properly");
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("Cannot connect to server. Please check if the server is running.");
      } else {
        throw new Error("Failed to access camera. Please check your camera connection.");
      }
    }
  };

  const startWebSocketExercise = async (exerciseType, onComplete) => {
    setCounter(0);
    setImage("");
    setExerciseFinished(false);

    try {
      // Check camera first
      await checkCamera();
      
      // Only proceed if camera check passed
      await axios.get(`${API_BASE_URL}/start_streaming`);
      const ws = new WebSocket(`${WEBSOCKET_URL}/ws/start_${exerciseType}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.event === "update_frame") {
          setImage(`data:image/jpeg;base64,${data.image}`);
          setCounter(data.counter);
        }

        if (data.event === "exercise_complete") {
          setExerciseFinished(true);
          ws.close();
          onComplete?.(data.total_reps);
        }
      };

      ws.onclose = () => {
        setImage("");
        setIsCameraReady(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        throw new Error("Connection to exercise server failed");
      };

      return ws;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return {
    image,
    counter,
    exerciseFinished,
    isCameraReady,
    startWebSocketExercise,
    checkCamera,
  };
}