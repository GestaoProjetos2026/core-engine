# Roadmap Demo CTO — Core Engine & Auth
**Data:** 29/05/2026  
**Objetivo:** Validar os pilares do Alicerce (suporte, M2M, tenant, gateway) conforme Sprint 8.

---

## 1. Infraestrutura e Gateway (RF28)
**Ação:** Validar se o gateway roteia corretamente entre o Core e módulos externos.

```bash
# 1.1 Saúde do Core Engine
curl -s http://api.core-engine.40.82.176.176.nip.io/v1/health

# 1.2 Saúde do módulo CRM (Stub Squad 3)
curl -s http://api.core-engine.40.82.176.176.nip.io/v1/crm/health

# 1.3 Bloqueio de login local no módulo (Segurança)
curl -s -o /dev/null -w "HTTP %{http_code}" http://api.core-engine.40.82.176.176.nip.io/v1/crm/auth/login
# Esperado: HTTP 403
```

---

## 2. Identity Core — Fluxo Humano e RBAC (RF01-RF13, RF30)
**Ação:** Login com papel `suporte` e validação de restrição fiscal.

```bash
# 2.1 Login como Suporte
curl -s -X POST http://api.core-engine.40.82.176.176.nip.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"suporte@example.com\",\"password\":\"Suporte123!\"}"
# Note: Copie o accessToken e o id (UUID) do JSON de resposta.
```

---

## 3. Integration Core — M2M e OAuth 2.0 (RF17-RF23, RF29)
**Ação:** Obter token M2M e consultar identidade via UUID.

```bash
# 3.1 Obter Token M2M (Client Credentials) para Squad CRM
curl -s -X POST http://api.core-engine.40.82.176.176.nip.io/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d "{
    \"grant_type\": \"client_credentials\",
    \"client_id\": \"crm-leads\",
    \"client_secret\": \"CrmLeads-Demo2026!\",
    \"scope\": \"identity:read\"
  }"
# Note: Copie o access_token da resposta.

### 3.2 Consultar Identidade via API de Integração

# Substitua <USER_ID> pelo UUID do usuário e <TOKEN> pelo access_token M2M
curl -s "http://api.core-engine.40.82.176.176.nip.io/v1/integration/users/<USER_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001"
```

---

## 4. Multi-tenant Lógico (RF25-RF27)
**Ação:** Validar isolamento de dados via header.

```bash
# 4.1 Consulta COM header de tenant correto
# Esperado: HTTP 200
curl -s -o /dev/null -w "HTTP %{http_code}" "http://api.core-engine.40.82.176.176.nip.io/v1/integration/users/<USER_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001"

# 4.2 Consulta COM header de tenant inexistente/errado
# Esperado: HTTP 404 (recurso não pertence ao tenant)
curl -s -o /dev/null -w "HTTP %{http_code}" "http://api.core-engine.40.82.176.176.nip.io/v1/integration/users/<USER_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-Tenant-Id: deadbeef-0000-0000-0000-000000000000"
```

---

## 5. Auditoria e Segurança (RNF07-RNF08, §21)
**Ação:** Validar logs e políticas.

- **Lockout:** Tente errar a senha do admin 5 vezes consecutivas. Esperado: `RATE_LIMIT_EXCEEDED` (429).
- **Audit Logs:** Verifique os logs do container `backend` ou a tabela `AuthAuditLog` (se persistida) para o evento de login sucesso/falha.

---

> [!IMPORTANT]
> Certifique-se de que o ambiente foi limpo e o seed executado: `npm run prisma:seed` no backend.
