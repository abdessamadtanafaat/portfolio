# Architecture

## Tech Stack
- **Framework:** Next.js 14.2.35 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4 (darkMode: "class")
- **Animation:** Framer Motion
- **Database:** Turso/libSQL (SQLite)
- **ORM:** Drizzle ORM 0.45.2
- **Auth:** NextAuth v5 beta.31 (Credentials provider, JWT)
- **Testing:** Vitest + React Testing Library

## Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, ThemeProvider, metadata)
│   │   ├── page.tsx            # Homepage (async server component)
│   │   ├── globals.css         # Tailwind config, CSS variables, utilities
│   │   ├── projects/
│   │   │   ├── page.tsx        # Projects listing (async)
│   │   │   └── ProjectsPageContent.tsx  # Client filter grid
│   │   └── admin/
│   │       ├── layout.tsx      # Admin layout (sidebar, toast)
│   │       ├── page.tsx        # Dashboard
│   │       ├── login/page.tsx  # Login
│   │       ├── projects/       # CRUD
│   │       ├── skills/         # CRUD
│   │       ├── experiences/    # CRUD
│   │       ├── education/      # CRUD
│   │       ├── certificates/   # CRUD
│   │       ├── social-links/   # CRUD
│   │       ├── seo/            # CRUD
│   │       ├── personal-info/  # Edit
│   │       └── settings/       # Edit
│   ├── components/
│   │   ├── public/             # 11 public-facing components
│   │   ├── admin/              # Sidebar, DataTable
│   │   ├── ui/                 # Button, Input, Textarea, Select, Toast, etc.
│   │   ├── icons.tsx           # Custom SVG icons
│   │   └── providers/
│   │       └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── auth-config.ts      # NextAuth configuration
│   │   ├── auth.ts             # Re-export
│   │   ├── password.ts         # bcryptjs wrappers
│   │   ├── db/
│   │   │   ├── schema.ts       # Drizzle schema (13 tables)
│   │   │   ├── index.ts        # Lazy DB connection
│   │   │   └── utils.ts        # CRUD utilities
│   │   └── queries/
│   │       └── portfolio.ts    # Data fetcher + types
│   └── middleware.ts           # Auth route guard
├── __tests__/                  # 27 tests
├── scripts/seed.ts             # Database seed
└── docs/                       # Project documentation
```

## Data Flow
1. Server components fetch data via `getPortfolioData()` or direct DB queries
2. Data passed as props to client components
3. Client components handle interactivity (animations, forms, filters)
4. Admin forms submit to API routes
5. API routes validate auth via session cookie, then query DB

## Auth Flow
1. Login form → POST /api/auth/[...nextauth] → NextAuth Credentials provider
2. JWT stored in httpOnly cookie "admin-session"
3. Middleware checks cookie presence for /admin/* routes
4. Server components can call auth() for user info
