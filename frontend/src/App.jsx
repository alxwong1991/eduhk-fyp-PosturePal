import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BicepCurls from "./pages/BicepCurls";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bicep-curls" element={<BicepCurls />} />
      </Routes>
    </Router>
  );
}