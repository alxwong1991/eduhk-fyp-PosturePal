import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BicepCurls from "./pages/BicepCurls";
import Squats from "./pages/Squats";
import Login from "./pages/Login";
import Register from "./pages/Register";

function GlobalSessionAlert() {
  const navigate = useNavigate();
  const { sessionExpired } = useAuth();

  useEffect(() => {
    if (sessionExpired) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/login");
      });
    }
  }, [sessionExpired, navigate]);

  return null; // ✅ Ensures it runs globally without affecting layout
}

export default function App() {
  return (
    <Router>
      <GlobalSessionAlert /> {/* ✅ Now it works on all pages */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bicep-curls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}