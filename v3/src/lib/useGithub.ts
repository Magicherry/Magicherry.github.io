import { useEffect, useState } from 'react'

/**
 * Public GitHub data for the agent window's "GitHub" reply.
 *
 * Two sources, both readable from a browser with no token:
 *
 *   - the contribution calendar, from github-contributions-api.jogruber.de -
 *     GitHub's own calendar is only exposed through the authenticated GraphQL
 *     API, which a static site cannot call without publishing a token. That
 *     service scrapes the public profile graph and serves it as JSON with CORS
 *     open;
 *   - the profile and recent repositories, from GitHub's public REST API
 *     (unauthenticated: 60 requests an hour per visitor IP, far more than one
 *     page view uses).
 *
 * Fetched once per page load, and only when the reply that needs it is first
 * shown - a visitor who never asks about GitHub sends no requests. The result
 * is cached at module level, so reopening the topic is instant.
 *
 * Either source can fail independently; the reply shows what arrived and
 * falls back to a link to the profile if the calendar did not.
 */

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface Repo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  pushed_at: string
  fork: boolean
}

export interface GithubData {
  days: ContributionDay[] | null
  total: number | null
  repos: Repo[] | null
  user: { public_repos: number; followers: number } | null
}

export type GithubState = { status: 'loading' } | { status: 'error' } | { status: 'ok'; data: GithubData }

let request: Promise<GithubData> | null = null

const json = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return (await res.json()) as T
}

function load(user: string): Promise<GithubData> {
  request ??= Promise.allSettled([
    json<{ total: Record<string, number>; contributions: ContributionDay[] }>(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
    ),
    json<Repo[]>(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=10`),
    json<{ public_repos: number; followers: number }>(`https://api.github.com/users/${user}`),
  ]).then(([calendar, repos, profile]) => {
    const data: GithubData = {
      days: calendar.status === 'fulfilled' ? calendar.value.contributions : null,
      total: calendar.status === 'fulfilled' ? (calendar.value.total['lastYear'] ?? null) : null,
      repos:
        repos.status === 'fulfilled' ? repos.value.filter((r) => !r.fork).slice(0, 4) : null,
      user:
        profile.status === 'fulfilled'
          ? { public_repos: profile.value.public_repos, followers: profile.value.followers }
          : null,
    }
    // Nothing at all arrived: let a later open try again rather than caching
    // the failure for the rest of the visit.
    if (!data.days && !data.repos && !data.user) {
      request = null
      throw new Error('github unreachable')
    }
    return data
  })
  return request
}

export function useGithub(user: string): GithubState {
  const [state, setState] = useState<GithubState>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    load(user).then(
      (data) => alive && setState({ status: 'ok', data }),
      () => alive && setState({ status: 'error' }),
    )
    return () => {
      alive = false
    }
  }, [user])

  return state
}
