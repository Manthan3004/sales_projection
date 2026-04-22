import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashbord";
import UploadData from "./pages/Upload";

function App() {
  const [authUser, setAuthUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  const handleAuthSuccess = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
  };

  return (
    <Router>
      <Navbar authUser={authUser} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/dashboard" element={authUser ? <Dashboard authUser={authUser} /> : <Navigate to="/" replace />} />
        <Route path="/upload" element={authUser ? <UploadData /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </Router>
  );
}

export default App;