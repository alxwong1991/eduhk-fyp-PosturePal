import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  const logsPerPage = 2; // ✅ Show 2 logs per page

  useEffect(() => {
    if (user) {
      loadLogs(user.id);
    }
  }, [user, loadLogs]); // ✅ Fix: Added `loadLogs` to dependencies

  const handleDelete = async (logId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the log.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteLog(logId);
      Swal.fire("Deleted!", "The exercise log has been removed.", "success");
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