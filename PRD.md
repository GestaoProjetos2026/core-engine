# 🔐 Core Engine & Auth (CORE-001)

## 📌 Visão Geral

O **Core Engine & Auth** é o módulo central responsável por autenticação, autorização e controle de acesso dentro de um sistema modular (ERP ou SaaS).

Ele garante **segurança, padronização e integração consistente** entre diferentes módulos.

---

## 🚨 Problema

Sistemas modulares sem uma camada central de autenticação:

- Duplicam lógica de segurança
- Criam inconsistência entre módulos
- Aumentam riscos de vulnerabilidades
- Dificultam manutenção

---

## 💡 Proposta de Valor

Fornecer uma solução centralizada para:

- Autenticação de usuários
- Gerenciamento de usuários
- Controle de permissões (RBAC)
- Integração segura entre módulos

---

## 💰 Oportunidade de Venda

Este módulo pode ser utilizado como produto independente para:

- Pequenas e médias empresas
- Sistemas internos
- Plataformas SaaS

---

## 👥 Personas

### 🧑‍💻 Gestor de TI
- Controlar acesso por módulo
- Definir permissões por usuário

### 🛠️ Administrador do Sistema
- Gerenciar usuários
- Controlar acessos e permissões

### 👨‍💻 Desenvolvedor
- Integrar módulos com autenticação central

---

## ⚙️ Requisitos Funcionais

| Código | Descrição |
|--------|----------|
| RF01 | Cadastro de usuários |
| RF02 | Autenticação via e-mail e senha |
| RF03 | Emissão de token |
| RF04 | Validação de token |
| RF05 | Controle de acesso por cargos |
| RF06 | Controle de permissões |
| RF07 | Consulta de usuário autenticado |
| RF08 | Gestão de usuários |
| RF09 | Gestão de cargos e permissões |
| RF10 | Integração com módulos externos |

---

## 🧱 Requisitos Não Funcionais

### 🔐 Segurança
- Senhas com hash seguro
- Tokens com expiração
- Endpoints protegidos com autenticação

### ⚡ Performance
- Baixa latência em autenticação e validação

### 📈 Escalabilidade
- Suporte a crescimento de usuários

### 🟢 Disponibilidade
- Serviço crítico (alta disponibilidade)

### 📊 Monitoramento
- Logs de:
  - Login
  - Falhas de autenticação
  - Erros de autorização

---

## 🔌 API - Endpoints

### 🔑 Autenticação
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/refresh
POST /v1/auth/validate
GET /v1/auth/me

### 👤 Usuários
GET /v1/users
POST /v1/users
PATCH /v1/users/:id

### 🛡️ Roles & Permissões
GET /v1/roles
POST /v1/roles
GET /v1/permissions
POST /v1/permissions


---

## 🔗 Integração com Outros Módulos

Os módulos devem:

- Enviar token no header das requisições
- Consultar permissões do usuário autenticado
- Restringir funcionalidades com base em papéis/permissões

---

## 📡 Eventos / Webhooks

### 🆕 user.created
Disparado ao criar um usuário

{
  "event": "user.created",
  "timestamp": "2026-03-12T21:00:00Z",
  "source": "core-auth",
  "data": {
    "userId": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "status": "active"
  }
}

Consumidores:

CRM
Service Desk

### user.disabled
Disparado ao desativar usuário

{
  "event": "user.disabled",
  "timestamp": "2026-03-12T21:00:00Z",
  "source": "core-auth",
  "data": {
    "userId": "uuid",
    "status": "disabled"
  }
}

### 🔄 permission.updated

Disparado ao alterar permissões

{
  "event": "permission.updated",
  "timestamp": "2026-03-12T21:00:00Z",
  "source": "core-auth",
  "data": {
    "permissionId": "uuid",
    "code": "finance.write",
    "description": "Permite modificar registros financeiros"
  }
}

🧩 role.updated

Disparado ao alterar roles

{
  "event": "role.updated",
  "timestamp": "2026-03-12T21:00:00Z",
  "source": "core-auth",
  "data": {
    "roleId": "uuid",
    "name": "finance_manager",
    "permissions": [
      "finance.read",
      "finance.write"
    ]
  }
}

### User Stories
Como administrador, quero cadastrar usuários para permitir acesso ao sistema
Como usuário, quero fazer login para acessar meus módulos
Como gestor de TI, quero controlar permissões para proteger áreas sensíveis
Como desenvolvedor, quero uma API central de autenticação
Como administrador, quero desativar usuários para evitar acessos indevidos

### ✅ Definição de Pronto (DoD)
 Código revisado
 Testes unitários implementados
 Documentação atualizada
 Pipeline CI/CD funcionando
 Endpoints testados
 Regras de acesso validadas
 Issue atualizada no Plane
