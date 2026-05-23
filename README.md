# Erp Core Auth (Core-Engine) — Identity, Access & Integration Core

**Status:** 🚀 MVP 1.0 (Stable)

O **Core Engine & Auth** é o núcleo de Identidade e Integração Segura do ecossistema ERP Modular. Fornece autenticação RBAC para usuários humanos e integração M2M via OAuth 2.0 (Client Credentials).

---

## 🛠️ Início Rápido (Dev Environment)

### 1. Pré-requisitos
- Node.js (Recomendado v22 LTS)
- Docker & Docker Compose

### 2. Instalação e Setup
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Na raiz do repo: subir infra (PostgreSQL + Redis)
cd ..
docker compose up -d

# Sincronizar banco e popular dados iniciais
cd backend
npx prisma db push
npm run prisma:seed

# Iniciar servidor
npm run dev
```

### 3. Acessos Iniciais (Seed — desenvolvimento)

Senhas padrão quando as variáveis `SEED_*` não estão definidas (ver [`backend/prisma/seed-data.ts`](backend/prisma/seed-data.ts)):

| Tipo | Identificador | Senha / secret (dev) |
|------|---------------|----------------------|
| Admin Core | `admin@example.com` | `AdminCore2026!` |
| Admin Hotmail | `admin@hotmail.com` | `AdminHotmail2026!` |
| Admin CRM | `admincrm@example.com` | `AdminCrm2026!` |
| Admin Fiscal | `adminfiscal@example.com` | `AdminFiscal2026!` |
| Admin Desk | `admdesk@example.com` | `AdminDesk2026!` |
| Admin DevOps | `admindevops@example.com` | `AdminDevops2026!` |
| Viewer | `viewer@example.com` | `ViewerDemo2026!` |
| M2M Core | `erp-core-client` | `M2mCore2026!Secret` |
| M2M CRM | `erp-crm-client` | `M2mCrm2026!Secret` |
| M2M E2E | `test-client-id` | `test-client-secret` |

**Produção:** defina todas as variáveis `SEED_PASSWORD_*` e `SEED_M2M_SECRET_*` como secrets do cluster — ver [`docs/DEPLOY_SEED.md`](docs/DEPLOY_SEED.md).

---

## 📖 Guia de Uso

### 1. Fluxo Humano (Autenticação JWT)
Autentique-se via `POST /v1/auth/login` para receber seu `accessToken`. Use este token no header `Authorization: Bearer <token>` para acessar rotas protegidas ou consultar seu perfil em `GET /v1/auth/me`.

### 2. Integração Máquina-a-Máquina (OAuth 2.0)
Aplicações podem obter tokens de integração via `POST /v1/oauth/token` usando `grant_type: client_credentials`. Os tokens gerados respeitam os **escopos** configurados para a aplicação.

---

## 📑 Documentação e Recursos

| Recurso | Descrição |
| :--- | :--- |
| `GET /v1/docs` | Swagger UI interativo (Documentação OpenAPI) |
| [`docs/WALKTHROUGH_MVP.md`](docs/WALKTHROUGH_MVP.md) | **Guia de Demonstração do MVP** |
| [`docs/PERMISSIONS_MATRIX.md`](docs/PERMISSIONS_MATRIX.md) | Catálogo oficial de permissões e escopos |
| [`docs/JWT_GUIDE.md`](docs/JWT_GUIDE.md) | Detalhes sobre Claims e validação de tokens |
| [`docs/DEPLOY_SEED.md`](docs/DEPLOY_SEED.md) | Seed em produção (admins, M2M, secrets K8s) |

---

## 🏗️ Definition of Done (DoD) - Status Final MVP

- [x] Autenticação Humana (Login/Register/Refresh/Me)
- [x] Autorização RBAC (PermissionsGuard)
- [x] Integração M2M (OAuth 2.0 Client Credentials)
- [x] Hardening (Rate Limit, Helmet, CSP)
- [x] Logs estruturados JSON com requestId
- [x] Healthcheck funcional (`/v1/health`)
- [ ] CI/CD (GitHub Actions) — *Débito Técnico*
- [ ] Cobertura de Testes ≥ 80% — *Débito Técnico*

---

**Time:** Squad 1 — ERP Modular Cloud-Native (2026)
