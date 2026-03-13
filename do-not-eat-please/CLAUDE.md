# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run all commands from this directory (`do-not-eat-please/`):

```bash
npm run dev          # Start Granite dev server
npm run build        # Build the app (via ait build)
npm run deploy       # Deploy the app (via ait deploy)
npm run test         # Run Jest tests (--passWithNoTests)
npm run typecheck    # TypeScript type check (tsc --noEmit)
npm run lint         # Lint and auto-fix with Biome
```

Run a single test file:
```bash
npx jest path/to/test.tsx
```

## Architecture

**Framework:** [Granite](https://granite-js.dev) — a React Native micro-frontend framework built on top of `@apps-in-toss/framework`.

**App config:** `granite.config.ts` declares `scheme: 'intoss'` and `appName: 'do-not-eat-please'`, using the `appsInToss` plugin with `primaryColor: '#3182F6'`.

**Entry point:** `index.ts` calls `register(App)` from `@granite-js/react-native`. `App` is defined in `src/_app.tsx` via `AppsInToss.registerApp`, passing the `context` from `require.context.ts` for route discovery.

**Two-layer pages pattern:** Routes live in `src/pages/`. The top-level `pages/` directory contains thin re-export shims (e.g. `export { Route } from 'pages/index'`) that Granite discovers via `require.context('./pages')` in `require.context.ts`. When adding a new route:
1. Create the page in `src/pages/your-route.tsx` using `createRoute('/your-route', { component })`
2. Create a shim at `pages/your-route.tsx` re-exporting `Route`
3. `src/router.gen.ts` is auto-generated — do not edit it

**Navigation:** Use `Route.useNavigation()` inside page components to get `navigation.navigate('/path')` and `navigation.goBack()`. Route paths are type-safe via `RegisterScreen` in `src/router.gen.ts`.

**404 page:** `pages/_404.tsx` — default fallback for unmatched routes (no shim needed, defined directly).

## Code Style

- **Linter/Formatter:** Biome (`biome.json`) — single quotes, space indentation, auto-organize imports
- **Biome scope:** only `src/**/*` and `pages/**/*`
- **TypeScript:** strict mode with `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- **Path aliases:** `baseUrl` is `src`, so `import ... from 'pages/index'` resolves to `src/pages/index`

## Testing

- Jest config extends `@granite-js/react-native/jest`
- Setup file: `jest.setup.ts` (imports `@testing-library/react-native/extend-expect` and calls `setup()` from `@granite-js/react-native/jest`)
- Tests use `@testing-library/react-native`
