import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountdown } from "../components/ShowCountdown";
import { showResult } from '../components/ShowResult';
import { showCameraError } from '../components/ShowCameraError';
import { useExerciseWebSocket } from '../hooks/useExerciseWebSocket';
import Webcam from "../components/WebcamFeed";
import styled from "styled-components";
import Swal from 'sweetalert2';

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

export default function Squats() {
  const [name, setName] = useState("");
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const navigate = useNavigate();
  
  const { 
    image, 
    exerciseFinished, 
    startWebSocketExercise,
    checkCamera 
  } = useExerciseWebSocket(API_BASE_URL, WEBSOCKET_URL);

  async function startExercise() {
    if (!name) {
      return Swal.fire({
        title: "Hold on!",
        text: "Please enter your name before starting the exercise",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6"
      });
    }
    
    try {
      setIsExerciseRunning(true);
      
      await checkCamera();
      await showCountdown();

      await startWebSocketExercise('squats', (totalReps) => {
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
      <Title>Squats</Title>

      {!isExerciseRunning && !name && (
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

          {!isExerciseRunning && (
            <>
              <Button onClick={startExercise} disabled={exerciseFinished}>
                {exerciseFinished ? "Exercise Complete" : "Start Exercise"}
              </Button>
              <Button onClick={() => navigate("/dashboard")}>Back to Menu</Button>
            </>
          )}

          <Webcam image={image} />
        </>
      )}
    </Container>
  );
}