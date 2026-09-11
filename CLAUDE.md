# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

Two generations of one personal site live side by side:

- `v2/` — **the live site.** React 19 · TypeScript · Vite 8 · Motion · Lenis. No UI or CSS framework. Everything is hand-written.
- `v1/` — archived predecessor (CRA · React Router · Bootstrap). Never built, never deployed. Do not touch it unless the request is explicitly about v1.

Unless stated otherwise, "the site" means `v2/` and every command below runs from `v2/`.

`v1/Resume/` is a **separate git repository** nested inside this one and is gitignored — the CV PDFs the site serves are hand-copied into `v2/src/assets/cv/`, they are not built from it.

## Commands

```bash
cd v2
npm install
npm run dev        # http://localhost:3002
npm run build      # tsc -b && vite build  ->  v2/dist
npm run typecheck  # tsc -b --noEmit
npm run preview    # serve the production build on 3002
```

`vite build` does **not** typecheck — `tsc -b` is the gate and runs first in `npm run build`. There is no test suite and no linter configured; `npm run typecheck` is the only automated check, and the TS config is strict (`exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`, `noUncheckedSideEffectImports`), so optional props are passed via conditional spreads rather than `prop={maybeUndefined}`.

`.github/workflows/deploy.yml` builds `v2/` and publishes `v2/dist` to GitHub Pages on every push to `main`. (`v2/README.md` still says deployment is "not wired up yet" — that section is stale.)

`@/*` resolves to `v2/src/*`, declared in both `vite.config.ts` and `tsconfig.app.json`; they must stay in step.

## Architecture

### Provider stack

`App.tsx` nests `ThemeProvider > LocaleProvider > IntroProvider > ScrollProvider > Shell`. Sections mount from the first commit — only their *entrance animations* wait on the intro flag, so the preloader curtain lifts onto an already-laid-out page.

### Content layer — bilingual by type

Every visible string lives in `src/content/` as a `Localized<T>` (`{ en: T; zh: T }`, a mapped type total over the locale union). Components never hold copy; they call `t(entry)` from `useLocale()`. Adding a string with only one locale is a **compile error**, not an English fallback — preserve that property when editing content.

Prose carries two inline markers parsed by `<RichText>` (~60 lines, no markdown dependency): `**accent**`, `*aside*`, `[text](url)`. It also auto-inserts optical spacing between Han characters and marked Latin runs, so never type literal spaces around a marker to fix CJK spacing.

### Glass system

`<GlassSurface>` is the only component allowed to render a frosted surface. It renders three tiers that must all stay designed:

1. **Refraction** — an SVG displacement map (`GlassDefs` + `displacementMap.ts`) inside `backdrop-filter`. Gated on `data-refraction` on `<html>`, set by `applyRefractionMode()` in `main.tsx` *before the first React commit*. The probe is a Chromium **allow-list**, not `CSS.supports` — other engines parse the value and then drop it when compositing, yielding an invisible panel rather than a fallback.
2. **Blur-only** — the default everywhere else.
3. **Opaque** — `@supports not (backdrop-filter: ...)`, plus designed states for `prefers-reduced-transparency` and `prefers-reduced-motion`.

`backdrop` defaults to `'flat'` on purpose: `'live'` runs a real `backdrop-filter` pass every frame the animated aurora behind it changes, so it is a permanent per-element cost and is used on roughly six surfaces site-wide. Everything else fakes glass with fill, rim, inner glow and specular for free. Do not add `'live'` casually, and do not hand-roll `backdrop-filter` outside this component.

### Tokens and theming

`src/styles/tokens.css` is two-tier: a **palette** tier of raw values that must never appear in component CSS, and a **semantic** tier that components exclusively read. Theming rewrites only the semantic tier under `[data-theme='light']`. Dark and light are separately tuned designs, not one palette inverted — light-mode glass *absorbs* (darkens) where dark-mode glass brightens. Most visual changes start here, not in a component.

Theme switching in `lib/theme.tsx` uses the View Transitions API to reveal the new palette under an expanding circle (keyframes and easing in `base.css`; only the geometry is computed per click). It deliberately does **not** transition properties across the document.

**Three values are duplicated between `src/lib/theme.tsx` and the pre-paint script in `index.html` and are marked KEEP IN SYNC:** `DEFAULT_THEME` (dark for everyone, `prefers-color-scheme` included), the `v2:theme` localStorage shape, and `THEME_COLOR` (sampled from the *composited* backdrop at the viewport edge — not `--bg-base`, which paints a black band on phones).

### Preferences

`useTimedPreference` backs both theme and locale: system/ambient value by default, manual override in localStorage, override **expires after a TTL** (24h default) so a one-off choice doesn't pin the site forever. Theme passes `ttlMs: null` — that choice is permanent. All localStorage access is wrapped, because Safari Lockdown and some webviews throw on *read*.

### Scroll and motion

`SECTION_IDS` in `lib/scroll.tsx` is the single source of truth for the nav, the anchor targets and the IntersectionObserver section spy — adding a section means adding it there and giving the `<Section>` the matching `id`. One Lenis instance owns all scrolling and is skipped entirely under `prefers-reduced-motion` (native scrolling instead); nothing else should call `window.scrollTo` for in-page navigation.

`<Reveal>` is the only scroll-entrance primitive: opacity and transform only (never animate `filter: blur()` — it is not a compositor property and the grids run a dozen at once), fires `once` by default, and renders a plain tag under reduced motion.

Reduced motion and reduced transparency select *designed* rendering paths throughout, not degraded ones. Keep that invariant when adding effects.

## Conventions

- CSS Modules per component (`Foo.module.css`), accessed as `styles['name']`; genuinely global rules (`.shell`, `.section`, `.sectionTitle`, `.lede`, skip link, view-transition keyframes) live in `styles/base.css`.
- Comments in this codebase explain *why* a non-obvious choice was made, often at length. Match that register — when changing such code, update the reasoning rather than deleting it.
- `*.pdf` imports are declared in `src/vite-env.d.ts`; `vite/client` does not cover documents.
