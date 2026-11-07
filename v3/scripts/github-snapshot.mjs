/**
 * Writes src/content/github-snapshot.json: the profile counts and recently
 * pushed repositories the agent window's GitHub reply falls back to.
 *
 * Why a build-time copy. The browser reads the same data live from GitHub's
 * REST API, which unauthenticated allows 60 requests an hour *per IP*. Behind a
 * campus, office or carrier NAT that budget is shared with everyone else on the
 * address, and once it is spent every call is a 403 - the calendar (served by a
 * different host) still arrived, so the reply showed a year of contributions
 * and no repositories. The snapshot is taken here, in CI, with the workflow's
 * token (5,000 an hour), and is at worst one deploy old.
 *
 * Runs as `prebuild`. It never fails the build: if GitHub cannot be reached
 * (offline, or rate-limited locally without a token) the committed snapshot is
 * left as it is.
 */

import { readFile, writeFile } from 'node:fs/promises'

const OUT = new URL('../src/content/github-snapshot.json', import.meta.url)
const USER = 'Magicherry'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

const get = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'bits-of-me-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

try {
  const [repos, user] = await Promise.all([
    get(`/users/${USER}/repos?sort=pushed&per_page=20`),
    get(`/users/${USER}`),
  ])
  const snapshot = {
    takenAt: new Date().toISOString(),
    repos: repos
      .filter((r) => !r.fork)
      .slice(0, 4)
      .map(({ name, description, html_url, language, stargazers_count, pushed_at, fork }) => ({
        name,
        description,
        html_url,
        language,
        stargazers_count,
        pushed_at,
        fork,
      })),
    user: { public_repos: user.public_repos, followers: user.followers },
  }
  const next = `${JSON.stringify(snapshot, null, 2)}\n`
  const prev = await readFile(OUT, 'utf8').catch(() => '')
  /* Rewritten only when the data moved, so a local build does not dirty the
     tree with nothing but a new timestamp. */
  const strip = (s) => s.replace(/"takenAt": "[^"]*",?/, '')
  if (strip(prev) !== strip(next)) await writeFile(OUT, next)
  console.log(`github-snapshot: ${snapshot.repos.length} repos`)
} catch (err) {
  console.warn(`github-snapshot: kept the committed snapshot (${err.message})`)
}
