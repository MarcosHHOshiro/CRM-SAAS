# AGENTS.md

## Project Overview

This project is a multi-tenant SaaS CRM built as a monorepo using Turborepo.

## Tech Stack

Frontend:
- Next.js
- TypeScript
- Tailwind
- React Query
- Zod

Backend:
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT Auth

Infrastructure:
- Turborepo
- Docker
- PostgreSQL

---

## Monorepo Structure

apps/
  web/
  api/

packages/
  types/
  eslint-config/
  tsconfig/

---

## Architecture Rules

- Use monolith modular architecture
- Avoid microservices
- Use feature-based modules
- Keep code simple and readable
- Prefer composition over inheritance

---

## Backend Rules

- Use NestJS modules per feature
- Use DTOs for validation
- Use services/use-cases for business logic
- Keep controllers thin
- Use Prisma for database access

Module Structure:

module/
  controller
  service
  dto
  repository
  entities

---

## Frontend Rules

- Use feature-based folders
- Use React Query for API calls
- Use Zod for validation
- Use Server Components when possible

Structure:

features/
  leads/
  clients/
  opportunities/
  users/

---

## Multi-tenant Rules

- All entities must have organizationId
- All queries must filter by organizationId
- No cross-tenant data access

---

## Coding Rules

- Use TypeScript everywhere
- Use ESLint
- Use Prettier
- Avoid any
- Prefer small functions

---

## Naming Conventions

Backend:
- use kebab-case files
- use PascalCase classes

Frontend:
- use PascalCase components
- use camelCase functions

---

## Database Rules

- Use Prisma
- Use UUID ids
- Use createdAt and updatedAt
- Use soft delete when needed

---

## Goals

- Build production-like SaaS
- Maintain clean architecture
- Keep code consistent
- Prioritize readability