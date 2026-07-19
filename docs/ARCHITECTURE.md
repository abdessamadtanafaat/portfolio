# Architecture

## Tech Stack
- **Framework:** Next.js 16.2.10 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **UI:** React 19
- **Styling:** Tailwind CSS 3.4 (`darkMode: "class"`)
- **Animation:** Framer Motion 12.42 (`LazyMotion` + `MotionConfig reducedMotion="user"`)
- **Database:** Turso / libSQL (SQLite-compatible), dev fallback to `file:local.db`
- **ORM:** Drizzle ORM 0.45.2
- **Auth:** Auth.js v5 (beta.31) — Credentials provider, JWT in HTTP-only cookies
- **i18n:** next-intl 4 · `en` / `fr` / `ar` (RTL) with locale-prefixed routing
- **Email:** Resend 6
- **Icons:** lucide-react, custom SVG icon set
- **Testing:** Vitest 3 + React Testing Library (27 tests)
- **Lint:** ESLint 9 (flat config, `eslint-config-next`)

## Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout: fonts, ThemeProvider, MotionProvider
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # Locale layout: getPortfolioData, LocaleProvider, LayoutShell
│   │   │   ├── page.tsx          # Homepage (async server component, PageTransition)
│   │   │   ├── projects/         # Public projects list + [slug] detail
│   │   │   └── admin/
│   │   │       ├── login/        # Auth.js sign-in page
│   │   │       └── (protected)/  # CMS dashboard + CRUD for every entity
│   │   ├── api/                  # REST CRUD + contact + auth handlers
│   │   ├── sitemap.ts            # Generated sitemap (all locales)
│   │   ├── robots.ts             # robots.txt (blocks /admin, /api)
│   │   ├── maintenance/          # Maintenance mode page
│   │   └── globals.css           # Tailwind layers, design tokens, section surfaces
│   ├── components/
│   │   ├── public/               # Hero, SectionShell, SectionHeader, ProjectsSection,
│   │   │                         #   About, Experience, Skills, Education, Certificates,
│   │   │                         #   Languages, Volunteering, SoftSkills, Contact,
│   │   │                         #   CustomSection, Navbar, Footer, MagneticButton, PageTransition
│   │   ├── admin/                # Sidebar, DataTable, editors, LayoutShell, actions
│   │   ├── effects/              # ScrollReveal, TiltCard, FloatingOrbs, GradientOrbs,
│   │   │                         #   AuroraBackground, ParticleField
│   │   ├── providers/            # ThemeProvider, MotionProvider, LocaleProvider
│   │   ├── ui/                   # Button, Input, Textarea, Select, Toast, Skeleton, ...
│   │   └── icons.tsx
│   ├── lib/
│   │   ├── auth-config.ts        # Auth.js configuration (credentials, JWT, cookies)
│   │   ├── auth.ts               # Re-export
│   │   ├── password.ts           # bcryptjs wrappers
│   │   ├── motion.ts             # Centralized motion tokens (eases, springs, variants)
│   │   ├── db/                   # schema.ts, index.ts (lazy client), utils.ts
│   │   ├── queries/portfolio.ts  # Data fetchers + types
│   │   ├── api/                  # API helpers
│   │   └── constants/ utils/
│   ├── i18n/                     # config.ts, request.ts, translation hooks
│   ├── proxy.ts                  # Locale redirect + routing proxy (Next 16 middleware)
│   ├── middleware.ts             # Legacy /admin cookie guard (see note below)
│   └── scripts/seed.ts, verify.ts
├── drizzle/                      # Generated migrations
├── __tests__/                    # 27 Vitest tests
└── docs/                         # Documentation
```

> **Note on `middleware.ts` vs `proxy.ts`:** Next 16 prefers `proxy.ts` (currently active — the build reports "Proxy (Middleware)"). The legacy `middleware.ts` only guards `/admin/*` via cookie presence. For clarity and to avoid double-registration, `proxy.ts` should absorb the `/admin` guard and `middleware.ts` removed. This is a cleanup item, not a functional bug.

## Data Flow
1. Server components fetch via `getPortfolioData()` (per-locale) or direct Drizzle queries.
2. Data is passed as props to client components.
3. Client components handle interactivity (animations, forms, filters, reordering).
4. Admin forms submit to REST API routes or Server Actions.
5. API routes validate the session cookie (`auth()`) for mutations; GET is public.

## Auth Flow
1. Login form → Server Action → `signIn("credentials")` → Auth.js Credentials provider (bcrypt verify).
2. JWT stored in HTTP-only, secure (prod), SameSite=Lax cookie `admin-session`.
3. `proxy.ts` / `middleware.ts` checks cookie presence for `/admin/*`.
4. `(protected)` route group + `auth()` server check finalize the guard.

## Animation System
- `MotionProvider` wraps the app (`LazyMotion` + `MotionConfig reducedMotion="user"`).
- `lib/motion.ts` holds shared eases/springs/variants (`fadeUp`, `staggerContainer`, `headerReveal`, hover lifts).
- `ScrollReveal` uses `whileInView` (GPU transform) with stagger; `TiltCard` is spring-smoothed; `MagneticButton` for hero CTAs; `Navbar` uses an animated `layoutId` active pill.

## Design System
- `SectionShell` provides consistent vertical rhythm + clean surfaces (no colored gradients on non-hero sections).
- `SectionHeader` standardizes the eyebrow → title → subtitle pattern.
- Hero keeps its rich branded background (orbs, mesh gradient, particles); all other sections use whitespace + subtle neutral surfaces + hairline dividers.
- Theme tokens in `globals.css` (`--background`, brand palette, `--card`).
```
