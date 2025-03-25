import styled from "styled-components";

// 🏋️‍♂️ Container for the results page
export const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #1e2a3a 0%, #3d4856 100%);
  color: white;
`;

// 📜 Card to display workout results
export const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  text-align: center;
`;

// 💪 Result text styling
export const ResultText = styled.p`
  font-size: 1.5rem;
  margin: 15px 0;
  font-weight: bold;
`;

// 🔘 Button styling
export const ActionButton = styled.button`
  padding: 12px 20px;
  margin-top: 15px;
  font-size: 18px;
  background-color: #337ab7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #286090;
  }
  
  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;