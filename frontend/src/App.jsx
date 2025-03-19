import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BicepCurls from "./pages/BicepCurls";
import Squats from "./pages/Squats";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Launch Dashboard by default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Add Profile Route */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Exercise Routes */}
        <Route path="/bicep-curls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />

        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}