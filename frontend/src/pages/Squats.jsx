import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showCameraError } from "../components/ShowCameraError";
import useAuthStore from "../stores/authStore";
import useWebsocketStore from "../stores/websocketStore";
import { ExerciseLayout, ExerciseButton } from "../components/ExerciseLayout";

export default function Squats() {  // Change to BicepCurls for that file
  const [difficulty, setDifficulty] = useState(null);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { image, exerciseFinished, startWebSocketExercise } = useWebsocketStore();

  async function startExercise() {
    if (!difficulty) return;

    setIsExerciseRunning(true);
    useWebsocketStore.setState({ exerciseFinished: false });  // ✅ Reset before starting
    await showCountdown();
    const startTime = Date.now();

    try {
      await startWebSocketExercise("squats", difficulty, (totalReps, totalCalories) => {
        setIsExerciseRunning(false);
        useWebsocketStore.setState({ exerciseFinished: false });  // ✅ Reset when navigating

        navigate("/results", {
          state: {
            totalReps,
            exerciseName: "squats",
            totalCaloriesBurned: totalCalories,
            durationMinutes: (Date.now() - startTime) / 60000,
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
    <ExerciseLayout title="Squats" image={image} isActive={!exerciseFinished && isExerciseRunning}>
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
              <ExerciseButton onClick={startExercise} disabled={isExerciseRunning}>
                Start Exercise
              </ExerciseButton>
              <ExerciseButton onClick={() => navigate("/dashboard")}>Back to Menu</ExerciseButton>
            </>
          )}
        </>
      )}
    </ExerciseLayout>
  );
}