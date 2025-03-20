import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export async function showResult(totalReps, caloriesBurned) {
  const { user } = useAuth(); // ✅ Get logged-in user

  const result = await Swal.fire({
    title: "Workout Complete! 🎉",
    html: `
      <p>You completed <strong>${totalReps}</strong> reps!</p>
      <p>Calories burned: <strong>${caloriesBurned.toFixed(2)}</strong> kcal</p>
    `,
    icon: "success",
    showCancelButton: user ? true : false, // ✅ Only show "Save" if logged in
    confirmButtonText: user ? "Save" : "Close",
    cancelButtonText: "Close",
  });

  if (result.isConfirmed && user) {
    saveWorkout(totalReps, caloriesBurned);
  }
}

// ✅ Save workout data
async function saveWorkout(totalReps, caloriesBurned) {
  try {
    const token = localStorage.getItem("access_token");

    await axios.post(
      "/api/workouts/save",
      { totalReps, caloriesBurned },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire("Saved!", "Your workout has been saved.", "success");
  } catch (error) {
    Swal.fire("Error", "Failed to save workout.", "error");
  }
}