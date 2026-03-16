# ADR 0002: Structured local content model

- Status: Accepted
- Date: 2026-03-16

## Context

The portfolio content now spans:

- localised pages,
- public projects,
- private case studies,
- skills,
- CV data,
- legal content,
- richer inline about popovers with linked items and media.

The repository needed a content model that stays static-first, is easy to
validate, and keeps UI components free from ad hoc editorial objects.

Alternatives considered:

- Markdown files with frontmatter for every content type.
- A CMS or remote content source.
- Leaving content embedded in UI components as plain objects.

## Decision

The portfolio uses:

- local content files under `src/content/data/`,
- Astro Content Collections for loading,
- Zod schemas in `src/content.config.ts` for validation,
- explicit domain/application mapping before data reaches the UI.

Editorial structures should remain typed and explicit, using fields such as:

- `paragraphs[]`
- `bullets[]`
- `links[]`
- `items[]`
- `metadata`

Raw HTML blobs are intentionally avoided.

## Consequences

### Positive

- Content stays versioned with the codebase and works well in a static build.
- Validation happens early through schemas instead of failing at render time.
- UI components receive already-shaped view models instead of raw content files.
- The model can evolve gradually, like the richer `about` popovers, without
  introducing a CMS.

### Negative

- Large JSON files become less ergonomic as the amount of content grows.
- Some richer editorial cases require schema and mapper changes before content
  can be entered.
- Markdown authoring ergonomics are traded away in favour of stricter
  structure.

## Follow-up

- If entries or skills grow significantly, split monolithic JSON files into
  smaller per-entry files while keeping the same schema-first approach.
- Reassess markdown/frontmatter only if narrative-heavy longform content
  becomes a primary need.
