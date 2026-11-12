import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { education, roles, trackLabels, type Education, type Role, type Track } from '@/content/experience'
import type { Localized } from '@/content/types'
import Reveal from '@/components/Reveal'
import RichText from '@/components/RichText'
import styles from './Work.module.css'

/**
 * Experience as a timeline, not a list.
 *
 * Every role and every degree is a bar on one year axis, in date order from
 * the top down, so the career reads as a staircase stepping to the right -
 * and the things a list cannot show are simply visible: the internships sat
 * inside the undergraduate years, the CAIT research overlapped the master's,
 * and the NIO bar runs on into the "now" line.
 *
 * Each row is a button. The chosen one's detail sits under the chart at full
 * width, so nothing is said twice (the bar carries a short name, the detail
 * the full one) and the detail is never a narrow column with empty space
 * beside it. The detail area sizes to what it holds and eases between
 * heights as the selection changes.
 *
 * Tabs to assistive tech: the rows are a vertical tablist, arrow keys move
 * between them, Home / End jump to the ends.
 */

type Kind = Track | 'edu'

interface Entry {
  key: string
  kind: Kind
  start: number // months since year 0
  end: number
  current: boolean
  label: Localized
  role?: Role
  edu?: Education
}

const NOW = (() => {
  const d = new Date()
  return d.getFullYear() * 12 + d.getMonth()
})()

/** "06/2026" -> months; "Present" -> now. */
const ym = (s: string) => {
  const t = s.trim()
  if (/present/i.test(t)) return NOW
  const [m, y] = t.split('/').map(Number)
  return (y ?? 0) * 12 + ((m ?? 1) - 1)
}

const span = (duration: string) => duration.split('—').map((p) => p.trim()) as [string, string]

const ENTRIES: Entry[] = [
  ...roles.map((r): Entry => {
    const [a, b] = span(r.duration)
    return {
      key: r.id,
      kind: r.track,
      start: ym(a),
      end: ym(b),
      current: !!r.current,
      label: site.work.short[r.id as keyof typeof site.work.short] ?? r.company,
      role: r,
    }
  }),
  ...education.map((e): Entry => {
    const [a, b] = span(e.duration)
    /* Academic years: September of the first year to June of the last. */
    return {
      key: e.url,
      kind: 'edu',
      start: Number(a) * 12 + 8,
      end: Number(b) * 12 + 5,
      current: false,
      label: site.work.eduShort[e.url as keyof typeof site.work.eduShort] ?? e.school,
      edu: e,
    }
  }),
].sort((x, y) => x.start - y.start)

/* The axis: from January of the first year to January after "now". */
const AXIS_START = Math.floor(Math.min(...ENTRIES.map((e) => e.start)) / 12) * 12
const AXIS_END = (Math.floor(Math.max(NOW, ...ENTRIES.map((e) => e.end)) / 12) + 1) * 12
const pct = (m: number) => ((m - AXIS_START) / (AXIS_END - AXIS_START)) * 100
const YEARS = Array.from({ length: (AXIS_END - AXIS_START) / 12 + 1 }, (_, i) => AXIS_START / 12 + i)

/** "2020 – 2024", "2023" for a span inside one year, "2026 – now" if current. */
const yearSpan = (e: Entry, now: string) => {
  const a = Math.floor(e.start / 12)
  if (e.current) return `${a} – ${now}`
  const b = Math.floor(e.end / 12)
  return a === b ? String(a) : `${a} – ${b}`
}

/** Default selection: the current role, else the latest entry. */
const CURRENT = ENTRIES.findIndex((e) => e.current)
const DEFAULT = CURRENT >= 0 ? CURRENT : ENTRIES.length - 1

export default function Work() {
  const { t } = useLocale()
  const [index, setIndex] = useState(DEFAULT)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])

  /*
   * The detail area is as tall as the entry it shows - a degree is a few
   * lines, a role a full list - and animates between heights rather than
   * jumping. Only the chosen entry is rendered; its height is measured and
   * written to the wrapper, which transitions to it. Re-measured when the
   * content itself resizes (a language switch, a narrower window).
   */
  const innerRef = useRef<HTMLDivElement>(null)
  const [detailsH, setDetailsH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    const measure = () => setDetailsH(inner.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [index])

  const select = (i: number) => {
    setIndex(i)
    rowRefs.current[i]?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = ENTRIES.length - 1
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? Math.min(index + 1, last)
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? Math.max(index - 1, 0)
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    select(next)
  }

  const kindLabel = (k: Kind) => (k === 'edu' ? site.work.eduKind : trackLabels[k])

  return (
    <section id="work" className={`container ${styles['section']}`} aria-labelledby="work-title">
      <Reveal className={styles['head']}>
        <h2 id="work-title" className="text-h1">
          <RichText tone="heading">{t(ui.sections.work.title)}</RichText>
        </h2>
        {/* What the bar styles mean. */}
        <ul className={styles['legend']} aria-hidden="true">
          {(['work', 'research', 'internship', 'edu'] as const).map((k) => (
            <li key={k} data-kind={k}>
              <i />
              {t(kindLabel(k))}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className={`panel ${styles['card']}`}>
        {/* The selected entry's span, shared by the column through the chart
            and the segment on the divider under it. */}
        <div
          className={styles['body']}
          style={
            {
              '--sel-start': `${pct(ENTRIES[index]!.start)}%`,
              '--sel-end': `${pct(Math.max(ENTRIES[index]!.end, ENTRIES[index]!.start + 1))}%`,
            } as CSSProperties
          }
        >
          <div className={styles['chart']}>
            {/* Only year labels and the "now" line - no grid. The bars carry
                the chart; anything more behind them competed with them. */}
            <div className={styles['axis']} aria-hidden="true">
              {YEARS.map((y) => (
                <span key={`tick-${y}`} className={styles['yearTick']} style={{ left: `${pct(y * 12)}%` }} />
              ))}
              {/* Each year's label centred over its span, not beside its
                  January line - so the chart's closing boundary has no label
                  hanging off the edge. */}
              {YEARS.slice(0, -1).map((y, i) => (
                <span
                  key={`label-${y}`}
                  className={styles['tickLabel']}
                  data-minor={i % 2 === 1 || undefined}
                  style={{ left: `${pct(y * 12 + 6)}%` }}
                >
                  {y}
                </span>
              ))}
              <span className={styles['now']} style={{ left: `${pct(NOW)}%` }}>
                <span className={styles['nowLabel']}>{t(site.work.now)}</span>
              </span>
            </div>

            <div
              className={styles['rows']}
              role="tablist"
              aria-orientation="vertical"
              aria-labelledby="work-title"
              onKeyDown={onKey}
            >
              {ENTRIES.map((e, i) => {
                const left = pct(e.start)
                const right = pct(Math.max(e.end, e.start + 1))
                /* Labels sit after the bar, or before it once the bar is far
                   enough right that a label after it would run off the chart. */
                const flip = right > 72
                const style = { '--tl-start': `${left}%`, '--tl-end': `${right}%`, '--i': i } as CSSProperties
                return (
                  <button
                    key={e.key}
                    ref={(el) => {
                      rowRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`tl-tab-${i}`}
                    aria-selected={i === index}
                    aria-controls="tl-panel"
                    tabIndex={i === index ? 0 : -1}
                    className={styles['row']}
                    data-kind={e.kind}
                    data-current={e.current || undefined}
                    data-flip={flip || undefined}
                    style={style}
                    onClick={() => select(i)}
                  >
                    <span className={styles['bar']} aria-hidden="true" />
                    <span className={styles['label']}>
                      <span className={styles['labelName']}>{t(e.label)}</span>
                      {/* Years, shown only on a phone: there the rows are a
                          list, and the narrow chart is too small to read a
                          bar's dates off it. */}
                      <span className={styles['labelYears']}>{yearSpan(e, t(site.work.now))}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* The divider between chart and detail, with the selected span
              lit on it - the detail below belongs to that stretch of time. */}
          <div className={styles['divider']} aria-hidden="true">
            <span />
          </div>

          <div
            className={styles['details']}
            style={detailsH === null ? undefined : { height: detailsH }}
          >
            {/* Keyed on the entry, so each change replays the entrance. */}
            <div ref={innerRef} key={ENTRIES[index]!.key}>
              <article
                id="tl-panel"
                role="tabpanel"
                aria-labelledby={`tl-tab-${index}`}
                className={styles['detail']}
              >
                {ENTRIES[index]!.role ? (
                  <RoleDetail role={ENTRIES[index]!.role!} />
                ) : ENTRIES[index]!.edu ? (
                  <EduDetail edu={ENTRIES[index]!.edu!} />
                ) : null}
              </article>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/*
 * One column, one left edge: the title with its tags on the same row, the
 * organisation under it, then a single meta line - dates and focus - and the
 * bullets. A degree adds its crest as a column of its own beside all of it,
 * so the text still shares one edge.
 */

function Tags({ kind, current }: { kind: Kind; current?: boolean }) {
  const { t } = useLocale()
  return (
    <div className={styles['tags']}>
      {current ? (
        <span className={styles['live']}>
          <span className={styles['liveDot']} aria-hidden="true" />
          {t(site.work.current)}
        </span>
      ) : null}
      <span className={styles['track']}>{t(kind === 'edu' ? site.work.eduKind : trackLabels[kind])}</span>
    </div>
  )
}

function MetaLine({ period, focus }: { period: string; focus?: string | undefined }) {
  return (
    <p className={styles['metaLine']}>
      <time className={styles['duration']}>{period}</time>
      {focus ? (
        <>
          <span className={styles['metaDot']} aria-hidden="true" />
          <span className={styles['focus']}>{focus}</span>
        </>
      ) : null}
    </p>
  )
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles['bullets']}>
      {items.map((b) => (
        <li key={b.slice(0, 24)}>{b}</li>
      ))}
    </ul>
  )
}

function RoleDetail({ role }: { role: Role }) {
  const { t } = useLocale()
  const text = (
    <div className={styles['text']}>
      <div className={styles['titleRow']}>
        <h3 className={styles['role']}>{t(role.title)}</h3>
        <Tags kind={role.track} current={!!role.current} />
      </div>
      {role.companyUrl ? (
        <a className={styles['company']} href={role.companyUrl} target="_blank" rel="noopener noreferrer">
          {t(role.company)}
          <LuArrowUpRight aria-hidden="true" />
        </a>
      ) : (
        <p className={styles['company']}>{t(role.company)}</p>
      )}
      <MetaLine period={role.duration} focus={t(role.focus)} />
      <Bullets items={t(role.bullets)} />
    </div>
  )
  /* With a logo, the same crest column a degree has; without, text only. */
  return role.logo ? (
    <div className={styles['withCrest']}>
      <img
        className={styles['crest']}
        data-tile={role.logoTile || undefined}
        data-on-dark={role.logoOnDark || undefined}
        src={role.logo}
        alt=""
        width={48}
        height={48}
        loading="lazy"
      />
      {text}
    </div>
  ) : (
    text
  )
}

function EduDetail({ edu }: { edu: Education }) {
  const { t } = useLocale()
  return (
    <div className={styles['withCrest']}>
      <img className={styles['crest']} src={edu.crest} alt="" width={48} height={48} loading="lazy" />
      <div className={styles['text']}>
        <div className={styles['titleRow']}>
          <h3 className={styles['role']}>{t(edu.degree)}</h3>
          <Tags kind="edu" />
        </div>
        <a className={styles['company']} href={edu.url} target="_blank" rel="noopener noreferrer">
          {t(edu.school)}
          <LuArrowUpRight aria-hidden="true" />
        </a>
        <MetaLine period={edu.period ?? edu.duration} focus={edu.focus ? t(edu.focus) : undefined} />
        {edu.notes ? <Bullets items={t(edu.notes)} /> : null}
      </div>
    </div>
  )
}
