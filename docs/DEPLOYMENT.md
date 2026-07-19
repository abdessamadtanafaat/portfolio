# Deployment Guide

Complete guide to deploy the portfolio application from scratch.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js 16 App                 │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   Public UI   │  │      Admin Panel         │ │
│  │  (Portfolio)  │  │  (CMS Dashboard)         │ │
│  └──────┬───────┘  └──────────┬───────────────┘ │
│         │                     │                  │
│  ┌──────┴─────────────────────┴───────────────┐ │
│  │            Server Layer                     │ │
│  │  API Routes + Server Actions + Auth         │ │
│  └──────┬─────────────────────┬───────────────┘ │
│         │                     │                  │
│  ┌──────┴───────┐  ┌─────────┴───────────────┐ │
│  │   Database    │  │     Email Service        │ │
│  │  Turso/SQLite │  │     (Resend)             │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 19, Tailwind CSS | Portfolio UI + Admin CMS |
| Backend | Next.js API Routes + Auth.js | Auth, CRUD, Contact form |
| Database | Turso (libSQL) / SQLite | All persistent data |
| Auth | Auth.js v5 (beta) | JWT-based admin authentication |
| Email | Resend | Contact form email delivery |
| Storage | Vercel Blob | Image uploads (projects, certificates) |
| Linting | ESLint 9 (flat config) | Code quality |

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20.19+ or 22.13+ or 24+ |
| npm | 10+ |
| Database | Turso (production) or SQLite file (development) |
| Resend account | Free tier sufficient |

---

## Installation

### 1. Clone and install

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment Variables](#environment-variables)).

### 3. Set up database

**Development (local SQLite):**

```bash
npm run db:push    # Push schema to local.db
npm run db:seed    # Create admin user + sample data
```

**Production (Turso):**

```bash
# Create a Turso database at https://turso.tech
# Then push schema:
TURSO_DATABASE_URL=libsql://your-db.turso.io TURSO_AUTH_TOKEN=your-token npm run db:push
npm run db:seed
```

### 4. Build and run

```bash
npm run build     # Verify production build
npm run dev       # Start development server at http://localhost:3000
```

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Database connection string | `libsql://your-db.turso.io` or `file:local.db` |
| `TURSO_AUTH_TOKEN` | Turso auth token (empty for local SQLite) | `your-turso-token` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application base URL | `https://your-domain.com` |
| `ADMIN_EMAIL` | Admin login email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin login password (min 12 chars) | `your-secure-password` |
| `ADMIN_NAME` | Admin display name | `Your Name` |

### Optional — Contact Form (Resend)

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key (get at resend.com) | `re_xxxxxxxxxxxx` |
| `CONTACT_EMAIL` | Where contact form messages are sent | `you@gmail.com` |
| `EMAIL_FROM` | Sender email (optional — uses `onboarding@resend.dev` in dev if not set) | `Portfolio <noreply@yourdomain.com>` |

### Optional — Storage

| Variable | Description | Example |
|----------|-------------|---------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for image uploads | `vercel_blob_rw_token...` |

### Optional — Revalidation

| Variable | Description | Example |
|----------|-------------|---------|
| `REVALIDATION_SECRET` | Secret for cache revalidation webhooks | `your-random-string` |

---

## Database

### Tables

| Table | Purpose |
|-------|---------|
| `admin_user` | Admin credentials, last login |
| `personal_info` | Name, title, bio, contact info |
| `site_settings` | Site name, favicon, analytics |
| `homepage_content` | Hero section, section visibility/order |
| `seo_settings` | Per-page SEO metadata |
| `projects` | Portfolio projects |
| `project_images` | Project images |
| `technologies` | Technology stack items |
| `project_technologies` | Project-technology relationships |
| `skills` | Skills with proficiency levels |
| `experiences` | Work experience entries |
| `education` | Education entries |
| `certificates` | Certificates and certifications |
| `social_links` | Social media links |
| `contact_messages` | Contact form submissions |

### Migrations

```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (visual DB browser)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run pending migrations
```

### Backups

**Turso:** Automatic backups included. Use `turso db shell` for manual dumps.

**SQLite (development):**

```bash
cp local.db local.db.backup
```

> `local.db` is a development-only file and is git-ignored (see `.gitignore`). Never commit it — it may contain a seeded admin password hash. If it was previously tracked, untrack it with `git rm --cached local.db`.

### Production Recommendations

- Use Turso for managed SQLite with replication
- Enable point-in-time recovery on Turso
- Periodically back up the database
- Monitor database size

---

## Authentication

### How It Works

- **Strategy:** JWT (JSON Web Tokens) stored in HTTP-only cookies
- **Cookie name:** `admin-session`
- **Session duration:** 24 hours
- **Password hashing:** bcryptjs with 12 salt rounds
- **Protection:** `proxy.ts` (Next 16 locale/routing proxy, the active middleware) + legacy `middleware.ts` cookie check on all `/admin/*` routes (except `/admin/login`)
- **Rate limiting:** 5 login attempts per 15 minutes per email

### Admin Access

1. Navigate to `/admin/login` (not linked from public site)
2. Enter admin credentials
3. Session cookie is set, redirect to dashboard

### Creating Additional Administrators

```bash
# Option 1: Use the seed script (resets all data)
ADMIN_EMAIL=new@user.com ADMIN_PASSWORD=new-password ADMIN_NAME="New User" npm run db:seed

# Option 2: Direct database modification
npm run db:studio
# Insert into admin_user table with bcryptjs hashed password
```

### Resetting Password

```bash
# Generate hash for new password
node -e "const b = require('bcryptjs'); console.log(b.hashSync('new-password', 12))"

# Update in database via Drizzle Studio
npm run db:studio
# Update password_hash in admin_user table
```

### Session Configuration

In `src/lib/auth-config.ts`:

```typescript
session: {
  strategy: "jwt",
  maxAge: 60 * 60 * 24,  // 24 hours
},
cookies: {
  sessionToken: {
    name: "admin-session",
    options: {
      httpOnly: true,                                    // Prevents XSS access
      secure: process.env.NODE_ENV === "production",     // HTTPS only in production
      sameSite: "lax",                                   // CSRF protection
    },
  },
},
```

### Security Features

| Feature | Status | Details |
|---------|--------|---------|
| Password hashing | ✅ | bcryptjs, 12 rounds |
| HTTP-only cookies | ✅ | Prevents JavaScript access |
| Secure flag | ✅ | HTTPS-only in production |
| SameSite | ✅ | Lax mode for CSRF protection |
| JWT expiry | ✅ | 24-hour session lifetime |
| Middleware protection | ✅ | All /admin/* routes checked |
| Server-side auth check | ✅ | Protected layout verifies session |
| Rate limiting | ✅ | 5 attempts / 15 min per email |
| Custom login page | ✅ | No default NextAuth pages exposed |

### Recommendations for High-Security

- Add account lockout after repeated failures (currently: rate limiting)
- Add IP-based rate limiting at reverse proxy level
- Consider adding 2FA for multi-admin scenarios
- Rotate NEXTAUTH_SECRET periodically
- Use environment-specific secrets (never commit to git)

---

## Contact Email (Resend)

### Setup

1. Create account at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_your_api_key
CONTACT_EMAIL=tanafaatabdessamad@gmail.com
EMAIL_FROM="Portfolio Contact <noreply@yourdomain.com>"
```

### How It Works

1. User submits contact form on portfolio
2. Server Action validates input (Zod schema)
3. Message is saved to `contact_messages` table
4. Email is sent via Resend API to `CONTACT_EMAIL`
5. Success/error response returned to frontend

### Changing Recipient

Update `CONTACT_EMAIL` in your environment variables.

### Custom Domain (Production)

1. Add your domain to Resend dashboard
2. Verify DNS records (MX, TXT, CNAME)
3. Update `EMAIL_FROM` to use your verified domain:

```bash
EMAIL_FROM="Portfolio Contact <noreply@yourdomain.com>"
```

### Free Tier Limits

- 100 emails/day
- 3,000 emails/month
- Resend branding on emails

### Troubleshooting

| Issue | Solution |
|-------|----------|
| No emails received | Check `RESEND_API_KEY` is set |
| "Email not configured" warning | Set `CONTACT_EMAIL` |
| Emails in spam | Verify domain in Resend, add SPF/DKIM |
| Rate limit errors | Upgrade Resend plan or wait |

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add RESEND_API_KEY
vercel env add CONTACT_EMAIL
# ... etc
```

**Vercel-specific notes:**
- Turso works perfectly with Vercel Edge Runtime
- Vercel Blob requires `BLOB_READ_WRITE_TOKEN`
- Automatic preview deployments on PRs
- Custom domain support included

### Option 2: Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Build with standalone output:

```bash
# next.config.js
module.exports = { output: "standalone" }
```

### Option 3: VPS (PM2)

```bash
# On your server
git clone <repo>
cd portfolio
npm install
npm run build
npm run db:push
npm run db:seed

# Start with PM2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

### Option 4: Static Export (Limited)

Not recommended — the app requires server-side features (auth, API routes, Server Actions).

---

## Free Services & Estimated Costs

The entire stack can run on free tiers:

| Service | Purpose | Free tier | Cost |
|---------|---------|-----------|------|
| **GitHub** | Git hosting, CI | Unlimited public/private repos | $0 |
| **Vercel** | Next.js hosting, HTTPS, preview deploys | 100 GB bandwidth/mo, serverless functions | $0 (Hobby) |
| **Turso** | libSQL database | 9 GB storage, 1 B group, daily backups | $0 |
| **Resend** | Contact emails | 3,000 emails/mo, 100/day | $0 |
| **Cloudflare** | DNS, HTTPS, optional caching | Full free plan | $0 |
| **Google Search Console / Bing** | SEO indexing | Free | $0 |
| **Microsoft Clarity / Plausible / GA4** | Analytics | Free tiers | $0 |
| **Vercel Blob** | Image uploads (optional) | 1 GB storage, 1 GB transfer | $0 (then paid) |

**Bottom line:** a personal portfolio can be hosted **entirely free**. Only paid upgrades are needed at scale (high traffic, high email volume, large media storage).

---

## SEO Files (sitemap & robots)

The app ships `src/app/sitemap.ts` and `src/app/robots.ts`:

- `sitemap.xml` is generated for every locale (`/en`, `/fr`, `/ar`) + projects.
- `robots.txt` allows `/` and blocks `/admin` and `/api`.

Both read `NEXTAUTH_URL` as the base URL — **set it to your production domain** so absolute URLs are correct. After deploy, submit `https://your-domain/sitemap.xml` to Google Search Console.

---

## Backend Deployment

The application uses an **integrated Next.js backend** — there is no separate backend server.

| Feature | Implementation |
|---------|---------------|
| API Routes | `/api/*` endpoints for CRUD operations |
| Server Actions | Contact form, admin login |
| Auth | NextAuth v5 with JWT cookies |
| Database | Turso/SQLite via Drizzle ORM |
| Email | Resend API |

All backend logic runs within the Next.js server process. Deploy as a single unit.

---

## Admin Panel

### Access

Navigate to `/admin/login` (not linked from public site).

### Protected Routes

All routes under `/admin/*` (except `/admin/login`) are protected by:
1. **Middleware:** Checks for session cookie, redirects to login if missing
2. **Layout:** Server-side `auth()` call, redirects if no session

### Available Sections

| Section | URL | Purpose |
|---------|-----|---------|
| Dashboard | `/admin` | Overview stats |
| Projects | `/admin/projects` | Manage portfolio projects |
| Skills | `/admin/skills` | Manage skills |
| Experience | `/admin/experiences` | Work experience |
| Education | `/admin/education` | Education history |
| Certificates | `/admin/certificates` | Certifications |
| Social Links | `/admin/social-links` | Social media profiles |
| SEO | `/admin/seo` | Search engine metadata |
| Settings | `/admin/settings` | Site-wide settings |
| Personal Info | `/admin/personal-info` | Name, bio, contact |

### Logout

Click "Déconnexion" in the sidebar. Session cookie is cleared.

---

## Production Checklist

### Environment

- [ ] All environment variables configured
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] `RESEND_API_KEY` is set and valid
- [ ] `CONTACT_EMAIL` is set to recipient address
- [ ] `EMAIL_FROM` uses verified domain
- [ ] `BLOB_READ_WRITE_TOKEN` is set (if using image uploads)

### Database

- [ ] Schema pushed to production database
- [ ] Admin user seeded
- [ ] Database backups configured
- [ ] Point-in-time recovery enabled (Turso)

### Security

- [ ] HTTPS enabled (automatic on Vercel, manual on VPS)
- [ ] Admin password is strong (12+ characters)
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to git
- [ ] Rate limiting active on login
- [ ] CORS configured (if needed)

### Testing

- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] Login works at `/admin/login`
- [ ] Contact form sends email
- [ ] All admin CRUD operations work
- [ ] Public pages render correctly
- [ ] Dark mode works
- [ ] Mobile responsive

### Monitoring

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (if using)
- [ ] Uptime monitoring configured
- [ ] Database monitoring (Turso dashboard)

---

## Troubleshooting

### Login doesn't work

1. Check `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Verify admin user exists: `npm run db:studio`
4. Check browser console for errors
5. Verify cookie is being set (DevTools > Application > Cookies)

### Contact form doesn't send email

1. Verify `RESEND_API_KEY` is set
2. Verify `CONTACT_EMAIL` is set
3. Check Resend dashboard for email logs
4. Verify domain in Resend (for production)
5. Check server logs for errors

### Database connection fails

1. Verify `TURSO_DATABASE_URL` is correct
2. Verify `TURSO_AUTH_TOKEN` is valid (for Turso)
3. For local: ensure `local.db` file exists
4. Run `npm run db:push` to sync schema

### Build fails

1. Clear `.next` cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Check for missing environment variables

### Images not uploading

1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check Vercel Blob dashboard for token validity
3. Ensure token has read/write permissions

---

## Support

For issues with:
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Turso:** [turso.tech/docs](https://turso.tech/docs)
- **Resend:** [resend.com/docs](https://resend.com/docs)
- **Drizzle ORM:** [orm.drizzle.team/docs](https://orm.drizzle.team/docs)
