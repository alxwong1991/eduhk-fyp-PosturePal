import { useState } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";
import { startWebSocket, closeWebSocket } from "./api/websocket";

// ✅ Styled Components
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

const NameInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
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
  const [name, setName] = useState("");
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState(""); // ✅ State for Webcam Frame

  function saveName() {
    if (!name.trim()) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please enter your name." });
      return;
    }

    Swal.fire({ icon: "success", title: "Success!", text: `Hi, ${name}!` });
    setExerciseStarted(false);
  }

  function startExercise() {
    setExerciseStarted(true);
    startWebSocket(setCounter, setImage); // ✅ Start WebSocket
  }

  return (
    <Container>
      <Title>Virtual PE Coach</Title>

      <div>
        <NameInput type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={saveName}>Save Name</Button>
      </div>

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
