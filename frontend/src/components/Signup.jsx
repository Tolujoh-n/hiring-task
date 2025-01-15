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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      setPasswordValidations({
        hasNonAlphanumeric: /[^a-zA-Z0-9]/.test(password),
        hasDigit: /\d/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        passwordsMatch: password === confirmPassword,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValidations.passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    if (
      !passwordValidations.hasNonAlphanumeric ||
      !passwordValidations.hasDigit ||
      !passwordValidations.hasUpperCase
    ) {
      toast.error("Please ensure your password meets all requirements.");
      return;
    }

    try {
      const response = await axios.post("/api/v1/auth/register", formData);
      toast.success("User registered successfully!");

      if (onSignupSuccess) onSignupSuccess();
      navigate("/dashboard");
    } catch (error) {
      let errorMsg = "An error occurred during signup.";
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.errors)) {
          errorMsg = error.response.data.errors.join(", ");
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
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
          <h1 className="text-3xl font-bold">TODO</h1>
          <h2 className="text-sm">Sign Up</h2>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            required
            autoFocus
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
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

        {/* Confirm Password Field */}
        <div className="mb-6">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full p-3 rounded-md border ${
              darkMode
                ? "border-gray-700 bg-gray-700 text-gray-300"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
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
              {passwordValidations.hasNonAlphanumeric ? "✔" : "✘"} Must contain
              a non-alphanumeric character
            </div>
            <div
              className={`flex items-center ${
                passwordValidations.hasDigit ? "text-green-600" : "text-red-600"
              }`}
            >
              {passwordValidations.hasDigit ? "✔" : "✘"} Must contain a digit
            </div>
            <div
              className={`flex items-center ${
                passwordValidations.hasUpperCase
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordValidations.hasUpperCase ? "✔" : "✘"} Must contain an
              uppercase letter
            </div>
            <div
              className={`flex items-center ${
                passwordValidations.passwordsMatch
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordValidations.passwordsMatch ? "✔" : "✘"} Passwords must
              match
            </div>
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSubmit}
          className={`w-full p-3 rounded-md font-bold transition duration-200 ${
            darkMode
              ? "bg-blue-500 hover:bg-blue-400"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          Sign Up
        </button>

        {/* Already have an account link */}
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
