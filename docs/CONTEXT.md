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
- Retirar/evitar pacotes antigos (`fastify/jwt` avulso, visto que a infra de API já conta com modulação oficial Nest para isto e guard de JWT pronto).
- Testes e2e (Sprint 3 task 6) dependem dos endpoints humanos e agora do novo PermissionsGuard nas rotas sensíveis. Devem ser integrados e validando os fluxos Auth Me + Auth Login em conjunto.

## Riscos e atencoes
- O Swagger de autenticacao para Swagger bearer mode deve ser ativado nas demais proteções `M2M`/App.
- Como o `vitest` executa fora da toolchain tradicional de Reflection do Nest(`tsc`), continue adotando injeções manuais via construtor nos `spec` tests de Unit quando possível.
- Evitar rodar o vitest contendo a flag `--exclude "dist/**"` omitida para evitar double test scan em módulos compilados comuns (arquivos .js).

## Proximo foco
- Completar as tarefas e2e de Auth da Sprint 3 (como a Task 6).

## Tasks concluidas na sessao
- Sprint 3 - Task 7: Spike de teste manual: papéis e permissões em ambiente de dev — Status `done`

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover itens de sprint nem inventar tasks.
- Observação sobre os testes: Utilizamos `vitest` em vez de jest. Fazer importação de mocks nativos sempre do `vitest`.

## Template de atualizacao rapida (copiar e preencher)
```md
## Ultima acao realizada
- ...

## Arquivos modificados recentemente
- ...

## Estado atual
- ...

## Pendencias e debitos
- ...

## Riscos e atencoes
- ...

## Proximo foco
- ...

## Tasks concluidas na sessao
- ...

## Observacoes uteis para a proxima sessao
- ...
```
