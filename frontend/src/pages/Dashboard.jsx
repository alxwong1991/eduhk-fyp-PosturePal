import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../stores/authStore";
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
  const { user } = useAuthStore();

  const exercises = [
    { icon: "💪", title: "Bicep Curls", path: "/bicep-curls", available: true },
    { icon: "🏃", title: "Squats", path: "/squats", available: true },
    {
      icon: "🤸",
      title: "Jumping Jacks",
      path: "/jumping-jacks",
      available: false,
    },
    { icon: "👊", title: "Push-Ups", path: "/push-ups", available: false },
  ];

  const handleStartExercise = (exercisePath, available) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to start an exercise.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (available) {
      navigate(exercisePath); // ✅ Navigate first to the correct exercise page
    }
  };

  return (
    <Container>
      <NavMenu />
      <ContentWrapper>
        <IntroSection>
          <IntroTitle>Welcome to PosturePal</IntroTitle>
          <IntroText>
            PosturePal is your AI-powered fitness assistant, designed to help
            you maintain proper posture and achieve your workout goals with
            real-time feedback.
            <br />
            <br />
            Select an exercise below to start your workout!
          </IntroText>
        </IntroSection>

        <ExerciseGrid>
          {exercises.map((exercise, index) => (
            <ExerciseCard key={index}>
              <ExerciseIcon>{exercise.icon}</ExerciseIcon>
              <ExerciseTitle>{exercise.title}</ExerciseTitle>
              <StartButton
                disabled={!exercise.available}
                onClick={() =>
                  handleStartExercise(exercise.path, exercise.available)
                }
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
