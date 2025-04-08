import styled from "styled-components";

// Full-page container for the results page
export const ResultPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #1e2a3a, #3d4856);
  color: white;
`;

export const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  text-align: center;
  color: white;
`;