import Swal from "sweetalert2";
import useExerciseLogStore from "../stores/exerciseLogStore";

export default function ShowResult({ totalReps, exerciseName, totalCaloriesBurned, durationMinutes, userId }) {
  const { saveLog } = useExerciseLogStore();

  async function handleSave() {
    if (userId) {
      try {
        await saveLog(userId, exerciseName, totalReps, totalCaloriesBurned, durationMinutes);
        Swal.fire("Saved!", "Your workout has been saved.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to save workout.", error);
      }
    }
  }

  async function showPopup() {
    let resultMessage = `<p>You completed <strong>${totalReps}</strong> reps!</p>`;

    if (userId && totalCaloriesBurned !== undefined) {
      resultMessage += `<p>Calories burned: <strong>${totalCaloriesBurned.toFixed(2)}</strong> kcal</p>`;
    }

    if (!userId) {
      resultMessage += `<p><em>⚠️ Log in to save your progress.</em></p>`;
    }

    const result = await Swal.fire({
      title: "Workout Complete! 🎉",
      html: resultMessage,
      icon: "success",
      showCancelButton: !!userId,
      confirmButtonText: userId ? "Save" : "Close",
      cancelButtonText: "Close",
    });

    if (result.isConfirmed && userId) {
      handleSave();
    }
  }

  return <button onClick={showPopup}>Show Results</button>;
}