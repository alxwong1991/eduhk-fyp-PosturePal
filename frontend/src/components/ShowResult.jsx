import useExerciseLogStore from "../stores/exerciseLogStore";

export default function ShowResult({ totalReps = 0, exerciseName = "Unknown", totalCaloriesBurned = 0, durationMinutes = 0, userId = null }) {
  const { saveLog } = useExerciseLogStore();

  async function handleSave() {
    if (userId) {
      try {
        await saveLog(userId, exerciseName, totalReps, totalCaloriesBurned, durationMinutes);
        alert("Workout saved successfully!");
      } catch (error) {
        alert("Failed to save workout.");
      }
    }
  }

  return (
    <>
      <p><strong>You completed:</strong> {totalReps} reps</p>

      {/* ✅ Ensure only logged-in users see calories */}
      {userId && typeof totalCaloriesBurned === "number" && (
        <p><strong>Calories burned:</strong> {totalCaloriesBurned.toFixed(2)} kcal</p>
      )}

      {/* ✅ Ensure only logged-in users see the save button */}
      {userId && (
        <button onClick={handleSave}>Save Workout</button>
      )}
    </>
  );
}