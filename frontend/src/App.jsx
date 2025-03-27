import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalSessionAlert from "./components/GlobalSessionAlert";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BicepCurls from "./pages/BicepCurls";
import Squats from "./pages/Squats";
import JumpingJacks from "./pages/JumpingJacks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Result from "./pages/Result";

export default function App() {
  return (
    <Router>
      <GlobalSessionAlert />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bicep-curls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />
        <Route path="/jumping-jacks" element={<JumpingJacks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}