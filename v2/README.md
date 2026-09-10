<h2 align="center">
  Bits of Me — Personal Portfolio <b>v2</b> <br/>
  <a href="https://magicherry.github.io/" target="_blank">magicherry.github.io</a>
</h2>

<p align="center">
  <img alt="React 19.3" src="https://img.shields.io/badge/React-19.3-0f172a?logo=react&logoColor=61DAFB">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-0f172a?logo=typescript&logoColor=3178C6">
  <img alt="Vite 8.2" src="https://img.shields.io/badge/Vite-8.2-0f172a?logo=vite&logoColor=646CFF">
  <img alt="Motion 13.2" src="https://img.shields.io/badge/Motion-13.2-0f172a?logo=framer&logoColor=0055FF">
  <img alt="Node.js 20.19+" src="https://img.shields.io/badge/Node.js-20.19%2B-0f172a?logo=nodedotjs&logoColor=3C873A">
</p>

## Overview

A ground-up rebuild of the portfolio as a **single-page scroll narrative**, built
around a hand-written **Liquid Glass** surface system. Where v1 assembled a site
from an open-source template and a component library, v2 ships **no UI framework
and no CSS framework** — every surface, every transition and every token in here
was written for this site.

The goal was a site that reads as *made*, not *assembled*: dense in craft, quiet
in presentation. Rich motion that still holds a steady frame, glass that behaves
like a material rather than a blur filter, and a bilingual content layer the type
system refuses to let you leave half-translated.

---

## Highlights & Features

### Appearance

- **Liquid Glass surfaces**: six stacked optical layers per surface — backdrop,
  body tint, gradient rim, inner glow, pointer-tracked specular and contact
  shadow. Removing any one of them is what makes most "glassmorphism" read as
  grey plastic.
- **Real edge refraction**: an SVG displacement map bends the backdrop *outward
  at the rim only*, the optical signature of a thick slab with a convex bevel.
  The thickest variant runs the map three times at different throws for cheap
  chromatic dispersion.
- **Dynamic theming**: dark and light are two separately tuned designs, not one
  palette inverted. Light-mode glass *absorbs* — it darkens and adds contrast,
  because brightening a near-white backdrop erases the very colour the
  saturation lift just produced.
- **Themed via View Transitions**: switching themes reveals the new palette under
  an expanding circle that starts at the button you pressed — one composited
  texture crossfade rather than a repaint of several hundred elements.

### Interaction & Motion

- **Smooth scroll** owned by a single Lenis instance, disabled entirely under
  `prefers-reduced-motion` — and the only thing allowed to scroll the page, so no
  two easings ever compound.
- **Glass capsule navigation**: a floating pill on desktop that docks to the
  **bottom** of the screen below 760px — not a fallback, but the end of the
  screen the thumb actually reaches.
- **Scroll-linked composition**: parallax on the hero, a progress rail through
  the experience timeline, and entrance animations that fire *before* an element
  has settled in view.
- **Pointer optics**: a dot field that bends around the cursor using the same
  lens maths as the glass, and stops its animation loop the moment it settles.

### Content

- **Bilingual by type, not by convention**: every visible string is a
  `Localized<T>` — a mapped type total over the locale union — so an untranslated
  string is a compile error rather than an English fallback discovered in
  production.
- **Project showcase** with tag filtering and animated re-layout across
  categories.
- **Experience timeline** covering full-time, research and internship tracks,
  newest first.
- **Integrated CV**: separate Chinese and English PDFs, served with the right
  download filename per locale.
- **Custom inline markup**: prose carries two markers (`**accent**`,
  `[text](url)`) parsed in ~60 lines, including automatic spacing between Han
  characters and Latin runs. A markdown dependency would be ~40 kB for a syntax
  the site does not use.

### Engineering

- **Two-tier design tokens**: a palette tier holds raw values and never appears
  in component CSS; a semantic tier maps them onto roles and is the only thing
  components read. Both themes swap by redefining the semantic tier.
- **An opt-in cost model for glass**: `backdrop-filter` re-runs every frame its
  backdrop changes, and the background here animates forever — so sampling is
  opt-in and the default is flat. Exactly one surface on the page samples
  permanently. The rest fake it with fill, rim and specular, and cost nothing.
- **Deliberate browser support**: only Chromium composites SVG filter references
  inside `backdrop-filter`; Safari and Firefox parse the value and then drop it,
  which yields an invisible panel rather than a graceful fallback. So the site
  opts *in* to Chromium for refraction and everything else lands on a fully
  designed blur-only tier — with an opaque tier below that for engines with no
  `backdrop-filter` at all.
- **Accessibility as a rendering path**: `prefers-reduced-motion` and
  `prefers-reduced-transparency` each select a designed state, not a degraded
  one.

## Prerequisites

Clone down this repository. You will need these tools installed:

- `git` (for cloning)
- `node` `20.19+` or `22.12+` and `npm` (bundled with Node) — required by Vite 8
- Optional: `nvm` for managing Node versions

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev        # http://localhost:3002
```

The page hot-reloads as you edit.

```bash
npm run build      # tsc -b && vite build  ->  dist/
npm run typecheck  # types only, no emit
npm run preview    # serve the production build
```

> `vite build` does **not** typecheck. `tsc -b` is the gate, and it runs first in
> `npm run build` for exactly that reason.

## Usage & Customization

Everything a visitor reads lives in `src/content/` as typed data, separate from
the components that render it.

- **Profile & contact**: `src/content/profile.ts` — name, current role, location,
  stats, contact channels and CV paths.
- **Copy**: `src/content/copy.ts` — section titles, prose and every UI string,
  both locales side by side.
- **Projects**: `src/content/projects.ts` — cards, tags and links.
- **Experience & education**: `src/content/experience.ts`.
- **Tech stack**: `src/content/stacks.ts`.
- **Design tokens**: `src/styles/tokens.css` — colour, type scale, spacing,
  motion curves and the whole glass tier. Almost every visual change starts here
  rather than in a component.
- **Assets**: replace images in `src/assets/`; CVs live in `src/assets/cv/`.

```
src/
  components/
    glass/       GlassSurface, GlassDefs, displacementMap
    fx/          Backdrop, LensGrid, Typewriter
    layout/      Nav, Preloader, Footer
    Action, Reveal, RichText, Section
  content/       typed bilingual data + UI copy
  lib/           theme, i18n, scroll, intro, preferences, hooks
  sections/      Hero, About, Stack, Work, Projects, Contact
  styles/        tokens.css, base.css
```

## Deployment

Not wired up yet. The repository's `.github/workflows/deploy.yml` still builds
from the repository root, which no longer holds a `package.json`. Pointing it at
`v2/` (build → `dist/`) is all that is needed when this goes live; `v1/` is kept
as an archive.

## Acknowledgements

Grateful to the open-source community and the projects this is built on:

- [React](https://react.dev)
- [Vite](https://vite.dev/)
- [Motion](https://motion.dev/)
- [Lenis](https://lenis.darkroom.engineering/)
- [React Icons](https://react-icons.github.io/react-icons)
- [Simple Icons](https://simpleicons.org/) and [Devicon](https://devicon.dev/)
  for the brand marks
- Apple's Liquid Glass, for the material this spent a long time chasing
