<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Approved stack. React 19 builds the interactive form-and-list screens -- expense entry, filterable list, budget forms and a live-updating dashboard/summary -- and a responsive, mobile-friendly layout. Delivered as a Vite SPA on its own origin, reading the API base URL from VITE_API_BASE_URL.

## Consequences

A SPA on a separate origin cannot use cookie sessions, so it stores an opaque bearer token and sends it on every request; initial bundle needs code-splitting to stay light on mobile.
<!-- sdlc:auto:end adr -->