# Architecture

## Goal

Strengthen the repository baseline and editorial architecture while preserving the current visual identity and copy.

## Principles

- Preserve the existing UI while changing architecture.
- Keep the site static-first.
- Prefer explicit contracts over direct template-to-data coupling.
- Model editorial content as structured data, not free-form HTML blobs.
- Keep analytics typed and provider-agnostic.

## Target Layering

```text
src/
  content/
    config.ts
    data/
      pages/
      entries/
      skills/
      cv/
  domain/
    portfolio/
    analytics/
  application/
    portfolio/
    cv/
  infrastructure/
    content-local/
    analytics/
  components/
  layouts/
  templates/
  pages/
  styles/
```

## Responsibilities

- `content/`: validated local editorial source.
- `domain/`: portfolio entities and contracts.
- `application/`: queries and view models for pages, CV, and future exports.
- `infrastructure/`: adapters for local content and analytics ingestion.
- `components/`, `layouts/`, `templates/`: presentation only.

## Analytics

- Provider baseline: Umami Cloud.
- Keep event names and payloads typed in `domain/analytics/`.
- Presentation code should emit semantic events only; provider calls belong in
  `infrastructure/analytics/`.
- Use delegated DOM tracking for server-rendered links and buttons where
  possible, and direct tracking only for stateful islands such as CV download
  and skill popovers.

## Delivery

- GitHub Actions is the single build authority.
- CI builds one production artifact and reuses it for smoke tests and Pages
  deployment.
- Cloudflare Pages is treated as a static delivery runtime, not as a second
  build system.
- Release automation stays independent through `release-please`.

## Near-Term Work

1. Baseline: Ultracite, Vitest, CI, commitlint, docs, hooks.
2. Content model: move hardcoded data into validated collections.
3. Application layer: replace direct template imports with explicit queries.
4. CV aggregate: separate CV from About and drive web/PDF from one view model.
5. Analytics: typed event contract for social links, CV downloads, and skill interactions.
