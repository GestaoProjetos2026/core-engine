# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluida task 7 — `Spike de teste manual: papéis e permissões em ambiente de dev`. Foi implementada a criação dos usuários testes ('admin', 'viewer') na `prisma/seed.ts` e atualizada a documentação (`README.md`) para propiciar o fluxo end-to-end local do RBAC utilizando o `GET /v1/auth/me`.

## Arquivos modificados recentemente
- `prisma/seed.ts` — Importado o `bcrypt` e adicionado mock users atrelados com suas respectivas roles.
- `README.md` — Adicionado tutorial de teste de login + auth/me usando os dados da semente.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- Os tokens JWT gerados via Auth já podem ter seu contexto lido localmente via endpoint `/v1/auth/me`.
- Tratamentos de Unauthorized para acessos vazios e limitadores de scope/type garantidos.
- Os testes the API restam 100% no vitest validando controllers de rotas.

## Pendencias e debitos
- Retirado pacote star-gap \`@fastify/jwt\` antigo do package.json, restando talvez dependências de tipos associados que não ferem a API e devem ser revisitadas num cleanup posterior.

## Riscos e atencoes
- O Swagger de autenticação para JWT continua aplicável às demais proteções.
- Os testes \`test/auth.e2e-spec.ts\` foram incorporados garantindo o fluxo e2e total entre app.inject do fastify com nest e o Prisma limpando os bancos por email isolado de test.
- Evite rodar vitest sem a flag de exclusão \`dist/**\` como sinalizado.

## Proximo foco
- Assegurar os fluxos RBAC (Sprints posteriores, roles e permissions seed completas e validação de 403 das chamadas HTTP via testes).

## Tasks concluidas na sessao
- Sprint 3 - Task 6: Testes e2e mínimos: login, refresh, `/me` — Status `done` e implementados garantindo RNF06 e comportamentos vitais.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
