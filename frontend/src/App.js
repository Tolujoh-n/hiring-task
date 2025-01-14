import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Toaster, toast } from "sonner";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5140"; // Set the backend base URL
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "jwtToken"
)}`;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is loggedin
  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Or sessionStorage
    if (token) {
      // Optionally validate token or decode it
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    window.location.href = "/login"; // Redirect to the login page
  };

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
      >
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/signup"
              element={<Signup onSignupSuccess={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/login"
              element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
