import { useNavigate } from "react-router-dom";
import ShowResult from "../components/ShowResult";
import { ResultContainer, ResultCard, ResultText, ActionButton } from "../styles/pages/ResultStyles";
import useWebsocketStore from "../stores/websocketStore";

export default function Result() {
  const navigate = useNavigate();
  const { resultData } = useWebsocketStore();

  if (!resultData || typeof resultData !== "object") {
    return (
      <ResultContainer>
        <ResultCard>
          <ResultText>No results available.</ResultText>
          <ActionButton onClick={() => navigate("/dashboard")}>Back to Dashboard</ActionButton>
        </ResultCard>
      </ResultContainer>
    );
  }

  // ✅ Extract values safely
  const { totalReps = 0, exerciseName = "Unknown", totalCaloriesBurned = 0, durationMinutes = 0, userId = null } = resultData;

  return (
    <ResultContainer>
      <ResultCard>
        <ShowResult 
          totalReps={totalReps}
          exerciseName={exerciseName}
          totalCaloriesBurned={totalCaloriesBurned}
          durationMinutes={durationMinutes}
          userId={userId}
        />
        {/* <ShowResult {...resultData} /> */}
        <ActionButton onClick={() => navigate("/dashboard")}>Back to Dashboard</ActionButton>
      </ResultCard>
    </ResultContainer>
  );
}