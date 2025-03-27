import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

// ✅ Validate Environment Variables
if (!API_BASE_URL || !WEBSOCKET_URL) {
  throw new Error("❌ Missing required environment variables: VITE_API_BASE_URL or VITE_WEBSOCKET_URL");
}

// ✅ Function to Check Camera Availability
export async function checkCamera() {
  try {
    const response = await axios.get(`${API_BASE_URL}/ws/system/check_camera`);
    console.log("✅ Camera check successful:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Camera check failed:", error.response?.data?.detail || error.message);
    return false; // Prevents WebSocket from starting if camera is unavailable
  }
}

// ✅ Function to Create Exercise WebSocket Connection
export function createExerciseWebSocket(exerciseType, difficulty, onMessage, onComplete) {
  try {
    const userId = localStorage.getItem("user_id"); // ✅ Retrieve user ID from local storage
    if (!userId) {
      console.warn("⚠️ Warning: No user ID found in localStorage.");
    }

    const wsUrl = `${WEBSOCKET_URL}/ws/start_exercise?exercise=${exerciseType}&difficulty=${difficulty}${
      userId ? `&user_id=${userId}` : ""
    }`;

    console.log("🔹 WebSocket Initializing:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket Connected:", ws.url);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "update_frame") {
          onMessage?.(data.image, data.counter);
        }

        if (data.event === "exercise_complete") {
          ws.close(); // ✅ Close WebSocket after exercise completion

          const resultData = {
            totalReps: data.totalReps ?? 0,
            totalCaloriesBurned: data.totalCaloriesBurned ?? 0,
            userId: data.userId ?? userId ?? null, // Ensure correct ID
            exerciseName: exerciseType,
            durationMinutes: data.durationMinutes ?? 0,
          };

          console.log("🟢 Exercise Complete:", resultData);
          onComplete?.(resultData); // ✅ Ensure callback is called safely
        }
      } catch (error) {
        console.error("❌ Error Parsing WebSocket Message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      ws.close();

      onComplete?.({
        totalReps: 0,
        totalCaloriesBurned: 0,
        userId: userId ?? null,
        exerciseName: exerciseType,
        durationMinutes: 0,
      });
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log("✅ WebSocket Closed Normally:", event.reason);
      } else {
        console.warn("⚠️ WebSocket Closed Unexpectedly:", event.code, event.reason);
      }
    };

    return ws;
  } catch (error) {
    console.error("❌ Failed to Create WebSocket Connection:", error);
    return null;
  }
}