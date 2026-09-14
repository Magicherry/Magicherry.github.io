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

The second version of my personal portfolio, rebuilt as a bilingual, single-page
experience with a **next-generation glassmorphism design**.

## Highlights

- **Refined glassmorphism** with layered surfaces, edge refraction and responsive
  light and dark themes.
- **Smooth, accessible motion** with scroll-linked effects and support for
  reduced-motion and reduced-transparency preferences.
- **Responsive navigation** that adapts from a floating desktop capsule to a
  mobile bottom bar.
- **Bilingual content** backed by TypeScript types, including localized CV files.
- **Project filtering and experience timeline** with animated transitions.
- **Progressive browser support** with designed fallbacks for unsupported visual
  effects.

## Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| React | 19.3 | Component-based user interface |
| TypeScript | 5.9 | Type-safe application development |
| Vite | 8.2 | Development server and production build |
| Motion | 13.2 | Interface and scroll-linked animations |
| Lenis | — | Smooth scrolling |

## Local Development

Requires Git, npm and Node.js `20.19+` or `22.12+`.

```bash
npm install
npm run dev        # http://localhost:3002
```

Other available commands:

```bash
npm run build      # typecheck and create the production build
npm run typecheck  # check types without emitting files
npm run preview    # preview the production build
```

## Customization

Visitor-facing content is stored separately from the UI in `src/content/`:

- `profile.ts` — profile details, contact channels and CV paths
- `copy.ts` — bilingual section titles and UI copy
- `projects.ts` — project cards, tags and links
- `experience.ts` — experience and education
- `stacks.ts` — technical skills

Visual styles and assets are organized in:

- `src/styles/tokens.css` — colors, typography, spacing, motion and glass styles
- `src/assets/` — images and other static assets
- `src/assets/cv/` — Chinese and English CV files

## Project Structure

```text
src/
  components/    reusable UI, effects and layout
  content/       typed bilingual content
  lib/           theme, i18n, scrolling and shared hooks
  sections/      page sections
  styles/        design tokens and global styles
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs
dependencies, runs the build and publishes the generated site to GitHub Pages.

## Acknowledgements

Grateful to the open-source community and the projects this is built on:

- [React](https://react.dev)
- [Vite](https://vite.dev/)
- [Motion](https://motion.dev/)
- [Lenis](https://lenis.darkroom.engineering/)
- [React Icons](https://react-icons.github.io/react-icons)
- [Simple Icons](https://simpleicons.org/) and [Devicon](https://devicon.dev/)
  for the brand marks
