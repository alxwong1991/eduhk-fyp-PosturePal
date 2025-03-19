import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing required environment variable: VITE_API_BASE_URL");
}

// ✅ Register User
export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data; // Success response
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
}

// ✅ Login User
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);

    // ✅ Ensure correct response handling
    if (!response.data || !response.data.name) {
        throw new Error("Unexpected response from server");
    }

    const { name, email } = response.data;

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    return response.data; // Success response
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Invalid credentials");
  }
}

// ✅ Logout User (Clear token & userName)
export function logoutUser() {
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail")
  window.dispatchEvent(new Event("storage"));

  Swal.fire({
    title: "Logged Out",
    text: "You have been successfully logged out.",
    icon: "info",
    confirmButtonText: "OK"
  }).then(() => {
    window.dispatchEvent(new Event("storage"));
  });
}