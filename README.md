# CRM SaaS

Initial Turborepo setup for a multi-tenant SaaS CRM with:

- `apps/web`: Next.js + TypeScript + Tailwind CSS
- `apps/api`: NestJS + TypeScript
- `packages/types`: shared domain types
- `packages/eslint-config`: shared ESLint presets
- `packages/tsconfig`: shared TypeScript configs

## Requirements

- Node.js 24+
- npm 11+

## Setup

```bash
npm install
```

Copy the environment examples before starting local development:

```bash
copy .env.example .env
copy apps\\api\\.env.example apps\\api\\.env
copy apps\\web\\.env.example apps\\web\\.env.local
```

## Run the apps

```bash
npm run dev
```

Run a single app:

```bash
npm run dev:web
npm run dev:api
```

## Quality scripts

```bash
npm run build
npm run lint
npm run check-types
```

## Local database

Start PostgreSQL with Docker:

```bash
npm run db:up
```

Stop it when you are done:

```bash
npm run db:down
```

## Prisma

Generate the Prisma client:

```bash
npm run prisma:generate
```

Create and apply a local migration:

```bash
npm run prisma:migrate:dev -- --name init
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Initial structure

```txt
apps/
  web/
  api/
packages/
  types/
  eslint-config/
  tsconfig/
```
# CRM-SAAS
# CRM-SAAS
