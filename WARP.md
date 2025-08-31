# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: searchbox (Remix + Vite + React + Tailwind)

1) Common commands (Windows pwsh, Node >= 20)
- Install dependencies
  - npm install
- Start development server (Remix + Vite with HMR)
  - npm run dev
- Build production bundles (server and client)
  - npm run build
- Serve built app locally
  - npm start
- Lint
  - npm run lint
- Type-check (no emit)
  - npm run typecheck
- Tests
  - Not configured in this repo (no test script or test framework present). There is currently no way to run a single test.
- Helpful introspection
  - npx remix routes  # prints the route manifest

Environment/prereqs
- Node: engines specifies ">=20.0.0". Use Node 20+.
- Package manager: npm (package-lock.json present).
- The UI issues HTTP requests to http://localhost:8080 for search/product data. That backend is not part of this repo; UI features that depend on it use mock data when unavailable.

2) High-level architecture and structure
- Framework and build
  - Remix v2 app using the Vite-based Remix plugin (@remix-run/dev) and Vite 6.
  - SSR entry: app/entry.server.tsx streams HTML using React 18’s renderToPipeableStream and detects bots (isbot) to switch to onAllReady.
  - Hydration entry: app/entry.client.tsx hydrates via hydrateRoot within React.StrictMode.
  - Vite config (vite.config.ts) enables several Remix v3 feature flags via the plugin (v3_singleFetch, v3_fetcherPersist, v3_relativeSplatPath, v3_throwAbortReason, v3_lazyRouteDiscovery) and applies path resolution via vite-tsconfig-paths.
- Application shell, theming, and transitions
  - app/root.tsx wraps the document and mounts a ThemeProvider (app/context/ThemeContext.tsx) that:
    - Persists theme (light/dark) in localStorage and toggles the root .dark class.
  - Global page transitions are integrated with Barba.js (app/utils/barbaTransitions.ts) and GSAP:
    - root.tsx sets data-barba wrapper/container and dynamically imports initBarba on the client.
    - barbaTransitions defines a default fade transition and a special transition scoped to namespace 'product'. Note: root currently sets data-barba-namespace to useLocation().pathname. If Barba transitions should target specific pages (e.g., product), ensure the namespace value matches transition filters.
- Layout and navigation
  - Route components (e.g., app/routes/_index.tsx, app/routes/search.tsx, app/routes/product/$productId.tsx) explicitly wrap page content with app/components/Layout.
  - The Layout component mounts a fixed Header and Footer and manages container padding. Header includes theme toggle and a favorites badge sourced from localStorage.
- Routing and data flow (selected routes)
  - Home (/): routes/_index.tsx renders the HomePage component (marketing hero + EnhancedSearchBar + feature sections with framer-motion animations).
  - Search (/search): routes/search.tsx renders SearchPage. Current implementation displays mocked results with client-side sorting and filtering UI. EnhancedSearchBar performs debounced queries to http://localhost:8080/api/search and shows preview results; navigating proceeds to /search?q=…
  - Product detail (/product/:productId): routes/product/$productId.tsx defines a Remix loader that fetches http://localhost:8080/api/product/:productId and falls back to a mock if the API fails. The UI provides image zoom, rating display, share/save actions, and “similar products” suggestions.
  - Favorites (/favorites): client-only page reading/writing favorites to localStorage; provides filters and removal actions; renders ProductCard items.
  - A guard route at /product redirects to / (routes/product/index.tsx).
- State and persistence
  - Global theme state via ThemeContext.
  - Client persistence for favorites via localStorage (ProductCard and Favorites page both read/write favoriteProducts).
- Styling and UI system
  - Tailwind CSS with a custom theme (tailwind.config.ts) and darkMode: 'class'. Extended color scales under primary, background, surface, and accent; several keyframes/animations and shadows defined for UI polish.
  - PostCSS pipeline configured (postcss.config.js). Global styles imported in app/root.tsx from app/tailwind.css.
  - Icons via lucide-react; motion/animation via framer-motion.
- TypeScript and module resolution
  - tsconfig.json targets ES2022, jsx: react-jsx, moduleResolution: Bundler, and noEmit: true (Vite builds). BaseUrl is "." with a path alias of ~/* -> app/* available.
- Linting
  - .eslintrc.cjs: base eslint:recommended plus React, React Hooks, JSX a11y, and @typescript-eslint rules. import resolver configured for TypeScript and alias "~/". Lint script uses cache with .gitignore as ignore path and runs on the project root.

3) Notes derived from README.md (what matters for this repo)
- The README describes the broader vision (regional product search, AI/semantic ranking, backend in Go, MCP for data retrieval). This repository currently contains the front-end Remix application. Backend endpoints are expected at http://localhost:8080; where absent, parts of the UI use mock data.

4) Operational tips
- Route discovery: npx remix routes
- If you modify Tailwind config or class usage across many files, rebuild or restart the dev server if styles don’t reflect immediately.
- When validating transitions, remember Barba is client-only; SSR output won’t include transition effects until hydration.

