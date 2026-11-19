# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Lets individuals create a private email/password account, sign in and out, and guarantees each account's expense and budget data stays private to that account.

Goal: individuals create a private personal account using email and password, sign in to reach their own data, and sign out; each account's expense/budget data is private and never visible to other users. Authentication is email/password only; the app is free with no payment, billing or subscription features. Stories: US-001 sign up, US-002 sign in, US-003 sign out and session expiry, US-004 per-account data isolation.

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: planning:EPIC-002

Covers manual creation, editing and deletion of expenses with amount, category and date; no bank/card sync or receipt OCR.

Goal: users manually record expenses with an amount, category and date; no automatic bank/card sync and no receipt photo or OCR capture (both out of scope); users can edit and delete their expenses; amounts shown in the account's single selected currency with no conversion. Stories: US-005 log a new expense, US-006 edit an existing expense, US-007 delete an expense.

**Related:** US-005, US-006, US-007

### EPIC-003 · approved · source: planning:EPIC-003

Provides default spending categories plus the ability for each user to create and manage custom categories used for expenses and budgets.

Goal: the app provides a set of default spending categories and lets each user create their own custom categories; categories classify expenses and set budgets. Stories: US-008 use default categories, US-009 create a custom category, US-010 manage (rename/remove) custom categories.

**Related:** US-008, US-009, US-010

### EPIC-004 · approved · source: planning:EPIC-004

Lets users set a monthly budget amount per category and keep it updated so spending can be measured against it.

Goal: users set a monthly budget amount per category; budget period is monthly; budget-versus-spending status is visible and spending against each budget drives near-budget/over-budget alerts. Stories: US-011 set a monthly budget for a category, US-012 update or remove a category budget.

**Related:** US-011, US-012

### EPIC-005 · approved · source: planning:EPIC-005

Dashboard showing budget-versus-spending status and a simple monthly spending summary, delivered as a responsive, mobile-friendly view.

Goal: a dashboard shows budget-versus-spending status for the current month and a simple spending summary; included as a supporting view even though full reports and income tracking were not selected as priorities; the view is mobile-friendly and responsive. Stories: US-013 see budget-versus-spending status, US-014 view a simple spending summary, US-015 mobile-friendly responsive layout.

**Related:** US-013, US-014, US-015

### EPIC-006 · approved · source: planning:EPIC-006

Alerts users in-app and by email when category spending nears or exceeds its monthly budget.

Goal: when spending for a category reaches a near-budget threshold or exceeds the budget, the user is alerted both in-app and by email; email delivery uses a transactional email provider that requires an email API key configured by operators. Stories: US-016 receive in-app budget alerts, US-017 receive budget alerts by email.

**Related:** US-016, US-017

### EPIC-007 · approved · source: planning:EPIC-007

Lets each account pick a single display currency (no conversion) and export recorded expenses as CSV.

Goal: each account uses a single user-selectable currency with no multi-currency conversion; users can export their expense data as CSV. Stories: US-018 select a single account currency, US-019 export expenses as CSV.

**Related:** US-018, US-019

### EPIC-008 · approved · source: planning:EPIC-008

Supporting expense list view for browsing, searching and filtering recorded expenses by category and date range.

Goal: a supporting expense list view lets users browse, search and filter their recorded expenses; included as a supporting feature even though it was not a stated top priority. Stories: US-020 browse my expenses, US-021 search and filter expenses.

**Related:** US-020, US-021

### SPRINT-1 · approved · source: plan:Sprint 1

First sprint targets authentication, session security, per-account data isolation, and default/custom categories.

Goal: Authentication, session security, per-account data isolation, and default/custom categories in place. Capacity: 20 points. Epic alignment inferred from goal wording (EPIC-001 Account Registration/Sign-in/Security, EPIC-003 Spending Categories); the input's plan item list gives per-story points and assigned role but does not state which sprint each item is scheduled in, so individual story-to-sprint assignment is not documented here.

**Related:** EPIC-001, EPIC-003

### SPRINT-2 · approved · source: plan:Sprint 2

Second sprint targets full manual expense CRUD, category management, monthly budgets, and the browsable/filterable expense list.

Goal: Full manual expense CRUD, category management, monthly budgets, and the browsable/filterable expense list. Capacity: 20 points. Epic alignment inferred from goal wording (EPIC-002 Manual Expense Entry and Management, EPIC-003 Spending Categories, EPIC-004 Monthly Budgets per Category, EPIC-008 Searchable and Filterable Expense List); the input does not explicitly assign individual story items to this sprint.

**Related:** EPIC-002, EPIC-003, EPIC-004, EPIC-008

### SPRINT-3 · approved · source: plan:Sprint 3

Third sprint targets dashboard budget status, spending summary, in-app/email budget alerts, and account currency selection.

Goal: Dashboard budget status, spending summary, in-app/email budget alerts, and account currency selection. Capacity: 20 points. Epic alignment inferred from goal wording (EPIC-005 Dashboard/Budget Status/Spending Summary, EPIC-006 Near-Budget and Over-Budget Alerts, EPIC-007 Account Currency and Data Export for the currency-selection portion); the input does not explicitly assign individual story items to this sprint.

**Related:** EPIC-005, EPIC-006, EPIC-007

### SPRINT-4 · approved · source: plan:Sprint 4

Fourth sprint targets responsive layout polish and CSV export of expense data.

Goal: Responsive layout polish and CSV export of expense data. Capacity: 20 points. Epic alignment inferred from goal wording (EPIC-005 Dashboard/responsive layout, EPIC-007 Account Currency and Data Export for CSV export); the input does not explicitly assign individual story items to this sprint.

**Related:** EPIC-005, EPIC-007
<!-- sdlc:auto:end narrative -->
