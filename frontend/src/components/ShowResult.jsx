import Swal from "sweetalert2";
import { useExerciseLog } from "../hooks/useExerciseLog";

export async function showResult(totalReps, exerciseName, totalCaloriesBurned, durationMinutes, userId) {
  const { saveLog } = useExerciseLog();

  // ✅ Base message for all users
  let resultMessage = `<p>You completed <strong>${totalReps}</strong> reps!</p>`;

  // ✅ Only show calories for logged-in users
  if (userId && totalCaloriesBurned !== undefined) {
    resultMessage += `<p>Calories burned: <strong>${totalCaloriesBurned.toFixed(2)}</strong> kcal</p>`;
  }

  // ✅ Warning for guests
  if (!userId) {
    resultMessage += `<p><em>⚠️ Log in to save your progress.</em></p>`;
  }

  const result = await Swal.fire({
    title: "Workout Complete! 🎉",
    html: resultMessage,
    icon: "success",
    showCancelButton: !!userId,  // ✅ Show "Save" only if logged in
    confirmButtonText: userId ? "Save" : "Close",
    cancelButtonText: "Close",
  });

  // ✅ Save workout only if the user is logged in
  if (result.isConfirmed && userId) {
    try {
      await saveLog(userId, exerciseName, totalReps, totalCaloriesBurned, durationMinutes);
      Swal.fire("Saved!", "Your workout has been saved.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to save workout.", error);
    }
  }
}