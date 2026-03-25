# 27 — TDD Orchestration, Conductor, LLM Dev Skills

Borrowed from `wshobson/agents`. Three patterns combined into one module.

## What's here

### 1. tdd-cycle command (`.claude/commands/tdd-cycle.md`)
6-phase TDD orchestration with filesystem-as-working-memory:
- Phase 1: Test specification + architecture → `.tdd-cycle/01-requirements.md`, `02-test-architecture.md`
- Phase 2 RED: Write failing tests → `03-failing-tests.md`, `04-failure-verification.md`
- Phase 3 GREEN: Implement → `05-implementation.md`, `06-green-verification.md`
- Phase 4 REFACTOR: Improve → `07-refactored-code.md`, `08-refactored-tests.md`
- Phase 5: Integration + edge cases → `09-11-*.md`
- Phase 6: Final review → `12-final-review.md`

4 user-approval checkpoints. Resumable via `state.json`.

Usage: `/tdd-cycle <feature> [--incremental|--suite] [--coverage 80]`

### 2. conductor commands (`.claude/commands/conductor-*.md`)
Multi-track project management with `conductor/` filesystem state:
- `setup` — initialize product.md, workflow.md, tracks.md
- `new-track` — create spec + plan for a feature track
- `implement` — execute tasks from a track's plan (TDD-aware)
- `status` — show all tracks progress
- `manage` — update track state
- `revert` — rollback a track

### 3. llm-application-dev skills (`.claude/skills/`)
8 progressive disclosure SKILL.md files extending context engineering (modules 18-22) into applied LLM territory:
- `prompt-engineering-patterns` — few-shot, CoT, structured outputs, template systems
- `rag-implementation` — chunking, retrieval, reranking, evaluation
- `embedding-strategies` — model selection, dimensionality, normalization
- `hybrid-search-implementation` — dense + sparse fusion, RRF
- `similarity-search-patterns` — ANN algorithms, HNSW, IVF
- `vector-index-tuning` — index parameters, performance tradeoffs
- `langchain-architecture` — chains, agents, memory patterns
- `llm-evaluation` — metrics, benchmarks, human eval design

## Key Pattern: Filesystem as Working Memory

Both `tdd-cycle` and `conductor` use the same principle: agents write outputs to files, subsequent agents read those files. This keeps multi-phase workflows resumable and avoids context window overflow.
