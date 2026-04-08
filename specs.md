# SaaS CRM — Checklist

## Setup
- [ ] Criar monorepo com Turborepo
- [ ] Criar apps/web (Next.js)
- [ ] Criar apps/api (NestJS)
- [ ] Criar packages/types
- [ ] Configurar ESLint
- [ ] Configurar TS compartilhado

## Banco
- [ ] Docker PostgreSQL
- [ ] Prisma
- [ ] Migration inicial
- [ ] Seed

## Auth
- [ ] Register organization
- [ ] Login
- [ ] Refresh token
- [ ] /auth/me

## Multi-tenant
- [ ] organizationId em todas tabelas
- [ ] Guard tenant
- [ ] Isolamento dados

## Users
- [ ] CRUD users
- [ ] Roles (owner, manager, sales)

## Leads
- [ ] Criar lead
- [ ] Listar leads
- [ ] Editar lead
- [ ] Converter lead

## Clients
- [ ] Criar client
- [ ] Listar clients
- [ ] Editar client

## Opportunities
- [ ] Criar oportunidade
- [ ] Pipeline
- [ ] Kanban
- [ ] Mudar etapa

## Activities
- [ ] Criar atividade
- [ ] Listar atividades

## Dashboard
- [ ] Métricas
- [ ] Gráficos

## Frontend
- [ ] Login
- [ ] Dashboard
- [ ] Leads UI
- [ ] Clients UI
- [ ] Pipeline UI

## Final
- [ ] README
- [ ] Deploy