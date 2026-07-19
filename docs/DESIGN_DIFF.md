# Design Diff — Current vs Target

## The reference and target are the same project.

Since both paths point to `/Users/mac/Desktop/kimchi-portfolio`, the "reference design" IS the current design. This means the task is to **elevate the current design to a professional, production-quality standard** while preserving all business logic.

---

## Identified Gaps

### 1. Font System (CRITICAL)
- **Current:** Geist fonts loaded in layout.tsx, but tailwind.config.ts references Inter/Space Grotesk
- **Impact:** Tailwind `font-sans` and `font-heading` don't resolve to loaded fonts
- **Fix:** Align tailwind.config.ts font families with Geist, or switch to Inter/Space Grotesk

### 2. Design Token System (HIGH)
- **Current:** Colors hardcoded in individual components
- **Missing:** Centralized constants file for category colors, status colors, labels
- **Impact:** 5+ files define duplicate color maps
- **Fix:** Create `src/lib/constants.ts` with all shared design tokens

### 3. Loading States (HIGH)
- **Current:** Public — no loading states. Admin — inconsistent "Loading..." text
- **Missing:** Skeleton loaders for all async data
- **Fix:** Create Skeleton primitives, add to all data-dependent views

### 4. Error Boundaries (HIGH)
- **Current:** No error boundaries anywhere
- **Missing:** Error handling for failed data loads
- **Fix:** Add error.tsx files for key routes

### 5. Form Duplication (HIGH)
- **Current:** 12 create/edit pages with 95%+ identical JSX (~600 duplicate lines)
- **Missing:** Generic form component
- **Fix:** Create `EntityForm` component parameterized by field config

### 6. ConfirmDialog Integration (MEDIUM)
- **Current:** ConfirmDialog component exists but is never used. All deletes use window.confirm()
- **Fix:** Replace all window.confirm() with ConfirmDialog

### 7. Toast Bug (CRITICAL)
- **Current:** `nextId` in Toast.tsx resets on every render (should be useRef)
- **Fix:** Change to useRef(0)

### 8. Delete Error Handling (HIGH)
- **Current:** Skills, Experiences, Education, Certificates delete operations have no try/catch
- **Fix:** Add proper error handling to all delete operations

### 9. Accessibility (MEDIUM)
- **Current:** Tables lack <caption>, <th> lacks scope, icon buttons lack aria-label
- **Fix:** Add proper ARIA attributes

### 10. Search Input Duplication (LOW)
- **Current:** Search input HTML duplicated in DataTable, SkillsListClient, SeoListClient
- **Fix:** Already partially addressed via DataTable, remaining instances should use it

### 11. Consistent Spacing (LOW)
- **Current:** Mix of space-y-4 and space-y-6 across forms
- **Fix:** Standardize on space-y-6

### 12. Responsive Images (MEDIUM)
- **Current:** All images use <img> tags, no Next.js <Image> optimization
- **Fix:** Not in scope (would require image domain config changes)

---

## What's Already Good
- Dark mode consistently applied via class strategy
- Toast notification system works well
- DataTable provides good reusable pattern
- Button component has proper variant system
- Input/Textarea/Select have proper ARIA attributes
- Sidebar has good responsive behavior
- Public components use Framer Motion effectively
- Glass-card effect works well in dark mode
- ThemeProvider with localStorage persistence

---

## Implementation Priority
1. Fix Toast bug (useRef) — 5 min
2. Create constants file — 15 min
3. Fix font configuration — 10 min
4. Extract EntityForm — 30 min
5. Integrate ConfirmDialog — 20 min
6. Fix delete error handling — 15 min
7. Add loading skeletons — 20 min
8. Fix accessibility issues — 15 min
9. Standardize spacing — 10 min
10. Clean up duplicates — 15 min
