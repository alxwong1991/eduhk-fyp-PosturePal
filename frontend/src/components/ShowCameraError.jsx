import Swal from "sweetalert2";

export async function showCameraError(errorMessage) {
  await Swal.fire({
    title: "Camera Error",
    text: `Please check your camera connection: ${errorMessage}`,
    icon: "error",
    confirmButtonText: "Ok",
  });
}
