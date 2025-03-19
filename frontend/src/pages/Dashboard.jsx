import { useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import {
  Container,
  ContentWrapper,
  IntroSection,
  IntroTitle,
  IntroText,
  ExerciseGrid,
  ExerciseCard,
  ExerciseTitle,
  StartButton,
  ExerciseIcon,
} from "../styles/pages/DashboardStyles";

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
