import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "../components/Signup";
import { BrowserRouter as Router } from "react-router-dom";
import { axios } from "axios";
import { toast } from "sonner";

// Mock axios and toast
jest.mock("axios");
jest.mock("sonner");

describe("Signup Component", () => {
  it("renders signup form correctly", () => {
    render(
      <Router>
        <Signup onSignupSuccess={jest.fn()} />
      </Router>
    );
    expect(screen.getByPlaceholderText(/Enter your email/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/)
    ).toBeInTheDocument();
  });

  it("displays error toast if passwords do not match", () => {
    render(
      <Router>
        <Signup onSignupSuccess={jest.fn()} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/), {
      target: { value: "differentpassword" },
    });
    fireEvent.click(screen.getByText(/Sign up/));

    expect(toast.error).toHaveBeenCalledWith("Passwords do not match!");
  });

  it("calls API and handles successful signup", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "User registered successfully!" },
    });

    render(
      <Router>
        <Signup onSignupSuccess={jest.fn()} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/), {
      target: { value: "Password123" },
    });
    fireEvent.click(screen.getByText(/Sign up/));

    expect(toast.success).toHaveBeenCalledWith("User registered successfully!");
  });
});
