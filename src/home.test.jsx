import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GovernmentSchemesPortal from "./homescreen";

describe("GovernmentSchemesPortal Component", () => {
  test("renders the portal with title", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );
    expect(screen.getByText("Government Schemes Portal")).toBeInTheDocument();
  });

  test("opens login modal when login button is clicked", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Login to Your Account")).toBeInTheDocument();
  });

  test("opens register modal when register button is clicked", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Register"));
    expect(screen.getByText("Create an Account")).toBeInTheDocument();
  });

  test("checks if schemes are displayed correctly", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    expect(screen.getByText("PM Kisan Samman Nidhi")).toBeInTheDocument();
    expect(screen.getByText("Ayushman Bharat")).toBeInTheDocument();
    expect(screen.getByText("PM Mudra Yojana")).toBeInTheDocument();
  });

  test("checks if categories are displayed correctly", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    expect(screen.getByText("Agriculture")).toBeInTheDocument();
    expect(screen.getByText("Healthcare")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  test("checks if eligibility form has required fields", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Select Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
    expect(screen.getByLabelText("Annual Income (in Rs.)")).toBeInTheDocument();
    expect(screen.getByLabelText("State")).toBeInTheDocument();
  });

  test("submits login form", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    // Close modal after submission (modal should not exist)
    expect(screen.queryByText("Login to Your Account")).not.toBeInTheDocument();
  });

  test("submits registration form", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Register"));

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "johndoe@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "securepassword" },
    });

    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "securepassword" },
    });

    fireEvent.click(screen.getByText("Register"));

    // Close modal after submission
    expect(screen.queryByText("Create an Account")).not.toBeInTheDocument();
  });

  test("checks search input functionality", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      "Search for schemes, benefits, or categories..."
    );

    fireEvent.change(searchInput, { target: { value: "PM Kisan" } });

    expect(searchInput.value).toBe("PM Kisan");
  });

  test("navigates to login page when clicking 'Schemes' in navbar", () => {
    render(
      <MemoryRouter>
        <GovernmentSchemesPortal />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Schemes"));

    // Expect to navigate to login page
    expect(window.location.pathname).toBe("/login");
  });
});
