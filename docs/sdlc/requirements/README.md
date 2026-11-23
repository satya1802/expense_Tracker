# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-TECH-STACK · approved · source: requirements:technology-stack

Product owner approved an exact technology stack for this lightweight app; agents must design against these choices, not substitute alternatives.

- Backend: FastAPI 0.115 - handles accounts, saving expenses/budgets, near-/over-budget checks and triggering email alerts; clean, fast, and validates amounts/dates/categories on input; platform default.
- Cloud: AWS - hosts the site, database and outbound alert emails with room to grow; platform default; small-usage tiers suit a no-revenue app.
- Database: PostgreSQL 16 - stores structured related records (users, expenses, categories, budgets); reliably sums spending per category per month and isolates each account's data; platform default.
- Frontend: React 19 - builds the interactive expense entry/filter/budget/summary screens and the required mobile-friendly layout; platform default, safest base for this app size.

### REQ-SERVICES · approved · source: requirements:services

SendGrid is the approved transactional email service, used to deliver budget alert emails and sign-up/verification messages reliably.

- Email: SendGrid (type: saas, env var: SENDGRID_API_KEY) - sends one-to-one near-/over-budget alerts and sign-up/verification messages; requires an API key to send.
- Required API key for this app: SENDGRID_API_KEY.

### REQ-SCOPE · approved · source: requirements:scope

Delivery scope is lightweight: a responsive web app for manual expense tracking, categories, per-category monthly budgets and alerts, explicitly excluding bank sync, OCR and a native mobile app.

In scope: email/password sign-up and login; private per-account expense data; manual expense entry (amount, category, date); default spending categories; custom category creation; monthly budget per category; budget-vs-spending status on the dashboard; expense list view; simple spending summary view; single user-selectable account currency with no conversion.
Out of scope - not designed or built: automatic bank account/card sync (transaction import); receipt photo scanning/OCR capture of expenses; native iOS/Android mobile app (delivered instead as a mobile-friendly responsive web app).

### REQ-FEAT-AUTH · approved · source: requirements:feature:Sign-in & accounts

Covers account creation, sign-in, sign-out and keeping each account's data private.

- Create an account: unique, valid email plus a password meeting minimum requirements; duplicate email or invalid input rejected with a clear message; on success account is created and user is signed in or sent to sign in.
- Sign in to my account: email+password sign-in takes the user to their own dashboard showing only their data; incorrect credentials are refused.
- Sign out: ends the session immediately; user must sign in again to reach any data.
- Keep account data private: each user sees only their own expenses, categories and budgets; unauthenticated attempts to open expense/budget/summary pages prompt sign-in instead.

### REQ-FEAT-EXPENSES · approved · source: requirements:feature:Logging expenses

Covers manually logging, editing and deleting expenses.

- Log a new expense: positive amount, category, date; saved to account and shown in expense list in account currency; invalid/missing fields block saving with a validation message.
- Edit an expense: change amount, category or date to valid values; updates reflected in expense list and affected budget status; invalid values rejected.
- Delete an expense: delete after confirming; once removed it no longer counts toward any budget or summary.

### REQ-FEAT-CATEGORIES · approved · source: requirements:feature:Spending categories

Covers default categories plus user-created custom categories, including rename/remove.

- Use default categories: every new account starts with ready-made default categories available for expenses and budgets with no setup.
- Create a custom category: name must not duplicate an existing one of the user's categories; becomes available for expenses/budgets; blank or duplicate name rejected.
- Rename or remove custom categories: rename to a valid non-duplicate name applied everywhere it appears; deleting a custom category used by existing expenses warns about the effect and proceeds only after confirmation.

### REQ-FEAT-BUDGETS · approved · source: requirements:feature:Monthly budgets

Covers setting, changing and clearing a monthly budget per category.

- Set a monthly budget: positive monthly amount per category; used to measure that month's spending; continues to apply as each new month resets counted spending; blank/non-numeric/non-positive amounts rejected.
- Change or clear a budget: changing updates current month's status and alert thresholds; removing the budget stops status display and alert generation for that category.

### REQ-FEAT-EXPENSE-LIST · approved · source: requirements:feature:Expense list

Covers browsing the expense list and searching/filtering it.

- Browse my expenses: list shows amount, category, date, ordered recent-first; empty state invites adding the first expense when there are none.
- Search and filter expenses: filter by category and/or date range; clear message shown when no expenses match.

### REQ-FEAT-DASHBOARD · approved · source: requirements:feature:Dashboard & summary

Covers the budget-vs-spending dashboard view and the simple monthly spending summary.

- Budget-versus-spending status: per budgeted category shows budget amount, amount spent this month, and under/near/over status; unbudgeted categories show spending without comparison.
- Simple spending summary: total spending and per-category breakdown for the selected month in account currency; spending totals only, no income tracking or advanced reporting.

### REQ-FEAT-ALERTS · approved · source: requirements:feature:Budget alerts

Covers in-app and email alerts when a category crosses its near- or over-budget threshold.

- In-app budget alerts: shown when spending reaches the near-budget threshold or exceeds the budget for the current month, naming the category and whether approaching or over budget.
- Email budget alerts: an email describing the category and near/over status is sent to the account email address via the transactional email service when a threshold is crossed.

### REQ-FEAT-SETTINGS · approved · source: requirements:feature:Account settings

Covers choosing the account's single currency and exporting expense data as CSV.

- Choose account currency: a single currency per account; amounts for expenses, budgets and summaries displayed in it; entered amounts treated as that currency with no conversion.
- Export expenses as CSV: file contains amount, category and date; contains only that account's own data.

### REQ-NFR-001 · approved · source: requirements:NFR-001

[security] Passwords must be stored only in hashed form, never in plain text, so a user's sign-in secret cannot be read back from stored data.

Each account password is stored only as a hash; plain text passwords are never retained.

**Related:** REQ-FEAT-AUTH

### REQ-NFR-002 · approved · source: requirements:NFR-002

[security] Failed sign-in attempts show one generic invalid-credentials message, without revealing which field (email or password) was wrong.

A wrong email or wrong password both produce the same single generic error message on sign-in.

**Related:** REQ-FEAT-AUTH

### REQ-NFR-003 · approved · source: requirements:NFR-003

[security] Sessions end on sign-out and expire after the configured idle lifetime, requiring sign-in again before further access.

Signing out immediately ends the session; a session left idle beyond the configured lifetime also expires. Purpose: keep someone sharing the device out of the account's financial data.

**Related:** REQ-FEAT-AUTH

### REQ-NFR-004 · approved · source: requirements:NFR-004

[privacy] A signed-in user can view and export only their own data; unauthenticated users are blocked from account pages and prompted to sign in.

No user can ever see or export another account's expenses, categories or budgets. Anyone not signed in is blocked from account pages and prompted to sign in first.

**Related:** REQ-FEAT-AUTH

### REQ-NFR-005 · approved · source: requirements:NFR-005

[usability] Dashboard, expense list and forms must stay readable and usable from small phone screens to large desktop screens, with no horizontal scrolling or broken layout.

Responsive layout requirement applies across the dashboard, expense list and all forms.

**Related:** REQ-FEAT-DASHBOARD, REQ-FEAT-EXPENSE-LIST

### REQ-NFR-006 · approved · source: requirements:NFR-006

[availability] If the email API key is not configured, in-app budget alerts must still appear, and the missing email configuration must be surfaced to operators rather than failing silently.

Email outage/misconfiguration must not suppress in-app alerting; operators must be informed of the missing configuration.

**Related:** REQ-FEAT-ALERTS, REQ-SERVICES
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-19

**Capabilities in scope:** Email and password sign-up and login, Private per-account expense data, Manual expense entry (amount, category, date), Default spending categories, Custom category creation, Monthly budget per category, Budget-versus-spending status on the dashboard, Expense list view, Simple spending summary view, Single user-selectable currency per account, no currency conversion

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The server's job here is modest and well-defined: accounts, saving expenses and budgets, running the near-/over-budget checks, and triggering email alerts. FastAPI is a clean, fast Python framework that covers all of this with little ceremony, and its data validation keeps amounts, dates and categories well-formed as they come in. It's the platform default and a strong fit for this scope. |
| cloud | AWS | A single, free consumer web app needs somewhere dependable to run the site, the database and the outbound alert emails, with room to grow if it catches on. AWS covers all of that and is the platform default, so you are not tied to a niche host. Its small-usage tiers suit an app with no revenue and modest, steady traffic. |
| database | PostgreSQL | Everything in this app is structured, related records: users, their expenses, their categories, their monthly budgets. Budget alerts depend on summing a user's spending per category per month accurately, and the spending summary depends on the same — PostgreSQL does these totals reliably and keeps each account's data cleanly separated. It's the platform default and the right tool for money data. |
| frontend | React | Your app is a responsive web app where people log expenses, filter a list, set budgets and watch a spending summary update as they type. React handles exactly this kind of interactive, form-and-list screen and makes the mobile-friendly layout you asked for straightforward. It's the platform default and the safest base for a consumer app of this size. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Account Registration, Sign-in and Security

Individuals create a private personal account using email and password, sign in to reach their own data, and sign out. Each account's expense and budget data is private to that account and never visible to other users. Authentication is email/password only; the app is free to use with no payment, billing, or subscription features.

### US-001: Sign up with email and password

**Priority:** critical

> As a new individual user, I want to create an account with my email address and a password, so that I can privately track my own expenses.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the sign-up screen and have not registered before | I enter a valid, unique email address and a password that meets the stated minimum requirements and submit | my account is created, my password is stored only in hashed form (never in plain text), and I am signed in or directed to sign in |
| AC-002 | I am on the sign-up screen | I enter an email address that is already registered | the account is not created and I see a message that the email is already in use |
| AC-003 | I am on the sign-up screen | I enter an invalid email format or a password that does not meet the minimum requirements | the account is not created and I see a clear validation message explaining what to fix |

### US-002: Sign in to my account

**Priority:** critical

> As a registered user, I want to sign in with my email and password, so that I can access my private expenses and budgets.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I have a registered account | I enter my correct email and password and submit | I am signed in and taken to my dashboard showing only my own data |
| AC-005 | I have a registered account | I enter an incorrect email or password | I am not signed in and I see a generic message that the credentials are invalid, without revealing which field was wrong |

### US-003: Sign out and session expiry

**Priority:** high

> As a signed-in user, I want my session to end when I sign out and to expire after a period of inactivity, so that no one else using my device can access my financial data.

| ID | Given | When | Then |
|---|---|---|---|
| AC-006 | I am signed in | I choose to sign out | my session ends and I must sign in again to access any of my data |
| AC-007 | I am signed in and leave the app idle beyond the configured session lifetime | I next try to perform an action | my session is no longer valid and I am required to sign in again |

### US-004: Private per-account data isolation

**Priority:** critical

> As a user, I want my expenses, categories and budgets to be visible only to me, so that my personal financial information stays private.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | two separate users each have their own account with expense data | one user is signed in and views or exports data | they see only their own expenses, categories and budgets and never any data belonging to the other user |
| AC-009 | I am not signed in | I attempt to open an expense, budget or summary page directly | I am prevented from seeing any account data and am prompted to sign in |

## EPIC-002: Manual Expense Entry and Management

Users manually record expenses with an amount, category and date. There is no automatic bank/card sync and no receipt photo or OCR capture (both out of scope). Users can edit and delete their expenses. Amounts are shown in the account's single selected currency with no conversion.

### US-005: Log a new expense manually

**Priority:** critical

> As a user, I want to manually add an expense with an amount, a category and a date, so that I can keep track of what I have spent.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | I am signed in | I enter a positive amount, select a category and choose a date, then save | the expense is saved to my account and appears in my expense list with the amount shown in my account currency |
| AC-011 | I am adding an expense | I leave the amount empty, enter a non-numeric or non-positive amount, or do not select a category or date | the expense is not saved and I see a validation message for the field to correct |
| AC-012 | Assumption: expenses are entered manually only — there is no bank/card sync and no receipt photo/OCR capture | I log an expense | I do so by typing the details myself, with no import or scanning option offered |

### US-006: Edit an existing expense

**Priority:** high

> As a user, I want to change the amount, category or date of an expense I recorded, so that I can correct mistakes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-013 | I have a saved expense | I open it, change the amount, category or date to valid values and save | the updated values are stored and reflected in the expense list and any affected budget status |
| AC-014 | I am editing an expense | I enter an invalid value | the change is not saved and I see a validation message |

### US-007: Delete an expense

**Priority:** medium

> As a user, I want to delete an expense, so that I can remove entries I added by mistake.

| ID | Given | When | Then |
|---|---|---|---|
| AC-015 | I have a saved expense | I choose to delete it and confirm | the expense is removed from my account and no longer counts toward any budget or summary |

## EPIC-003: Spending Categories

The app provides a set of default spending categories and lets each user create their own custom categories. Categories are used to classify expenses and to set budgets.

### US-008: Use default categories

**Priority:** high

> As a new user, I want a set of ready-made default spending categories, so that I can start logging expenses without setting everything up first.

| ID | Given | When | Then |
|---|---|---|---|
| AC-016 | I have just created my account | I go to add an expense or view categories | a set of default spending categories is already available for selection |

### US-009: Create a custom category

**Priority:** high

> As a user, I want to add my own custom categories, so that I can classify spending in ways that fit my life.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I am signed in | I create a category with a name that is not already one of my categories | the new category is saved to my account and becomes available when adding expenses and setting budgets |
| AC-018 | I am creating a category | I enter a blank name or a name that duplicates an existing category of mine | the category is not created and I see a validation message |

### US-010: Manage custom categories

**Priority:** low

> As a user, I want to rename or remove custom categories I created, so that I can keep my category list tidy.

| ID | Given | When | Then |
|---|---|---|---|
| AC-019 | I have a custom category | I rename it to a valid, non-duplicate name | the new name is applied everywhere that category is shown |
| AC-020 | I have a custom category that is used by existing expenses | I attempt to delete it | I am warned about the effect on those expenses and the deletion only proceeds after I confirm |

## EPIC-004: Monthly Budgets per Category

Users set a monthly budget amount per category. The budget period is monthly. Budget-versus-spending status is visible, and spending against each budget drives the near-budget and over-budget alerts.

### US-011: Set a monthly budget for a category

**Priority:** critical

> As a user, I want to set a monthly budget amount for a category, so that I can control how much I spend in that area each month.

| ID | Given | When | Then |
|---|---|---|---|
| AC-021 | I am signed in and have at least one category | I set a positive monthly budget amount for a category and save | the monthly budget is stored for that category and used to measure my spending for the current month |
| AC-022 | Assumption: the budget period is monthly | a new calendar month begins | spending counted against each category budget resets to that month's expenses while the budget amount itself continues to apply |
| AC-023 | I am setting a budget | I enter a blank, non-numeric or non-positive amount | the budget is not saved and I see a validation message |

### US-012: Update or remove a category budget

**Priority:** medium

> As a user, I want to change or clear the monthly budget for a category, so that my budgets stay aligned with my plans.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | I have a budget set for a category | I change the amount to a valid value and save | the new amount is applied to the current month's budget status and alert thresholds |
| AC-025 | I have a budget set for a category | I remove the budget | that category no longer shows budget status or generates near/over-budget alerts |

## EPIC-005: Dashboard, Budget Status and Spending Summary

A dashboard shows budget-versus-spending status for the current month and a simple spending summary. This supporting summary view is included even though full reports and income tracking were not selected as priorities. The view is mobile-friendly and responsive.

### US-013: See budget-versus-spending status

**Priority:** high

> As a user, I want to see how my spending compares to my monthly budget for each category, so that I know where I stand before I overspend.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | I have categories with monthly budgets and some expenses this month | I open the dashboard | for each budgeted category I see the budget amount, the amount spent this month and whether I am under, near or over budget |
| AC-027 | a category has no budget set | I view the dashboard | its spending is still shown but without a budget comparison |

### US-014: View a simple spending summary

**Priority:** medium

> As a user, I want a simple summary of my spending for the current month, so that I can understand where my money is going at a glance.

| ID | Given | When | Then |
|---|---|---|---|
| AC-028 | I have logged expenses this month | I open the spending summary | I see my total spending and a breakdown by category for the selected month, in my account currency |
| AC-029 | Assumption: the summary is a simple supporting view and reports/income tracking are not included | I view the summary | I see spending totals only, with no income tracking or advanced reporting features |

### US-015: Mobile-friendly responsive layout

**Priority:** medium

> As a user on a phone or desktop, I want the app to adapt to my screen size, so that I can log and review expenses comfortably on any device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | Assumption: the product is delivered as a responsive web app, not a native mobile app | I open the app on a small mobile screen or a large desktop screen | the dashboard, expense list and forms remain readable and usable without horizontal scrolling or broken layout |

## EPIC-006: Near-Budget and Over-Budget Alerts

When spending for a category reaches a near-budget threshold or exceeds the budget, the user is alerted both in-app and by email. Email delivery uses a transactional email provider that requires an email API key configured by operators.

### US-016: Receive in-app budget alerts

**Priority:** high

> As a user, I want to be alerted in the app when I am near or over a category budget, so that I can adjust my spending in time.

| ID | Given | When | Then |
|---|---|---|---|
| AC-031 | I have a monthly budget set for a category | my spending for that category in the current month reaches the near-budget threshold | I see an in-app alert identifying the category and that I am approaching its budget |
| AC-032 | I have a monthly budget set for a category | my spending for that category in the current month exceeds the budget | I see an in-app alert identifying the category and that I am over budget |

### US-017: Receive budget alerts by email

**Priority:** high

> As a user, I want to be emailed when I am near or over a category budget, so that I am notified even when I am not using the app.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | my account email is set and a category crosses its near-budget or over-budget threshold | the alert is triggered | an email describing the category and the near/over-budget status is sent to my account email address |
| AC-034 | Assumption: email delivery uses a transactional email provider that requires an email API key (e.g. a provider API key such as <email-provider-api-key>) | the email API key is not configured | in-app alerts still appear and the missing-email-configuration condition is surfaced to operators rather than failing silently |

## EPIC-007: Account Currency and Data Export

Each account uses a single user-selectable currency with no multi-currency conversion. Users can export their expense data as CSV.

### US-018: Select a single account currency

**Priority:** medium

> As a user, I want to choose the currency used for my account, so that amounts are shown in the currency I think in.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | I am signed in | I select a currency for my account | amounts for expenses, budgets and summaries are displayed in that currency |
| AC-036 | Assumption: a single currency per account with no conversion | I enter expense amounts | all amounts are treated as being in the account currency and no currency conversion is applied |

### US-019: Export expenses as CSV

**Priority:** medium

> As a user, I want to export my expenses to a CSV file, so that I can keep my own records or use them elsewhere.

| ID | Given | When | Then |
|---|---|---|---|
| AC-037 | I have expenses recorded | I choose to export my data | I receive a CSV file containing my expenses with their amount, category and date |
| AC-038 | I request an export | the file is produced | it contains only my own account's data and nothing from any other user |

## EPIC-008: Searchable and Filterable Expense List

A supporting expense list view lets users browse, search and filter their recorded expenses. Included as a supporting feature even though it was not a stated top priority.

### US-020: Browse my expenses

**Priority:** high

> As a user, I want to see a list of my recorded expenses, so that I can review what I have spent.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | I have recorded expenses | I open the expense list | I see my expenses with their amount, category and date, ordered so recent entries are easy to find |
| AC-040 | I have no expenses yet | I open the expense list | I see a clear empty state inviting me to add my first expense |

### US-021: Search and filter expenses

**Priority:** medium

> As a user, I want to search and filter my expenses by category and date range, so that I can quickly find specific spending.

| ID | Given | When | Then |
|---|---|---|---|
| AC-041 | I have expenses across several categories and dates | I filter by a category and/or a date range | the list shows only expenses matching the selected criteria |
| AC-042 | I have applied filters that match no expenses | the list refreshes | I see a clear message that no expenses match the current filters |
<!-- sdlc:auto:end epics -->
