import {
  ExerciseContainer,
  ExerciseLeftSide,
  ExerciseButton,
  ExerciseInput,
  EmptyStateMessage,
  ExerciseTitle,
  ExerciseRightSide,
  WebcamFrame,
} from "../styles/components/ExerciseLayoutStyles";

// Webcam component that hides when exercise is not active
const WebcamFeed = ({ image, isActive }) => {
  if (!isActive) return null; // Hide webcam feed if not active

  return (
    <WebcamFrame isActive={isActive}>
      {image ? (
        <img
          src={image}
          alt="Webcam Feed"
          style={{ width: "100%", height: "100%", borderRadius: "10px" }}
        />
      ) : (
        <EmptyStateMessage>No Camera Feed Available</EmptyStateMessage>
      )}
    </WebcamFrame>
  );
};

// Reusable layout component with WebcamFeed
const ExerciseLayout = ({ title, children, image, isActive }) => {
  return (
    <ExerciseContainer>
      <ExerciseLeftSide>
        <ExerciseTitle>{title}</ExerciseTitle>
        {children}
      </ExerciseLeftSide>

      <ExerciseRightSide>
        <WebcamFeed image={image} isActive={isActive} /> {/* Updated */}
      </ExerciseRightSide>
    </ExerciseContainer>
  );
};

export { ExerciseLayout, ExerciseInput, ExerciseButton };
