# ADR 0001: Repository baseline

- Status: Accepted
- Date: 2026-03-12

## Context

The site was functional, but the repository baseline was not strong enough for a public architecture-focused portfolio. Tooling, tests, CI, and documentation needed a stricter default.

## Decision

The repository baseline is:

- Bun as runtime and package manager.
- Astro as the static-first framework.
- Ultracite as linting and formatting baseline.
- Vitest for unit tests and coverage.
- Playwright for smoke tests on public routes.
- commitlint and lefthook for local commit quality checks.
- Architecture-only phases must preserve the current visual identity and public copy.

## Consequences

### Positive

- The repository has a clear and defensible quality gate.
- Tooling is stricter and more consistent.
- Architectural refactors can progress without redesigning the UI first.

### Negative

- Some temporary coexistence remains between the current data layout and the target architecture until the content refactor lands.
- Smoke tests add browser setup and maintenance cost to CI.
