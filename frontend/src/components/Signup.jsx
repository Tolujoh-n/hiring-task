import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValidations, setPasswordValidations] = useState({
    hasNonAlphanumeric: false,
    hasDigit: false,
    hasUpperCase: false,
    passwordsMatch: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Update password validations only if the password or confirmPassword fields are modified
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      const password = formData.password;

      setPasswordValidations({
        hasNonAlphanumeric: /[^a-zA-Z0-9]/.test(password),
        hasDigit: /\d/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check if all validations are met
    if (
      !passwordValidations.hasNonAlphanumeric ||
      !passwordValidations.hasDigit ||
      !passwordValidations.hasUpperCase
    ) {
      toast.error("Please make sure all password requirements are met.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5140/api/v1/auth/register",
        formData
      );
      toast.success("User registered successfully!");

      // After successful registration, redirect to the dashboard
      navigate("/dashboard"); // Redirect to dashboard

      if (onSignupSuccess) onSignupSuccess();
    } catch (error) {
      let errorMsg = "An error occurred!";
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.errors)) {
          errorMsg = error.response.data.errors.join(", ");
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else if (
          error.response.data.code &&
          error.response.data.description
        ) {
          errorMsg = `${error.response.data.code}: ${error.response.data.description}`;
        }
      }
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
          <h2 className="text-sm text-right">Sign Up</h2>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your username"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
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

        {/* Confirm Password Field */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm your password"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <div className="mt-2 space-y-1 text-sm">
            <div
              className={`flex items-center ${
                passwordValidations.hasNonAlphanumeric
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidations.hasNonAlphanumeric
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordValidations.hasNonAlphanumeric ? "✔" : "✘"}
              </span>
              Must contain a non-alphanumeric character
            </div>
            <div
              className={`flex items-center ${
                passwordValidations.hasDigit ? "text-green-600" : "text-red-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidations.hasDigit
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordValidations.hasDigit ? "✔" : "✘"}
              </span>
              Must contain a digit
            </div>
            <div
              className={`flex items-center ${
                passwordValidations.hasUpperCase
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidations.hasUpperCase
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordValidations.hasUpperCase ? "✔" : "✘"}
              </span>
              Must contain an uppercase letter
            </div>
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSubmit}
          className={`w-full p-3 rounded-md bg-blue-600 text-white font-bold transition duration-200 hover:bg-blue-500 ${
            darkMode ? "bg-blue-500" : "bg-blue-600"
          }`}
        >
          Sign Up
        </button>

        {/* Already have an account Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Log In
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

export default Signup;
