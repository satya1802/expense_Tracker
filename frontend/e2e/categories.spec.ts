import { expect, test, type Page } from "@playwright/test";

// Default spending categories every freshly signed-up account provisions
// (AC-016); matches app/routers/auth.py's _DEFAULT_CATEGORIES.
const DEFAULT_CATEGORIES = [
  "Groceries",
  "Transport",
  "Eating out",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

function uniqueEmail(label: string): string {
  return `e2e-${label}-${crypto.randomUUID()}@example.test`;
}

async function signUp(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/sign-up");
  await page.locator("#np-email").fill(email);
  await page.locator("#np-password").fill(password);
  await page.locator("#np-confirm").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard");
}

async function openCategories(page: Page): Promise<void> {
  await page.goto("/categories-budgets");
  // Wait for the loading placeholder to clear.
  await expect(page.getByText("Loading your categories…")).toHaveCount(0);
}

function categoryNameCells(page: Page) {
  return page.locator("table tbody tr td span.block");
}

test("[AC-016] a freshly registered account sees its default categories with no setup step", async ({
  page,
}) => {
  const email = uniqueEmail("ac016");
  const password = crypto.randomUUID();
  await signUp(page, email, password);
  await openCategories(page);

  const names = await categoryNameCells(page).allTextContents();
  for (const expected of DEFAULT_CATEGORIES) {
    expect(names).toContain(expected);
  }
});

test("[AC-017] creating a category with a new name saves it and it appears in the list", async ({
  page,
}) => {
  const email = uniqueEmail("ac017");
  const password = crypto.randomUUID();
  await signUp(page, email, password);
  await openCategories(page);

  const newName = "Side gigs " + crypto.randomUUID().slice(0, 8);
  await page.getByRole("button", { name: "New category" }).click();
  await page.locator("#np-category-name").fill(newName);
  await page.getByRole("button", { name: "Save category" }).click();

  await expect(categoryNameCells(page).filter({ hasText: newName })).toHaveCount(1);
});

test("[AC-018] submitting a blank category name shows a validation message and adds no row", async ({
  page,
}) => {
  const email = uniqueEmail("ac018-blank");
  const password = crypto.randomUUID();
  await signUp(page, email, password);
  await openCategories(page);

  const before = await categoryNameCells(page).count();
  await page.getByRole("button", { name: "New category" }).click();
  await page.locator("#np-category-name").fill("   ");
  await page.getByRole("button", { name: "Save category" }).click();

  await expect(page.getByText("Give the category a name")).toBeVisible();
  // The dialog stays open on a client-side validation failure, so no API call
  // was ever made and no row was added.
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close the category editor" }).click();
  await expect(categoryNameCells(page)).toHaveCount(before);
});

test("[AC-018] submitting a name duplicating an existing category shows a validation message and adds no row", async ({
  page,
}) => {
  const email = uniqueEmail("ac018-dup");
  const password = crypto.randomUUID();
  await signUp(page, email, password);
  await openCategories(page);

  const before = await categoryNameCells(page).count();
  await page.getByRole("button", { name: "New category" }).click();
  // "Groceries" is one of the provisioned default categories (AC-016), so this
  // duplicates an existing row for this same account.
  await page.locator("#np-category-name").fill("Groceries");
  await page.getByRole("button", { name: "Save category" }).click();

  await expect(page.getByText("You already have a category called")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close the category editor" }).click();
  await expect(categoryNameCells(page)).toHaveCount(before);
});
