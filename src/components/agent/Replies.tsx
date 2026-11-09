import type { ReactNode } from 'react'
import { LuArrowUpRight, LuExternalLink, LuGithub, LuStar } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { useGithub, type ContributionDay } from '@/lib/useGithub'
import { agent, type Topic } from '@/content/agent'
import { ui } from '@/content/copy'
import { projects } from '@/content/projects'
import { education, roles } from '@/content/experience'
import { profile, socials } from '@/content/profile'
import { techStack } from '@/content/stacks'
import RichText from '@/components/RichText'
import Stream from './Stream'
import styles from '../AgentWindow.module.css'

/**
 * The bodies of the agent's replies, one per topic. Each is built from the
 * site's real content files, so the window and the page below it can never
 * disagree.
 */

const GITHUB_USER = profile.github.replace(/\/+$/, '').split('/').pop() ?? 'Magicherry'

/** Scrolls the page to a section - the window's links into the page below. */
const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function Reply({ topic }: { topic: Topic }) {
  switch (topic) {
    case 'intro':
      /* The intro text itself is rendered by the window (it animates on first
         load), and the topic chips that used to follow it are pinned above the
         composer - nothing is left to add here. */
      return null
    case 'about':
      return <AboutReply />
    case 'projects':
      return <ProjectsReply />
    case 'experience':
      return <ExperienceReply />
    case 'github':
      return <GithubReply />
    case 'contact':
      return <ContactReply />
    case 'stack':
      return <StackReply />
    case 'nio':
      return <RoleReply id="nio" lead={agent.leads.nio} />
    case 'rail':
      return <RoleReply id="cait" lead={agent.leads.rail} />
    case 'unknown':
      return <UnknownReply />
  }
}

/**
 * The topic chips. Pinned in one row above the composer, the way a chat
 * client lays out its starter prompts, rather than repeated under the intro,
 * the greeting and every miss - one fixed place to find them, and a reply
 * that is only its answer.
 */
export function Chips({ onPick, className }: { onPick: (t: Topic) => void; className?: string }) {
  const { t } = useLocale()
  return (
    <div className={className ? `${styles['chips']} ${className}` : styles['chips']}>
      {agent.chips.map((c) => (
        <button key={c.topic} type="button" className={styles['chipBtn']} onClick={() => onPick(c.topic)}>
          {t(c.label)}
        </button>
      ))}
    </div>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className={styles['lead']}>{children}</p>
}

function PageLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <button type="button" className={styles['pageLink']} onClick={() => goTo(id)}>
      {children}
      <LuArrowUpRight aria-hidden="true" />
    </button>
  )
}

/* ------------------------------------------------------------------ unknown */
/** Honest about being a demo: no guessing - it points at the topics it does
    know, which are the chips pinned just below. */
function UnknownReply() {
  const { t } = useLocale()
  return <Lead>{t(agent.leads.unknown)}</Lead>
}

/* -------------------------------------------------------------------- about */
/**
 * v2's About, word for word - the three paragraphs from the shared copy file,
 * with their emphasis and links. v3's About section on the page tells the same
 * story through cards; in the chat it is told as prose, the way an answer is.
 */
function AboutReply() {
  const { t } = useLocale()
  return (
    <>
      {t(ui.about.paragraphs).map((paragraph, i) => (
        <p key={i} className={styles['prose']}>
          <RichText>{paragraph}</RichText>
        </p>
      ))}
      <PageLink id="about">{t(agent.seeAbout)}</PageLink>
    </>
  )
}

/* ------------------------------------------------------------------ projects */
function ProjectsReply() {
  const { t } = useLocale()
  return (
    <>
      <Lead>{t(agent.leads.projects)}</Lead>
      <ul className={styles['projList']}>
        {projects.map((p) => {
          const body = (
            <>
              <img src={p.image} alt="" width={36} height={36} loading="lazy" />
              <span className={styles['projText']}>
                <span className={styles['projTitle']}>
                  {t(p.title)}
                  <span className={styles['projYear']}>{p.year}</span>
                </span>
                <span className={styles['projSummary']}>{t(p.summary)}</span>
              </span>
              <span className={styles['projAction']}>
                {p.repo ? (
                  <>
                    <LuGithub aria-hidden="true" />
                    {t(agent.source)}
                  </>
                ) : (
                  t(agent.internal)
                )}
              </span>
            </>
          )
          return (
            <li key={p.id}>
              {p.repo ? (
                <a className={styles['projRow']} href={p.repo} target="_blank" rel="noopener noreferrer">
                  {body}
                </a>
              ) : (
                <div className={styles['projRow']} data-static>
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <PageLink id="projects">{t(agent.seeAllProjects)}</PageLink>
    </>
  )
}

/* ---------------------------------------------------------------- experience */
function ExperienceReply() {
  const { t } = useLocale()
  return (
    <>
      <Lead>{t(agent.leads.experience)}</Lead>
      <ol className={styles['roleList']}>
        {roles.map((r) => (
          <li key={r.id}>
            <span className={styles['roleDot']} data-current={r.current || undefined} aria-hidden="true" />
            <span className={styles['roleText']}>
              <span className={styles['roleTitle']}>
                {t(r.title)}
                {r.current ? <span className={styles['roleLive']}>{t(agent.current)}</span> : null}
              </span>
              <span className={styles['roleMeta']}>
                {t(r.company)} · {r.duration}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className={styles['subhead']}>{t(agent.education)}</p>
      <ul className={styles['eduList']}>
        {education.map((e) => (
          <li key={e.url}>
            <img src={e.crest} alt="" width={22} height={22} loading="lazy" />
            <span>
              {t(e.degree)} · {t(e.school)}
            </span>
            <span className={styles['roleMeta']}>{e.duration}</span>
          </li>
        ))}
      </ul>
      <PageLink id="work">{t(agent.seeExperience)}</PageLink>
    </>
  )
}

/* ---------------------------------------------------------------- one role */
function RoleReply({ id, lead }: { id: string; lead: { en: string; zh: string } }) {
  const { t } = useLocale()
  const role = roles.find((r) => r.id === id)
  if (!role) return null
  return (
    <>
      <Lead>{t(lead)}</Lead>
      <ol className={styles['bullets']}>
        {t(role.bullets).map((b) => (
          <li key={b.slice(0, 20)}>{b}</li>
        ))}
      </ol>
      <p className={styles['roleMeta']}>
        {t(role.title)} · {t(role.company)} · {role.duration}
      </p>
      <PageLink id="work">{t(agent.seeExperience)}</PageLink>
    </>
  )
}

/* -------------------------------------------------------------------- stack */
function StackReply() {
  const { t } = useLocale()
  return (
    <>
      <Lead>{t(agent.leads.stack)}</Lead>
      <dl className={styles['stackList']}>
        {techStack.map((g) => (
          <div key={g.id}>
            <dt>{t(g.label)}</dt>
            <dd>
              {g.items.map((i) => (
                <span key={i.name} className={styles['stackItem']}>
                  {i.name}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <PageLink id="stack">{t(agent.seeStack)}</PageLink>
    </>
  )
}

/* ------------------------------------------------------------------ contact */
const CONTACT_IDS = ['email', 'github', 'linkedin', 'bilibili', 'xiaohongshu', 'phone'] as const

function ContactReply() {
  const { t } = useLocale()
  const wechat = socials.find((s) => s.id === 'wechat')
  return (
    <>
      <Lead>{t(agent.leads.contact)}</Lead>
      <div className={styles['contact']}>
        <ul className={styles['contactList']}>
          {CONTACT_IDS.map((id) => {
            const s = socials.find((x) => x.id === id)
            if (!s) return null
            const href = t(s.href)
            const external = /^https?:/.test(href)
            return (
              <li key={id}>
                <a
                  className={styles['contactRow']}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles['contactLabel']}>{t(s.label)}</span>
                  <span className={styles['contactHint']}>{t(s.hint)}</span>
                </a>
              </li>
            )
          })}
        </ul>
        {wechat?.qr ? (
          <figure className={styles['qr']}>
            <img src={wechat.qr.image} alt={t(wechat.qr.alt)} width={120} height={120} loading="lazy" />
            <figcaption>{t(agent.wechat)}</figcaption>
          </figure>
        ) : null}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------- github */
function GithubReply() {
  const { t, locale } = useLocale()
  const state = useGithub(GITHUB_USER)
  const fmt = (s: string, vars: Record<string, string | number>) =>
    s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
  const profileLink = (
    <a className={styles['pageLink']} href={profile.github} target="_blank" rel="noopener noreferrer">
      <LuGithub aria-hidden="true" />
      {t(agent.openGithub)}
      <LuExternalLink aria-hidden="true" />
    </a>
  )

  if (state.status === 'loading') {
    return (
      <Stream key="loading" className={styles['streamPart']}>
        <Lead>{t(agent.leads.github)}</Lead>
        <p className={`${styles['muted']} ${styles['pulseText']}`}>{t(agent.github.loading)}</p>
      </Stream>
    )
  }
  if (state.status === 'error') {
    return (
      <Stream key="error" className={styles['streamPart']}>
        <Lead>{t(agent.github.error)}</Lead>
        {profileLink}
      </Stream>
    )
  }

  const { days, total, repos, user } = state.data
  /* Its own stream: the data lands after the reply has started, and this
     streams the second part in when it does. */
  return (
    <Stream key="ok" className={styles['streamPart']}>
      <Lead>{t(agent.leads.github)}</Lead>
      {days ? (
        <div className={styles['ghCard']}>
          <div className={styles['ghHead']}>
            <span>{total !== null ? fmt(t(agent.github.total), { n: total.toLocaleString(locale) }) : null}</span>
            {user ? (
              <span className={styles['muted']}>
                {user.public_repos} {t(agent.github.publicRepos)} · {user.followers} {t(agent.github.followers)}
              </span>
            ) : null}
          </div>
          <Calendar
            days={days}
            summary={total !== null ? fmt(t(agent.github.total), { n: total }) : t(agent.leads.github)}
            label={(d) => fmt(t(agent.github.contributionsOn), { n: d.count, date: d.date })}
          />
          <div className={styles['ghLegend']}>
            <span>{t(agent.github.less)}</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <i key={l} data-level={l} />
            ))}
            <span>{t(agent.github.more)}</span>
          </div>
        </div>
      ) : null}
      {repos && repos.length ? (
        <>
          <p className={styles['subhead']}>{t(agent.github.repos)}</p>
          <ul className={styles['repoList']}>
            {repos.map((r) => (
              <li key={r.name}>
                <a className={styles['repoRow']} href={r.html_url} target="_blank" rel="noopener noreferrer">
                  <span className={styles['repoName']}>{r.name}</span>
                  {r.description ? <span className={styles['repoDesc']}>{r.description}</span> : null}
                  <span className={styles['repoMeta']}>
                    {r.language ? <span>{r.language}</span> : null}
                    {r.stargazers_count > 0 ? (
                      <span>
                        <LuStar aria-hidden="true" /> {r.stargazers_count}
                      </span>
                    ) : null}
                    <span>{new Date(r.pushed_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {profileLink}
    </Stream>
  )
}

/**
 * The contribution calendar: one column per week, Sunday at the top, the way
 * GitHub draws it. Leading days before the first Sunday are padded so every
 * column is a real week. Each cell's level (0-4) comes from the data source -
 * GitHub's own quartile buckets - and maps to a step of the accent.
 */
function Calendar({
  days,
  summary,
  label,
}: {
  days: ContributionDay[]
  /** Read out in place of the grid - a year of cells is not a useful list. */
  summary: string
  label: (d: ContributionDay) => string
}) {
  const first = days[0] ? new Date(`${days[0].date}T00:00:00`).getDay() : 0
  const cells: (ContributionDay | null)[] = [...Array.from({ length: first }, () => null), ...days]
  const weeks = Math.ceil(cells.length / 7)
  return (
    /* Starts scrolled to the right on a narrow window, so the most recent
       weeks - the ones a visitor cares about - are the ones in view. */
    <div
      className={styles['calScroll']}
      ref={(el) => {
        if (el) el.scrollLeft = el.scrollWidth
      }}
    >
      <div
        className={styles['calendar']}
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(7px, 1fr))` }}
        role="img"
        aria-label={summary}
      >
        {cells.map((d, i) =>
          d ? <i key={d.date} data-level={d.level} title={label(d)} /> : <i key={`pad-${i}`} data-pad />,
        )}
      </div>
    </div>
  )
}
