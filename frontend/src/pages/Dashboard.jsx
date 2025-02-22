import { useNavigate } from "react-router-dom";
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
  margin-bottom: 20px;
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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Exercise Menu</Title>
      <Button onClick={() => navigate("/bicep-curls")}>Bicep Curls</Button>
      <Button disabled>Squats (Coming Soon)</Button>
      <Button disabled>Push-Ups (Coming Soon)</Button>
      <Button disabled>Running (Coming Soon)</Button>
    </Container>
  );
}