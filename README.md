<h2 align="center">
  Bits of Me — Personal Portfolio <br/>
  <a href="https://magicherry.github.io/" target="_blank">magicherry.github.io</a>
</h2>

This repository holds two generations of the site.

| | | |
| --- | --- | --- |
| [**`v2/`**](v2/) | **Live** | Single-page scroll narrative with a hand-built Liquid Glass surface system. React 19 · TypeScript · Vite 8 · Motion · Lenis. No UI framework, no CSS framework. |
| [`v1/`](v1/) | Archived | The original portfolio. React 19 · React Router · Bootstrap 5, grown from an open-source template. Kept for history; not built or deployed. |

`.github/workflows/deploy.yml` builds `v2/` and publishes `v2/dist` to GitHub
Pages on every push to `main`. See [v2/README.md](v2/README.md) for the design
and engineering notes, and [v1/README.md](v1/README.md) for the original.
