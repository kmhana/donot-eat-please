---
name: project_architecture
description: Core architectural decisions and patterns for the do-not-eat-please Granite app
type: project
---

App is a food restriction tracker ("제발 먹지마..") built with Granite React Native.

**Why:** Micro-frontend app in the Apps-in-Toss ecosystem.
**How to apply:** All reviews must check two-layer pages pattern, FoodContext placement in _app.tsx, and route-scoped navigation.

## Key architecture facts

- `FoodProvider` is mounted in `src/_app.tsx` (the `AppContainer` wrapper), so context is available across all pages without re-mounting on navigation.
- State IDs use `Date.now().toString()` — not UUID. Collision risk if items are added rapidly but acceptable for this use case.
- Eating records are keyed by `eatenAt` ISO string as the React key in the calendar detail list (see `src/pages/calendar.tsx:100`). This is fragile — two records for the same food in rapid succession could share the same millisecond key in theory.
- `logEating` in `FoodContext` inlines the date string computation rather than using `formatDate` from `calendarUtils`. Acceptable but slightly inconsistent.
- Calendar uses a fixed 6-row (42-cell) grid regardless of the month — trailing cells from next month always fill to 42.
- Tab navigation: home→calendar uses `navigate('/calendar')`, calendar→home uses `goBack()`.
- `pages/` shims are all clean single-line re-exports. `pages/_404.tsx` has no shim (correct per convention).
- `router.gen.ts` includes an `/about` route that has no corresponding `src/pages/about.tsx` visible in the review — this may be a leftover from scaffolding.
