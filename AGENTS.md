# AGENTS.md

This file provides guidance to Codex (claude.ai/code) when working with code in this repository.

## Repository shape

`main` is the live site (v3) and the only long-lived branch; it is the only branch that deploys. Work happens on short-lived `feat/…` / `fix/…` branches merged into `main` and then deleted. Releases are tagged `v3.x.y` on `main`.

Earlier generations are **tags**, not branches, each with its project at the repo root:

- `v2.0.0` — the previous site (React 19 · TS · Vite 8 · Motion · Lenis, glassmorphism design system), archived but kept buildable as a rollback target. Its own `AGENTS.md` documents its glass system, tactical tokens and scroll stack — none of which v3 uses.
- `v1.0.0` — archived predecessor (CRA · React Router · Bootstrap). Never built, never deployed. Do not touch it unless the request is explicitly about v1.

v3 is a quiet product-page design, dark by default with a light appearance: near-black page, white type at a few opacities, one accent (v2's cyan), pill buttons, 16px hairline panels, mock app-window illustrations. React 19 · TypeScript strict · Vite 8, no animation library, no UI or CSS framework. Everything is hand-written.

`src/content/` (except `site.ts` and `agent.ts`) and `src/assets/` began as **copies** of v2's. v2 is frozen at its tag, so they are no longer kept in step. v3-only copy lives in `src/content/site.ts`; the hero agent window's topics and keyword routing in `src/content/agent.ts`.

## Commands

```bash
npm install
npm run dev        # http://localhost:3003
npm run build      # prebuild snapshot, then tsc -b && vite build  ->  dist
npm run typecheck  # tsc -b --noEmit
npm run preview    # serve the production build on 3003
```

`vite build` does **not** typecheck — `tsc -b` is the gate and runs first in `npm run build`. There is no test suite and no linter configured; `npm run typecheck` is the only automated check, and the TS config is strict (`exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`, `noUncheckedSideEffectImports`), so optional props are passed via conditional spreads rather than `prop={maybeUndefined}`.

`prebuild` runs `scripts/github-snapshot.mjs`, which writes `src/content/github-snapshot.json` — the GitHub data the page falls back to when a visitor's IP has spent its anonymous API quota. It uses `GITHUB_TOKEN` when set.

`.github/workflows/deploy.yml` runs `npm ci && npm run build` at the repo root and publishes `dist` to GitHub Pages on every push to `main`. Rolling back to v2 means committing the `v2.0.0` tree onto `main` as a new commit (`git rm -rq . && git checkout v2.0.0 -- .`), never force-pushing `main`.

`@/*` resolves to `src/*`, declared in both `vite.config.ts` and `tsconfig.app.json`; they must stay in step.

## Content layer — bilingual by type

Every visible string lives in `src/content/` as a `Localized<T>` (`{ en: T; zh: T }`, a mapped type total over the locale union, in `content/types.ts`). Components never hold copy; they call `t(entry)` from `useLocale()` (`lib/i18n.tsx`). Adding a string with only one locale is a **compile error**, not an English fallback — preserve that property when editing content.

Prose carries inline markers parsed by `<RichText>` (no markdown dependency): `**accent**`, `*aside*`, `[text](url)`. It also auto-inserts optical spacing between Han characters and marked Latin runs, so never type literal spaces around a marker to fix CJK spacing.

The locale preference is backed by `useTimedPreference`: ambient value by default, manual override in localStorage that **expires after a TTL** (24h default). All localStorage access is wrapped, because Safari Lockdown and some webviews throw on *read*.

## Conventions

- CSS Modules per component (`Foo.module.css`), accessed as `styles['name']`; genuinely global rules live in `src/styles/base.css`, and design tokens in `src/styles/tokens.css`.
- Two appearances, dark and light, keyed on `<html data-theme>` (`lib/theme.tsx`, plus a pre-paint script in `index.html`). Follow `prefers-color-scheme` by default, including live system changes; fall back to dark when unavailable. A manual toggle overrides the system for 24 hours, then returns to following it like the locale preference. Light overrides only colour tokens in `tokens.css` — add any new colour as a token with both values, never a literal. The mock app windows use their own `--win-*` ramp; canvas/WebGL effects re-read colours on a `data-theme` change. One accent hue (cyan, deepened to cyan-700 on light); don't add a second bright hue without a reason.
- Reduced motion and reduced transparency select *designed* rendering paths, not degraded ones. Keep that invariant when adding effects.
- Comments in this codebase explain *why* a non-obvious choice was made, often at length. Match that register — when changing such code, update the reasoning rather than deleting it. Read v3's own source and comments before applying a rule carried over from v2.
- `*.pdf` imports are declared in `src/vite-env.d.ts`; `vite/client` does not cover documents.
