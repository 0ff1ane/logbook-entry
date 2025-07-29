import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Todos from "../../src/pages/Todos.tsx";

describe("Todos Page", () => {
  it("renders the counter page with count and buttons", () => {
    render(<Todos />);

    const countText = screen.getByText("Complete react tutorial");

    expect(countText).toBeInTheDocument();
  });
});
