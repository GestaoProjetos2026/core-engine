# Deploy Seed — Contas Admin e M2M por Squad

Guia operacional para popular o PostgreSQL em **produção** no startup do container (migrate + seed).

## Fluxo no container

1. `prisma migrate deploy`
2. `node dist/prisma/seed.js` (se `SEED_ON_STARTUP` ≠ `false`)
3. `node dist/src/main.js`

O seed é **idempotente** (`upsert`). Em produção, senhas e secrets **não são resetados** em redeploys, salvo `SEED_UPDATE_PASSWORDS=true`.

## Secrets obrigatórios (ArgoCD / K8s)

Configure no cluster (nunca commitar valores reais no git):

### Senhas de usuários humanos

| Variável | Conta |
|----------|--------|
| `SEED_PASSWORD_ADMIN_CORE` | `admin@example.com` |
| `SEED_PASSWORD_ADMIN_HOTMAIL` | `admin@hotmail.com` |
| `SEED_PASSWORD_ADMIN_CRM` | `admincrm@example.com` |
| `SEED_PASSWORD_ADMIN_FISCAL` | `adminfiscal@example.com` |
| `SEED_PASSWORD_ADMIN_DESK` | `admdesk@example.com` |
| `SEED_PASSWORD_ADMIN_DEVOPS` | `admindevops@example.com` |
| `SEED_PASSWORD_VIEWER` | `viewer@example.com` |

Padrão sugerido em dev (ver `backend/prisma/seed-data.ts`): `Admin{Persona}2026!`, `ViewerDemo2026!`.

### Secrets M2M (client_credentials)

| Variável | `client_id` |
|----------|-------------|
| `SEED_M2M_SECRET_CORE` | `erp-core-client` |
| `SEED_M2M_SECRET_HOTMAIL` | `erp-hotmail-client` |
| `SEED_M2M_SECRET_CRM` | `erp-crm-client` |
| `SEED_M2M_SECRET_FISCAL` | `erp-fiscal-client` |
| `SEED_M2M_SECRET_DESK` | `erp-desk-client` |
| `SEED_M2M_SECRET_DEVOPS` | `erp-devops-client` |

`test-client-id` usa sempre `test-client-secret` (E2E); não requer env.

### Controle do seed

| Variável | Default produção | Descrição |
|----------|------------------|-----------|
| `SEED_ON_STARTUP` | `true` | `false` desliga seed no startup |
| `SEED_STRICT` | implícito com `NODE_ENV=production` | Falha o container se o seed falhar |
| `SEED_UPDATE_PASSWORDS` | `false` | `true` força reset de hashes em redeploy |
| `SEED_STRICT_M2M_SECRETS` | `false` | `true` força erro quando faltar `SEED_M2M_SECRET_*` em produção; `false` permite fallback para `defaultSecret` |

Também necessários: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`.

## Primeiro deploy vs redeploy

| Cenário | Ação |
|---------|------|
| **Primeiro deploy** | Definir todos os `SEED_PASSWORD_*` e `SEED_M2M_SECRET_*`; manter `SEED_UPDATE_PASSWORDS=false` |
| **Redeploy normal** | Não alterar secrets; seed atualiza vínculos/permissões sem resetar senhas |
| **Rotação de senha** | Definir novo secret no cluster + `SEED_UPDATE_PASSWORDS=true` em um deploy; voltar para `false` |

## Validação pós-deploy

### Login humano (admin)

```bash
curl -s -X POST "$BASE_URL/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"<SEED_PASSWORD_ADMIN_CORE>"}'
```

Confirme `GET /v1/auth/me` com o `accessToken` — `perms` deve listar permissões de administrador.

### Token M2M

```bash
curl -s -X POST "$BASE_URL/v1/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=erp-crm-client&client_secret=<SEED_M2M_SECRET_CRM>"
```

O JWT deve ter `type: integration_access` e `scopes` com o catálogo completo vinculado à aplicação.

## Desativação pós-go-live

1. `SEED_ON_STARTUP=false` no deployment.
2. Revogar ou desativar contas demo via admin (`PATCH /v1/users/:id/status`).
3. Rotacionar `JWT_SECRET` e secrets M2M se houve exposição.

## Pendência operacional (Squad 5 / ArgoCD)

Com `SEED_STRICT_M2M_SECRETS=false` o deploy desbloqueia usando fallback demo. Ainda assim, abrir pendência para criação/rotação dos secrets reais no cluster:

- `SEED_M2M_SECRET_CORE`
- `SEED_M2M_SECRET_HOTMAIL`
- `SEED_M2M_SECRET_CRM`
- `SEED_M2M_SECRET_FISCAL`
- `SEED_M2M_SECRET_DESK`
- `SEED_M2M_SECRET_DEVOPS`
- `SEED_M2M_SECRET_FINANCE_FISCAL`
- `SEED_M2M_SECRET_CRM_LEADS`
- `SEED_M2M_SECRET_SERVICE_DESK`

## Referências

- Dados declarativos: [`backend/prisma/seed-data.ts`](../backend/prisma/seed-data.ts)
- Script: [`backend/prisma/seed.ts`](../backend/prisma/seed.ts) (dev: `npm run prisma:seed:dev`; produção: `node dist/prisma/seed.js`)
- Constantes tenant: [`backend/prisma/constants.ts`](../backend/prisma/constants.ts)
- Variáveis: [`backend/.env.example`](../backend/.env.example)
