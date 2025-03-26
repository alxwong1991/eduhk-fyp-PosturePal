import React, { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import useExerciseLogStore from "../stores/exerciseLogStore";
import {
  Container,
  LogGrid,
  LogCard,
  LogHeader,
  LogBody,
  Info,
  Label,
  Value,
  DeleteButton,
  Pagination,
  PageButton,
} from "../styles/components/ShowExerciseLogStyles";

export default function ShowExerciseLog() {
  const { user } = useAuthStore();
  const { exerciseLogs, loadLogs, deleteLog } = useExerciseLogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 3; // ✅ Show 3 logs per page

  useEffect(() => {
    if (user) {
      loadLogs(user.id);
    }
  }, [user]);

  const handleDelete = async (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      await deleteLog(logId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const roundCalories = (calories) => Math.round(calories);

  const totalPages = Math.ceil(exerciseLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = exerciseLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <Container>
      {exerciseLogs.length === 0 ? (
        <p>No exercise logs available.</p>
      ) : (
        <>
          <LogGrid>
            {currentLogs.map((log) => (
              <LogCard key={log.id}>
                <LogHeader>
                  <span>{log.exercise_name}</span>
                  <DeleteButton onClick={() => handleDelete(log.id)}>🗑️</DeleteButton>
                </LogHeader>
                <LogBody>
                  <Info>
                    <Label>Total Reps:</Label> <Value>{log.total_reps}</Value>
                  </Info>
                  <Info>
                    <Label>Calories Burned:</Label> <Value>{roundCalories(log.calories_burned)} kcal</Value>
                  </Info>
                  <Info>
                    <Label>Date:</Label> <Value>{formatDate(log.exercise_date)}</Value>
                  </Info>
                  <Info>
                    <Label>Time:</Label> <Value>{formatTime(log.exercise_date)}</Value>
                  </Info>
                </LogBody>
              </LogCard>
            ))}
          </LogGrid>

          <Pagination>
            <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              ◀ Prev
            </PageButton>
            <span>Page {currentPage} of {totalPages}</span>
            <PageButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next ▶
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
}