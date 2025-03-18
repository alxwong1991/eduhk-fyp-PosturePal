import axios from "axios";

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
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
    });

    // ✅ Ensure correct response handling
    if (!response.data || !response.data.message || !response.data.name) {
        throw new Error("Unexpected response from server");
    }

    const { name } = response.data;

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userName", name);

    return response.data; // Success response
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Invalid credentials");
  }
}

// ✅ Logout User (Clear token & userName)
export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
}