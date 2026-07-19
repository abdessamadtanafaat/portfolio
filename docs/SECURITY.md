# Security

This document describes the security model of the portfolio/CMS and the findings from the pre-production audit, plus recommended hardening.

## Current security model

| Control | Implementation | Status |
|---------|----------------|--------|
| Password hashing | `bcryptjs`, cost 12 (`src/lib/password.ts`) | ✅ Strong |
| Session transport | JWT in HTTP-only, `secure` (prod), `sameSite: "lax"` cookie `admin-session` | ✅ |
| Session lifetime | 24h (`maxAge`) | ✅ Reasonable |
| Login rate limiting | 5 attempts / 15 min per email (in-memory, `admin/actions.ts`) | ⚠️ In-memory (resets on restart / per-instance) |
| Route guard | `proxy.ts` (locale) + `middleware.ts` (`/admin` cookie check) + `(protected)` group + `auth()` server check | ✅ Defense in depth |
| API auth | Every mutation (`POST/PUT/DELETE`) checks `auth()` → 401 | ✅ |
| Input validation | Zod schemas on contact + API write paths | ✅ |
| Secrets | `.env*.local` git-ignored; `NEXTAUTH_SECRET` for JWT | ✅ |
| Headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy`, DNS prefetch via `next.config.mjs` | ✅ Basic |
| Markdown rendering | `react-markdown` + `rehype-sanitize` where used | ✅ |

## Findings (audit)

1. **No CSRF protection on API write routes.** Mutations rely on the session cookie alone. Server Actions (login, contact) are protected by Next's same-origin guarantees, but the `/api/*` `POST/PUT/DELETE` endpoints are callable cross-site with a valid cookie. *(Severity: Medium — admin-only, but real.)*
2. **Contact email HTML is not escaped.** `src/app/api/contact/route.ts` interpolates `name`/`email`/`subject` into an HTML email template. A malicious submission can inject HTML/markup rendered by the recipient's mail client (stored XSS in mail). `message` body is currently placed in a code block but `name`/`subject` are inline. *(Severity: Low–Medium.)*
3. **No rate limiting on the public contact endpoint.** Allows automated spam/submission floods. *(Severity: Medium.)*
4. **Login rate limit is in-memory only.** On serverless (Vercel) each cold instance starts fresh; an attacker can bypass the 5/15 min limit by spreading attempts across invocations. *(Severity: Low on serverless.)*
5. **`local.db` is tracked in git.** The dev SQLite file was committed. It may contain a seeded admin password hash and should never be in version control. Fixed in `.gitignore` (run `git rm --cached local.db` to untrack). *(Severity: Low if no real secrets, but must be removed.)*
6. **Redundant middleware.** `proxy.ts` (active) and `middleware.ts` (legacy `/admin` guard) both register. Consolidate to avoid confusion/double runs. *(Severity: Low.)*
7. **`NEXTAUTH_URL` hardcoded to localhost in `.env.example`.** Must be set to the production domain or cookie/Session callbacks may misbehave. *(Severity: Low — operational.)*

## Recommendations (can enhance — yes)

- **Add CSRF/origin checks** to API write routes: verify `request.headers.get("origin")` equals `NEXTAUTH_URL` (or the host), or migrate admin mutations to Server Actions (which Next protects automatically).
- **Escape contact email fields** with a small HTML-escape helper (or use text/plain + a sanitized HTML part). Never interpolate raw user input into HTML.
- **Rate-limit the contact endpoint** (e.g., token bucket per IP using Upstash Redis free tier, or a simple KV store) and add a honeypot/hCaptcha.
- **Use a shared rate-limit store** (Upstash Redis / Vercel KV) for login attempts so the limit survives serverless instances.
- **Move admin API to Server Actions** where feasible to inherit Next's CSRF protection and reduce the cookie-auth surface.
- **Add security headers** via `next.config.mjs` `headers()`: `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (HSTS), `Permissions-Policy`.
- **Add 2FA** for admin accounts if multiple editors are introduced.
- **Rotate `NEXTAUTH_SECRET`** periodically and keep it unique per environment.
- **Keep `local.db` untracked** and add a pre-commit hook (or CI check) to block `.env*` and `*.db` from being committed.

## Is the site secure today?

For a **single-admin personal portfolio**, the current posture is **reasonable**: strong password hashing, HTTP-only secure cookies, server-checked auth on every mutation, validated inputs, and ignored secrets. The main gaps (API CSRF, contact HTML escaping, contact rate limiting) are real but low-impact for a personal site. They are worth closing before exposing the admin to the public internet at scale, and all are straightforward to implement.
