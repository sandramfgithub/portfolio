# portfolio

Architecture portfolio built with Astro, React, and Tailwind CSS.

## Stack

- Runtime and package manager: Bun
- Framework: Astro
- Interactive islands: React
- Styling: Tailwind CSS v4
- Linting and formatting: Ultracite
- Unit testing: Vitest
- Route smoke tests: Playwright
- Commit validation: commitlint + lefthook

## Requirements

- Node.js `>=22.12.0`
- Bun `>=1.3.10`

## Editor

- Biome config lives in `biome.jsonc` and is aligned with Ultracite plus Astro.
- If WebStorm shows stale Biome diagnostics that do not reproduce with
  `bun run lint`, reload the project Biome integration before changing code.

## Commands

```bash
bun install
bun run dev
bun run lint
bun run format
bun run typecheck
bun run test:unit
bun run test:coverage
bun run build
bun run check
bun run update
```

## Commit Template

Use a scoped Conventional Commit with a short bullet body:

```text
type(scope): summary

- Bullet one
- Bullet two
```

## Quality Gate

`bun run check` runs the baseline verification used by CI:

- Ultracite checks
- Astro typecheck
- Vitest unit tests
- Production build

`bun run test:smoke` protects the public routes with Playwright.

## Repository Structure

```text
src/                  Application source
public/               Static assets
tests/                Unit and smoke tests
docs/                 Architecture, workflow, and ADRs
.github/workflows/    CI workflows
```

## Documentation

- [Agent guide](./AGENTS.md)
- [Docs index](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Workflow](./docs/workflow.md)
- [ADR 0001](./docs/adr/0001-repository-baseline.md)
