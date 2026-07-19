# Implementation Plan

## Phase 1: Foundation Fixes
**Goal:** Fix critical bugs and establish design token system

- Fix Toast `nextId` bug (useRef)
- Create `src/lib/constants.ts` with all shared design tokens
- Fix font configuration alignment
- Standardize form spacing to space-y-6

## Phase 2: Form Architecture
**Goal:** Eliminate ~600 lines of duplicated form code

- Create generic `EntityForm` component
- Refactor all 12 create/edit pages to use EntityForm
- Integrate ConfirmDialog for all delete operations
- Add proper try/catch to all delete operations

## Phase 3: Admin UI Polish
**Goal:** Consistent, professional admin interface

- Fix accessibility issues (aria-labels, scope, caption)
- Add loading skeletons for admin pages
- Unify cancel navigation behavior
- Clean up duplicate search inputs

## Phase 4: Public Components
**Goal:** Polish public-facing portfolio

- Centralize category/status color maps
- Fix hardcoded data (certificates in-progress, footer tech)
- Clean up duplicate code between ProjectsSection and ProjectsPageContent
- Ensure consistent responsive behavior

## Phase 5: Verification
**Goal:** Ensure everything works

- Build verification
- Test verification
- Documentation update
