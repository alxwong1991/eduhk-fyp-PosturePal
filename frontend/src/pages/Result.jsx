import { useEffect, useState } from "react";
import ShowResult from "../components/ShowResult";
import { ResultPageContainer, ResultCard } from "../styles/pages/ResultStyles";
import useWebsocketStore from "../stores/websocketStore";

export default function Result() {
  const { resultData } = useWebsocketStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultData && typeof resultData === "object" && Object.keys(resultData).length > 0) {
      setLoading(false);
    }
  }, [resultData]);

  if (loading) {
    return (
      <ResultPageContainer>
        <ResultCard>
          <p><strong>Loading results...</strong></p>
        </ResultCard>
      </ResultPageContainer>
    );
  }

  if (!resultData || Object.keys(resultData).length === 0) {
    return (
      <ResultPageContainer>
        <ResultCard>
          <p><strong>No results available.</strong></p>
        </ResultCard>
      </ResultPageContainer>
    );
  }

  const {
    totalReps = 0,
    exerciseName = "Unknown",
    totalCaloriesBurned = 0,
    durationMinutes = 0,
    userId = null,
  } = resultData;

  return (
    <ResultPageContainer>
      <ResultCard>
        <ShowResult
          totalReps={totalReps}
          exerciseName={exerciseName}
          totalCaloriesBurned={totalCaloriesBurned}
          durationMinutes={durationMinutes}
          userId={userId}
        />
      </ResultCard>
    </ResultPageContainer>
  );
}