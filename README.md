# Core Engine & Auth — Squad 1

Módulo de autenticação, controle de acesso (RBAC) e API Gateway do ERP Modular Cloud-Native.

## Sobre

O Squad 1 é a fundação do ERP. Todo tráfego do sistema passa por este módulo antes de chegar a qualquer outro serviço — autenticação de usuários, gerenciamento de roles e permissões, e roteamento centralizado via API Gateway.

## Stack

- **Runtime:** Node.js v20 LTS + TypeScript
- **Framework:** NestJS 11 (adapter Fastify)
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL 16
- **Cache:** Redis 7
- **Validação:** class-validator + class-transformer
- **Testes:** Vitest
- **Documentação:** Swagger/OpenAPI 3 (`@nestjs/swagger`)

## Pré-requisitos

- Node.js v20 LTS
- Docker Desktop

## Instalação
```bash
# Clonar o repositório
git clone git@github.com:GestaoProjetos2026/Core-Engine.git
cd Core-Engine

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Subir banco de dados e Redis
docker compose up -d

# Criar as tabelas
npx prisma migrate dev

# Popular com dados iniciais
npx prisma db seed

# Iniciar em desenvolvimento
npm run dev
```

## Início Rápido / Exemplos Práticos (cURL)

Com a seed executada (`npx prisma db seed`), o ambiente já possui dados para testes:
- **Admin (Humano):** `admin@example.com` / `Password123!` (Possui a role 'admin')
- **Viewer (Humano):** `viewer@example.com` / `Password123!` (Possui a role 'viewer')
- **Aplicação M2M:** Uma aplicação mock pode ser criada no Admin e testada.

### 1. Fluxo Humano (Autenticação JWT)

**Passo A: Fazer Login**
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Password123!"}'
```
*(Você receberá um `access_token` e `refresh_token` na resposta no campo `data`)*

**Passo B: Consultar Perfil Autenticado**
```bash
curl -X GET http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer <SEU_ACCESS_TOKEN>"
```

### 2. Fluxo Máquina-a-Máquina (Integração M2M)

**Passo A: Obter Token de Integração via OAuth 2.0 (Client Credentials)**
```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>&scope=orders.read"
```
*(A API validará a aplicação e retornará um token JWT do tipo `integration_access`)*

**Passo B: Chamar Rota Protegida por Escopo**
```bash
curl -X GET http://localhost:3000/v1/alguma-rota-protegida \
  -H "Authorization: Bearer <SEU_TOKEN_DE_INTEGRACAO>"
```
*(O `ScopesGuard` interceptará a chamada garantindo que o token possui o escopo necessário)*

## Variáveis de Ambiente
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/erp_core"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua-string-secreta-longa"
JWT_EXPIRES_IN="15m"
REFRESH_EXPIRES_IN="7d"
PORT=3000
```

## Endpoints (Sprint 4 — estado atual)

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| GET | `/v1/health` | Health check com envelope padrão | ✅ |
| GET | `/v1/docs` | Swagger UI (apenas em desenvolvimento) | ✅ |
| POST | `/v1/auth/register` | Registrar usuário (RF01) | ✅ |
| POST | `/v1/auth/login` | Login e-mail/senha, emite tokens (RF02, RF03) | ✅ |
| POST | `/v1/auth/refresh` | Renovar par de tokens com rotação (RF04, RN03) | ✅ |
| GET | `/v1/auth/me` | Perfil e permissões do usuário autenticado (RF08) | ✅ |
| GET | `/v1/users` | Listar usuários paginados (RF09) | ✅ |
| POST | `/v1/users` | Criar usuário via admin (RF09) | ✅ |
| GET | `/v1/users/:id` | Detalhe do usuário (RF09) | ✅ |
| PATCH | `/v1/users/:id` | Atualizar usuário (RF09) | ✅ |
| PATCH | `/v1/users/:id/status` | Ativar/desativar usuário (RF09, RN01) | ✅ |
| GET | `/v1/roles` | Listar papéis (RF10) | ✅ |
| POST | `/v1/roles` | Criar papel (RF10) | ✅ |
| POST | `/v1/roles/:id/users` | Associar usuário a papel (RF12) | ✅ |
| POST | `/v1/roles/:id/permissions` | Associar permissão a papel (RF13) | ✅ |
| GET | `/v1/permissions` | Listar permissões (RF11) | ✅ |
| POST | `/v1/permissions` | Criar permissão (RF11) | ✅ |
| GET | `/v1/applications` | Listar aplicações (RF14) | ✅ |
| POST | `/v1/applications` | Criar aplicação; retorna `client_secret` **uma vez** (RF14, RF15) | ✅ |
| GET | `/v1/applications/:id` | Detalhe (sem secret) (RF14) | ✅ |
| PATCH | `/v1/applications/:id` | Atualizar aplicação (RF14) | ✅ |
| PATCH | `/v1/applications/:id/status` | Ativar/desativar aplicação (RF14) | ✅ |
| POST | `/v1/applications/:id/regenerate-secret` | Novo secret; exibido **uma vez** (RF15) | ✅ |
| GET | `/v1/applications/:id/scopes` | Listar escopos da aplicação (RF16) | ✅ |
| POST | `/v1/applications/:id/scopes` | Associar escopos à aplicação (RF16) | ✅ |
| GET | `/v1/scopes` | Listar catálogo global de escopos | ✅ |
| POST | `/v1/scopes` | Criar escopo global | ✅ |
| POST | `/v1/oauth/token` | Token endpoint OAuth 2.0 (`client_credentials`, `refresh_token`) (RF21–RF23) | ✅ |
| POST | `/v1/integration/token` | Alias M2M para `client_credentials` (RF17) | ✅ |

## Padrão de resposta da API (MVP atual)

### Sucesso
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-26T15:03:48.186Z",
  "path": "/v1/health"
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cannot GET /v1/not-found"
  },
  "timestamp": "2026-03-26T15:03:56.831Z",
  "path": "/v1/not-found"
}
```

## Documentação para Consumidores

| Documento | Conteúdo |
|-----------|----------|
| [`docs/M2M_INTEGRATION_GUIDE.md`](docs/M2M_INTEGRATION_GUIDE.md) | **Guia de Integração M2M** — fluxo OAuth 2.0, `curl`, escopos, erros e boas práticas para parceiros externos |
| [`docs/JWT_GUIDE.md`](docs/JWT_GUIDE.md) | Claims JWT, validação de token, uso de `perms` e `scopes`, exemplos em TypeScript e Python |
| [`docs/INTEGRATION_API_CONTRACT.md`](docs/INTEGRATION_API_CONTRACT.md) | Envelope de resposta, catálogo de `error.code` e referência ao Swagger |
| [`docs/SCOPES_GUARD_TEST_GUIDE.md`](docs/SCOPES_GUARD_TEST_GUIDE.md) | Guia de testes do `ScopesGuard` e `@RequireScopes` |
| `GET /v1/docs` | Swagger UI interativo (disponível apenas em desenvolvimento) |

## Definition of Done (DoD) - PRD §23

- [ ] Cobertura de testes unitários ≥ 80% nos módulos críticos (RNF05).
- [x] Testes e2e dos fluxos principais (RNF06).
- [x] Swagger/OpenAPI completo e testável (“Try it out”) para `/v1`.
- [x] Sem segredos em plain-text no repositório; revisão de configuração.
- [ ] CI com lint, testes e build.
- [x] Logs estruturados JSON com requestId (RNF11).
- [x] Healthcheck utilizável (`GET /v1/health`).
- [x] Documentação de integração pública disponível (README ou site docs do repositório).

## Fluxo de Trabalho
```bash
# Começar o dia
git checkout develop
git pull origin develop

# Criar branch para a tarefa
git checkout -b feat/sprint-2-task-x

# Commitar
git add .
git commit -m "feat(api): short description [CORE-XX]"

# Enviar
git push -u origin feat/sprint-2-task-x
```

Abrir Pull Request com `base: develop` e solicitar revisão antes do merge.

## Padrão de Commits
```
tipo(escopo): descrição curta [CORE-XX]
```

Tipos: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`

## Estrutura do Projeto
```
src/
├── main.ts
└── server/
    ├── app.module.ts
    ├── common/
    │   ├── api-exception.filter.ts
    │   └── response-envelope.interceptor.ts
    ├── health/
    │   ├── health.controller.ts
    │   └── health.module.ts
    └── prisma/
        ├── prisma.module.ts
        └── prisma.service.ts
prisma/
├── schema.prisma
└── seed.ts
```

## Time

Squad 1 — ERP Modular Cloud-Native  
Engenharia e Gestão de Projetos — 2026
