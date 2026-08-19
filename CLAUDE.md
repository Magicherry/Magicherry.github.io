# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Bits of Me" — a bilingual (en/zh), dual-theme personal portfolio SPA. Create React App (`react-scripts` 5) + React 19 + React Router v6 + Bootstrap 5. No TypeScript, no CSS modules, no state library.

## Commands

```bash
npm install
npm start                                    # dev server on port 3001 (PORT is forced via cross-env)
npm run build                                # production build into build/
npm test                                     # CRA/Jest watch mode
npm test -- --watchAll=false                 # single run (CI style)
npm test -- --watchAll=false -t "renders the primary site navigation"   # single test by name
```

Node 20.16+ / 22.3+ (`react-pdf` / `pdfjs-dist` engine requirement).

Deployment is automatic: `.github/workflows/deploy.yml` builds on push to `main`, copies `build/index.html` to `build/404.html` as the SPA fallback, and publishes to GitHub Pages. Do not add a `gh-pages` deploy script — `homepage` in package.json only sets the public URL.

## Architecture

### Global shell (`src/App.js`)
`App` is the only stateful shell. It owns:
- **Theme** — resolved by `useTimedAutoPreference`, written to `document.documentElement[data-theme]` (`"dark"` | `"light"`). All theming flows from that attribute into CSS custom properties; `theme` is also passed as a prop to `Particle` and `About` for JS-side variants.
- **Preloader** — `load` state gates `Pre`, `.app-loading`, and `body.preloader-active`; `triggerPreloader` is handed to `Navbar` so nav clicks can replay it.
- **Mouse-glow effect** — one large `useEffect` that queries a fixed selector list once on mount, injects a `.mouse-glow-local` overlay div into each match, and drives `--glow-x`/`--glow-y` from pointer events via `requestAnimationFrame`. It runs **once**, so elements rendered later (or moved into a different class) silently lose the glow; add new interactive classes to that selector list rather than expecting it to be dynamic.

Render order inside `<Router>`: `LanguageProvider` → `Pre` → `Navbar` → `Particle` → `ScrollToTop` → `AnimatedRoutes` → `Footer`.

### Preferences: `src/hooks/useTimedAutoPreference.js`
The shared mechanism behind **both** theme and language. A preference is auto-derived (system `prefers-color-scheme`, or `navigator.languages`) unless the user manually overrides it; the override is persisted to `localStorage` as `{value, expiresAt}` with a **24h TTL**, then automatically falls back to auto mode via a timer, on window `focus`, and on `visibilitychange`. Storage keys: `themePreference`, `languagePreference` (Navbar separately persists `navMode`). Any new user preference of this kind should reuse this hook rather than touching `localStorage` directly.

### i18n: `src/context/LanguageContext.js`
No i18n library. `useLanguage()` returns `{ locale, isAutoLocale, setManualLocale, toggleLocale }` where `locale` is `"en" | "zh"`, and sets `document.documentElement.lang`. Copy is bilingual **in place**, in two shapes:
- Data files export `{ en, zh }` objects per field — `src/components/Projects/ProjectData.js`, `src/components/Experiences/ExperienceData.js`.
- Components define a local `copy = locale === "zh" ? {...} : {...}` literal and read from it.

When adding user-visible text, add both languages; never leave a locale unfilled. Locale also selects assets (e.g. `Yuting_Zhou_CV_zh.pdf` vs `Yuting_Zhou_CV.pdf`) and the CJK font stack via `html:lang(zh)` in CSS.

### Routing: `src/components/MainFrame/AnimatedRoutes.js`
All five pages (`/`, `/project`, `/about`, `/resume`, `/experiences`) are `React.lazy` + `Suspense`, wrapped in a framer-motion `AnimatedPage` inside `AnimatePresence mode="wait"`; unknown paths `Navigate` to `/`. New pages go here and in `NAV_ITEMS` in `Navbar.js` (which is keyed by locale).

### Navbar (`src/components/MainFrame/Navbar.js`, ~740 lines)
Three coordinated navigations — desktop floating top pill, optional floating side panel, mobile bottom bar — plus the liquid-glass effect: an SVG displacement map is generated at runtime as a data URI, sized per surface via `ResizeObserver`, and applied to elements marked `data-liquid-glass-map-target`. It is **deliberately disabled on Safari** (UA sniff) because the filter renders incorrectly there; keep that guard when touching this code.

### Styling: `src/css/style.css` (single ~4.5k-line global stylesheet)
There is no per-component CSS. The file header documents its own section order and its design tokens; **colors, radii, shadows and blurs are defined only in `:root`, with the light theme overriding the same tokens under `[data-theme="light"]`** — add or edit tokens there instead of hardcoding values in rules. The header also lists the few styles intentionally set from JS (draggable pill position, `--fade-delay`, mouse-glow coordinates); keep that list accurate if you add another.

### Other conventions
- `FadeInOnScroll` wraps content for `IntersectionObserver` reveal, with `eager` / `skipAnimation` escapes; `--fade-delay` is set inline per instance.
- `pdfjs.GlobalWorkerOptions.workerSrc` in `ResumeNew.js` points at unpkg CDN pinned to `pdfjs.version` — the resume viewer breaks offline / behind a strict CSP.
- `Particle` initializes the tsparticles engine once through a module-level promise; do not call `initParticlesEngine` elsewhere.
- Images live in `src/Assets/<section>/` and are pulled in with `require(...)` from the data files.

## Tests

Only `src/App.test.js` exists — a smoke test that mocks `Particle` and `AnimatedRoutes`. `src/setupTests.js` already stubs the browser APIs this app depends on at module scope (`matchMedia`, `scrollTo`, `ResizeObserver`, `IntersectionObserver`); extend that file rather than re-stubbing per test when a new component reaches for another browser-only API.
