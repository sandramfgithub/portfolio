# Viveria hosting

The production artifact can be served on the `viveria` SSH host
(`148.113.183.160`). The host already runs Docker and a shared Caddy proxy on
ports 80 and 443. The portfolio joins its existing `viveria-edge` network.

## Build and deploy

Use the production analytics values from the GitHub repository variables in
the local `.env.production` file. This file is ignored by Git and never
uploaded to the server. Install dependencies and validate the artifact:

```bash
bun install --frozen-lockfile
bun run check
PLAYWRIGHT_WEB_SERVER_COMMAND='bun run preview:ci' bun run test:smoke
bun run deploy:viveria
```

The deploy command uploads the tested `dist/` directory and hosting
configuration to a new release under `/opt/viveria/portfolio/releases/`.
It validates Caddy and waits for the new container to become healthy before
updating `/opt/viveria/portfolio/current`. A failed update restores the
previous container when a previous release exists. Old release directories
are retained for rollback.

Only the shared proxy exposes public ports. The portfolio's HTTP preview
listens on the server's loopback address, port 18080. To preview it locally:

```bash
ssh -N -L 127.0.0.1:4322:127.0.0.1:18080 viveria
```

Open `http://127.0.0.1:4322/es` or `http://127.0.0.1:4322/en`.

The site Caddyfile preserves the three HTTP redirects from
`public/_redirects`, Astro's URLs without trailing slashes, and its localized
404 handling. The existing browser smoke tests also apply to this server.

## Connect the domain

Install `deploy/host.caddy` as `/opt/viveria/host/sites/portfolio.caddy` on
the server. Validate the complete proxy configuration before reloading:

```bash
sudo docker exec viveria-host-caddy-1 caddy validate \
  --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker exec viveria-host-caddy-1 caddy reload \
  --config /etc/caddy/Caddyfile --adapter caddyfile
```

The domain was migrated from the Cloudflare Worker named `portfolio` on
October 21, 2026. Its DNS-only `A` record points to `148.113.183.160`, and
the shared Caddy proxy manages its Let's Encrypt certificate.

The cutover from a Worker custom domain uses the following steps after
the server has passed its checks:

1. In Cloudflare Workers & Pages, open `portfolio` and remove only the
   `sandramf.dev` custom domain under Settings, Domains & Routes.
2. In the `sandramf.dev` zone's DNS records, create an `A` record for `@`
   pointing to `148.113.183.160`. Start with **DNS only** so Caddy can obtain
   its public TLS certificate directly.
3. Remove conflicting records for the same hostname, including an old
   `AAAA` record if present. The new origin currently uses IPv4.
4. Verify `https://sandramf.dev/es`, `/en`, the redirects, and a missing page.
   Caddy automatically obtains and renews the HTTPS certificate.
5. If Cloudflare proxying is desired, it can be enabled after HTTPS works.
   Use the **Full (strict)** SSL/TLS mode with the origin certificate.

Keep the original Worker available until the new domain has been verified.
Its `portfolio.sandramf-developer.workers.dev` address is independent of
the migrated custom domain and provides a fallback.

## GitHub Actions deployment

After these workflow changes reach `main`, CI deploys its verified `dist/`
artifact to Viveria over SSH. Pull request previews still use Cloudflare.
The repository secret `VIVERIA_DEPLOY_KEY` contains a dedicated Ed25519 key.
The pinned server public key lives in `deploy/known-hosts`.

On the server, this key is restricted in `ubuntu`'s `authorized_keys` with
`restrict` and a forced command that runs the root-owned
`/opt/viveria/portfolio/receive-dist.py`. The receiver accepts only a bounded
archive of regular static files and directories. It rejects absolute paths,
parent paths, links and special files. It copies the existing trusted
hosting configuration into each release; the CI key cannot supply Compose
configuration or execute an arbitrary remote command. Deployments are
serialized with a file lock and roll back if the new container is unhealthy.

The receiver is installed once by an administrator from
`deploy/receive-dist.py`. Hosting configuration changes continue to use
the administrator's `deploy:viveria` command; CI changes only static assets.

## Updates and rollback

Pushes to `main` deploy automatically after verification and browser tests.
The manual build and `deploy:viveria` commands above remain available for
administrator deployments.

To restore a previous release, run its Compose file on the server and
update the `current` symlink after it becomes healthy:

```bash
sudo docker compose \
  -f /opt/viveria/portfolio/releases/RELEASE/compose.production.yaml \
  up -d --wait --wait-timeout 60
sudo ln -sfn /opt/viveria/portfolio/releases/RELEASE \
  /opt/viveria/portfolio/current
```
