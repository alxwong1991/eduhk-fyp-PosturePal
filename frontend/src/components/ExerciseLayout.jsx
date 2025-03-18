import styled from "styled-components";
import PropTypes from "prop-types"; // ✅ Import prop-types for validation

// Main layout for exercise pages
const ExerciseContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #1e1e1e;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 20px;
  }
`;

// Left section (title, input, buttons)
const ExerciseLeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #282828;
  height: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;

// Right section (Webcam feed)
const ExerciseRightSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;

// Webcam frame (conditionally styled)
const WebcamFrame = styled.div`
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  border: ${({ isActive }) => (isActive ? "3px solid #337ab7" : "none")};
  transition: border 0.3s ease-in-out;
`;

// Title styling
const ExerciseTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
`;

// Input field
const ExerciseInput = styled.input`
  padding: 12px;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  width: 80%;
  text-align: center;
`;

// Button styling
const ExerciseButton = styled.button`
  padding: 12px 20px;
  margin: 10px;
  background-color: #337ab7;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  width: 80%;
  text-align: center;
  transition: background 0.3s;

  &:hover {
    background-color: #286090;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

// ✅ Moved WebcamFeed component inside ExerciseLayout
const WebcamFeed = ({ image, isActive }) => {
  return (
    <WebcamFrame isActive={isActive}>
      {image ? (
        <img src={image} alt="Webcam Feed" style={{ width: "100%", height: "100%", borderRadius: "10px" }} />
      ) : (
        <p style={{ color: "#ccc", textAlign: "center", padding: "20px" }}>
          No Camera Feed Available
        </p>
      )}
    </WebcamFrame>
  );
};

// ✅ Reusable layout component with integrated WebcamFeed
const ExerciseLayout = ({ title, children, image, isActive }) => {
  return (
    <ExerciseContainer>
      <ExerciseLeftSide>
        <ExerciseTitle>{title}</ExerciseTitle>
        {children}
      </ExerciseLeftSide>

      <ExerciseRightSide>
        <WebcamFeed image={image} isActive={isActive} /> {/* ✅ Integrated WebcamFeed here */}
      </ExerciseRightSide>
    </ExerciseContainer>
  );
};

export { ExerciseLayout, ExerciseInput, ExerciseButton };