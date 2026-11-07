<h2 align="center">
  Bits of Me — Personal Portfolio <br/>
  <a href="https://magicherry.github.io/" target="_blank">magicherry.github.io</a>
</h2>

This repository contains three generations of the portfolio.

|    Version    | Status   | Description |
| ---------------- | -------- | ----------- |
| [**`v3/`**](v3/) | **Live** | The current portfolio — a quiet, dark product-page design with a working agent window in the hero, a liquid-glass header and live GitHub data. Built with React 19 · TypeScript · Vite 8, with no animation library and no UI or CSS frameworks. |
| [`v2/`](v2/)     | Archived | The previous portfolio — a scroll-driven narrative with a custom glassmorphism design system. Built with React 19 · TypeScript · Vite 8 · Motion · Lenis. No longer deployed, but kept buildable as a rollback target. |
| [`v1/`](v1/)     | Archived | The original portfolio, built with React 19 · React Router · Bootstrap 5 and adapted from an open-source template. Preserved for reference; no longer built or deployed. |

On every push to `main`, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds `v3/` and publishes `v3/dist` to GitHub Pages. Rolling back to v2 means changing the three `v3` paths in that file to `v2`.

For implementation details and design decisions, see [`v3/README.md`](v3/README.md). The earlier versions are documented in [`v2/README.md`](v2/README.md) and [`v1/README.md`](v1/README.md).
