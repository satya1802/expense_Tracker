import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { clearSessionToken, setSessionToken } from "@/lib/api";

describe("App", () => {
  beforeEach(() => {
    setSessionToken("a-valid-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: "u_1",
          email: "signed-in-user@example.com",
          created_at: "2026-01-01T00:00:00Z",
        }),
      }),
    );
  });

  afterEach(() => {
    clearSessionToken();
    vi.unstubAllGlobals();
  });

  it("renders a screen inside the app shell and shows its menu once /me confirms the session", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>,
    );
    // getAllByText, not getByText: the page may repeat its menu item's text.
    await waitFor(() => expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0));
  });

  it("[AC-009] redirects an unauthenticated visit to a protected route to /sign-in without rendering it", async () => {
    clearSessionToken();
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(screen.getByText("Sign in", { selector: "h1" })).toBeInTheDocument(),
    );
    expect(screen.queryByText("November 2026 overview")).not.toBeInTheDocument();
  });
});
