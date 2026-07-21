import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { DesignSystemPage } from "@/pages/DesignSystem";

describe("DesignSystemPage", () => {
  it("renders the design-system reference shell and hub patterns", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <MemoryRouter>
          <DesignSystemPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Design system" })).toBeInTheDocument();
    expect(screen.getAllByText("Delivery Hub").length).toBeGreaterThan(0);
    expect(screen.getAllByText("To do").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: "Hub patterns" }));
    expect(await screen.findByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByText("Contract commercial summary")).toBeInTheDocument();
  });
});
