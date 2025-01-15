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
  const [userId, setUserId] = useState(null); // Define setUserId state
  const [userInfo, setUserInfo] = useState(null); // Optional state to store user info

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/auth/login", formData);
      const token = response.data.token;
      localStorage.setItem("jwtToken", token);

      // Fetch user info after login
      const userInfoResponse = await axios.get("/api/v1/auth/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { userId, username } = userInfoResponse.data;

      // Store the user info in state and console log
      setUserId(userId);
      setUserInfo({ userId, username, token });

      console.log("User ID:", userId);
      console.log("Token:", token);
      console.log("Username:", username);

      onLoginSuccess();
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
            className="w-full p-3 rounded-md bg-blue-600 text-white font-bold transition duration-200 hover:bg-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Register
            </Link>
          </p>
        </div>

        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-2xl"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

export default Login;
