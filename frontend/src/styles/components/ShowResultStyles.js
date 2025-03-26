import styled from "styled-components";

// 🏋️‍♂️ Glassmorphism container for result details
export const ShowResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  margin: auto;
  text-align: center;
  color: white;
`;

// ✅ Styled save button
export const SaveButton = styled.button`
  background: #28a745;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;

  &:hover {
    background: #218838;
  }
`;

// ✅ Back to Dashboard button
export const ActionButton = styled.button`
  background: #007bff;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;