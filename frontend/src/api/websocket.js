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

export function createExerciseWebSocket(exerciseType, difficulty, onMessage, onComplete) {
  try {
    const userId = localStorage.getItem("user_id"); // ✅ Get user ID if logged in
    const wsUrl = userId
      ? `${WEBSOCKET_URL}/ws/start_exercise?exercise=${exerciseType}&difficulty=${difficulty}&user_id=${userId}`
      : `${WEBSOCKET_URL}/ws/start_exercise?exercise=${exerciseType}&difficulty=${difficulty}`;

    console.log("🔹 WebSocket URL:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket connected:", ws.url);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "update_frame") {
          onMessage(data.image, data.counter);
        }

        if (data.event === "exercise_complete") {
          ws.close();

          // ✅ Ensure only valid data is passed
          const resultData = {
            totalReps: data.total_reps ?? 0,
            totalCaloriesBurned: data.total_calories_burned ?? 0,
            userId: data.user_id ?? null,
            exerciseName: exerciseType, // ✅ Ensure exercise name is included
            durationMinutes: data.duration_minutes ?? 0, // ✅ Ensure duration is included
          };

          console.log(resultData, "hihihi");
          if (onComplete) onComplete(resultData);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      ws.close();

      if (onComplete) {
        onComplete({ totalReps: 0, totalCaloriesBurned: 0, userId: null, exerciseName: exerciseType, durationMinutes: 0 });
      }
    };

    ws.onclose = (event) => {
      console.log("✅ WebSocket connection closed", event);
    };

    return ws;
  } catch (error) {
    console.error("❌ Failed to create WebSocket connection:", error);
    return null;
  }
}