import { useNavigate, useLocation } from "react-router-dom";
import ShowResult from "../components/ShowResult";
import { ResultContainer, ResultCard, ResultText, ActionButton } from "../styles/pages/ResultStyles";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state; // ✅ Get workout data from navigation state

  if (!resultData) {
    return (
      <ResultContainer>
        <ResultCard>
          <ResultText>No results available.</ResultText>
          <ActionButton onClick={() => navigate("/dashboard")}>Back to Dashboard</ActionButton>
        </ResultCard>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <ResultCard>
        <ShowResult {...resultData} />
        <ActionButton onClick={() => navigate("/dashboard")}>Back to Dashboard</ActionButton>
      </ResultCard>
    </ResultContainer>
  );
}