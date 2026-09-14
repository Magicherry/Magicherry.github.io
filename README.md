<h2 align="center">
  Bits of Me — Personal Portfolio <br/>
  <a href="https://magicherry.github.io/" target="_blank">magicherry.github.io</a>
</h2>

This repository contains two generations of the portfolio.

|    Version    | Status   | Description                                                                                                                                                                                                    |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**`v2/`**](v2/) | **Live** | The current portfolio — a single-page, scroll-driven narrative with a custom-built glassmorphism design system. Built with React 19 · TypeScript · Vite 8 · Motion · Lenis, with no UI or CSS frameworks. |
| [`v1/`](v1/)     | Archived | The original portfolio, built with React 19 · React Router · Bootstrap 5 and adapted from an open-source template. Preserved for reference; no longer built or deployed.                                       |

On every push to `main`, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds `v2/` and publishes `v2/dist` to GitHub Pages.

For implementation details and design decisions, see [`v2/README.md`](v2/README.md). The original version is documented in [`v1/README.md`](v1/README.md).
