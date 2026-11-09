import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { LuArrowUpRight, LuGithub } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { domainLabels, projects, type ProjectDomain } from '@/content/projects'
import Reveal from '@/components/Reveal'
import RichText from '@/components/RichText'
import { LensFilter, useLensMap } from '@/components/LensFilter'
import styles from './Projects.module.css'

type Filter = 'all' | ProjectDomain

/** The indicator's lens - a trial: a 10px bevel on a 34px pill, 9px of throw
    at the rim. Refracts only where the engine can (see lib/refraction.ts). */
const LENS = { bevel: 10, falloff: 2, scale: 18, dispersion: 0.12 }

/** Domains in the order they first appear, so the filter row follows the
 *  grid's own ordering rather than an alphabet. Empty domains never show. */
const DOMAINS: readonly ProjectDomain[] = [...new Set(projects.flatMap((p) => p.domains))]

/**
 * Projects, in v2's layout: the title with the filter set opposite it, then a
 * grid of cards. Each card leads with the project's app icon beside its kind,
 * year and name; the summary is clamped to four lines so the row of cards
 * keeps one rhythm; the tags sit on the bottom edge whatever the summary's
 * length; and the source link, or a note that the source is not public, closes
 * the card under a hairline.
 */
export default function Projects() {
  const { t, locale } = useLocale()
  const [filter, setFilter] = useState<Filter>('all')

  /*
   * The sliding indicator: one pill behind the buttons, placed over the active
   * one by measuring it. Its two edges are separate custom properties (`--l`,
   * `--r`) so each can travel on its own curve - see `.indicator` in the CSS.
   * `dir` records which way the last move went, which decides which edge
   * leads. Re-measured when the filter, the language (labels change width) or
   * the row's size changes.
   */
  const rowRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef(new Map<Filter, HTMLButtonElement>())
  const [edges, setEdges] = useState<{ l: number; r: number; dir: 'left' | 'right' } | null>(null)
  const [settled, setSettled] = useState(false)
  const [indicator, setIndicator] = useState<HTMLSpanElement | null>(null)
  const lens = useLensMap(indicator, LENS)

  useLayoutEffect(() => {
    const row = rowRef.current
    if (!row) return
    const measure = () => {
      const button = buttonRefs.current.get(filter)
      if (!button) return
      const l = button.offsetLeft
      const r = l + button.offsetWidth
      setEdges((prev) => ({ l, r, dir: prev && l < prev.l ? 'left' : 'right' }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [filter, locale])

  /* No transition on the very first placement - the pill should start under
     "All", not slide in from the row's left edge. */
  useEffect(() => {
    if (edges && !settled) requestAnimationFrame(() => setSettled(true))
  }, [edges, settled])

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.domains.includes(filter))),
    [filter],
  )

  const options: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: t(ui.actions.all), count: projects.length },
    ...DOMAINS.map((d) => ({
      value: d,
      label: t(domainLabels[d]),
      count: projects.filter((p) => p.domains.includes(d)).length,
    })),
  ]

  return (
    <section id="projects" className={`container ${styles['section']}`} aria-labelledby="projects-title">
      <Reveal className={styles['head']}>
        <h2 id="projects-title" className="text-h1">
          <RichText tone="heading">{t(ui.sections.projects.title)}</RichText>
        </h2>
        <div ref={rowRef} className={styles['filters']} role="group" aria-label={t(ui.sections.projects.filter)}>
          {lens ? <LensFilter id="filter-lens" href={lens} scale={LENS.scale} dispersion={LENS.dispersion} /> : null}
          {edges ? (
            <span
              ref={setIndicator}
              className={styles['indicator']}
              data-dir={edges.dir}
              data-settled={settled || undefined}
              data-lens={lens ? '' : undefined}
              style={{ '--l': `${edges.l}px`, '--r': `${edges.r}px` } as CSSProperties}
              aria-hidden="true"
            />
          ) : null}
          {options.map(({ value, label, count }) => (
            <button
              key={value}
              ref={(el) => {
                if (el) buttonRefs.current.set(value, el)
                else buttonRefs.current.delete(value)
              }}
              type="button"
              className={styles['filter']}
              data-active={filter === value || undefined}
              aria-pressed={filter === value}
              onClick={(e) => {
                setFilter(value)
                /* On a phone the row scrolls sideways; bring the choice into
                   view so the pill never slides off the edge. */
                e.currentTarget.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
              }}
            >
              {label}
              <span className={styles['count']}>{count}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Screen readers are told what the filter did; sighted readers see it. */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {visible.length} {t(ui.sections.projects.count)}
      </p>

      {/* Keyed on the filter so a change re-runs the entrance for the new set,
          rather than leaving cards already shown frozen while others pop in. */}
      <ul className={styles['grid']} key={filter}>
        {visible.map((project, index) => (
          <Reveal as="li" key={project.id} className={styles['cell']} delay={Math.min(index, 5) * 0.04}>
            <article className={`panel ${styles['card']}`}>
              <header className={styles['cardHead']}>
                <span className={styles['icon']}>
                  <img src={project.image} alt="" width={128} height={128} loading="lazy" decoding="async" />
                </span>
                <div className={styles['heading']}>
                  <p className={styles['kind']}>
                    {t(project.kind)}
                    <span className={styles['dot']} aria-hidden="true" />
                    <span className={styles['year']}>{project.year}</span>
                  </p>
                  <h3 className={styles['title']}>{t(project.title)}</h3>
                </div>
              </header>

              <p className={styles['summary']}>{t(project.summary)}</p>

              <ul className={styles['tags']}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              {project.repo ? (
                <a className={styles['repo']} href={project.repo} target="_blank" rel="noopener noreferrer">
                  <LuGithub aria-hidden="true" />
                  <span>{t(ui.actions.source)}</span>
                  <LuArrowUpRight aria-hidden="true" className={styles['arrow']} />
                  <span className="visually-hidden">— {t(project.title)}</span>
                </a>
              ) : (
                <p className={styles['private']}>{t(site.projects.private)}</p>
              )}
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
