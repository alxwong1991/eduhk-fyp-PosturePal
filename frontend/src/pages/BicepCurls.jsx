import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showCameraError } from "../components/ShowCameraError";
import useAuthStore from "../stores/authStore";
import useWebsocketStore from "../stores/websocketStore";
import { ExerciseLayout, ExerciseButton } from "../components/ExerciseLayout";

export default function BicepCurls() {
  const [difficulty, setDifficulty] = useState(null);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { image, exerciseFinished, startWebSocketExercise } = useWebsocketStore();

  async function startExercise() {
    if (!difficulty) return;

    setIsExerciseRunning(true);
    useWebsocketStore.setState({ exerciseFinished: false });
    await showCountdown();
    const startTime = Date.now();

    try {
      await startWebSocketExercise("bicep_curls", difficulty, (totalReps, totalCalories) => {
        setIsExerciseRunning(false);
        useWebsocketStore.setState({ exerciseFinished: true });
        const durationMinutes = (Date.now() - startTime) / 60000;

        // ✅ Navigate to the results page
        navigate("/results", {
          state: {
            totalReps,
            exerciseName: "bicep_curls",
            totalCaloriesBurned: totalCalories,
            durationMinutes,
            userId: user?.id,
          },
        });
      });
    } catch (error) {
      console.error("Camera error:", error);
      setIsExerciseRunning(false);
      await showCameraError(error.message);
    }
  }

  return (
    <ExerciseLayout title="Bicep Curls" image={image} isActive={!exerciseFinished && isExerciseRunning}>
      {!difficulty && (
        <>
          <h3>Select Difficulty:</h3>
          <ExerciseButton onClick={() => setDifficulty("easy")}>Easy</ExerciseButton>
          <ExerciseButton onClick={() => setDifficulty("medium")}>Medium</ExerciseButton>
          <ExerciseButton onClick={() => setDifficulty("hard")}>Hard</ExerciseButton>
        </>
      )}

      {difficulty && (
        <>
          <h2>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>

          {!isExerciseRunning && (
            <>
              <ExerciseButton onClick={startExercise}>
                {exerciseFinished ? "Exercise Complete" : "Start Exercise"}
              </ExerciseButton>
              <ExerciseButton onClick={() => navigate("/dashboard")}>Back to Menu</ExerciseButton>
            </>
          )}
        </>
      )}
    </ExerciseLayout>
  );
}