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
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Subir infra (PostgreSQL + Redis)
# Nota: PostgreSQL mapeado para a porta 5433 no host
docker compose up -d

# Sincronizar banco e popular dados iniciais
npx prisma db push
npm run prisma:seed

# Iniciar servidor
npm run dev
```

### 3. Acessos Iniciais (Seed)
- **Admin:** `admin@hotmail.com` / `Admin12345!`
- **Suporte (Squad 4 demo):** `suporte@example.com` / `Suporte123!` — papel `suporte`, sem permissões `finance:*`
- **App M2M:** `test-client-id` / `test-client-secret`

Detalhes de papéis e permissões: [`docs/PERMISSIONS_MATRIX.md`](docs/PERMISSIONS_MATRIX.md)

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
