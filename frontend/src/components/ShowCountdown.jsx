import Swal from "sweetalert2";

export async function showCountdown() {
  for (let i = 5; i > 0; i--) {
    await Swal.fire({
      title: `Starting in ${i}...`,
      text: "Get ready!",
      timer: 1000,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  }
}