# Workflow

## Runtime

- Use `bun@1.3.10`.
- Keep dependency updates explicit with `bun run update`.
- Use `bun add` and `bun remove` for package changes.

## Local Checks

```bash
bun run lint
bun run format
bun run typecheck
bun run test:unit
bun run test:coverage
bun run build
bun run check
bun run test:smoke
```

## Hooks

- `prepare` installs `lefthook` when a local `.git` directory exists.
- `pre-commit` runs `bun run format` and stages the fixes.
- `commit-msg` runs `commitlint`.
- `pre-push` runs `bun run typecheck` and `bun run test:unit`.

## Commit Convention

- Format: `type(scope): description`
- Scope is mandatory, must be specific, and should be kebab-case.
- Bodies are required and should use short bullets.
- Prefer `git commit -F -` so the body stays as one bullet block.

```bash
git commit -F - <<'EOF'
chore(repo): initialize repository baseline

- Adopt the shared Ultracite baseline
- Add tests, CI, and commit quality checks
EOF
```

## Change Policy

- Architecture tasks must not alter the existing design or copy without explicit approval.
- Public-facing repository material should stay in English.
- Prefer small, verifiable changes with tests and docs updated in the same branch.

## Editor Notes

- `astro.config.mjs` intentionally uses the default export from
  `@astrojs/react`, which is the supported Astro 6 integration API.
- Relative import extensions are intentionally not enforced in this repo.
- If the editor disagrees with `bun run lint`, fix the editor integration before
  changing otherwise valid code.
