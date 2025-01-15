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
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = "http://localhost:5140"; // Set backend base URL

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    setUserId(null);
    toast.success("Logged out successfully");
  };

  // Verify token and fetch user info
  const verifyAndFetchUserInfo = async () => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token from localStorage:", token);

    if (token) {
      try {
        // Decode token to check expiration
        const decoded = jwtDecode(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if (isTokenExpired) {
          handleLogout();
        } else {
          setIsLoggedIn(true);

          // Fetch user info from API
          const userInfoResponse = await axios.get("/api/v1/auth/user-info", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { userId, username } = userInfoResponse.data;
          setUserId(userId);

          console.log("User Info:", { userId, username });
        }
      } catch (error) {
        console.error("Error decoding or fetching token info:", error);
        handleLogout();
      }
    }
  };

  useEffect(() => {
    verifyAndFetchUserInfo();
  }, []);

  // Axios interceptor to set Authorization header
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Toaster position="top-right" />
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
            element={
              <Signup
                onSignupSuccess={() => {
                  setIsLoggedIn(true);
                  verifyAndFetchUserInfo();
                }}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onLoginSuccess={() => {
                  setIsLoggedIn(true);
                  verifyAndFetchUserInfo();
                }}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard userId={userId} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
