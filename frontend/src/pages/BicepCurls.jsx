import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showResult } from '../components/ShowResult'
import { showCameraError } from '../components/ShowCameraError'
import { useExerciseWebSocket } from '../hooks/useExerciseWebSocket';
import Webcam from "../components/WebcamFeed";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #222;
  color: white;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
`;

const Button = styled.button`
  padding: 12px 20px;
  margin: 10px;
  background-color: #337ab7;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    background-color: #286090;
  }
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function BicepCurls() {
  const [name, setName] = useState("");
  const [isExerciseRunning, setIsExerciseRunning] = useState(false); // ✅ Track if exercise is running
  const [cameraError, setCameraError] = useState(null);
  const navigate = useNavigate();

  const {
    image,
    exerciseFinished,
    startWebSocketExercise
  } = useExerciseWebSocket(API_BASE_URL, WEBSOCKET_URL);

  async function startExercise() {
    if (!name) return alert("Please enter your name");

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
    <Container>
      <Title>Bicep Curls</Title>

      {!isExerciseRunning && !name && ( // ✅ Show input only when exercise is NOT running
        <>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={() => setName(name)}>Continue</Button>
        </>
      )}

      {name && (
        <>
          <h2>Welcome, {name}!</h2>

          {!isExerciseRunning && ( // ✅ Hide buttons when exercise is running
            <>
              <Button onClick={startExercise} disabled={exerciseFinished}>
                {exerciseFinished ? "Exercise Complete" : "Start Exercise"}
              </Button>
              <Button onClick={() => navigate("/")}>Back to Menu</Button>
            </>
          )}

          <Webcam image={image} />
        </>
      )}
    </Container>
  );
}