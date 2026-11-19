import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import SignIn from "./SignIn";
import { clearSessionToken, getSessionToken } from "@/lib/api";

function renderSignIn() {
  return render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <SignIn />
    </MemoryRouter>,
  );
}

describe("SignIn", () => {
  afterEach(() => {
    clearSessionToken();
    vi.unstubAllGlobals();
  });

  it("[AC-004] stores the returned token and nothing is pre-filled from a seeded account", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          token: "a-session-token",
          user: { id: "u_1", email: "jane@example.com" },
        }),
      }),
    );

    renderSignIn();

    // AC-005: the seeded sample credentials are removed from the form.
    expect(screen.getByLabelText(/email address/i)).toHaveValue("");

    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "correct-horse-1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(getSessionToken()).toBe("a-session-token"));
  });

  it("[AC-005] shows exactly one generic message on 401 and never names a field", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: "Invalid email or password" }),
      }),
    );

    renderSignIn();

    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(screen.queryByText(/email.*is wrong|password.*is wrong/i)).not.toBeInTheDocument();
    expect(getSessionToken()).toBeNull();
  });
});
