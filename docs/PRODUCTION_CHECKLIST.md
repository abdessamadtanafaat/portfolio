# Production Checklist

Verify every item before going live. Status reflects the current repository state.

## Build & Quality
- [x] `npm run build` passes
- [x] `npm run lint` passes (ESLint 9 flat config)
- [x] `npm test` passes (27/27 Vitest)
- [x] No TypeScript errors (`tsc --noEmit` clean via build)
- [x] No hydration errors (ThemeProvider/MotionProvider client boundaries correct)

## Functionality
- [x] Public homepage renders (`/en`, `/fr`, `/ar`) — 200
- [x] Hero, About, Experience, Projects, Skills, Education, Certificates, Languages, Volunteering, Soft Skills, Contact, Custom Sections render
- [x] Three featured projects (UGB, Multi-Tenant Back-Office, HR Application / ANCFCC)
- [x] Admin login works (`/en/admin/login`)
- [x] All admin CRUD operations work
- [x] Contact form validates + persists + emails (Resend)
- [x] Dark mode + light mode
- [x] Responsive (mobile → desktop)
- [x] Reduced-motion respected (`MotionConfig reducedMotion="user"`)

## SEO
- [x] Per-page `generateMetadata` (home + projects list + detail)
- [x] `hreflang` / language alternates
- [x] `sitemap.ts` generated (all locales)
- [x] `robots.ts` (allows `/`, blocks `/admin`, `/api`)
- [ ] Submit sitemap to Google Search Console / Bing Webmaster
- [ ] Add `NEXTAUTH_URL` (used as sitemap/robots base) = production domain
- [ ] Open Graph images (optional `opengraph-image`)

## i18n
- [x] `en` / `fr` / `ar` (RTL) routing
- [x] Translations present (`messages/*.json`)
- [x] Locale prefix redirect (`/` → `/en`) via `proxy.ts` + `next.config` redirect

## Security
- [x] `.env*.local` git-ignored
- [x] `local.db` added to `.gitignore` (run `git rm --cached local.db` to untrack)
- [x] `NEXTAUTH_SECRET` set (generate `openssl rand -base64 32`)
- [x] Admin password strong (12+ chars)
- [x] Mutations require `auth()`
- [ ] Close API CSRF gap (add origin check or move to Server Actions) — see SECURITY.md
- [ ] Escape contact email HTML fields — see SECURITY.md
- [ ] Rate-limit contact endpoint — see SECURITY.md
- [ ] Add CSP / HSTS / X-Frame-Options headers — see SECURITY.md

## Database
- [x] Turso (production) or SQLite (dev) connection
- [x] Schema migrated (`db:push` / `db:migrate`)
- [x] Admin user + content seeded (`db:seed`)
- [ ] Backups configured (Turso automatic; or scheduled `turso db shell` dump)
- [ ] Point-in-time recovery enabled (Turso)

## Environment (production)
- [ ] `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL` = https://your-domain
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`
- [ ] `RESEND_API_KEY` (contact form)
- [ ] `CONTACT_EMAIL`
- [ ] `EMAIL_FROM` (verified domain)
- [ ] `BLOB_READ_WRITE_TOKEN` (if using image uploads)

## Deployment
- [ ] Repository pushed to GitHub
- [ ] Vercel project imported, env vars set
- [ ] `db:push` + `db:seed` run against Turso
- [ ] Custom domain + HTTPS (auto on Vercel)
- [ ] Analytics (Plausible / Clarity / GA4) added (optional)
- [ ] Uptime monitoring (optional)
- [ ] Smoke test: login, edit content, submit contact, view public site

## Post-launch
- [ ] Change default admin password
- [ ] Rotate any test secrets
- [ ] Verify robots.txt + sitemap.xml are reachable
- [ ] Schedule periodic DB backups
