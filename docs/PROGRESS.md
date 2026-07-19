# Progress Log

## 2026-07-18

### Phase 4: Product Redesign & Hardening — COMPLETED

#### Critical Fixes
- Moved `bcryptjs` from devDependencies to dependencies (production crash)
- Created `/projects/[slug]/page.tsx` — dead detail links now work
- Created `src/middleware.ts` — admin routes protected at middleware level
- Fixed skills proficiency scale mismatch (public showed `/5`, admin used 0-100%)

#### Code Cleanup
- Removed unused imports: `Link`, `Plus`, `Pencil`, `Code`, `Search`, `useState` from admin skills page
- Removed unused `now` variable from admin dashboard
- Deleted dead `SEO.tsx` component (163 lines, never imported)
- Fixed unescaped entities in Contact.tsx
- Added `eslint-disable-next-line` for unused `name` prop in About.tsx

#### Complete Design System (Premium SaaS aesthetic)
- Rewrote `globals.css` with CSS variables for light/dark mode (background, foreground, muted, border, ring, card, popover, destructive, success, info)
- Added reusable component classes: `.glass-card`, `.card-hover`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.input-field`, `.label-text`, `.badge`, `.badge-brand`, `.badge-success`, `.badge-warning`, `.badge-info`, `.badge-neutral`, `.divider`, `.chip`, `.page-container`
- Extended `tailwind.config.ts` with: muted colors, card colors, border colors, ring colors, 3xl border-radius, glow/elevated shadows, shimmer/pulse-soft animations, stagger utilities
- Updated `layout.tsx` with `font-sans` class on body

#### Public Component Redesign
- **Navbar**: Premium glass morphism (bg-white/70 + backdrop-blur-xl), subtle border, pill-style active indicators, refined mobile menu with translate animation
- **Hero**: Subtle grid pattern, radial brand glow, cleaner CTA buttons using `.btn-primary`/`.btn-secondary`, social icons as bordered squares, ArrowDown icon replace inline SVG
- **Footer**: Cleaner typography hierarchy (uppercase tracking-wider headings), bordered social icons, separated copyright section
- **About**: Updated card hover effects (`.card-hover`), consistent timing functions
- **Experience**: Thinner timeline line (w-px), smaller dots, refined tech pills as neutral chips
- **Skills**: Thinner progress bars (h-1.5), tabular-nums percentages, neutral chip styling for tech stack
- **Education**: Compact certificate cards with `.card-hover`
- **Certificates**: Refined card layout with gradient icons, cleaner date display
- **Projects (homepage)**: Smaller badges, cleaner card layout, `.card-hover` effects
- **Projects (listing page)**: Cleaner filter buttons, refined card grid, fixed GitHub link to use `project.repoUrl`
- **Contact**: Form inputs use `.input-field`, submit button uses `.btn-primary`

#### Admin Redesign
- **Sidebar**: Compact with AT logo, borderless nav items with subtle hover, rounded-xl mobile toggle
- **Dashboard**: Cleaner gradient hero, `.glass-card` cards, `.card-hover` effects, uppercase tracking-wider section headers
- **Login**: Centered AT logo, cleaner card with `.input-field`/`.btn-primary`, removed inline styles

#### New Components
- `src/components/ui/Skeleton.tsx` — DashboardSkeleton, ListSkeleton, CardSkeleton
- `src/app/admin/loading.tsx` — Admin loading state
- `src/app/projects/loading.tsx` — Projects loading state

#### Build Verification
- Build: PASS (zero errors, only 1 ESLint warning)
- Tests: 27/27 passing
- 38 routes generated successfully

---

## 2026-07-17

### Phase 1: Foundation Fixes — COMPLETED
- Fixed Toast `nextId` bug (let → useRef)
- Added aria-label to Toast dismiss button
- Created `src/lib/constants.ts` with all design tokens (categories, statuses, platforms, labels, colors)
- Fixed font configuration (tailwind.config.ts now references Geist font variables loaded in layout.tsx)
- Standardized all form spacing to space-y-6 (was mixed space-y-4/6)

### Phase 2: Form Architecture — COMPLETED
- Created `EntityForm` component (`src/components/admin/EntityForm.tsx`)
  - Handles both create and edit modes
  - Declarative field configuration (text, textarea, select, number, checkbox, date, image)
  - Built-in ConfirmDialog for delete operations
  - Toast notifications for all operations
  - Image preview for image fields
  - Loading/error/saving states
  - onTransformSubmit/onTransformLoad hooks for data conversion
- Refactored all 12 CRUD forms to use EntityForm:
  - Projects (new + edit): 157→40 lines, 223→41 lines
  - Skills (new + edit): 88→30 lines, 115→33 lines
  - Experiences (new + edit): 123→42 lines, 178→53 lines
  - Education (new + edit): 104→36 lines, 145→47 lines
  - Certificates (new + edit): 97→36 lines, 137→42 lines
  - Social Links (new + edit): 90→30 lines, 132→33 lines
- Total: ~1,500 lines of duplicate code eliminated
- All delete operations now use ConfirmDialog instead of window.confirm()
- All delete operations now have proper try/catch error handling

### Phase 3: Accessibility & Polish — COMPLETED
- Added scope="col" to all DataTable th elements
- Added aria-label to all search inputs (DataTable, SkillsListClient, SeoListClient)
- Added aria-label="Delete entry" to SEO icon-only delete button
- Added aria-label="Dismiss" to Toast close button

### Files Modified
- src/components/ui/Toast.tsx (bug fix + aria)
- src/components/admin/DataTable.tsx (accessibility)
- src/components/admin/EntityForm.tsx (new)
- src/lib/constants.ts (new)
- tailwind.config.ts (font fix)
- src/app/admin/projects/new/page.tsx (refactored)
- src/app/admin/projects/[id]/page.tsx (refactored)
- src/app/admin/skills/new/page.tsx (refactored)
- src/app/admin/skills/[id]/page.tsx (refactored)
- src/app/admin/experiences/new/page.tsx (refactored)
- src/app/admin/experiences/[id]/page.tsx (refactored)
- src/app/admin/education/new/page.tsx (refactored)
- src/app/admin/education/[id]/page.tsx (refactored)
- src/app/admin/certificates/new/page.tsx (refactored)
- src/app/admin/certificates/[id]/page.tsx (refactored)
- src/app/admin/social-links/new/page.tsx (refactored)
- src/app/admin/social-links/[id]/page.tsx (refactored)
- src/app/admin/seo/SeoListClient.tsx (accessibility)
- src/app/admin/skills/SkillsListClient.tsx (accessibility)
- src/app/admin/personal-info/PersonalInfoForm.tsx (spacing)
- src/app/admin/settings/SettingsForm.tsx (spacing)

### Verification
- Build: PASS
- Tests: 27/27 PASS

### Remaining
- Phase 4: Centralize color maps usage in public components
- Phase 4: Clean up duplicate code between ProjectsSection and ProjectsPageContent
