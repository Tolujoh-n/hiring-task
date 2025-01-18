import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { axios } from "axios";
import { toast } from "sonner";

// Mock axios and toast for the test
jest.mock("axios");
jest.mock("sonner");

describe("Login Component", () => {
  it("renders login form correctly", () => {
    render(
      <Router>
        <Login
          onLoginSuccess={jest.fn()}
          darkMode={false}
          toggleDarkMode={jest.fn()}
        />
      </Router>
    );
    expect(
      screen.getByPlaceholderText(/Enter your email or username/)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/)
    ).toBeInTheDocument();
  });

  it("displays error toast on login failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    render(
      <Router>
        <Login
          onLoginSuccess={jest.fn()}
          darkMode={false}
          toggleDarkMode={jest.fn()}
        />
      </Router>
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Enter your email or username/),
      { target: { value: "wrong@example.com" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText(/Login/));

    // Check if error toast is shown
    expect(toast.error).toHaveBeenCalledWith(
      "Login failed. Please check your credentials."
    );
  });

  it("handles login successfully and redirects to dashboard", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: "token", refreshToken: "refreshToken" },
    });
    axios.get.mockResolvedValueOnce({
      data: { userId: 1, username: "testUser" },
    });

    render(
      <Router>
        <Login
          onLoginSuccess={jest.fn()}
          darkMode={false}
          toggleDarkMode={jest.fn()}
        />
      </Router>
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Enter your email or username/),
      { target: { value: "test@example.com" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText(/Login/));

    expect(toast.success).toHaveBeenCalledWith("Login successful!");
  });
});
