import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing required environment variable: VITE_API_BASE_URL");
}

// ✅ Helper function to get the token from localStorage
function getAuthToken() {
  return localStorage.getItem("access_token");
}

// ✅ Register User
export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
}

// ✅ Login User (JWT-based)
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    localStorage.setItem("access_token", response.data.access_token); // ✅ Store JWT token
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Invalid credentials");
  }
}

// ✅ Fetch Logged-in User Profile (Handles Token Expiry)
export async function getUserProfile() {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Session expired detected", error);
      throw new Error("Session expired");
    }
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");
  }
}

// ✅ Logout User (Clear Token)
export function logoutUser() {
  localStorage.removeItem("access_token"); // ✅ Remove JWT token
}