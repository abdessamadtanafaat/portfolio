# Design Analysis

## Current State Assessment

### Design System Foundation

| Token | Value | Usage |
|---|---|---|
| Primary | `brand-500..700` (orange) | CTAs, active states, focus rings |
| Accent | `accent-500..700` (green) | Skill bars, rarely used |
| Background | `slate-50` / `slate-950` | Light/dark page backgrounds |
| Surface | `white` / `slate-900` | Cards, panels |
| Border | `slate-200` / `slate-800` | Light/dark borders |
| Text primary | `slate-900` / `white` | Headings |
| Text secondary | `slate-500` / `slate-400` | Labels, descriptions |
| Error | `red-500..700` | Errors, danger actions |
| Success | `emerald-500` | Success toasts |

### Typography
- **Fonts loaded:** GeistVF + GeistMonoVF (layout.tsx)
- **Tailwind config references:** Inter (sans) + Space Grotesk (headings)
- **Mismatch:** Geist fonts loaded but not referenced in Tailwind config
- **Scale:** text-xs through text-6xl, used inconsistently

### Spacing
- Public: `section-padding` (py-20 lg:py-28), `container-px` (px-5 sm:px-8)
- Admin: ad-hoc p-6, space-y-6, max-w-2xl
- No consistent spacing scale

### Border Radius
- Cards: `rounded-xl` (admin) / `rounded-2xl` (glass-card)
- Inputs: `rounded-lg`
- Badges: `rounded-full`
- Inconsistent across surfaces

### Shadows
- Public: `shadow-lg` on cards, `shadow-xl` on modals
- Admin: no shadows on cards (border-only)
- Inconsistent elevation model

### Animations
- Framer Motion used throughout public components
- Custom keyframes: fade-in, slide-up, slide-down, scale-in
- Admin: Toast uses Framer Motion, ConfirmDialog uses Framer Motion
- No reduced-motion handling anywhere

---

## Component Inventory

### Public Components (11)
| Component | Client | Animations | Dark Mode | Responsive |
|---|---|---|---|---|
| Navbar | Yes | Scroll detection | Yes | Mobile hamburger |
| Hero | Yes | Framer Motion | Yes | Fluid |
| About | Yes | whileInView | Yes | Grid collapse |
| Skills | Yes | whileInView + bars | Yes | Grid collapse |
| Experience | Yes | whileInView | Yes | Timeline stacks |
| ProjectsSection | Yes | whileInView + hover | Yes | Grid collapse |
| ProjectsPageContent | Yes | AnimatePresence | Yes | Grid collapse |
| Education | Yes | whileInView | Yes | Two-col → stack |
| Certificates | Yes | whileInView | Yes | Grid collapse |
| Contact | Yes | whileInView | Yes | Two-col → stack |
| Footer | Yes | None | Yes | Four-col → stack |

### Admin Components (9)
| Component | Client | Purpose |
|---|---|---|
| Sidebar | Yes | Navigation |
| DataTable | Yes | Reusable table with search |
| Button | Yes | 5 variants, 4 sizes |
| Input | Yes | With error state |
| Textarea | Yes | With error state |
| Select | Yes | With label + error |
| Toast | Yes | 3 types, animated |
| ImagePreview | Yes | Image with fallback |
| ConfirmDialog | Yes | Modal (UNUSED) |

### Admin Pages (18)
All CRUD pages follow near-identical patterns with massive duplication.

---

## Layout Architecture

### Public
- Root layout: Geist fonts, ThemeProvider, metadata
- Pages: Server components fetching data, passing to client components
- Consistent section pattern: id + className section-padding

### Admin
- Admin layout: Conditional sidebar (skips login), ToastProvider
- Login: Standalone (no sidebar)
- List pages: Server components → DataTable or custom client
- Form pages: Client components with useEffect fetch (edit) or empty state (new)

---

## Color Usage Map

### Public Sections
| Section | Primary Accent | Secondary |
|---|---|---|
| Hero | brand-600 | slate gradients |
| Navbar | brand-500/600 | slate |
| About | brand, emerald, violet, amber | slate |
| Skills | category-specific colors | brand bars |
| Experience | brand dots, purple cards | slate |
| Projects | category colors (violet, brand, etc.) | status colors |
| Education | border-slate-300 | slate |
| Certificates | amber Award icon | slate |
| Contact | brand form, slate cards | social colors |
| Footer | brand tech pills | slate |

### Admin
| Area | Primary | Secondary |
|---|---|---|
| Sidebar | brand active | slate |
| Dashboard | brand, emerald, blue, violet, amber | slate |
| Forms | brand submit | slate |
| Tables | brand edit | red delete |
| Status badges | category-specific | slate |

---

## Key Design Issues

1. **Font mismatch** — Geist loaded but Tailwind references Inter/Space Grotesk
2. **No design tokens** — Colors, spacing, radius all ad-hoc
3. **Inconsistent elevation** — Public uses shadows, admin uses borders only
4. **No consistent container** — Different max-widths and padding everywhere
5. **Duplicate color maps** — Category/status colors defined in multiple files
6. **No loading states** — Public has none, admin has inconsistent text
7. **No skeleton patterns** — Missing for all async data
8. **Hardcoded data** — Certificates "in progress", footer tech pills
9. **SEO component** — Should use Next.js Metadata API
10. **All client components** — Public components could be server components
