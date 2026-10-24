# syntax=docker/dockerfile:1
# Multi-stage production image for the Next.js portfolio.
# Build:  docker compose build
# Run:    docker compose up -d
# Env:    copy .env.docker.example → .env.docker (never commit secrets)

ARG NODE_VERSION=22

# -----------------------------------------------------------------------------
# Base
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# -----------------------------------------------------------------------------
# Dependencies (cached when package-lock.json unchanged)
# -----------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined at build time — pass via --build-arg when the public URL is known.
# Secrets (TURSO_*, NEXTAUTH_SECRET, RESEND_*) must NOT be present at build; inject at runtime (Compose / k3s Secret).
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# No secrets here — Turso / NEXTAUTH_SECRET / RESEND come from k3s Secret at runtime.
RUN npm run build

# -----------------------------------------------------------------------------
# Production runner (minimal, non-root)
# -----------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Bind all interfaces so the app is reachable from outside the container
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs \
  && mkdir -p /app/data \
  && chown -R nextjs:nodejs /app

# Public assets
COPY --from=builder /app/public ./public

# Standalone server (includes only required node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/en >/dev/null || exit 1

CMD ["node", "server.js"]
