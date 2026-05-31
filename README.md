# ERP Core Auth (Core Engine)

**Status:** MVP 1.0 estável, com débitos técnicos identificados.

O **Core Engine & Auth** é o núcleo de identidade, autorização e integração segura do ecossistema ERP Modular. Ele centraliza autenticação de usuários humanos, autorização RBAC, emissão de tokens JWT, integrações M2M via OAuth 2.0 Client Credentials, isolamento multi-tenant e gateway para módulos consumidores.

---

## Visão Geral

O projeto é um monorepo composto por:

| Pasta | Função |
| :--- | :--- |
| `backend/` | API NestJS/Fastify com Auth, RBAC, OAuth M2M, multi-tenant, Prisma, PostgreSQL e Redis |
| `frontend/` | Console administrativo React/Vite para login, dashboard, usuários, papéis, permissões e aplicações M2M |
| `docs/` | Contratos, guias de integração, JWT, gateway, matriz de permissões e roteiro de demo |
| `infra/mock-modules/` | Stubs HTTP para módulos externos das squads consumidoras |
| `scripts/` | Scripts auxiliares, incluindo smoke test do gateway |
| `.github/workflows/` | Workflow de deploy por tags `v*` |

---

## Arquitetura

```mermaid
flowchart LR
  user[Usuário humano] --> browser[Frontend Admin<br/>React/Vite]
  browser --> gateway[Gateway Nginx<br/>porta 80]

  partner[Serviço externo / Squad] --> gateway

  gateway --> core[Core Auth API<br/>NestJS + Fastify]
  gateway --> fiscal[Stub / Módulo Fiscal<br/>/v1/fiscal]
  gateway --> crm[Stub / Módulo CRM<br/>/v1/crm]
  gateway --> desk[Stub / Service Desk<br/>/v1/service-desk]

  core --> pg[(PostgreSQL)]
  core --> redis[(Redis)]

  core --> jwt[JWT user_access<br/>roles + perms]
  core --> m2m[JWT integration_access<br/>scopes]

  fiscal -. valida JWT do Core .-> jwt
  crm -. valida JWT do Core .-> jwt
  desk -. valida JWT do Core .-> jwt
  fiscal -. usa X-Tenant-Id .-> core
  crm -. usa X-Tenant-Id .-> core
  desk -. usa X-Tenant-Id .-> core
```

O Core é o único emissor de login humano (`POST /v1/auth/login`). Os módulos consumidores devem validar o JWT emitido pelo Core e não implementar login local.

---

## Início Rápido

### Pré-requisitos

- Node.js v22 LTS ou compatível
- Docker e Docker Compose

### Backend em desenvolvimento

```bash
cd backend
npm install
cp .env.example .env

# Na raiz do repositório, subir somente a infra necessária
cd ..
docker compose up -d postgres redis

# Sincronizar banco e popular dados iniciais
cd backend
npx prisma db push
npm run prisma:seed:dev

# Iniciar API
npm run dev
```

API local:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/v1/docs`
- Healthcheck: `http://localhost:3000/v1/health`

### Frontend em desenvolvimento

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o frontend usa `VITE_API_URL` quando definido. Se a variável não existir, ele aponta para o endpoint remoto configurado em `frontend/src/lib/api.ts`.

### Stack completa com gateway

```bash
docker compose up -d --build
```

Entrada única local:

- Frontend/gateway: `http://localhost`
- Core via gateway: `http://localhost/v1/health`
- Documentação Swagger: `http://localhost/v1/docs`

---

## Acessos Iniciais

Após o seed:

| Tipo | Credencial |
| :--- | :--- |
| Admin | `admin@hotmail.com` / `Admin12345!` |
| Suporte demo | `suporte@example.com` / `Suporte123!` |
| Tenant default | `00000000-0000-4000-8000-000000000001` |

Apps M2M demo:

| `client_id` | `client_secret` | Escopos principais |
| :--- | :--- | :--- |
| `finance-fiscal` | `FinanceFiscal-Demo2026!` | `identity:read`, `finance:read` |
| `crm-leads` | `CrmLeads-Demo2026!` | `identity:read`, `customers:read` |
| `service-desk` | `ServiceDesk-Demo2026!` | `identity:read`, `tickets:read` |
| `test-client-id` | `test-client-secret` | QA / e2e |

Detalhes completos: [`docs/PERMISSIONS_MATRIX.md`](docs/PERMISSIONS_MATRIX.md) e [`docs/DEPLOY_SEED.md`](docs/DEPLOY_SEED.md).

---

## Funcionalidades

### Autenticação humana

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `GET /v1/auth/me`

O login retorna `accessToken` e `refreshToken`. O access token humano possui `type: user_access`, `tenant_id`, `roles` e `perms`.

### RBAC

O backend usa `PermissionsGuard` e decoradores como `@RequirePermissions(...)` para proteger rotas administrativas:

- usuários: `/v1/users`
- papéis: `/v1/roles`
- permissões: `/v1/permissions`
- aplicações M2M: `/v1/applications`
- escopos: `/v1/scopes`
- dashboard: `/v1/dashboard`

### Integração M2M

Endpoint canônico OAuth 2.0:

```http
POST /v1/oauth/token
```

Alias simplificado:

```http
POST /v1/integration/token
```

Exemplo:

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "crm-leads",
    "client_secret": "CrmLeads-Demo2026!",
    "scope": "identity:read"
  }'
```

O token M2M possui `type: integration_access` e `scopes`. A rota `GET /v1/integration/users/:id` permite consulta de identidade por sistemas consumidores, exigindo token M2M, escopo `identity:read` e header `X-Tenant-Id`.

### Multi-tenant

Usuários pertencem a um tenant. Rotas tenant-aware usam:

```http
X-Tenant-Id: 00000000-0000-4000-8000-000000000001
```

Para tokens humanos, o header deve bater com o `tenant_id` do JWT. Para integrações M2M tenant-scoped, o header é obrigatório.

### Gateway multi-módulo

O container `frontend` também atua como gateway Nginx. Ele roteia:

| Prefixo | Destino |
| :--- | :--- |
| `/` | SPA administrativa |
| `/v1/auth`, `/v1/users`, `/v1/roles`, `/v1/permissions` | Core Auth |
| `/v1/oauth`, `/v1/integration`, `/v1/applications`, `/v1/scopes` | Core Auth |
| `/v1/fiscal/*` | Módulo Fiscal ou stub local |
| `/v1/crm/*` | Módulo CRM ou stub local |
| `/v1/service-desk/*` | Service Desk ou stub local |

Mais detalhes: [`docs/GATEWAY.md`](docs/GATEWAY.md).

---

## Documentação

| Recurso | Descrição |
| :--- | :--- |
| `GET /v1/docs` | Swagger UI interativo |
| [`docs/WALKTHROUGH_MVP.md`](docs/WALKTHROUGH_MVP.md) | Guia consolidado de demonstração do MVP |
| [`docs/PERMISSIONS_MATRIX.md`](docs/PERMISSIONS_MATRIX.md) | Catálogo de permissões, papéis, escopos e apps demo |
| [`docs/JWT_GUIDE.md`](docs/JWT_GUIDE.md) | Claims e validação de tokens JWT |
| [`docs/M2M_INTEGRATION_GUIDE.md`](docs/M2M_INTEGRATION_GUIDE.md) | Guia de integração M2M |
| [`docs/INTEGRATION_API_CONTRACT.md`](docs/INTEGRATION_API_CONTRACT.md) | Envelope de resposta e catálogo de erros |
| [`docs/GATEWAY.md`](docs/GATEWAY.md) | Contrato do gateway multi-módulo |
| [`docs/DEPLOY_SEED.md`](docs/DEPLOY_SEED.md) | Seed em produção, secrets e rotação |

---

## Status do MVP

- [x] Autenticação humana: register, login, refresh e me
- [x] Autorização RBAC com `PermissionsGuard`
- [x] Gestão de usuários, papéis e permissões
- [x] Gestão de aplicações M2M e escopos
- [x] OAuth 2.0 Client Credentials via `/v1/oauth/token`
- [x] Alias M2M `/v1/integration/token`
- [x] API de identidade M2M `GET /v1/integration/users/:id`
- [x] Multi-tenant com `tenant_id` e `X-Tenant-Id`
- [x] Gateway Nginx multi-módulo com stubs locais
- [x] Console administrativo React/Vite
- [x] Logs estruturados com `requestId`
- [x] Healthcheck funcional em `/v1/health`
- [x] Workflow de deploy por tags `v*`
- [ ] Pipeline CI com lint, testes e coverage automatizados
- [ ] Cobertura de testes >= 80%
- [ ] CSP/HSTS restritivos para produção

Observação: o backend registra Helmet, mas a configuração atual mantém `contentSecurityPolicy` e `hsts` desabilitados. Por isso, CSP/HSTS ficam registrados como débito de hardening.

---

## Time

Squad 1 — ERP Modular Cloud-Native (2026)
