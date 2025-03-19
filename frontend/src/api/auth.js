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

// ✅ Login User (Uses Cookies)
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
      withCredentials: true, // ✅ Enables session cookies
    });

    return response.data; // Success response
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Invalid credentials");
  }
}

// ✅ Fetch Logged-in User Profile
export async function getUserProfile() {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      withCredentials: true, // ✅ Ensures cookies are sent for authentication
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");
  }
}

// ✅ Logout User (Clear Session)
export async function logoutUser() {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    
    // ✅ Force reload to clear session cookie
    window.location.href = "/login";  
  } catch (error) {
    console.error("Logout failed:", error);
  }
}