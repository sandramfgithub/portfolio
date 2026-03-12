# Portfolio Agent Guide

## Scope

- Preserve the existing visual identity, animation language, navigation, and copy unless the user explicitly asks for visual or editorial changes.
- Architecture work must not introduce surprise layout, content, or component rewrites.
- Public-facing repository material must be written in English.

## Principles

- No legacy or backward-compatibility work unless explicitly requested.
- Apply SOLID, DRY, KISS, YAGNI, composition over inheritance, and fail-fast validation.
- Prefer mature, maintained OSS dependencies when they remove real work.
- Do not reinvent content, data, or UI primitives that can be modeled cleanly.
- Avoid barrel files and hidden cross-layer coupling.
- Prefer small, composable pieces over large cross-layer abstractions.
- Keep architecture changes verifiable with tests, docs, and explicit contracts.

## Architecture

- Keep the site static-first.
- Prefer structured local content over ad hoc objects in UI files.
- Avoid embedded HTML blobs for editorial data; use typed fields such as `paragraphs[]`, `bullets[]`, `links[]`, and `metadata`.
- Keep UI components presentation-only. Domain rules and data access belong in `domain/`, `application/`, and `infrastructure/` layers.
- Do not add a CMS unless the user explicitly reopens that decision.
- Do not introduce Turborepo unless a real second app or package appears.

## Tooling

- Runtime and package manager: `bun@1.3.10`
- Linting and formatting: Ultracite
- Unit testing: Vitest
- Route smoke tests: Playwright
- Commit validation: commitlint + lefthook

## Code Style

- ES modules only.
- Single quotes by default.
- Semicolons always.
- Line width: 80 characters unless a longer line is clearly justified.
- Keep file and directory names in kebab-case.
- Use `import type` and `export type` for types.
- Avoid explicit `any` unless there is a concrete justification.
- Prefer arrow functions over function declarations when practical.
- Use the `node:` prefix for Node.js built-ins.
- Avoid `enum`; prefer union types or `as const`.
- Avoid namespace imports.
- Prefer `for...of` over `.forEach()` when iteration has logic or control flow.
- Keep files focused and responsibilities explicit.
- Avoid inline comments inside functions unless the code would otherwise be hard to understand.

## Commit Rules

- Format: `type(scope): description`
- Scope is mandatory and must be specific.
- Bodies should use short bullets.
- Scope should be kebab-case and reflect the affected area, never a generic repo-wide placeholder.
- No emojis, no generated-by signatures, no co-author trailers.
- Prefer `git commit -F -` so bullets are written as a single body block.

## Workflow

- Use `bun add` / `bun remove` for dependency changes.
- If environment variables change, update `.env.example` and docs in the same change.
- `bun run lint`, `bun run typecheck`, and `bun run test:unit` must pass before pushing.
- `bun run check` is the baseline gate for behaviour changes.
- Use typed analytics events and avoid PII in telemetry.
- If the editor shows a Biome error that does not reproduce with `bun run lint`, treat it as editor drift first and fix the local integration before changing valid code.
