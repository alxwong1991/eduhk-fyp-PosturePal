import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavMenu from "../components/NavMenu";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e2a3a 0%, #3d4856 100%);
  color: white;
  padding: 2rem;
  padding-top: 100px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const IntroSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  text-align: center;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.3);
  max-width: 800px;
`;

const IntroTitle = styled.h2`
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const IntroText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const ExerciseCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }
`;

const ExerciseIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.disabled ? "#666" : "#4a90e2")};
  color: white;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #357abd;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();

  const exercises = [
    {
      icon: "💪",
      title: "Bicep Curls",
      path: "/bicep-curls",
      available: true,
    },
    {
      icon: "🏃",
      title: "Squats",
      path: "/squats",
      available: true,
    },
    {
      icon: "🤸",
      title: "Jumping Jacks",
      path: "/jumping-jacks",
      available: false,
    },
    {
      icon: "👊",
      title: "Push-Ups",
      path: "/push-ups",
      available: false,
    },
  ];

  return (
    <Container>
      <NavMenu />
      <ContentWrapper>
        {/* ✅ PosturePal Introduction Section */}
        <IntroSection>
          <IntroTitle>Welcome to PosturePal</IntroTitle>
          <IntroText>
            PosturePal is your AI-powered fitness assistant, designed to help
            you maintain proper posture and achieve your workout goals with
            real-time feedback. Improve your form, track your progress, and stay
            on top of your fitness journey.
            <br />
            <br />
            Select an exercise below to start your workout!
          </IntroText>
        </IntroSection>

        {/* ✅ Exercise Grid */}
        <ExerciseGrid>
          {exercises.map((exercise, index) => (
            <ExerciseCard key={index}>
              <ExerciseIcon>{exercise.icon}</ExerciseIcon>
              <ExerciseTitle>{exercise.title}</ExerciseTitle>
              <StartButton
                disabled={!exercise.available}
                onClick={() => exercise.available && navigate(exercise.path)}
              >
                {exercise.available ? "Start Exercise" : "Coming Soon"}
              </StartButton>
            </ExerciseCard>
          ))}
        </ExerciseGrid>
      </ContentWrapper>
    </Container>
  );
}
