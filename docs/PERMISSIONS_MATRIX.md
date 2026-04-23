# Matriz de Permissoes por Endpoint Administrativo

> Fonte normativa: `PRD.md` (RF09, RF10, RF11, RF12, RF13 e RN05)  
> Backlog: `Sprints/Sprints.md` (Sprint 4 - Task 4)

Este documento consolida a matriz oficial `endpoint x permission.code` para os endpoints administrativos ja implementados no Core/Auth.

## 1) Escopo desta matriz

- Inclui endpoints administrativos de `Users`, `Roles` e `Permissions`.
- O `permission.code` abaixo corresponde ao que esta configurado no codigo via `@RequirePermissions(...)`.
- Esta matriz deve ser tratada como fonte de consulta para squads consumidores e para onboarding tecnico.

## 2) Matriz endpoint x permission.code

| Modulo | Metodo | Endpoint (`/v1`) | `permission.code` exigido | Referencia Swagger |
|--------|--------|------------------|---------------------------|--------------------|
| Users | `POST` | `/users` | `users:write` | Tag `Users` |
| Users | `GET` | `/users` | `users:read` | Tag `Users` |
| Users | `GET` | `/users/:id` | `users:read` | Tag `Users` |
| Users | `PATCH` | `/users/:id` | `users:write` | Tag `Users` |
| Users | `PATCH` | `/users/:id/status` | `users:write` | Tag `Users` |
| Roles | `POST` | `/roles` | `roles:write` | Tag `Roles` |
| Roles | `GET` | `/roles` | `roles:read` | Tag `Roles` |
| Roles | `POST` | `/roles/:id/users` | `roles:manage` | Tag `Roles` |
| Roles | `POST` | `/roles/:id/permissions` | `roles:manage` | Tag `Roles` |
| Permissions | `POST` | `/permissions` | `permissions:write` | Tag `Permissions` |
| Permissions | `GET` | `/permissions` | `permissions:read` | Tag `Permissions` |

## 3) Referencia cruzada

- Swagger interativo: `GET /v1/docs`.
- Guia de integracao JWT para consumidores internos: `docs/JWT_GUIDE.md`.
- Contrato de envelope e `error.code`: `docs/INTEGRATION_API_CONTRACT.md`.

## 4) Regra de manutencao

Sempre que um endpoint administrativo novo for criado, removido ou tiver mudanca de permissao:

1. atualizar o decorator `@RequirePermissions(...)` no controller;
2. atualizar esta matriz no mesmo commit;
3. validar alinhamento no Swagger (`/v1/docs`) e no guia de integracao.
