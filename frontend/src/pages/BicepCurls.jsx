import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showResult } from "../components/ShowResult";
import { showCameraError } from "../components/ShowCameraError";
import { useWebSocket } from "../hooks/useWebSocket";
import {
  ExerciseLayout,
  ExerciseInput,
  ExerciseButton,
} from "../components/ExerciseLayout";

export default function BicepCurls() {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState(null);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const navigate = useNavigate();

  const { image, exerciseFinished, startWebSocketExercise } = useWebSocket();

  async function startExercise() {
    if (!difficulty) return; // Ensure difficulty is selected

    setIsExerciseRunning(true);
    await showCountdown();

    try {
      await startWebSocketExercise("bicep_curls", difficulty, (totalReps) => {
        setIsExerciseRunning(false);
        showResult(totalReps);
      });
    } catch (error) {
      console.error("Camera error:", error);
      setIsExerciseRunning(false);
      await showCameraError(error.message);
    }
  }

  return (
    <ExerciseLayout
      title="Bicep Curls"
      image={image}
      isActive={!exerciseFinished && isExerciseRunning}
    >
      {!isExerciseRunning && !name && (
        <>
          <ExerciseInput
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ExerciseButton onClick={() => setName(name)}>
            Continue
          </ExerciseButton>
        </>
      )}

      {name && !difficulty && (
        <>
          <h2>Welcome, {name}!</h2>
          <h3>Select Difficulty:</h3>
          <ExerciseButton onClick={() => setDifficulty("easy")}>
            Easy
          </ExerciseButton>
          <ExerciseButton onClick={() => setDifficulty("medium")}>
            Medium
          </ExerciseButton>
          <ExerciseButton onClick={() => setDifficulty("hard")}>
            Hard
          </ExerciseButton>
        </>
      )}

      {difficulty && (
        <>
          <h2>
            Difficulty:{" "}
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </h2>

          {!isExerciseRunning && (
            <>
              <ExerciseButton
                onClick={startExercise}
                disabled={exerciseFinished}
              >
                {exerciseFinished ? "Exercise Complete" : "Start Exercise"}
              </ExerciseButton>
              <ExerciseButton onClick={() => navigate("/dashboard")}>
                Back to Menu
              </ExerciseButton>
            </>
          )}
        </>
      )}
    </ExerciseLayout>
  );
}
