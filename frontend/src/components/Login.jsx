import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";

const Login = ({ onLoginSuccess, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/auth/login", formData);
      const { token, refreshToken } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Fetch user info after login
      const userInfoResponse = await axios.get("/api/v1/auth/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { userId, username } = userInfoResponse.data;

      setUserId(userId);

      onLoginSuccess(); // Notify App.js to update state

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } flex items-center justify-center`}
    >
      <div
        className={`w-full max-w-sm p-8 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">TODO</h1>
          <h2 className="text-sm">Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className={`w-full p-3 rounded-md border ${
                darkMode
                  ? "border-gray-700 bg-gray-700 text-gray-300"
                  : "border-gray-300 bg-gray-50 text-gray-800"
              }`}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full p-3 rounded-md border ${
                darkMode
                  ? "border-gray-700 bg-gray-700 text-gray-300"
                  : "border-gray-300 bg-gray-50 text-gray-800"
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-blue-500 text-white"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
