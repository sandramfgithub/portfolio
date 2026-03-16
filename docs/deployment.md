# Deployment

## Strategy

- Hosting: Cloudflare Workers static assets via the Workers & Pages dashboard
- Deployment mode: Direct Upload from GitHub Actions
- Production branch: `main`
- Preview deployments: per pull request branch
- Release automation: `release-please`

Cloudflare currently exposes static asset projects in the Workers & Pages
dashboard as Workers. This repository still uses Direct Upload, but deployment
is performed with Wrangler Worker commands instead of the older Pages API.

The GitHub workflow builds the site once, runs smoke tests against that built
artifact through `astro preview`, and deploys the exact same `dist/` directory.
Cloudflare-specific redirect behavior is defined through `public/_redirects` so
production can use real HTTP redirects instead of Astro's static fallback HTML.

## Cloudflare setup

1. Create a new static asset Worker with **Direct Upload** in Workers & Pages.
2. Make sure the Worker name matches `CLOUDFLARE_PAGES_PROJECT_NAME`.
3. Add `sandramf.dev` as the custom domain.
4. Optionally add `www.sandramf.dev` and redirect it to `sandramf.dev`.
5. Keep the `workers.dev` route enabled for preview aliases.
6. Create an API token that can deploy Workers for the target account.

Important:

- The runtime target is the Worker name shown in Workers & Pages.
- Preview deployments are exposed through `workers.dev` preview aliases.

## GitHub repository settings

Add these repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `RELEASE_PLEASE_TOKEN`

Add these repository variables:

- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `PUBLIC_UMAMI_WEBSITE_ID`
- `PUBLIC_UMAMI_SCRIPT_URL`
- `PUBLIC_UMAMI_DOMAINS`

Recommended values:

- `CLOUDFLARE_PAGES_PROJECT_NAME=portfolio`
- `PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js`
- `PUBLIC_UMAMI_DOMAINS=sandramf.dev`

Notes:

- `PUBLIC_UMAMI_WEBSITE_ID` is only injected for production builds on pushes to
  `main`.
- Preview builds intentionally keep analytics disabled.

## Workflow layout

### CI

`ci.yml` is responsible for verification and deployment.

1. `verify`
   - installs dependencies
   - runs lint, typecheck, unit tests, and production build
   - uploads `dist/` as a GitHub Actions artifact
2. `smoke`
   - downloads the artifact
   - serves it with `astro preview`
   - runs route smoke tests with Playwright
3. `deploy-preview`
   - runs only for pull requests from branches in the same repository
   - uploads the verified `dist/` artifact as a Worker preview version
4. `deploy-production`
   - runs only for pushes to `main`
   - uploads the verified `dist/` artifact to the production Worker

This keeps build, verification, and deployment aligned around the same output.

### Releases

`release-please.yml` manages:

- release PRs
- version bumps in `package.json`
- `CHANGELOG.md`
- Git tags and GitHub Releases

The repository uses manifest mode so the root package version is tracked
explicitly in `.github/.release-please-manifest.json`.

## Release Please token

Use a dedicated token in `RELEASE_PLEASE_TOKEN` instead of relying only on the
default `GITHUB_TOKEN`.

Reason:

- release PRs and release commits created with a dedicated token can trigger
  downstream workflows normally
- this keeps CI and deployment behavior consistent for release automation

## Branch protection

Recommended protection for `main`:

- require pull requests
- require `Verify` and `Smoke`
- block force pushes
- block branch deletion

## Local parity

Two smoke modes are supported:

- local development: Playwright starts `astro dev`
- CI artifact validation: Playwright starts `astro preview`

The switch happens through `PLAYWRIGHT_WEB_SERVER_COMMAND` in CI.
