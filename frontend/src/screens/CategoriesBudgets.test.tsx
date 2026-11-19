import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Screen from "./CategoriesBudgets";
import { clearSessionToken } from "@/lib/api";

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/categories-budgets"]}>
      <Screen />
    </MemoryRouter>,
  );
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("CategoriesBudgets", () => {
  afterEach(() => {
    clearSessionToken();
    vi.unstubAllGlobals();
  });

  it("[AC-016] renders the list from the GET /categories response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          categories: [
            { id: "c_1", name: "Groceries", is_default: true },
            { id: "c_2", name: "Transport", is_default: true },
          ],
        }),
      ),
    );

    renderScreen();

    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.queryByText("Housing")).not.toBeInTheDocument();
  });

  it("No seeded categories remain: the empty state renders when the API returns none", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, { categories: [] })));

    renderScreen();

    expect(await screen.findByText(/no categories left/i)).toBeInTheDocument();
  });

  it("[AC-018] blocks a blank name client-side before any call is made", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { categories: [] }));
    vi.stubGlobal("fetch", fetchMock);

    renderScreen();
    await screen.findByText(/no categories left/i);

    await user.click(screen.getAllByRole("button", { name: /new category/i })[0]);
    const callsBeforeSubmit = fetchMock.mock.calls.length;

    await user.click(screen.getByRole("button", { name: /save category/i }));

    expect(await screen.findByText(/can.t be blank/i)).toBeInTheDocument();
    expect(fetchMock.mock.calls.length).toBe(callsBeforeSubmit);
  });

  it("[AC-018] a 409 on create shows the duplicate-name message without adding a row", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (!init || init.method === undefined) {
        return Promise.resolve(
          jsonResponse(200, { categories: [{ id: "c_1", name: "Groceries", is_default: true }] }),
        );
      }
      if (init.method === "POST") {
        return Promise.resolve(
          jsonResponse(409, { detail: "You already have a category with that name" }),
        );
      }
      return Promise.resolve(jsonResponse(200, {}));
    });
    vi.stubGlobal("fetch", fetchMock);

    renderScreen();
    expect(await screen.findByText("Groceries")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^new category$/i }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText(/category name/i), "Snacks");
    await user.click(within(dialog).getByRole("button", { name: /save category/i }));

    expect(
      await screen.findByText(/you already have a category with that name/i),
    ).toBeInTheDocument();

    // No second "Groceries" row was added.
    expect(screen.getAllByText("Groceries")).toHaveLength(1);
  });
});
