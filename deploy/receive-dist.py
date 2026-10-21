#!/usr/bin/env python3
"""Receive a static artifact through a restricted deployment SSH key."""

import fcntl
import gzip
import hashlib
import io
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import sys
import tarfile
from datetime import datetime, timezone


ROOT = Path('/opt/viveria/portfolio')
MAX_ARCHIVE = 32 * 1024 * 1024
MAX_CONTENT = 256 * 1024 * 1024


def compose(release, *arguments):
    subprocess.run(
        ['docker', 'compose', '-f', str(release / 'compose.production.yaml'),
         *arguments],
        check=True,
        stdin=subprocess.DEVNULL,
    )


def deploy():
    archive = sys.stdin.buffer.read(MAX_ARCHIVE + 1)
    if len(archive) > MAX_ARCHIVE:
        raise ValueError('The compressed artifact exceeds 32 MiB.')

    with gzip.GzipFile(fileobj=io.BytesIO(archive)) as compressed:
        content = compressed.read(MAX_CONTENT + 1)
    if len(content) > MAX_CONTENT:
        raise ValueError('The expanded archive exceeds 256 MiB.')

    with tarfile.open(fileobj=io.BytesIO(content), mode='r:') as bundle:
        members = []
        total = 0
        for member in bundle:
            path = PurePosixPath(member.name)
            if path.is_absolute() or '..' in path.parts:
                raise ValueError('Artifact paths must stay inside dist/.')
            if not (member.isfile() or member.isdir()):
                raise ValueError('Artifacts may contain only files and directories.')
            total += member.size
            members.append(member)
            if total > MAX_CONTENT or len(members) > 10_000:
                raise ValueError('The artifact exceeds the content limits.')

        timestamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
        digest = hashlib.sha256(archive).hexdigest()[:12]
        release = ROOT / 'releases' / f'{timestamp}-{digest}'
        release.mkdir()
        dist = release / 'dist'
        dist.mkdir()
        try:
            bundle.extractall(dist, members=members, filter='data')
            for filename in ('es/index.html', 'en/index.html', '404.html'):
                if not (dist / filename).is_file():
                    raise ValueError(f'Missing required static page: {filename}')
        except Exception:
            shutil.rmtree(release)
            raise

    previous = (ROOT / 'current').resolve(strict=True)
    shutil.copy2(previous / 'compose.production.yaml', release)
    shutil.copytree(previous / 'deploy', release / 'deploy')
    compose(release, 'config', '--quiet')
    try:
        compose(release, 'up', '-d', '--wait', '--wait-timeout', '60')
    except subprocess.CalledProcessError:
        compose(previous, 'up', '-d', '--wait', '--wait-timeout', '60')
        raise

    next_link = ROOT / '.current-ci'
    next_link.unlink(missing_ok=True)
    next_link.symlink_to(release)
    next_link.replace(ROOT / 'current')
    print(f'Deployed static artifact: {release.name}', flush=True)


if __name__ == '__main__':
    with (ROOT / '.deploy.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        try:
            deploy()
        except Exception as error:
            print(f'Deployment failed: {error}', file=sys.stderr)
            sys.exit(1)
