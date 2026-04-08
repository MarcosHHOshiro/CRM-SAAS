# SaaS CRM - Checklist

## Setup
- [x] Criar monorepo com Turborepo
- [x] Criar apps/web (Next.js)
- [x] Criar apps/api (NestJS)
- [x] Criar packages/types
- [x] Configurar ESLint
- [x] Configurar TS compartilhado

## Banco
- [x] Docker PostgreSQL
- [x] Prisma
- [x] Migration inicial
- [ ] Seed

## Auth
- [x] Register organization
- [x] Login
- [x] Refresh token
- [x] Logout
- [x] /auth/me
- [x] JWT access token
- [x] Refresh token persistido
- [x] Password hash

## Multi-tenant
- [x] organizationId em todas tabelas de negocio
- [ ] Guard tenant
- [x] Base de isolamento de dados no schema

## Users
- [ ] CRUD users
- [x] Roles (owner, manager, sales)

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
- [ ] Metricas
- [ ] Graficos

## Frontend
- [ ] Login
- [ ] Dashboard
- [ ] Leads UI
- [ ] Clients UI
- [ ] Pipeline UI

## Dev Experience
- [x] README inicial
- [x] Postman collection para auth

## Final
- [ ] Deploy
