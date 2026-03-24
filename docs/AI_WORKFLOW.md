# AI_WORKFLOW.md

## Objetivo
Padronizar como usar IA neste repositorio com contexto persistente entre sessoes, sem depender da memoria do chat.

## Fontes oficiais (ordem de prioridade)
1. **Visao normativa do produto:** `PRD.md`
2. **Execucao e backlog por sprint:** `Sprints.md`
3. **Memoria curta da ultima sessao:** `docs/CONTEXT.md`
4. **Codigo e estrutura atual do repositorio:** arquivos reais versionados

## Quando abrir uma nova sessao
- Sempre que iniciar um novo item de backlog.
- Sempre que houver mudanca de contexto relevante (nova sprint, novo modulo, novo bloqueio).
- Sempre que a conversa anterior tiver encerrado sem handoff completo.

## Procedimento de inicio de sessao
1. Executar `prompts/bootstrap.txt`.
2. Ler primeiro: `PRD.md`, `Sprints.md`, `docs/CONTEXT.md`.
3. Mapear estrutura real do repositorio e status atual de implementacao.
4. Identificar item alvo no `Sprints.md` (sem inventar backlog).
5. Resumir impacto tecnico e aguardar confirmacao antes de implementar.

## Como usar o documento normativo (`PRD.md`)
- Tratar como contrato de produto: escopo, nao-escopo, requisitos, arquitetura e regras.
- Nao sobrescrever regras do PRD por conveniencia tecnica.
- Em caso de divergencia com implementacao atual, registrar gap explicitamente antes de codar.

## Como usar o backlog (`Sprints.md`)
- Tratar como fonte oficial de execucao, priorizacao e sequenciamento.
- Selecionar tarefas somente a partir do que ja esta listado.
- Nao mover item entre sprints nem criar item novo sem decisao explicita.

## Como encerrar uma sessao
1. Executar `prompts/close-session.txt`.
2. Consolidar:
   - o que foi feito;
   - o que ficou pendente;
   - riscos/atencoes;
   - proximo item logico do `Sprints.md`.
3. Atualizar `docs/CONTEXT.md` antes de finalizar.

## Como registrar handoff sem perda de contexto
- Toda sessao deve terminar com `docs/CONTEXT.md` atualizado.
- Sempre registrar arquivos alterados, estado atual e proximo foco.
- Evitar conclusoes importantes apenas no chat.

## Uso de logs e erros reais como insumo de prompt
- Em depuracao, usar mensagens reais de erro (terminal, testes, lint) no prompt.
- Incluir contexto minimo reproduzivel: comando, erro retornado, arquivo afetado.
- Pedir que a IA proponha causa raiz antes de sugerir correcoes.

## Padrao pratico para este projeto
- Stack observada: TypeScript, Fastify, Prisma, PostgreSQL, Redis, Zod, Vitest.
- Banco e cache locais via `docker-compose.yml`.
- Migrations e schema em `prisma/`.
- Nao assumir estrutura futura (ex.: `src/`) sem validar no repositorio atual.
