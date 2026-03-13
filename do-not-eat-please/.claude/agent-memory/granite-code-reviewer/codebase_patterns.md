---
name: codebase_patterns
description: Recurring patterns, conventions, and known pitfalls observed in this codebase across reviews
type: project
---

**Why:** Build up institutional knowledge to avoid re-discovering the same issues.
**How to apply:** Check these patterns first before doing a full review scan.

## Confirmed correct patterns
- All string literals use single quotes (Biome compliant).
- Space indentation throughout.
- `noUncheckedIndexedAccess` handled correctly: `parts[2] ?? '0'` in CalendarGrid.tsx:66, `row[0]?.date ?? ''` in CalendarGrid.tsx:41, `DOT_COLORS[colorIndex] ?? '#3182F6'` in CalendarGrid.tsx:89.
- `import type` used correctly for type-only imports.
- All async mutations use `void` prefix or `.then()` to silence unhandled-promise lint.
- `useCallback` deps arrays are populated correctly (foodItems, eatingRecords captured by closure).
- `StyleSheet.create` used for all styles.
- No `console.log` or debug artifacts found in any reviewed file.

## Known issues / pitfalls found (first review, 2026-03-13)
- `FoodItemRow` setTimeout leak: `setTimeout(() => setJustEaten(false), 1500)` is not cleared on unmount. If the row is removed from the list (food deleted) while the timer is pending, it fires a setState on an unmounted component.
- `logEating` does not use `todayString()` / `formatDate()` from calendarUtils — inlines the same date logic. Minor inconsistency, not a bug.
- `FoodItemRow` `onPress` on the outer `TouchableOpacity` is not set — the outer container is pressable (long press for delete) but tapping the row body does nothing; only the inner "먹었어요" button triggers eating. This is intentional by design but worth noting.
- Calendar page uses `new Date()` directly in the component body (line 26) rather than in a `useState` initializer — re-renders would re-evaluate `today` but it is only used for `useState` initial values so this is safe.
- `record.eatenAt` used as React `key` (calendar.tsx:100) — risk of duplicate keys if two records for the same food are logged within the same millisecond, but practically negligible.
- Missing `pages/` shim for the `/about` route referenced in `router.gen.ts` — `pages/about.tsx` exists (re-exports from `pages/about`) but `src/pages/about.tsx` was not provided for review.
