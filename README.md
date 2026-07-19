# Portfolio — Abdessamad Tanafaat

A bilingual (EN / FR / AR) personal portfolio and CMS built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Framer Motion**, **Drizzle ORM** and **Turso (libSQL)**. The public site is fully editable from a built-in admin dashboard (CMS), with Auth.js v5 authentication, contact form (Resend), and SEO metadata management.

## Highlights

- **Public site**: Hero (rich branded background), About, Experience, Projects, Skills, Education, Certificates, Languages, Volunteering, Soft Skills, Custom Sections, Contact.
- **Design system**: unified `SectionShell` / `SectionHeader`, clean Apple/Linear/Vercel-style light surfaces, elegant dark mode, brand-orange (`#ed8116`) + violet accents, GPU-accelerated Framer Motion (scroll reveals, magnetic CTAs, tilt cards).
- **CMS / Admin**: dashboard + CRUD for every content type, drag reordering, file uploads (Vercel Blob), SEO editor, site settings, maintenance mode.
- **i18n**: `en` / `fr` / `ar` (RTL) with locale-prefixed routing (`/en`, `/fr`, `/ar`).
- **Auth**: Auth.js v5 credentials, JWT in HTTP-only cookies, bcrypt (cost 12), login rate limiting.
- **Contact**: validated server action + API, persisted to DB, emailed via Resend.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Turso + Auth + (optional) Resend values
npm run db:push              # create schema (local SQLite by default)
npm run db:seed              # seed admin user + sample content
npm run dev                  # http://localhost:3000  → redirects to /en
```

Admin: `/en/admin/login` (email/password from `.env.local`, default `admin@portfolio.com` / `admin123`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm test` | Vitest (27 tests) |
| `npm run db:push` / `db:generate` / `db:migrate` / `db:studio` | Drizzle schema management |
| `npm run db:seed` / `db:verify` | Seed / verify database |

## Deploy (free)

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for a full step-by-step guide using **Vercel + Turso + Resend** (all generous free tiers). Short version:

1. Push to GitHub.
2. Import the repo on **Vercel** (zero config, Next.js detected).
3. Create a **Turso** database, set `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` in Vercel project env.
4. Generate `NEXTAUTH_SECRET`, set `NEXTAUTH_URL` to your Vercel domain.
5. Run `db:push` + `db:seed` against Turso (see deployment guide).
6. (Optional) Resend for the contact form.

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — install, env vars, DB, auth, deploy, troubleshooting.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, structure, data/auth/animation flow.
- [`docs/SECURITY.md`](docs/SECURITY.md) — security model, findings, hardening recommendations.
- [`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md) — pre-launch verification.
- [`docs/CHECKLIST.md`](docs/CHECKLIST.md) — historical work checklist.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 3.4 · Framer Motion 12 · Drizzle ORM 0.45 · @libsql/client · Auth.js v5 (beta) · next-intl 4 · Resend · lucide-react · Vitest.

> Database content (projects, bio, etc.) is the **source of truth** and fully editable from the CMS — no code changes needed to update the site.
