import React from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const Welcome = ({ darkMode, toggleDarkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button onClick={toggleDarkMode} className="text-2xl">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Welcome Text */}
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to your Todo Application
      </h1>
      <p className="text-lg mb-8 text-center">
        Manage your tasks efficiently with ease. Create, update, and track your
        tasks all in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-6 mb-8">
        <Link
          to="/login"
          className="px-6 py-3 rounded-md bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 rounded-md border border-blue-500 text-blue-500 text-lg font-semibold hover:bg-blue-50"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
