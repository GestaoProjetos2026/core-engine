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

## Testando a Autenticação (Spike Sprint 3)

Com a seed executada (`npx prisma db seed`), dois usuários já estão prontos para uso:
- **Admin:** `admin@example.com` / `Password123!` (Possui a role 'admin')
- **Viewer:** `viewer@example.com` / `Password123!` (Possui a role 'viewer')

1. **Login:** Faça um `POST` para `/v1/auth/login` com o corpo:
   ```json
   { "email": "admin@example.com", "password": "Password123!" }
   ```
   *Vocé receberá um `access_token` no retorno.*
   
2. **Consultar Perfil:** Envie um `GET` para `/v1/auth/me` incluindo o cabeçalho:
   ```
   Authorization: Bearer <seu_access_token>
   ```
   *O retorno listará os dados do usuário e confirmará as permissões injetadas conforme suas roles.*

## Variáveis de Ambiente
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/erp_core"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua-string-secreta-longa"
JWT_EXPIRES_IN="15m"
REFRESH_EXPIRES_IN="7d"
PORT=3000
```

## Endpoints (Sprint 3 — estado atual)

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
| GET | `/v1/roles` | Listar papéis | Sprint 4 |
| POST | `/v1/roles` | Criar papel | Sprint 4 |
| GET | `/v1/permissions` | Listar permissões | Sprint 4 |
| POST | `/v1/permissions` | Criar permissão | Sprint 4 |
| POST | `/v1/integration/token` | Token M2M client credentials (RF17, RF21) | Sprint 5 |

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
| [`docs/JWT_GUIDE.md`](docs/JWT_GUIDE.md) | Guia completo de JWT: claims, validação, uso de `perms`, exemplos de payload decodificado |
| [`docs/INTEGRATION_API_CONTRACT.md`](docs/INTEGRATION_API_CONTRACT.md) | Envelope de resposta, catálogo de `error.code` e referência ao Swagger |
| `GET /v1/docs` | Swagger UI interativo (disponível apenas em desenvolvimento) |

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
