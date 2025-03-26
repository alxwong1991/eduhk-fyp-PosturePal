import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useExerciseLogStore from "../stores/exerciseLogStore";
import useAuthStore from "../stores/authStore";
import { ShowResultContainer, SaveButton, ActionButton } from "../styles/components/ShowResultStyles";

export default function ShowResult({ totalReps, exerciseName, totalCaloriesBurned, durationMinutes }) {
  const { saveLog } = useExerciseLogStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // ✅ Convert duration from minutes to seconds
  const durationSeconds = Math.round(durationMinutes * 60);

  async function handleSave() {
    try {
      await saveLog(user.id, exerciseName, totalReps, totalCaloriesBurned, durationSeconds);
      Swal.fire({
        title: "Workout Saved!",
        text: "Your workout has been saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to save workout.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <ShowResultContainer>
      <h2>Exercise Completed!</h2>
      <p><strong>Exercise:</strong> {exerciseName}</p>
      <p><strong>Total Reps:</strong> {totalReps}</p>
      <p><strong>Calories Burned:</strong> {totalCaloriesBurned.toFixed(2)} kcal</p>
      <p><strong>Duration:</strong> {durationSeconds} seconds</p>

      <SaveButton onClick={handleSave}>Save Workout</SaveButton>
      <ActionButton onClick={() => navigate("/dashboard")}>Back to Dashboard</ActionButton>
    </ShowResultContainer>
  );
}