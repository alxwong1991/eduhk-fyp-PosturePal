import Swal from "sweetalert2";

export async function showResult(totalReps) {
  await Swal.fire({
    title: "Workout Complete! 🎉",
    text: `You completed ${totalReps} reps!`,
    icon: "success",
    confirmButtonText: "Close",
  });
}