# Pulse CRM

Pulse CRM is a multi-tenant SaaS CRM built as a Turborepo monorepo with a Next.js frontend and a NestJS backend.

The project is designed as a realistic portfolio MVP:
- private authenticated workspace
- multi-tenant organization isolation
- role-aware internal user management
- leads, clients, opportunities, activities, and dashboard modules
- professional fullstack architecture without unnecessary complexity

## Tech Stack

- Next.js App Router
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- TanStack Query
- Zod
- Docker
- Turborepo

## Architecture Summary

The repository follows a simple monorepo + modular monolith approach:
- `apps/web` contains the frontend application
- `apps/api` contains the backend API
- `packages/types` contains shared domain enums and lightweight shared types

The frontend uses feature-based organization and keeps routes thin:
- routes in `app/`
- business UI and hooks in `features/`
- shared UI in `components/`
- central API access in `services/`

The backend uses business modules with thin controllers:
- auth
- organizations
- users
- leads
- clients
- opportunities
- activities
- dashboard

## Monorepo Structure

```txt
apps/
  web/          # Next.js frontend
  api/          # NestJS backend

packages/
  types/        # shared enums/types
  eslint-config/
  tsconfig/
```

## Multi-Tenancy

Pulse CRM is multi-tenant by organization.

That means:
- every business record belongs to an `organizationId`
- protected backend queries are always scoped by `organizationId`
- users can only read and mutate data from their own organization
- the frontend always works against the current authenticated workspace

This keeps the MVP simple while still reflecting a real SaaS isolation strategy.

## Key Modules

- `auth`: register, login, refresh token, logout, current session
- `organizations`: current organization settings
- `users`: internal team members, roles, activation/deactivation
- `leads`: prospect management and conversion to client
- `clients`: customer records
- `opportunities`: pipeline, stage movement, and deal tracking
- `activities`: calls, meetings, emails, notes, and tasks
- `dashboard`: summary metrics and recent activity

## Requirements

- Node.js 24+
- npm 11+
- Docker Desktop or compatible Docker runtime

## Environment Setup

Copy the example environment files before running the project.

Windows:

```bash
copy .env.example .env
copy apps\\api\\.env.example apps\\api\\.env
copy apps\\web\\.env.example apps\\web\\.env.local
```

macOS / Linux:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### Root env

The root `.env` is used by Docker Compose for PostgreSQL:

```env
POSTGRES_DB=crm_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=15432
```

### API env

Main API variables live in `apps/api/.env`:

```env
NODE_ENV=development
PORT=3334
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:15432/crm_saas?schema=public
JWT_ACCESS_SECRET=change-me-access-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

### Web env

The frontend points to the backend API through `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3334/api
```

If you change the API port locally, update this URL to match.

## Setup

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

## Running the Database

Start PostgreSQL with Docker:

```bash
npm run db:up
```

Stop the database:

```bash
npm run db:down
```

View database logs:

```bash
npm run db:logs
```

The local PostgreSQL container uses port `15432` by default to avoid collisions with a local `5432`.

## Running the API

Start only the API:

```bash
npm run dev:api
```

By default the API runs at:

```txt
http://localhost:3334/api
```

## Running the Web App

Start only the frontend:

```bash
npm run dev:web
```

By default the web app runs at:

```txt
http://localhost:3000
```

## Running Everything Together

Start web and api with Turborepo:

```bash
npm run dev
```

## Prisma

Create and apply a local migration:

```bash
npm run prisma:migrate:dev -- --name init
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Quality Checks

Run everything:

```bash
npm run check-types
npm run lint
npm run build
```

Run per app when needed:

```bash
npm --workspace @crm-saas/web run check-types
npm --workspace @crm-saas/web run lint
npm --workspace @crm-saas/web run build

npm --workspace @crm-saas/api run check-types
npm --workspace @crm-saas/api run lint
npm --workspace @crm-saas/api run build
```

## Demo Flow

A good local demo sequence is:

1. Start the database with `npm run db:up`
2. Start the API with `npm run dev:api`
3. Start the web app with `npm run dev:web`
4. Open `http://localhost:3000/register`
5. Create an organization and owner account
6. Explore dashboard, leads, clients, opportunities, activities, users, and settings

## Notes

- The frontend uses webpack in local Next.js commands to stay stable in this Windows environment.
- Route and mutation feedback are handled with TanStack Query invalidation plus lightweight shared UI primitives.
- The codebase intentionally avoids overengineering so the architecture remains easy to explain in a portfolio or interview setting.
