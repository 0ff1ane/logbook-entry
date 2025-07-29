import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Login from "../../src/pages/Login.tsx";

describe("Login Page", () => {
  it("renders the Login page with card title", () => {
    render(<Login />);

    const headerText = screen.getByText("Sign in to your account");

    expect(headerText).toBeInTheDocument();
  });
});
