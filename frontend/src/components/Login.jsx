import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5140/api/v1/auth/login",
        formData
      );
      const { token } = response.data;
      localStorage.setItem("jwtToken", token);
      toast.success("Login successful!");
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      const errorMsg =
        error.response?.data || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
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
          <h1 className="text-3xl font-bold text-left">TODO</h1>
          <h2 className="text-sm text-right">Login</h2>
        </div>

        {/* Login Form */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your email or username"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className={`w-full p-3 rounded-md bg-blue-600 text-white font-bold transition duration-200 hover:bg-blue-500 ${
            darkMode ? "bg-blue-500" : "bg-blue-600"
          }`}
        >
          Login
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Register
            </Link>
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <button onClick={toggleDarkMode} className="text-2xl">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
