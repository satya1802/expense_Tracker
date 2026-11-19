# Deployment Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start how-it-deploys -->
Pushes to `main` run `.github/workflows/deploy.yml`, which builds the API image (if there is a backend) and deploys the SPA to AWS Amplify. Commits touching only `docs/sdlc/**` don't deploy. Deployments can also be started from the platform's Deployment tab.
<!-- sdlc:auto:end how-it-deploys -->

<!-- sdlc:auto:start environments -->
| Name | Service | Runtime | Scaling | Environment |
|---|---|---|---|---|
| SPA Host | React 19 static build served from S3 behind CloudFront (its own origin) | Static assets | CDN edge cache | dev |
| API Service | FastAPI 0.115 (Uvicorn) on AWS App Runner / ECS Fargate (separate origin) | Python 3.12 container | 1 instance in dev, horizontal scale later | dev |
| Database | Amazon RDS for PostgreSQL 16 | PostgreSQL 16 | Single db.t-class instance, encrypted at rest | dev |
| Email Provider | SendGrid transactional email (SaaS) | External API | Managed by provider | dev |
<!-- sdlc:auto:end environments -->

<!-- sdlc:auto:start live -->
_Not deployed yet._
<!-- sdlc:auto:end live -->

<!-- sdlc:auto:start topology -->
```mermaid
graph LR
  n_SPA_Host["SPA Host<br/>React 19 static build served from S3 behind CloudFront (its own origin)"]
  n_API_Service["API Service<br/>FastAPI 0.115 (Uvicorn) on AWS App Runner / ECS Fargate (separate origin)"]
  n_Database["Database<br/>Amazon RDS for PostgreSQL 16"]
  n_Email_Provider["Email Provider<br/>SendGrid transactional email (SaaS)"]
  n_SPA_Host -->|"HTTPS (Authorization: Bearer token)"| n_API_Service
  n_API_Service -->|"PostgreSQL/TLS"| n_Database
  n_API_Service -->|"HTTPS (SendGrid API)"| n_Email_Provider
```
<!-- sdlc:auto:end topology -->
