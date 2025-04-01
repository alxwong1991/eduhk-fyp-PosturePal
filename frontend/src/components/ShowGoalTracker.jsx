import useAuthStore from "../stores/authStore";
import {
  ProgressContainer,
  ProgressBar,
  Label,
} from "../styles/components/ShowGoalTrackerStyles";

export default function ShowGoalTracker() {
  const { user } = useAuthStore();

  if (!user) return null;

  const getDailyCalorieGoal = () => {
    if (user.gender === "Male") return 300;
    if (user.gender === "Female") return 200;
    return 250; // Neutral for other/undefined genders
  };

  const dailyGoal = getDailyCalorieGoal();
  const burned = user.daily_calories_burned || 0;
  const progress = Math.min((burned / dailyGoal) * 100, 100);
  const progressColor = progress < 30 ? "red" : progress < 80 ? "orange" : "green";

  return (
    <ProgressContainer>
      <Label>🔥 Daily Calorie Goal ({dailyGoal} kcal) 🔥</Label>
      <ProgressBar style={{ width: `${progress}%`, backgroundColor: progressColor }}>
        {Math.round(progress)}%
      </ProgressBar>
    </ProgressContainer>
  );
}