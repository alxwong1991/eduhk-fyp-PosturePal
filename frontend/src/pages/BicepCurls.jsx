import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showResult } from '../components/ShowResult';
import { showCameraError } from '../components/ShowCameraError';
import { useExerciseWebSocket } from '../hooks/useExerciseWebSocket';
import Webcam from "../components/WebcamFeed";
import {
  ExerciseContainer,
  ExerciseLeftSide,
  ExerciseRightSide,
  ExerciseTitle,
  ExerciseInput,
  ExerciseButton
} from "../styles/exerciseStyles"; // Import modular styles
import { WebcamFrame } from "../styles/exerciseStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function BicepCurls() {
  const [name, setName] = useState("");
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const navigate = useNavigate();

  const {
    image,
    exerciseFinished,
    startWebSocketExercise
  } = useExerciseWebSocket(API_BASE_URL, WEBSOCKET_URL);

  async function startExercise() {
    setIsExerciseRunning(true);
    await showCountdown();

    try {
      await startWebSocketExercise("bicep_curls", (totalReps) => {
        setIsExerciseRunning(false);
        showResult(name, totalReps);
      });
    } catch (error) {
      console.error("Camera error:", error);
      setIsExerciseRunning(false);
      await showCameraError(error.message);
    }
  }

  return (
    <ExerciseContainer>
      {/* Left Side - Title, User Input, and Exercise Controls */}
      <ExerciseLeftSide>
        <ExerciseTitle>Bicep Curls</ExerciseTitle>

        {!isExerciseRunning && !name && (
          <>
            <ExerciseInput
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ExerciseButton onClick={() => setName(name)}>Continue</ExerciseButton>
          </>
        )}

        {name && (
          <>
            <h2>Welcome, {name}!</h2>

            {!isExerciseRunning && (
              <>
                <ExerciseButton onClick={startExercise} disabled={exerciseFinished}>
                  {exerciseFinished ? "Exercise Complete" : "Start Exercise"}
                </ExerciseButton>
                <ExerciseButton onClick={() => navigate("/dashboard")}>
                  Back to Menu
                </ExerciseButton>
              </>
            )}
          </>
        )}
      </ExerciseLeftSide>

      {/* Right Side - Webcam Feed */}
      <ExerciseRightSide>
        <WebcamFrame>
          <Webcam image={image} />
        </WebcamFrame>
      </ExerciseRightSide>
    </ExerciseContainer>
  );
}