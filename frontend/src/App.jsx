import { useState } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #222;
  color: #fff;
`;

const Title = styled.h1`
  text-align: center;
  margin-top: 40px;
  font-size: 36px;
  color: #fff;
`;

const Button = styled.button`
  padding: 8px 20px;
  background-color: #337ab7;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #286090;
  }
`;

const WebcamFeed = styled.img`
  margin-top: 20px;
  width: 640px;
  height: 480px;
  border-radius: 10px;
  border: 2px solid #fff;
`;

export default function App() {
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState("");

  async function startExercise() {
    // ✅ Reset counter and clear previous frame before starting
    setCounter(0);
    setImage("");

    // ✅ Show Swal Countdown
    for (let i = 5; i > 0; i--) {
      await Swal.fire({
        title: `Starting in ${i}...`,
        text: "Get ready!",
        timer: 1000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    // ✅ After countdown, start the exercise
    beginExercise();
  }

  async function beginExercise() {
    setExerciseStarted(true);

    // ✅ Start MJPEG Streaming
    await fetch("http://localhost:8000/start_streaming");

    // ✅ Open WebSocket for Bicep Curls Tracking
    const ws = new WebSocket("ws://localhost:8000/ws/start_bicep_curls");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "update_frame") {
        setImage(`data:image/jpeg;base64,${data.image}`);
        setCounter(data.counter);
      }

      if (data.event === "exercise_finished") {
        Swal.fire("Exercise Completed!", `Total reps: ${data.counter}`, "success");
        setExerciseStarted(false);
        fetch("http://localhost:8000/stop_streaming"); // ✅ Stop Streaming
      }
    };

    ws.onclose = () => {
      setExerciseStarted(false);
      fetch("http://localhost:8000/stop_streaming"); // ✅ Stop Streaming
    };
  }

  return (
    <Container>
      <Title>Virtual PE Coach</Title>

      {!exerciseStarted && <Button onClick={startExercise}>Start Bicep Curls</Button>}

      {exerciseStarted && (
        <>
          <h2>Reps: {counter}</h2>
          {image && <WebcamFeed src={image} alt="Webcam Feed" />}
        </>
      )}
    </Container>
  );
}