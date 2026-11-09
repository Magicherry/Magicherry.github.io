<h2 align="center">
  Bits of Me — Personal Portfolio <b>v3</b> <br/>
  <a href="https://magicherry.github.io/" target="_blank">magicherry.github.io</a>
</h2>

<p align="center">
  <img alt="React 19.3" src="https://img.shields.io/badge/React-19.3-0f172a?logo=react&logoColor=61DAFB">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-0f172a?logo=typescript&logoColor=3178C6">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-0f172a?logo=vite&logoColor=646CFF">
  <img alt="Node.js 20.19+" src="https://img.shields.io/badge/Node.js-20.19%2B-0f172a?logo=nodedotjs&logoColor=3C873A">
</p>

## Overview

The third version of my personal portfolio: a bilingual single page in a quiet,
dark product-page style — near-black page, white type, one cyan accent, pill
buttons and hairline panels — set over v2's animated aurora field. No animation
library and no UI or CSS framework; everything is hand-written.

## Highlights

- **An agent window that works.** The hero is a mock agent desktop client that
  you can actually use: pick a topic from the sidebar or the pinned suggestion
  chips, or type a question. Replies stream in a few characters at a time, and
  the log follows them as a chat client does. Every answer is built from the
  same content files as the page. It routes questions by keyword, and says
  plainly when something is beyond it.
- **Live GitHub data.** A contribution calendar and recently updated
  repositories, fetched in the browser.
- **Liquid-glass header.** The nav contracts into a floating pill on scroll and
  refracts the page behind it through an SVG displacement map, generated per
  pixel for the pill's exact shape. The glass condenses in, and a liquid droplet
  follows the pointer across the links. Chromium gets the refraction; other
  browsers get a designed frosted pill.
- **Motion without a library.** Spring-sampled easing, liquid sliders, a scroll
  tilt on the hero window, looping illustrations and scroll reveals, all in CSS
  and a few small hooks.
- **Experience as a timeline.** Work, research and education on one chart, with
  expandable details and a list layout on phones.
- **Bilingual by type.** Every visible string is `{ en, zh }`; a missing
  translation is a compile error. CV files are provided in both languages.
- **Accessible by default.** Reduced-motion and reduced-transparency
  preferences select designed alternatives, not degraded ones.

## Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| React | 19.3 | Component-based user interface |
| TypeScript | 5.9 | Type-safe application development (strict) |
| Vite | 8 | Development server and production build |
| React Icons | 5.7 | Interface icons |

## Local Development

Requires Git, npm and Node.js `20.19+` or `22.12+`.

```bash
npm install
npm run dev        # http://localhost:3003
```

Other available commands:

```bash
npm run build      # typecheck, then create the production build in dist/
npm run typecheck  # check types without emitting files
npm run preview    # preview the production build on port 3003
```

`vite build` alone does not typecheck; `npm run build` runs `tsc -b` first, so
a type error fails the build.

## Customization

Visitor-facing content is kept apart from the UI in `src/content/`:

- `profile.ts` — profile details, contact channels and CV paths
- `copy.ts` — bilingual UI copy shared with v2 (including the About text)
- `site.ts` — copy written for v3 only: hero, sections, footer
- `agent.ts` — the agent window: topics, questions, chips and keyword routing
- `projects.ts` — project cards, tags and links
- `experience.ts` — roles and education, with logos
- `stacks.ts` — technical skills and tools

`profile.ts`, `copy.ts`, `projects.ts`, `experience.ts`, `stacks.ts` and the
whole of `src/assets/` began as copies of v2's. v2 is frozen at its tag now, so
they are no longer kept in step.

Visual styles and assets:

- `src/styles/tokens.css` — colors, type, spacing, radii, glass and motion
- `src/styles/base.css` — global type, buttons, panels and entrance animations
- `src/assets/` — images, logos, brand marks and the CV files (`cv/`)

## Project Structure

```text
src/
  components/    header, agent window, CV download, glass lens, shared UI
    agent/       agent replies and the streaming text effect
    fx/          the animated background
  content/       typed bilingual content
  lib/           i18n, refraction detection, lens maps and hooks
  sections/      page sections
  styles/        design tokens and global styles
```

## Deployment

Pushing to `main` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs
`npm ci` and `npm run build` at the repo root and publishes `dist` to GitHub
Pages.

## Versions

`main` is the live site and the only long-lived branch. Earlier generations are
kept as tags, each with its project at the repo root:

| Tag      | Status   | Description |
| -------- | -------- | ----------- |
| `v3.0.0` | **Live** | The current design, first release in this layout. Later v3 releases are tagged `v3.x.y` on `main`. |
| `v2.0.0` | Archived | A scroll-driven narrative with a custom glassmorphism design system (React 19 · TypeScript · Vite 8 · Motion · Lenis). Kept buildable as a rollback target. |
| `v1.0.0` | Archived | The original portfolio (React 19 · React Router · Bootstrap 5), adapted from an open-source template. Never built or deployed. |

To look at an old version, `git checkout v2.0.0` (then `npm ci`). Work happens
on short-lived `feat/…` or `fix/…` branches that merge into `main` and are then
deleted.

## Acknowledgements

The layout and component language follow
[DeepSeek's Harness page](https://www.deepseek.com/harness/). Grateful to the
open-source projects this is built on:

- [React](https://react.dev)
- [Vite](https://vite.dev/)
- [React Icons](https://react-icons.github.io/react-icons)
- [Simple Icons](https://simpleicons.org/) and [Devicon](https://devicon.dev/)
  for the brand marks
- [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api)
  for the contribution calendar
