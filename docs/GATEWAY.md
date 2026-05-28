# Gateway multi-módulo — Core Engine & Auth

> **RF28** | Sprint 8 task 14 | Fonte normativa: `PRD.md` §14.7  
> **Público:** Squad 5 (Portal Conexus / DevOps), squads consumidoras (2–4) e frontend admin (Squad 1).

---

## 1. Objetivo

Uma **única URL de entrada** HTTP encaminha tráfego para:

- **Core Engine** — login humano, OAuth, RBAC, integração M2M (`/v1/auth`, `/v1/oauth`, `/v1/integration`, …).
- **Módulos ERP** — prefixos por squad (`/v1/fiscal`, `/v1/crm`, `/v1/service-desk`, …) **sem** endpoint de login local.

**Regra de ouro:** `POST /v1/auth/login` existe **somente** no Core. Módulos validam o JWT emitido pelo Core (ver `docs/JWT_GUIDE.md`).

---

## 2. Mapa de rotas (contrato)

| Prefixo HTTP | Destino | Squad | Login local |
|--------------|---------|-------|-------------|
| `/v1/auth`, `/v1/users`, `/v1/roles`, `/v1/permissions` | Core | 1 | N/A (Core é o IdP) |
| `/v1/oauth`, `/v1/integration` | Core | 1 | N/A |
| `/v1/applications`, `/v1/scopes`, `/v1/dashboard` | Core | 1 | N/A |
| `/v1/health`, `/v1/docs` | Core | 1 | N/A |
| `/v1/fiscal/*` | Finance / Fiscal | 2 | **Proibido** |
| `/v1/crm/*` | CRM / Leads | 3 | **Proibido** |
| `/v1/service-desk/*` | Service Desk | 4 | **Proibido** |
| `/` (SPA) | Frontend admin (build estático) | 1 | Usa Core via `/v1/auth/login` |

O gateway retorna **403** `AUTH_LOGIN_FORBIDDEN` se alguém tentar `*/auth/login` ou `*/login` sob prefixos de módulo (proteção de demonstração no nginx).

---

## 3. Hosts internos (Kubernetes)

Padrão de URL:

```text
http://<service-name>.<namespace>.svc.cluster.local:<porta>
```

| Serviço lógico | Service K8s (exemplo) | Porta | Prefixo |
|----------------|----------------------|-------|---------|
| Core Engine | `core-engine-svc` | `8080` | `/v1/auth`, `/v1/users`, … |
| Finance/Fiscal | `finance-fiscal-svc` | `8080` | `/v1/fiscal/` |
| CRM Leads | `crm-leads-svc` | `8080` | `/v1/crm/` |
| Service Desk | `service-desk-svc` | `8080` | `/v1/service-desk/` |
| Portal / Gateway | `portal-conexus-svc` | `80` | entrada pública |

Exemplos:

```text
http://core-engine-svc.default.svc.cluster.local:8080/v1/auth/login
http://crm-leads-svc.default.svc.cluster.local:8080/v1/crm/leads
```

Headers propagados pelo gateway (quando presentes na requisição original):

- `Authorization` — Bearer JWT do Core
- `X-Tenant-Id` — contexto multi-tenant (RF27, ver `docs/INTEGRATION_GUIDE.md` §5.3)
- `X-Request-Id` — correlação de logs

---

## 4. Variáveis de ambiente (Docker / compose)

O container **frontend** (nginx) usa `frontend/nginx.conf.template` com **envsubst** na subida.

| Variável | Descrição | Default (compose local) |
|----------|-----------|-------------------------|
| `CORE_SVC_HOST` | `host:porta` do Core (sem `http://`) | `backend:3000` |
| `FISCAL_SVC_HOST` | Squad 2 | `module-stubs:8080` |
| `CRM_SVC_HOST` | Squad 3 | `module-stubs:8080` |
| `SERVICE_DESK_SVC_HOST` | Squad 4 | `module-stubs:8080` |

Em staging/produção, apontar cada variável para o Service real da squad. O Portal Conexus (Squad 5) pode centralizar o mesmo mapa de rotas.

---

## 5. Demo local (Docker Compose)

### Subir stack

```bash
docker compose up -d --build
```

Entrada única: **http://localhost** (porta 80).

### Smoke test — Core + módulo externo

```bash
# Core (health)
curl -s http://localhost/v1/health | jq .

# Módulo CRM (stub Squad 3)
curl -s http://localhost/v1/crm/health | jq .

# Login proibido no módulo
curl -s -o /dev/null -w "%{http_code}" http://localhost/v1/crm/auth/login
# Esperado: 403
```

Script automatizado: `scripts/gateway-smoke.sh`

### Login humano (só no Core)

```bash
curl -s -X POST http://localhost/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotmail.com","password":"Admin12345!"}' | jq .
```

---

## 6. Arquivos no repositório

| Arquivo | Função |
|---------|--------|
| `frontend/nginx.conf.template` | Configuração do gateway (envsubst) |
| `frontend/Dockerfile` | SPA + nginx template |
| `infra/mock-modules/` | Stubs HTTP Squads 2–4 para demo |
| `docker-compose.yml` | `frontend`, `backend`, `module-stubs` |
| `scripts/gateway-smoke.sh` | Validação rápida pós-deploy |

A configuração legada `frontend/nginx.conf` (proxy único para o Core) foi substituída pelo template multi-módulo.

---

## 7. Integração com squads consumidoras

1. Expor API REST sob o prefixo acordado (`/v1/crm/`, etc.).
2. **Não** implementar `POST .../login` — redirecionar usuários ao admin/Core.
3. Validar JWT (`user_access` ou `integration_access`) com o mesmo `JWT_SECRET` do Core.
4. Repassar `X-Tenant-Id` nas chamadas server-to-server ao Core quando necessário.

---

## 8. Referências

| Documento | Conteúdo |
|-----------|----------|
| `docs/INTEGRATION_GUIDE.md` | Fluxos M2M e RBAC, header `X-Tenant-Id` |
| `docs/JWT_GUIDE.md` | Claims e validação |
| `PRD.md` §14.7 | Contrato normativo do gateway |
