# Docker

Production-like image for this Next.js portfolio. The app listens on `0.0.0.0:3000` inside the container so it is reachable from the host.

## Files

| File | Role |
|------|------|
| `Dockerfile` | Multi-stage build → standalone Next.js, non-root user |
| `docker-compose.yml` | Port publish, `env_file`, data volume |
| `.env.docker.example` | Template for runtime secrets |
| `.dockerignore` | Keeps secrets and `node_modules` out of the build context |

## Quick start

```bash
cd /Users/mac/Desktop/kimchi-portfolio/portfolio

cp .env.docker.example .env.docker
# Edit .env.docker: NEXTAUTH_SECRET, TURSO_*, NEXTAUTH_URL=http://localhost:3000

# Create schema + admin once (from the host, same Turso credentials as .env.docker)
export $(grep -v '^#' .env.docker | xargs)   # or copy values into .env.local
npm run db:push
npm run db:seed

docker compose up --build -d
open http://localhost:3000/en
```

Admin login: `/en/admin/login` (email/password from seed / `ADMIN_*`).

## Environment

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXTAUTH_URL` | yes | Must match the URL in the browser (`http://localhost:3000`) |
| `NEXTAUTH_SECRET` | yes | `openssl rand -base64 32` |
| `TURSO_DATABASE_URL` | yes | Turso `libsql://…` or `file:/app/data/local.db` |
| `TURSO_AUTH_TOKEN` | for Turso | Empty for local file URL |
| `NEXT_PUBLIC_SITE_URL` | recommended | Build arg + runtime; used in emails/links |
| `HOST_PORT` | no | Host port mapped to 3000 (default `3000`) |
| `AUTH_TRUST_HOST` | set in Compose | Allows Auth.js behind Docker |

Do **not** bake secrets into the image. Compose injects them at **runtime** via `.env.docker`.

## Useful commands

```bash
docker compose logs -f portfolio
docker compose ps
docker compose down
# rebuild after code changes
docker compose up --build -d
```

## Build without secrets (k3s-ready)

The image must build with **no** real `.env`. Secrets are injected at **runtime** (Docker Compose `env_file`, or Kubernetes `env` / `Secret`).

```bash
# Build only (no .env.docker required)
docker build -t portfolio:local .

# Or
docker compose build
```

At runtime on k3s, set at least:

- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (public URL of the Ingress)
- `AUTH_TRUST_HOST=true`
- optional: `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL` (rebuild image if you change `NEXT_PUBLIC_*`)

`RESEND_API_KEY` is read only when sending mail (lazy client). Missing key at build no longer breaks `next build`.

## Design choices

- **`output: "standalone"`** in `next.config.mjs` — small runtime image.
- **Non-root** user `nextjs` (uid 1001).
- **`HOSTNAME=0.0.0.0`** — without this, Next may bind only loopback and the published port looks “dead”.
- **Volume `/app/data`** — only needed if you use `file:/app/data/local.db`.
- Schema/seed stay on the **host** (or CI) against Turso; the slim image does not ship `tsx` / drizzle-kit.
