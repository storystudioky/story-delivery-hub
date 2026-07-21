import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { DesignSystemPage } from "@/pages/DesignSystem";

describe("DesignSystemPage", () => {
  it("renders authoritative vocabulary, patterns, and shell controls", async () => {
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
    expect(screen.getByLabelText("Current tenant Acme Media Tenant")).toBeInTheDocument();
    expect(screen.getByLabelText("Account menu for Alex Rivera")).toBeInTheDocument();

    expect(screen.getByText("Waiting")).toBeInTheDocument();
    expect(screen.getByText("On hold")).toBeInTheDocument();
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText("Late/off track")).toBeInTheDocument();
    expect(screen.getByText("Expiring")).toBeInTheDocument();
    expect(screen.getAllByText("Tenant administrator").length).toBeGreaterThan(0);

    // Authoritative product nav (not Tasks/Projects)
    expect(screen.getAllByRole("button", { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Workstreams/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Contracts/i }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /^Tasks$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Hub patterns" }));
    expect(await screen.findByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByText("Contract KYD")).toBeInTheDocument();
    expect(screen.getByText("Launch readiness")).toBeInTheDocument();
    expect(screen.getByText("Northwind Studio")).toBeInTheDocument();
    expect(screen.getAllByText("View source").length).toBeGreaterThan(0);
    expect(screen.getByText("Immutable report snapshot")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Shell & states" }));
    expect(await screen.findByText("Unable to load contract view")).toBeInTheDocument();
    expect(screen.getByText("Access denied")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
