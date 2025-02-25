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

// Reusable layout component
const ExerciseLayout = ({ title, children, image, isActive }) => {
  return (
    <ExerciseContainer>
      <ExerciseLeftSide>
        <ExerciseTitle>{title}</ExerciseTitle>
        {children}
      </ExerciseLeftSide>

      <ExerciseRightSide>
        <WebcamFrame isActive={isActive}>
          {image ? <img src={image} alt="Webcam Feed" style={{ width: "100%", height: "100%", borderRadius: "10px" }} /> : null}
        </WebcamFrame>
      </ExerciseRightSide>
    </ExerciseContainer>
  );
};

// ✅ Add PropTypes Validation
ExerciseLayout.propTypes = {
  title: PropTypes.string.isRequired, // ✅ Ensures title is a required string
  children: PropTypes.node.isRequired, // ✅ Ensures children is a valid React node
  image: PropTypes.string, // ✅ Ensures image is a string (Base64 or URL)
  isActive: PropTypes.bool, // ✅ Ensures isActive is a boolean
};

// ✅ Default Props (Optional)
ExerciseLayout.defaultProps = {
  image: "", // Default to empty image
  isActive: false, // Default isActive to false
};

export { ExerciseLayout, ExerciseInput, ExerciseButton };