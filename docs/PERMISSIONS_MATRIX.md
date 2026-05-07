# Matriz de Permissões e Escopos — Core Engine & Auth

Este documento detalha o catálogo estável de permissões (RBAC) e escopos (M2M) do sistema, servindo como guia para squads consumidores e integradores.

## 1. Permissões (RBAC — Usuários Humanos)

Utilizadas em conjunto com o decorador `@RequirePermissions('code')` no backend.

| Código | Descrição | Módulo Alvo |
|--------|-----------|-------------|
| **IAM (Identity & Access Management)** | | |
| `users:read` | Visualizar lista e detalhes de usuários | Core/Auth |
| `users:write` | Criar, atualizar e excluir usuários | Core/Auth |
| `roles:read` | Visualizar papéis de acesso | Core/Auth |
| `roles:write` | Criar e atualizar papéis | Core/Auth |
| `roles:manage` | Vincular usuários e permissões a papéis | Core/Auth |
| `permissions:read` | Visualizar catálogo de permissões | Core/Auth |
| `permissions:write` | Gerenciar permissões do sistema | Core/Auth |
| **Integração & M2M** | | |
| `applications:read` | Visualizar aplicações integradas | Core/Auth |
| `applications:write` | Gerenciar aplicações e segredos | Core/Auth |
| `scopes:read` | Visualizar catálogo de escopos | Core/Auth |
| `scopes:write` | Gerenciar escopos e vínculos | Core/Auth |
| **Sistema & Observabilidade** | | |
| `audit:read` | Visualizar logs de auditoria e eventos críticos | Core/Auth |
| `health:read` | Visualizar status de saúde do sistema | Core/Auth |
| **Domínios (Placeholders para Squads)** | | |
| `orders:read` | Visualizar pedidos | Vendas/Logística |
| `orders:write` | Criar e gerenciar pedidos | Vendas/Logística |
| `customers:read` | Visualizar clientes | CRM |
| `customers:write` | Criar e gerenciar clientes | CRM |
| `products:read` | Visualizar catálogo de produtos | Catálogo |
| `products:write` | Gerenciar catálogo de produtos | Catálogo |
| `inventory:read` | Visualizar estoque | Logística |
| `inventory:write` | Movimentar estoque | Logística |

## 2. Escopos (OAuth 2.0 — Integrações M2M)

Utilizados no fluxo `client_credentials` e validados via `@RequireScopes('code')`.

| Código | Descrição | Nível de Acesso |
|--------|-----------|-----------------|
| `read:all` | Leitura total em todas as APIs permitidas | Global |
| `write:all` | Escrita total em todas as APIs permitidas | Global |
| `orders:read` | Leitura de pedidos | Funcional |
| `orders:write` | Criação/alteração de pedidos | Funcional |
| `customers:read` | Leitura de clientes | Funcional |
| `customers:write` | Escrita de clientes | Funcional |
| `products:read` | Leitura de produtos | Funcional |
| `products:write` | Escrita de produtos | Funcional |

## 3. Contrato para Squads Consumidores

Para solicitar novas permissões ou escopos:
1. Abra um PR ou Issue no repositório `erp-core-auth`.
2. Adicione a nova definição no arquivo `prisma/seed.ts`.
3. Atualize esta tabela (`docs/PERMISSIONS_MATRIX.md`).
4. Após o merge, execute `npx prisma db seed` no seu ambiente de desenvolvimento.

> [!NOTE]
> O Core Engine não gerencia a lógica de negócio dos outros módulos, apenas a **emissão e validação do token** contendo as claims de acesso.

## 4. Papéis Padrão (Seed)

| Papel | Descrição | Permissões Inclusas |
|-------|-----------|----------------------|
| `admin` | Administrador total do sistema | Todas as permissões |
| `viewer` | Acesso de leitura | Todas as permissões `:read` |
| `manager` | Gestor de negócio | Leituras IAM + Escrita/Leitura de domínios (orders, customers, etc.) |
