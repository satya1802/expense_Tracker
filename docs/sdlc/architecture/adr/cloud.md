<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Google Cloud
- Azure

## Decision Outcome

Chosen option: AWS, because Approved stack. AWS hosts the static SPA (S3/CloudFront), the FastAPI container (App Runner/ECS) and the database (RDS PostgreSQL 16) with small-usage tiers suited to a free app, plus TLS and encryption at rest for financial data.

## Consequences

Multiple managed services to wire up (IAM, RDS, container service) adds operational overhead versus a single PaaS; mitigated by keeping the dev footprint to one small instance each.
<!-- sdlc:auto:end adr -->