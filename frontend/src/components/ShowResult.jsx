import useExerciseLogStore from "../stores/exerciseLogStore";

export default function ShowResult({ totalReps, exerciseName, totalCaloriesBurned, durationMinutes, userId }) {
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

      {userId && totalCaloriesBurned !== undefined && (
        <p><strong>Calories burned:</strong> {totalCaloriesBurned.toFixed(2)} kcal</p>
      )}

      {userId && (
        <button onClick={handleSave}>Save Workout</button>
      )}
    </>
  );
}