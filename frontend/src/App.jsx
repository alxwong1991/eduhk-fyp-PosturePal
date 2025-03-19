import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BicepCurls from "./pages/BicepCurls";
import Squats from "./pages/Squats";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Exercise Routes */}
        <Route path="/bicep-curls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />

        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}