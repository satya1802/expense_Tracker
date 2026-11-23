# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Individuals create a private personal account using email and password, sign in to reach their own data, and sign out; each account's data is private and never visible to other users.

Authentication is email/password only; the app is free to use with no payment, billing, or subscription features.

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: planning:EPIC-002

Users manually record expenses with an amount, category and date, and can edit and delete them.

No automatic bank/card sync and no receipt photo or OCR capture (both out of scope). Amounts are shown in the account's single selected currency with no conversion.

**Related:** US-005, US-006, US-007

### EPIC-003 · approved · source: planning:EPIC-003

The app provides ready-made default spending categories and lets each user create their own custom categories.

Categories are used to classify expenses and to set budgets.

**Related:** US-008, US-009, US-010

### EPIC-004 · approved · source: planning:EPIC-004

Users set a monthly budget amount per category; budget-vs-spending status is visible and drives near-/over-budget alerts.

The budget period is monthly.

**Related:** US-011, US-012

### EPIC-005 · approved · source: planning:EPIC-005

A dashboard shows budget-vs-spending status for the current month and a simple spending summary.

Included as a supporting view even though full reports and income tracking were not prioritized. The view is mobile-friendly and responsive.

**Related:** US-013, US-014, US-015

### EPIC-006 · approved · source: planning:EPIC-006

When spending for a category reaches a near-budget threshold or exceeds the budget, the user is alerted both in-app and by email.

Email delivery uses a transactional email provider that requires an email API key configured by operators.

**Related:** US-016, US-017

### EPIC-007 · approved · source: planning:EPIC-007

Each account uses a single user-selectable currency with no multi-currency conversion, and users can export their expense data as CSV.

**Related:** US-018, US-019

### EPIC-008 · approved · source: planning:EPIC-008

A supporting expense list view lets users browse, search and filter their recorded expenses.

Included as a supporting feature even though it was not a stated top priority.

**Related:** US-020, US-021

### SPRINT-1 · approved · source: planning:plan-v2:Sprint 1

Sprint 1: authentication, session security, per-account data isolation, and default/custom categories in place.

Capacity: 20 points.

**Related:** EPIC-001, US-001, US-002, US-003, US-004, EPIC-003, US-008, US-009, US-010

### SPRINT-2 · approved · source: planning:plan-v2:Sprint 2

Sprint 2: full manual expense CRUD, category management, monthly budgets, and the browsable/filterable expense list.

Capacity: 20 points.

**Related:** EPIC-002, US-005, US-006, US-007, EPIC-004, US-011, US-012, EPIC-008, US-020, US-021

### SPRINT-3 · approved · source: planning:plan-v2:Sprint 3

Sprint 3: dashboard budget status, spending summary, in-app/email budget alerts, and account currency selection.

Capacity: 20 points.

**Related:** EPIC-005, US-013, US-014, EPIC-006, US-016, US-017, US-018

### SPRINT-4 · approved · source: planning:plan-v2:Sprint 4

Sprint 4: responsive layout polish and CSV export of expense data.

Capacity: 20 points.

**Related:** US-015, US-019
<!-- sdlc:auto:end narrative -->
