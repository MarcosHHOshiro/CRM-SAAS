# AGENTS.md

This file provides instructions for AI coding agents working on this repository.
It defines how agents should behave, what architecture they must respect, and what priorities they should follow when generating code.

---

## 1. Project Context

This repository contains a **multi-tenant SaaS CRM** built as a **monorepo** with **Turborepo**.

### Main stack

* Next.js
* NestJS
* TypeScript
* PostgreSQL
* Prisma
* Tailwind CSS
* TanStack Query
* Docker

### Main goal

Build a professional fullstack portfolio project that looks and feels like a real SaaS product.

The code should prioritize:

* clarity
* consistency
* maintainability
* realistic architecture
* fast MVP delivery

---

## 2. Repository Structure

```txt
apps/
  web/          # frontend app (Next.js)
  api/          # backend app (NestJS)

packages/
  types/        # shared types
  eslint-config/
  tsconfig/
```

### Rules

* put frontend code only inside `apps/web`
* put backend code only inside `apps/api`
* only move code to `packages/*` when there is real reuse
* do not create unnecessary shared abstractions

---

## 3. Architecture Rules

Agents must follow these architecture decisions:

* use **modular monolith** on the backend
* use **feature-based organization** on the frontend
* avoid microservices
* avoid event-driven complexity
* avoid premature abstractions
* avoid overengineering

When multiple options exist, choose the one that:

1. is simpler
2. is easier to maintain
3. respects tenant isolation
4. delivers the MVP faster

---

## 4. Backend Instructions

### Module strategy

Organize backend by business module.

Expected modules:

* auth
* organizations
* users
* leads
* clients
* opportunities
* activities
* dashboard

### Backend rules

* controllers must be thin
* business logic must stay in service/use-case layer
* DTOs must validate input
* Prisma should handle persistence
* avoid putting business logic directly in controllers
* avoid accessing Prisma from random unrelated layers

### Preferred request flow

```txt
Controller -> DTO -> Service/UseCase -> Prisma -> Response
```

### File naming

Use kebab-case file names.

Examples:

* `create-lead.use-case.ts`
* `leads.controller.ts`
* `auth.module.ts`

---

## 5. Frontend Instructions

### Frontend organization

Use feature-based structure.

Suggested structure:

```txt
apps/web/src/
  app/
  components/
  features/
  hooks/
  services/
  lib/
```

### Frontend rules

* routes/pages live in `app/`
* feature logic lives in `features/`
* shared UI goes to `components/`
* centralize API access
* use TanStack Query for server state
* use Zod for form validation where useful
* avoid giant page files with all logic mixed together

### Components

* use PascalCase for component names
* keep components focused
* prefer composition over deeply nested abstractions

---

## 6. Multi-Tenant Rules

This project is multi-tenant by organization.

### Mandatory rules

* all business entities must have `organizationId`
* all protected queries must filter by `organizationId`
* users must never access data from another organization
* users must never mutate data from another organization
* tenant isolation is not optional

### Important

If an agent creates a new entity that belongs to the business domain, it should almost always include tenant scope.
If there is doubt, prefer including `organizationId`.

---

## 7. Auth and Authorization Rules

### Auth

* use JWT for access token
* use refresh token flow
* store passwords securely with hash
* never expose password hash in responses

### Authorization

Roles:

* OWNER
* MANAGER
* SALES_REP

Agents must respect both:

* authenticated identity
* tenant scope
* role permissions

---

## 8. Database Rules

Use PostgreSQL + Prisma.

### Database conventions

* use UUID ids
* use `createdAt`
* use `updatedAt`
* use explicit relations
* create indexes where useful
* keep schema readable
* avoid unnecessary complexity in the initial schema

### Expected core models

* Organization
* User
* RefreshToken
* Lead
* Client
* Opportunity
* Activity

---

## 9. TypeScript Rules

* use TypeScript everywhere
* avoid `any`
* prefer explicit typing
* keep types readable
* share types only when needed
* do not create excessive generic abstractions unless clearly useful

---

## 10. Code Style Rules

Agents must follow these coding principles:

* write simple code
* prefer readability over cleverness
* keep functions small
* avoid deep nesting
* avoid giant files
* avoid duplicated business rules
* use meaningful names
* keep code production-like

Do not generate:

* unnecessary patterns just to look advanced
* abstract factories unless clearly justified
* CQRS unless explicitly requested
* microservice-style boundaries inside the monolith

---

## 11. Validation Rules

### Backend

* validate incoming payloads
* reject invalid input early
* never trust client input

### Frontend

* validate forms before submit
* keep form schemas close to the feature
* align validation with backend rules when possible

---

## 12. Error Handling Rules

### Backend

* return predictable error shapes
* do not leak internal implementation details
* distinguish validation, auth and business errors where practical

### Frontend

* show useful error messages
* implement loading states
* implement empty states
* do not leave undefined UI states

---

## 13. Testing Priorities

When adding tests, prioritize:

1. authentication
2. tenant isolation
3. lead creation
4. lead conversion
5. opportunity stage updates

Tests should focus on critical business rules first.

---

## 14. Implementation Priorities

Agents should generally build in this order:

1. monorepo setup
2. web app setup
3. api setup
4. docker + postgres
5. prisma schema + migrations
6. auth
7. tenant isolation
8. users + organizations
9. leads
10. clients
11. opportunities
12. activities
13. dashboard
14. frontend feature pages
15. refinements
16. tests
17. documentation

---

## 15. What Agents Should Avoid

Do not:

* introduce microservices
* introduce Kafka, queues or event bus unless explicitly requested
* create excessive shared packages
* create complex abstractions before the need exists
* break tenant isolation
* mix unrelated domains into one module
* generate code that looks impressive but is hard to maintain

---

## 16. Preferred Deliverable Style

When implementing a task, agents should:

* make focused changes
* keep file structure organized
* explain major architectural choices briefly in comments or docs only when useful
* avoid unnecessary comments for obvious code
* leave the project in a runnable state whenever possible

---

## 17. Documentation Alignment

Agents should respect the repository documents:

* `specs.md`
* `tasks.md`
* `ARCHITECTURE.md`
* `CONVENTIONS.md`

If there is conflict:

1. follow architecture and tenant safety first
2. prefer simpler implementation
3. preserve consistency with existing codebase

---

## 18. Final Instruction

Build this project like a real SaaS MVP for a strong portfolio.

That means:

* realistic structure
* good engineering decisions
* simple but professional code
* safe tenant isolation
* strong fullstack execution
