# CONVENTIONS.md

This document defines coding conventions and standards for the SaaS CRM project.
These conventions must be followed by all contributors and AI agents.

---

# 1. General Principles

* Keep code simple and readable
* Prefer explicit over implicit
* Avoid premature abstractions
* Prefer small functions
* Avoid deep nesting
* Keep modules independent

---

# 2. Naming Conventions

## Files

Use **kebab-case** for file names

Examples:

```
create-lead.use-case.ts
leads.controller.ts
users.service.ts
```

---

## Classes

Use **PascalCase**

Examples:

```
CreateLeadUseCase
UsersService
AuthController
```

---

## Variables

Use **camelCase**

Examples:

```
organizationId
userId
createdAt
```

---

## Constants

Use **UPPER_SNAKE_CASE**

Examples:

```
JWT_SECRET
ACCESS_TOKEN_EXPIRATION
```

---

## Enums

Use PascalCase for enum name
Use UPPER_CASE for values

Example:

```
enum UserRole {
  OWNER,
  MANAGER,
  SALES_REP
}
```

---

# 3. Folder Structure

## Backend

```
module/
  dto/
  use-cases/
  repository/
  entities/
  controller.ts
  service.ts
  module.ts
```

---

## Frontend

```
features/
  leads/
  clients/
  opportunities/
  users/
```

---

# 4. TypeScript Rules

* Avoid `any`
* Use explicit types
* Use interfaces for DTOs
* Use enums for constants

Bad:

```
const user: any
```

Good:

```
const user: User
```

---

# 5. Backend Conventions

## Controllers

Controllers must:

* Be thin
* Only handle HTTP logic
* Delegate to services/use-cases

Bad:

```
@Controller()
class LeadsController {
  create() {
    // business logic here ❌
  }
}
```

Good:

```
@Controller()
class LeadsController {
  constructor(private createLead: CreateLeadUseCase) {}

  create() {
    return this.createLead.execute()
  }
}
```

---

## Services / Use Cases

* Must contain business logic
* Must not depend on HTTP
* Must be testable

---

## DTOs

DTOs must:

* Validate input
* Be simple
* Be colocated in module

---

# 6. Frontend Conventions

## Components

Use PascalCase

```
LeadForm.tsx
DashboardCard.tsx
```

---

## Hooks

Use camelCase prefixed with use

```
useLeads
useDashboard
```

---

## API Calls

Centralize API logic

```
services/api.ts
```

---

# 7. Database Conventions

## IDs

Use UUID

```
id: string
```

---

## Timestamps

All tables must include

```
createdAt
updatedAt
```

---

## Tenant

All entities must include

```
organizationId
```

---

# 8. API Conventions

## REST Rules

Use plural resources

Good:

```
GET /leads
POST /users
```

Bad:

```
GET /getLeads
POST /createUser
```

---

# 9. Git Conventions

## Commit Messages

Use conventional commits

Examples:

```
feat: create leads module
fix: login validation
refactor: improve auth logic
```

---

# 10. Branch Naming

Use:

```
feature/leads
feature/auth
fix/login
```

---

# 11. Environment Variables

Use uppercase

Examples:

```
DATABASE_URL
JWT_SECRET
PORT
```

---

# 12. Error Handling

Backend must return consistent errors

Example:

```
{
  message: string
  code: string
}
```

---

# 13. Logging

Use structured logs

Example:

```
logger.info('Lead created', { leadId })
```

---

# 14. Pagination

Use:

```
?page=1
&limit=10
```

---

# 15. Sorting

Use:

```
?sort=createdAt
&order=desc
```

---

# 16. Security

* Never log passwords
* Never expose tokens
* Always validate input
* Always filter tenant

---

# 17. Final Rules

When writing code:

* Prefer readability
* Keep consistency
* Follow architecture
* Avoid unnecessary complexity

---

# Summary

This document ensures:

* consistent code
* easier maintenance
* better AI collaboration
* professional architecture
