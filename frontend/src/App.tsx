import "./styles/index.css";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
