<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Django REST Framework
- Flask

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved stack. FastAPI 0.115 with Pydantic validation keeps amounts, dates and categories well-formed on input and cleanly implements auth, expense/category/budget CRUD, monthly aggregation, budget evaluation and CSV export with little ceremony.

## Consequences

Async stack means blocking SendGrid calls should run in a threadpool or background task so alert email latency does not slow the save response.
<!-- sdlc:auto:end adr -->