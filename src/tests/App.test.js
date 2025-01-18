import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../App";

test("renders App component and checks initial route", () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Check if the login link is present initially when not logged in
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
