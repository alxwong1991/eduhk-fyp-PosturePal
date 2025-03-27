import useAuthStore from "../stores/authStore";
import {
  ProgressContainer,
  ProgressBar,
  Label,
} from "../styles/components/ShowGoalTrackerStyles";

export default function ShowGoalTracker() {
  const { user } = useAuthStore();

  if (!user) return null; // Ensure user is loaded

  console.log("daily calorie burned: " + user.daily_calories_burned);

  // ✅ Set daily calorie goal based on gender
  const getDailyCalorieGoal = () => {
    return user.gender === "Male" ? 2500 : user.gender === "Female" ? 2000 : 2200;
  };

  const dailyGoal = getDailyCalorieGoal();
  const progress = Math.min((user.daily_calories_burned / dailyGoal) * 100, 100);
  const progressColor = progress < 30 ? "red" : progress < 80 ? "orange" : "green"; // ✅ Color-coded progress

  return (
    <ProgressContainer>
      <Label>🔥 Daily Calorie Goal ({dailyGoal} kcal) 🔥</Label>
      <ProgressBar style={{ width: `${progress}%`, backgroundColor: progressColor }}>
        {Math.round(progress)}%
      </ProgressBar>
    </ProgressContainer>
  );
}