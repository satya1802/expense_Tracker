# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Authentication, session security, per-account data isolation, and default/custom categories in place.

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up with email and password | 5 | backend-agent | — |
| US-002 | Story | Sign in to my account | 3 | backend-agent | US-001 |
| US-003 | Story | Sign out and session expiry | 3 | backend-agent | US-002 |
| US-004 | Story | Private per-account data isolation | 5 | security-agent | US-001, US-002 |
| US-008 | Story | Use default categories | 2 | backend-agent | US-001 |
| US-009 | Story | Create a custom category | 2 | backend-agent | US-008 |

## Sprint 2: Sprint 2

Full manual expense CRUD, category management, monthly budgets, and the browsable/filterable expense list.

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | Log a new expense manually | 3 | backend-agent | US-008 |
| US-006 | Story | Edit an existing expense | 2 | backend-agent | US-005 |
| US-007 | Story | Delete an expense | 1 | backend-agent | US-005 |
| US-010 | Story | Manage custom categories | 3 | backend-agent | US-009 |
| US-011 | Story | Set a monthly budget for a category | 3 | backend-agent | US-008 |
| US-012 | Story | Update or remove a category budget | 2 | backend-agent | US-011 |
| US-020 | Story | Browse my expenses | 3 | frontend-agent | US-005 |
| US-021 | Story | Search and filter expenses | 3 | frontend-agent | US-020 |

## Sprint 3: Sprint 3

Dashboard budget status, spending summary, in-app/email budget alerts, and account currency selection.

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-013 | Story | See budget-versus-spending status | 5 | frontend-agent | US-011, US-005 |
| US-014 | Story | View a simple spending summary | 3 | frontend-agent | US-005 |
| US-016 | Story | Receive in-app budget alerts | 5 | backend-agent | US-011, US-013 |
| US-017 | Story | Receive budget alerts by email | 5 | integration-agent | US-016 |
| US-018 | Story | Select a single account currency | 2 | backend-agent | US-001 |

## Sprint 4: Sprint 4

Responsive layout polish and CSV export of expense data.

Capacity: 20 points · Committed: 5

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-015 | Story | Mobile-friendly responsive layout | 3 | frontend-agent | US-013, US-014, US-020 |
| US-019 | Story | Export expenses as CSV | 2 | backend-agent | US-005, US-020 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
