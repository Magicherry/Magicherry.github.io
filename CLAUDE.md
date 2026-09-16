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

`App.tsx` nests `LocaleProvider > IntroProvider > ScrollProvider > Shell`. Sections mount from the first commit — only their *entrance animations* wait on the intro flag, so the preloader curtain lifts onto an already-laid-out page.

### Content layer — bilingual by type

Every visible string lives in `src/content/` as a `Localized<T>` (`{ en: T; zh: T }`, a mapped type total over the locale union). Components never hold copy; they call `t(entry)` from `useLocale()`. Adding a string with only one locale is a **compile error**, not an English fallback — preserve that property when editing content.

Prose carries two inline markers parsed by `<RichText>` (~60 lines, no markdown dependency): `**accent**`, `*aside*`, `[text](url)`. It also auto-inserts optical spacing between Han characters and marked Latin runs, so never type literal spaces around a marker to fix CJK spacing.

### Glass system

`<GlassSurface>` is the only component allowed to render a frosted surface. It renders three tiers that must all stay designed:

1. **Refraction** — an SVG displacement map (`GlassDefs` + `displacementMap.ts`) inside `backdrop-filter`. Gated on `data-refraction` on `<html>`, set by `applyRefractionMode()` in `main.tsx` *before the first React commit*. The probe is a Chromium **allow-list**, not `CSS.supports` — other engines parse the value and then drop it when compositing, yielding an invisible panel rather than a fallback.
2. **Blur-only** — the default everywhere else.
3. **Opaque** — `@supports not (backdrop-filter: ...)`, plus designed states for `prefers-reduced-transparency` and `prefers-reduced-motion`.

`backdrop` defaults to `'flat'` on purpose: `'live'` runs a real `backdrop-filter` pass every frame the animated field behind it changes, so it is a permanent per-element cost and is used on roughly six surfaces site-wide. Everything else fakes glass with fill, rim, inner glow and specular for free. Do not add `'live'` casually, and do not hand-roll `backdrop-filter` outside this component.

**Panels are square with a bracketed frame:** four faint edges (`--glass-edge`) and four bright right-angles at the corners (`--hud-bracket`), drawn as eight hairline gradients by `.surface::before` and switched off per surface with `--surface-tick: transparent`. The ratio between the two — brackets several times the edge — *is* the design; bring either toward the other and the figure collapses into an ordinary outline. `.surface` hard-codes `border-radius: 0` and ignores the `radius` prop; `.live` and the `.circle`/`.rounded` escape hatches restate it. A `'live'` surface swaps the brackets for its gradient rim ring (`.live::before` resets the shorthand): one edge treatment per surface, never both.

### Tokens and theming

`src/styles/tokens.css` is two-tier: a **palette** tier of raw values that must never appear in component CSS, and a **semantic** tier that components exclusively read. Components ask for roles, this file answers — so most visual changes start here, not in a component.

**There is one appearance and it is dark.** A light theme was removed along with the toggle, `lib/theme.tsx`, the pre-paint script in `index.html`, the view-transition reveal, and every `[data-theme]` selector. Don't add `[data-theme=…]` rules back; `<html>` no longer carries the attribute. `--glass-inner-shade` and `--glass-specular-blend` survive as deliberately-inert slots (a transparent shadow layer keeps the hover stack interpolable — `box-shadow` lists of unequal length snap).

The design is a **tactical** one (drawn against Call of Duty: Black Ops 7): a near-black cold field with v1's bright cyan carrying every accent.

There is exactly **one accent hue** — cyan — and everything reads it: links, heading highlights, readouts, rails, buttons, focus rings, glass rim hovers. The ember the tactical design started from is gone from the interface entirely; it survives only as a faint bloom in the field (`--aurora-3`, a literal) and as the unspent `--accent-warm`. Don't reintroduce a second bright hue without a reason the cyan cannot carry.

Three consequences are easy to trip over:

- **The radius scale holds four-value shorthands, not lengths** (`--radius-lg: 0 13px 0 13px`), and `base.css` sets `corner-shape: bevel` on `:where(*)`. Together that makes a cut plate at the top-right and bottom-left. Anything that must be round — status dots, vendor app-icon tiles, the preloader mark, the nav bar and its language button — sets `corner-shape: round` explicitly, and needs a *single-length* radius (`--radius-round`, `--radius-circle`) since a two-corner shorthand would arc two corners and leave two square. `--radius-full` is a small cut, not a capsule; `--radius-chip` is 0, for chips and tags too short to carry a chamfer without turning into parallelograms. `corner-shape` is Chromium-only and degrades to rounded corners elsewhere, which is why the angular language is carried in parallel by the corner brackets, HUD rules and stencilled caps.
- **Buttons are square and bracketed.** `<Action>` is the one component with no chamfer (`--radius-chip`) — a button is a command, not a surface — and its hover/focus state draws a pair of detached `[ ]` calipers via `.action::before`, which is why `.action` must not carry `overflow: hidden`.
- **Interface type is mono caps; prose is not.** Nav links, buttons, chips, section slates and readouts are `--font-mono`, uppercase, positive tracking. Section titles and the hero name are set caps at `--tracking-stencil` with a `:lang(zh)` reset — Han carries its own advance width and letterspacing it opens gaps that read as word breaks.

`<meta name="theme-color">` in `index.html` is a static value sampled from the *composited* backdrop at the viewport edge — deliberately not `--bg-base`, which is the near-black *under* the field and paints a black band above and below the content on phones.

### Preferences

`useTimedPreference` backs the locale — and only the locale, since the theme it also backed is gone: ambient value by default, manual override in localStorage, override **expires after a TTL** (24h default) so a one-off choice doesn't pin the site forever. It still supports `ttlMs: null` for a permanent choice; nothing currently asks for one. All localStorage access is wrapped, because Safari Lockdown and some webviews throw on *read*.

### Scroll and motion

`SECTION_IDS` in `lib/scroll.tsx` defines the section *vocabulary* — the anchor targets, the IntersectionObserver spy, and the `SectionId` type. It is not the nav's list: `Nav.tsx` keeps its own `ITEMS` array (typed `Exclude<SectionId, 'home'>`, so it carries the icon and label a bare id cannot). **Adding a section means three edits, not one** — `SECTION_IDS`, `ITEMS`, and a `<Section>` with the matching `id`. The type catches a typo, not an omission.

One Lenis instance owns all scrolling and is skipped entirely under `prefers-reduced-motion` (native scrolling instead); nothing else should call `window.scrollTo` for in-page navigation.

`<Reveal>` is the only scroll-entrance primitive: opacity and transform only (never animate `filter: blur()` — it is not a compositor property and the grids run a dozen at once), fires `once` by default, and renders a plain tag under reduced motion.

Reduced motion and reduced transparency select *designed* rendering paths throughout, not degraded ones. Keep that invariant when adding effects.

## Conventions

- CSS Modules per component (`Foo.module.css`), accessed as `styles['name']`; genuinely global rules (`.shell`, `.section`, `.sectionTitle`, `.lede`, skip link, view-transition keyframes) live in `styles/base.css`.
- Comments in this codebase explain *why* a non-obvious choice was made, often at length. Match that register — when changing such code, update the reasoning rather than deleting it.
- `*.pdf` imports are declared in `src/vite-env.d.ts`; `vite/client` does not cover documents.
