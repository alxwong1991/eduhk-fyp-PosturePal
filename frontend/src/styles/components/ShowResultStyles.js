import styled from "styled-components";

// 🏋️‍♂️ Glassmorphism container for result details (Larger & More Readable)
export const ShowResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  max-width: 600px; /* Increased width */
  width: 50%;
  margin: auto;
  text-align: center;
  color: white;
`;

// Larger & Bolder Heading
export const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

// Bigger Text for Exercise Info
export const InfoText = styled.p`
  font-size: 2.5rem;
  margin: 1.5rem 0;
`;

// Styled save button
export const SaveButton = styled.button`
  background: ${(props) => (props.disabled ? "#666" : "#4a90e2")};
  color: white;
  font-size: 1.2rem; /* Increased font size */
  padding: 14px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #357abd;
    transform: scale(1.05);
  }
`;

// Styled back button
export const ActionButton = styled.button`
  background: #007bff;
  color: white;
  font-size: 1.2rem; /* Increased font size */
  padding: 14px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
`;