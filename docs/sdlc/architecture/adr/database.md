<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved stack. All data is structured and related -- users, categories, expenses, budgets. PostgreSQL 16 sums spending per category per month exactly with numeric types, powers list filtering and the summary, and keeps each account's data isolated. Filtering and aggregation stay inside PostgreSQL, so no separate search service is needed.

## Consequences

Needs a managed instance (RDS) and connection pooling even at small scale; slightly more setup than SQLite for a single-app MVP.
<!-- sdlc:auto:end adr -->