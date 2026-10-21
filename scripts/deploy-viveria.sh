#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
ssh_target="${1:-viveria}"
release_id="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short=12 HEAD)"

for file in dist/es/index.html dist/en/index.html dist/404.html; do
  if [[ ! -f "$file" ]]; then
    printf 'Missing %s. Build and test the production artifact first.\n' "$file" >&2
    exit 1
  fi
done

tar -czf - dist compose.production.yaml deploy |
  ssh -o BatchMode=yes "$ssh_target" \
    "sudo -n install -d /opt/viveria/portfolio/releases/$release_id && sudo -n tar -xzf - -C /opt/viveria/portfolio/releases/$release_id"

ssh -o BatchMode=yes "$ssh_target" sudo -n bash -s -- "$release_id" <<'REMOTE'
set -euo pipefail
root=/opt/viveria/portfolio
release_dir="$root/releases/$1"
exec 9>"$root/.deploy.lock"
flock 9
previous=''
if [[ -L "$root/current" ]]; then
  previous="$(readlink -f "$root/current")"
fi

docker compose -f "$release_dir/compose.production.yaml" config --quiet
docker compose -f "$release_dir/compose.production.yaml" \
  run --rm --no-deps -T --interactive=false \
  web caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

if ! docker compose -f "$release_dir/compose.production.yaml" \
  up -d --wait --wait-timeout 60; then
  if [[ -n "$previous" ]]; then
    docker compose -f "$previous/compose.production.yaml" \
      up -d --wait --wait-timeout 60
  fi
  exit 1
fi

ln -sfn "$release_dir" "$root/current"
printf 'Release: %s\nPreview: http://127.0.0.1:18080/es\n' "$release_dir"
REMOTE
