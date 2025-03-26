import Swal from "sweetalert2";

export async function ShowFinishExercise(navigate, resultData) {
  return Swal.fire({
    title: "Workout Complete!",
    text: "Great job! Your workout has been recorded.",
    icon: "success",
    confirmButtonText: "View Results",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/result", { state: resultData });
    }
  });
}