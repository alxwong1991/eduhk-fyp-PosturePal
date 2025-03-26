import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Helper function to get the auth token
function getAuthToken() {
  return localStorage.getItem("access_token");
}

// ✅ Save exercise log to backend
export async function saveExerciseLog(userId, exerciseName, totalReps, totalCalories, durationMinutes) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    const requestData = {
      user_id: userId,
      exercise_name: exerciseName,
      total_reps: totalReps,
      calories_burned: totalCalories,
      duration_minutes: durationMinutes,
    };

    console.log("📤 Sending Exercise Log Data:", requestData);

    const response = await axios.post(`${API_BASE_URL}/exercise/log`, requestData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to save exercise log:", error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || "Failed to save exercise log");
  }
}

// ✅ Fetch exercise logs from backend
export async function fetchExerciseLogs(userId) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    console.log(`📥 Fetching Exercise Logs for User ID: ${userId}`);

    const response = await axios.get(`${API_BASE_URL}/exercise/logs/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.reverse(); // ✅ Show most recent logs first
  } catch (error) {
    console.error("❌ Failed to fetch exercise logs:", error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || "Failed to fetch exercise logs");
  }
}

// ✅ Delete an exercise log from backend
export async function deleteExerciseLog(logId) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    console.log(`🗑️ Deleting Exercise Log with ID: ${logId}`);

    await axios.delete(`${API_BASE_URL}/exercise/log/${logId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete exercise log:", error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || "Failed to delete exercise log");
  }
}