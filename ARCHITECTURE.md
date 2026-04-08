# ARCHITECTURE.md

## 1. Objective

This document defines the architectural decisions for the SaaS CRM.

The goal is to keep the project:

* simple enough to build fast
* structured enough to look professional
* scalable enough for portfolio discussions
* consistent for AI agents like Codex

---

## 2. Architecture Style

The system must follow a **modular monolith** architecture inside a **monorepo**.

### Decision

* Use **monorepo** with Turborepo
* Use **modular monolith** for the backend
* Avoid microservices
* Separate concerns by business domain

### Why

This project is a portfolio SaaS, not a distributed system exercise.
A modular monolith is easier to build, easier to maintain, and still demonstrates architectural maturity.

---

## 3. Monorepo Structure

```txt
apps/
  web/                # Next.js frontend
  api/                # NestJS backend

packages/
  types/              # shared types
  eslint-config/      # shared lint config
  tsconfig/           # shared tsconfig
```

### Rules

* `apps/web` contains only frontend code
* `apps/api` contains only backend code
* shared code goes to `packages/*` only when there is real reuse
* do not create shared packages too early

---

## 4. Backend Architecture

The backend must be organized by **feature modules**.

### Main modules

* auth
* organizations
* users
* leads
* clients
* opportunities
* activities
* dashboard

### Suggested structure

```txt
apps/api/src/modules/
  auth/
    dto/
    use-cases/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
  users/
    dto/
    use-cases/
    users.controller.ts
    users.module.ts
    users.service.ts
```

### Rules

* each feature owns its own logic
* controllers must be thin
* business rules must stay outside controllers
* database access must not leak everywhere
* modules should communicate through explicit services/use-cases

---

## 5. Request Flow

A request should generally follow this path:

```txt
Controller -> DTO validation -> Use case / Service -> Prisma access -> Response mapper
```

### Rules

* controller receives request
* DTO validates input
* service/use-case executes business rule
* Prisma handles persistence
* response must avoid leaking internal fields

---

## 6. Frontend Architecture

The frontend must be organized by **feature**.

### Suggested structure

```txt
apps/web/src/
  app/
  components/
  features/
    auth/
    dashboard/
    leads/
    clients/
    opportunities/
    activities/
    users/
    settings/
  services/
  hooks/
  lib/
```

### Rules

* pages/routes live in `app/`
* business UI lives in `features/`
* shared UI lives in `components/`
* API calls should be centralized
* validation should be explicit
* forms should stay close to the feature

---

## 7. Multi-Tenancy Strategy

The CRM is **multi-tenant by organization**.

### Strategy chosen

Use a **shared database** with **logical isolation** through `organizationId`.

### Rules

* all business entities must have `organizationId`
* every protected query must filter by `organizationId`
* users can only access data from their own organization
* no cross-tenant reads
* no cross-tenant writes

### Affected entities

* User
* Lead
* Client
* Opportunity
* Activity

### Why

This is the best balance for MVP speed and architectural relevance.

---

## 8. Authorization Model

### Roles

* `OWNER`
* `MANAGER`
* `SALES_REP`

### Rules

* OWNER has full access inside the organization
* MANAGER can manage business data and team operations where allowed
* SALES_REP works on assigned commercial data

### Authorization approach

* authentication with JWT
* authorization by role + organization scope
* protected routes must validate both identity and tenant scope

---

## 9. Database Design Principles

### Rules

* use PostgreSQL
* use Prisma ORM
* use UUID as primary key
* use `createdAt` and `updatedAt`
* prefer explicit relations
* index important lookup fields
* avoid premature normalization complexity

### Core entities

* Organization
* User
* RefreshToken
* Lead
* Client
* Opportunity
* Activity

---

## 10. Business Boundaries

### Auth

Responsible for:

* register
* login
* refresh token
* current user session

### Organizations

Responsible for:

* tenant identity
* organization settings

### Users

Responsible for:

* internal team members
* roles
* activation/deactivation

### Leads

Responsible for:

* prospect records
* lead lifecycle
* qualification state
* conversion trigger

### Clients

Responsible for:

* customer records
* converted leads
* account history

### Opportunities

Responsible for:

* pipeline
* stage movement
* forecast value
* win/loss state

### Activities

Responsible for:

* interaction history
* notes
* meetings
* calls
* emails

### Dashboard

Responsible for:

* aggregates
* KPIs
* charts data

---

## 11. API Design Rules

### General rules

* use REST endpoints
* keep routes resource-oriented
* use plural resource names
* use consistent error responses
* validate all input

### Examples

* `POST /auth/login`
* `GET /users`
* `POST /leads`
* `POST /leads/:id/convert`
* `PATCH /opportunities/:id/stage`
* `GET /dashboard/summary`

---

## 12. Validation Rules

### Backend

* validate input at the DTO boundary
* reject invalid payloads early
* never trust frontend input

### Frontend

* validate forms before submit
* keep validation aligned with backend rules
* prefer Zod schemas when possible

---

## 13. State and Data Fetching

### Frontend rules

* use TanStack Query / React Query for server state
* avoid duplicated fetch logic across features
* use mutations for writes
* invalidate caches intentionally
* prefer feature-level hooks for API usage

### Examples

* `useLeadsList`
* `useCreateLead`
* `useDashboardSummary`

---

## 14. Error Handling

### Backend rules

* return predictable error shape
* distinguish validation, auth and business errors
* do not leak internal stack traces

### Frontend rules

* show user-friendly messages
* handle loading, empty and error states
* never leave screen in undefined state

---

## 15. Security Rules

* passwords must be hashed securely
* JWT secret must come from environment variables
* refresh tokens must be stored safely
* protected endpoints must require authentication
* tenant isolation is mandatory
* never expose password hash
* never expose internal tokens in responses

---

## 16. Development Rules

### General

* use TypeScript everywhere
* avoid `any`
* prefer explicit types
* keep files focused
* prefer readability over cleverness

### Backend

* thin controllers
* business logic in service/use-case layer
* reusable helpers only when they reduce duplication clearly

### Frontend

* dumb UI components when possible
* feature-driven organization
* avoid giant pages with everything inside

---

## 17. Testing Priorities

Focus first on critical flows.

### Priority tests

* auth login/register
* tenant isolation
* lead creation
* lead conversion to client
* opportunity stage update

### Why

These tests validate the most important business and architecture rules.

---

## 18. Non-Goals

The project should **not** prioritize these initially:

* microservices
* event-driven architecture
* CQRS
* Kubernetes
* billing system
* advanced audit log
* mobile app
* real-time sockets

These may be added later only if necessary.

---

## 19. Architectural Summary

This project must be built as:

* **monorepo** with Turborepo
* **modular monolith** with NestJS
* **feature-based frontend** with Next.js
* **shared PostgreSQL** with tenant isolation by `organizationId`
* **clean, simple, professional architecture** suitable for portfolio and interviews

---

## 20. Final Rule

When in doubt, choose the option that:

1. keeps the code simpler
2. keeps tenant isolation safe
3. preserves module boundaries
4. improves maintainability
5. helps deliver the MVP faster
