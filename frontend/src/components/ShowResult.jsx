import Swal from "sweetalert2";
import { useExerciseLog } from "../hooks/useExerciseLog";

export async function showResult(totalReps, exerciseName, totalCaloriesBurned, durationMinutes, user) {
  const { saveLog } = useExerciseLog();

  let resultMessage = `
    <p>You completed <strong>${totalReps}</strong> reps!</p>
    <p>Calories burned: <strong>${totalCaloriesBurned.toFixed(2)}</strong> kcal</p>
  `;

  if (!user) {
    resultMessage += `<p><em>⚠️ Log in to save your progress.</em></p>`;
  }

  const result = await Swal.fire({
    title: "Workout Complete! 🎉",
    html: resultMessage,
    icon: "success",
    showCancelButton: user ? true : false,
    confirmButtonText: user ? "Save" : "Close",
    cancelButtonText: "Close",
  });

  if (result.isConfirmed && user) {
    try {
      await saveLog(user.id, exerciseName, totalReps, totalCaloriesBurned, durationMinutes);
      Swal.fire("Saved!", "Your workout has been saved.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to save workout.", "error");
    }
  }
}