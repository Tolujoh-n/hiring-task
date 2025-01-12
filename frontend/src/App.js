import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
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
