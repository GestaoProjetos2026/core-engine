# Core Engine & Auth — Squad 1

Módulo de autenticação, controle de acesso (RBAC) e API Gateway do ERP Modular Cloud-Native.

## Sobre

O Squad 1 é a fundação do ERP. Todo tráfego do sistema passa por este módulo antes de chegar a qualquer outro serviço — autenticação de usuários, gerenciamento de roles e permissões, e roteamento centralizado via API Gateway.

## Stack

- **Runtime:** Node.js v20 LTS + TypeScript
- **Framework:** Fastify
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL 16
- **Cache:** Redis 7
- **Validação:** Zod
- **Testes:** Vitest

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

## Variáveis de Ambiente
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/erp_core"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua-string-secreta-longa"
JWT_EXPIRES_IN="15m"
REFRESH_EXPIRES_IN="7d"
PORT=3000
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/auth/register` | Criar usuário |
| POST | `/v1/auth/login` | Autenticar |
| POST | `/v1/auth/logout` | Encerrar sessão |
| POST | `/v1/auth/refresh` | Renovar token |
| GET | `/v1/auth/me` | Usuário autenticado |
| GET | `/v1/users` | Listar usuários |
| GET | `/v1/roles` | Listar roles |
| GET | `/v1/permissions` | Listar permissões |
| GET | `/v1/health` | Health check |

Documentação completa disponível em `/docs` com o servidor rodando.

## Fluxo de Trabalho
```bash
# Começar o dia
git checkout develop
git pull origin develop

# Criar branch para a tarefa
git checkout -b feature/CORE-XX-descricao-breve

# Commitar
git add .
git commit -m "feat(auth): descrição [CORE-XX]"

# Enviar
git push -u origin feature/CORE-XX-descricao-breve
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
├── modules/
│   ├── auth/
│   ├── users/
│   └── rbac/
└── shared/
    ├── middleware/
    └── utils/
prisma/
├── schema.prisma
└── seed.ts
```

## Time

Squad 1 — ERP Modular Cloud-Native  
Engenharia e Gestão de Projetos — 2025

#PRD (Documento de Requisitos do Produto)

##[CORE-001] Core Engine & Auth
##1. Visão Geral e Proposta de Valor
Problema
Sistemas modulares necessitam de uma camada central de autenticação e autorização para garantir segurança, padronização de acesso e integração consistente entre módulos. Sem essa base, os módulos tendem a implementar seu próprio controle de acesso, gerando falhas de segurança e dificuldade de manutenção.
Proposta de Valor
O módulo Core Engine & Auth fornece uma fundação centralizada para autenticação, gerenciamento de usuários, controle de permissões e integração segura entre os demais módulos do ERP.
Oportunidade de Venda
Esse módulo pode ser comercializado separadamente como uma solução simplificada para pequenas e médias empresas que desejam controle de acesso centralizado em sistemas internos ou plataformas SaaS (Software as a Service).
##2. Personas
Gestor de TI
Precisa controlar o acesso para cada módulo, além de quais ações cada usuário pode realizar.
Administrador do Sistema
Precisa cadastrar usuários, redefinir acessos e gerenciar permissões.
Desenvolvedor de outro Squad
Precisa integrar seu módulo com uma camada pronta de autenticação e autorização.
##3. Requisitos Funcionais
RF01 — Cadastro de usuários
O sistema deve permitir cadastrar usuários com nome, e-mail, senha e status de ativação.
RF02 — Autenticação de usuário
O sistema deve permitir que usuários autenticados entrem na plataforma por meio de e-mail e senha.
RF03 — Emissão de token
O sistema deve emitir token de autenticação para acesso às APIs protegidas.
RF04 — Validação de token
O sistema deve validar se o token recebido é autêntico, válido e não expirado.
RF05 — Controle de acesso por cargos
O sistema deve permitir atribuir cargos aos usuários, como administrador, gestor, analista e operador.
RF06 — Controle de permissões
O sistema deve permitir definir permissões específicas por módulo e por ação.
RF07 — Consulta de usuário autenticado
O sistema deve disponibilizar endpoint para retornar os dados básicos do usuário autenticado.
RF08 — Gestão de usuários
O administrador deve poder ativar, desativar e atualizar usuários.
RF09 — Gestão de cargos e permissões
O administrador deve poder criar, editar e vincular papéis e permissões.
RF10 — Integração com módulos externos
Os demais squads devem conseguir consumir autenticação e autorização por meio de APIs padronizadas.
##4. Requisitos Não Funcionais
Segurança
As senhas devem ser armazenadas com hash seguro. Os tokens devem ter expiração definida. O acesso a endpoints protegidos deve exigir autenticação válida.
Performance
Os endpoints de autenticação e validação devem responder em tempo adequado para não gerar atrasos na navegação do sistema.
Escalabilidade
O módulo deve suportar aumento de usuários e autenticações sem comprometer a experiência geral.
Disponibilidade
Como módulo central, sua indisponibilidade impacta o ecossistema inteiro. Portanto, deve ser tratado como serviço crítico.
Monitoramento
As ações de login, falha de autenticação e erro de autorização devem gerar logs para auditoria e suporte.
##5. Especificação Técnica e Integração
Endpoints previstos
•	POST /v1/auth/register
•	POST /v1/auth/login
•	POST /v1/auth/refresh
•	GET /v1/auth/me
•	GET /v1/users
•	POST /v1/users
•	PATCH /v1/users/:id
•	GET /v1/roles
•	POST /v1/roles
•	GET /v1/permissions
•	POST /v1/permissions
•	POST /v1/auth/validate
Integração com os outros squads
Os demais módulos deverão:
•	enviar token no header das requisições;
•	consultar permissões do usuário autenticado;
•	restringir funcionalidades conforme o papel/permissão.
##Eventos ou Webhooks possíveis
1. Evento: user.created
Descrição:
Disparado quando um novo usuário é registrado no sistema.
Ação que dispara:
POST /v1/users
Permissão necessária:
users.create
Papéis comuns:
Administrador, Gestor de TI.
Payload:
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
CRM (criar perfil comercial), Service Desk (criar perfil de suporte)
2. Evento: user.disabled
Descrição:
Disparado quando um usuário é desativado do sistema.
Ação que dispara:
PATCH /v1/users/{id}/disable
Permissão necessária:
users.disable
Papéis que normalmente possuem essa permissão:
Administrador, Gestor de TI.
Payload:
{
    "event": "user.disabled",
    "timestamp": "2026-03-12T21:00:00Z",
    "source": "core-auth",
    "data": {
       "userId": "uuid",
       "status": "disabled"
     }
}

Consumidores:
CRM (bloquear acesso ao CRM), Service Desk (remover acesso a tickets).
3. Evento: permission.updated
Descrição:
Disparado quando uma permissão é criada ou modificada.
Ação que dispara:
PATCH /v1/permissions/{id}
Permissão necessária:
permissions.manage
Papéis que normalmente possuem essa permissão:
Administrador, Gestor de TI.
Payload:
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
Consumidores: 
Plataforma DevOps (auditoria), Módulos dependentes de permissões.
4. Evento: role.updated
Descrição:
Disparado quando um papel (role) é alterado.
Ação que dispara:
PATCH /v1/roles/{id}
Permissão necessária:
roles.manage
Papéis comuns:
Administrador, Gestor de TI.
Payload:
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
Consumidores:
Todos os módulos que dependem de RBAC.

##6. User Stories
•	Como administrador, eu quero cadastrar usuários para que eles possam acessar o sistema.
•	Como usuário, eu quero fazer login para acessar os módulos disponíveis para meu perfil.
•	Como gestor de TI, eu quero controlar permissões por papel para proteger áreas sensíveis do ERP.
•	Como desenvolvedor de outro squad, eu quero uma API central de autenticação para integrar meu módulo com segurança.
•	Como administrador, eu quero desativar usuários para impedir acessos indevidos.
##7. Definição de Pronto (DoD)
•	Código revisado por outro squad
•	Testes unitários implementados
•	Documentação da API atualizada
•	Pipeline de CI/CD passando
•	Endpoints testados
•	Regras de acesso validadas
•	Issue atualizada no Plane

