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

## Qualidade local (DoD)

```bash
# Lint
npm run lint

# Verificação de formatação (Prettier)
npm run format:check

# Testes unitários
npm run test:unit

# Testes e2e
npm run test:e2e

# Build de produção
npm run build

# Pipeline completo local (mesma ordem do CI)
npm run ci
```

## Pipeline CI (GitHub Actions)

O repositório possui workflow em `.github/workflows/ci.yml` com execução em `pull_request` e `push` para `main`, `master` e `develop`.

Etapas do pipeline:

- instalação via `npm ci`;
- aplicação de migrações (`npx prisma migrate deploy`);
- `npm run lint`;
- `npm run format:check`;
- `npm run test:unit`;
- `npm run test:e2e`;
- `npm run build`.

Para que falhas do pipeline bloqueiem merge, configure no GitHub a branch protection exigindo o status check do workflow **CI**.

## Testando a Autenticação (Spike Sprint 3)

Com a seed executada (`npx prisma db seed`), dois usuários já estão prontos para uso:

- **Admin:** `admin@example.com` / `Password123!` (Possui a role 'admin')
- **Viewer:** `viewer@example.com` / `Password123!` (Possui a role 'viewer')

1. **Login:** Faça um `POST` para `/v1/auth/login` com o corpo:
   ```json
   { "email": "admin@example.com", "password": "Password123!" }
   ```
   _Vocé receberá um `access_token` no retorno._
2. **Consultar Perfil:** Envie um `GET` para `/v1/auth/me` incluindo o cabeçalho:
   ```
   Authorization: Bearer <seu_access_token>
   ```
   _O retorno listará os dados do usuário e confirmará as permissões injetadas conforme suas roles._

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

| Método | Rota                                     | Descrição                                                                    | Status |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- | ------ |
| GET    | `/v1/health`                             | Health check com envelope padrão                                             | ✅     |
| GET    | `/v1/docs`                               | Swagger UI (apenas em desenvolvimento)                                       | ✅     |
| POST   | `/v1/auth/register`                      | Registrar usuário (RF01)                                                     | ✅     |
| POST   | `/v1/auth/login`                         | Login e-mail/senha, emite tokens (RF02, RF03)                                | ✅     |
| POST   | `/v1/auth/refresh`                       | Renovar par de tokens com rotação (RF04, RN03)                               | ✅     |
| GET    | `/v1/auth/me`                            | Perfil e permissões do usuário autenticado (RF08)                            | ✅     |
| GET    | `/v1/users`                              | Listar usuários paginados (RF09)                                             | ✅     |
| POST   | `/v1/users`                              | Criar usuário via admin (RF09)                                               | ✅     |
| GET    | `/v1/users/:id`                          | Detalhe do usuário (RF09)                                                    | ✅     |
| PATCH  | `/v1/users/:id`                          | Atualizar usuário (RF09)                                                     | ✅     |
| PATCH  | `/v1/users/:id/status`                   | Ativar/desativar usuário (RF09, RN01)                                        | ✅     |
| GET    | `/v1/roles`                              | Listar papéis (RF10)                                                         | ✅     |
| POST   | `/v1/roles`                              | Criar papel (RF10)                                                           | ✅     |
| POST   | `/v1/roles/:id/users`                    | Associar usuário a papel (RF12)                                              | ✅     |
| POST   | `/v1/roles/:id/permissions`              | Associar permissão a papel (RF13)                                            | ✅     |
| GET    | `/v1/permissions`                        | Listar permissões (RF11)                                                     | ✅     |
| POST   | `/v1/permissions`                        | Criar permissão (RF11)                                                       | ✅     |
| GET    | `/v1/applications`                       | Listar aplicações (RF14)                                                     | ✅     |
| POST   | `/v1/applications`                       | Criar aplicação; retorna `client_secret` **uma vez** (RF14, RF15)            | ✅     |
| GET    | `/v1/applications/:id`                   | Detalhe (sem secret) (RF14)                                                  | ✅     |
| PATCH  | `/v1/applications/:id`                   | Atualizar aplicação (RF14)                                                   | ✅     |
| PATCH  | `/v1/applications/:id/status`            | Ativar/desativar aplicação (RF14)                                            | ✅     |
| POST   | `/v1/applications/:id/regenerate-secret` | Novo secret; exibido **uma vez** (RF15)                                      | ✅     |
| GET    | `/v1/applications/:id/scopes`            | Listar escopos da aplicação (RF16)                                           | ✅     |
| POST   | `/v1/applications/:id/scopes`            | Associar escopos à aplicação (RF16)                                          | ✅     |
| GET    | `/v1/scopes`                             | Listar catálogo global de escopos                                            | ✅     |
| POST   | `/v1/scopes`                             | Criar escopo global                                                          | ✅     |
| POST   | `/v1/oauth/token`                        | Token endpoint OAuth 2.0 (`client_credentials`, `refresh_token`) (RF21–RF23) | ✅     |
| POST   | `/v1/integration/token`                  | Alias M2M para `client_credentials` (RF17)                                   | ✅     |

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

| Documento                                                              | Conteúdo                                                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`docs/M2M_INTEGRATION_GUIDE.md`](docs/M2M_INTEGRATION_GUIDE.md)       | **Guia de Integração M2M** — fluxo OAuth 2.0, `curl`, escopos, erros e boas práticas para parceiros externos |
| [`docs/JWT_GUIDE.md`](docs/JWT_GUIDE.md)                               | Claims JWT, validação de token, uso de `perms` e `scopes`, exemplos em TypeScript e Python                   |
| [`docs/INTEGRATION_API_CONTRACT.md`](docs/INTEGRATION_API_CONTRACT.md) | Envelope de resposta, catálogo de `error.code` e referência ao Swagger                                       |
| [`docs/SCOPES_GUARD_TEST_GUIDE.md`](docs/SCOPES_GUARD_TEST_GUIDE.md)   | Guia de testes do `ScopesGuard` e `@RequireScopes`                                                           |
| `GET /v1/docs`                                                         | Swagger UI interativo (disponível apenas em desenvolvimento)                                                 |

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
