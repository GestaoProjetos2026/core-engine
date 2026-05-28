# Walkthrough Consolidado — MVP Identity & Integration Core

Este documento demonstra as capacidades finais entregues no MVP do **Identity & Integration Core**, consolidando os fluxos de acesso para usuários humanos e aplicações (M2M).

---

## 1. Autenticação Humana (RBAC)

O sistema suporta login via e-mail/senha, emissão de JWT com claims de permissão e renovação via Refresh Token com rotação.

### Login e Perfil
1.  **Endpoint:** `POST /v1/auth/login`
2.  **Credenciais Admin (dev):** `admin@example.com` / `AdminCore2026!` (demais contas em [`docs/DEPLOY_SEED.md`](DEPLOY_SEED.md))
3.  **Resultado:** Recebimento de `accessToken` e `refreshToken`.
4.  **Consulta de Perfil:** `GET /v1/auth/me` (com Bearer Token) retorna os dados do usuário e a lista exata de permissões (ex: `users:read`, `users:write`).

### Autorização Restritiva
- O sistema utiliza o `PermissionsGuard`. Se um usuário tentar acessar `POST /v1/users` sem a permissão `users:write`, receberá um erro `403 Forbidden` com o código `AUTHZ_FORBIDDEN`.

---

## 2. Integração de Máquina (M2M / OAuth 2.0)

Para squads e parceiros externos, o sistema atua como um **Authorization Server** simplificado.

### Fluxo de Integração
1.  **Provisionamento:** Uma aplicação é criada via `POST /v1/applications`, recebendo um `client_id` e um `client_secret` (exibido uma única vez).
2.  **Obtenção de Token:** A aplicação solicita um token via `POST /v1/oauth/token` usando `grant_type: client_credentials`.
3.  **Validação de Escopos:** O token gerado contém `scopes` (ex: `orders:read`). O `ScopesGuard` nas rotas de integração garante que a aplicação só acesse o que lhe foi permitido.

---

## 3. Hardening e Segurança Operacional

- **Rate Limit:** Proteção contra força bruta em rotas sensíveis (5 tentativas/min).
- **Helmet & CSP:** Headers de segurança configurados para proteger contra XSS e Clickjacking.
- **Auditoria:** Eventos críticos (login, troca de segredo) são registrados em logs estruturados JSON com `requestId`.

---

## 4. Estado da Entrega (DoD)

| Item | Status | Observação |
| :--- | :--- | :--- |
| Autenticação Humana | ✅ OK | Login/Register/Refresh/Me funcionais. |
| Autorização RBAC | ✅ OK | PermissionsGuard e Matriz de Permissões estável. |
| Integração M2M | ✅ OK | OAuth 2.0 Client Credentials e ScopesGuard. |
| Swagger UI | ✅ OK | Documentação completa em `/v1/docs`. |
| Hardening | ✅ OK | Rate Limit, Helmet e Logs JSON. |
| Healthcheck | ✅ OK | Monitoramento em `/v1/health`. |
| **CI/CD** | ⚠️ DÉBITO | Task 5 (GitHub Actions) pendente. |
| **Cobertura Tests** | ⚠️ DÉBITO | Task 6 (80% coverage) pendente. |

---

**Ambiente de Desenvolvimento:**
- **Porta DB:** 5433 (PostgreSQL Docker)
- **Porta API:** 3000 (Local)
- **URL Desenvolvimento:** http://20.246.82.149:8080
- **Documentação:** `docs/PERMISSIONS_MATRIX.md`
