import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCountDown } from "../components/ShowCountdown";
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
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  async function startExercise() {
    if (!name) return alert("Please enter your name");

    setCounter(0);
    setImage("");

    await showCountDown();
    fetch(`${API_BASE_URL}/start_streaming`);

    const ws = new WebSocket(`${WEBSOCKET_URL}/start_bicep_curls`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "update_frame") {
        setImage(`data:image/jpeg;base64,${data.image}`);
        setCounter(data.counter);
      }
    };

    ws.onclose = () => setImage("");
  }

  return (
    <Container>
      <Title>Bicep Curls</Title>
      {!name ? (
        <>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={() => setName(name)}>Continue</Button>
        </>
      ) : (
        <>
          <h2>Welcome, {name}!</h2>
          <Button onClick={startExercise}>Start Exercise</Button>
          <h2>Reps: {counter}</h2>
          <Webcam image={image} />
          <Button onClick={() => navigate("/")}>Back to Menu</Button>
        </>
      )}
    </Container>
  );
}