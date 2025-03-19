import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

if (!API_BASE_URL || !WEBSOCKET_URL) {
  throw new Error("Missing required environment variables: VITE_API_BASE_URL or VITE_WEBSOCKET_URL");
}

// ✅ Check if the camera is available
export async function checkCamera() {
  try {
    await axios.get(`${API_BASE_URL}/ws/system/check_camera`);
    return true;
  } catch (error) {
    console.error("Camera check failed:", error.response?.data?.detail || error.message);
    return false; // ✅ Prevents WebSocket from starting if camera is not available
  }
}

// ✅ Start a WebSocket connection for an exercise
export function createExerciseWebSocket(exerciseType, difficulty, onMessage, onComplete) {
  try {
    const wsUrl = `${WEBSOCKET_URL}/ws/start_exercise?exercise=${exerciseType}&difficulty=${difficulty}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected:", ws.url);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "update_frame") {
          onMessage(data.image, data.counter);
        }
        if (data.event === "exercise_complete") {
          ws.close();
          if (onComplete) onComplete(data.total_reps);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      ws.close();
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log("WebSocket connection closed cleanly");
      } else {
        console.error("WebSocket connection closed unexpectedly");
      }
    };

    return ws;
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    return null;
  }
}