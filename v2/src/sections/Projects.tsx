import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuArrowUpRight, LuGithub } from 'react-icons/lu'
import Section from '@/components/Section'
import Reveal from '@/components/Reveal'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { domainLabels, projects, type ProjectDomain } from '@/content/projects'
import { ui } from '@/content/copy'
import styles from './Projects.module.css'

type Filter = ProjectDomain | 'all'

export default function Projects() {
  const { t, locale } = useLocale()
  const reducedMotion = usePrefersReducedMotion()
  const [filter, setFilter] = useState<Filter>('all')

  // Only offer a chip for a domain that actually has projects behind it - an
  // empty filter is a dead end the visitor has to back out of.
  const filters = useMemo(() => {
    const present = new Set<ProjectDomain>()
    projects.forEach((project) => project.domains.forEach((domain) => present.add(domain)))
    return (['all', ...present] as Filter[]).map((id) => ({
      id,
      label: id === 'all' ? ui.actions.all : domainLabels[id],
      count: id === 'all' ? projects.length : projects.filter((p) => p.domains.includes(id)).length,
    }))
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.domains.includes(filter))),
    [filter],
  )

  return (
    <Section
      id="projects"
      title={ui.sections.projects.title}
      aside={
        <div className={styles['filters']} role="group" aria-label={t(ui.sections.projects.filter)}>
          {filters.map((entry) => {
            const isActive = filter === entry.id
            return (
              <button
                key={entry.id}
                type="button"
                className={styles['chip']}
                data-active={isActive || undefined}
                aria-pressed={isActive}
                onClick={() => setFilter(entry.id)}
              >
                {/* Locale-scoped for the same reason as the nav indicator: the
                    pill should travel when you pick a different filter, not when
                    every chip around it changes width at once. See Nav.tsx. */}
                {isActive ? (
                  <motion.span
                    key={locale}
                    layoutId={`filter-pill-${locale}`}
                    className={styles['chipPill']}
                    transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                  />
                ) : null}
                <span className={styles['chipLabel']}>{t(entry.label)}</span>
                <span className={styles['chipCount']}>{entry.count}</span>
              </button>
            )
          })}
        </div>
      }
    >
      {/* Screen readers get told what the filter did; sighted users can see it. */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {visible.length} {t(ui.sections.projects.count)}
      </p>

      {/*
       * Two separate events, two separate mechanisms.
       *
       * The grid's *first* appearance is a scroll entrance, and <Reveal> owns it
       * at block level. A filter change is a different thing entirely - the
       * visitor is already looking at the grid and just pressed something - so
       * the cards animate on mount/unmount instead.
       *
       * The cards used to drive their entrance from `whileInView`, which
       * conflated the two: a card returning to a filter while the section was
       * already on screen had to wait for an IntersectionObserver callback, so it
       * spent a frame at opacity 0 and flashed.
       *
       * `layout` lets survivors slide physically to their new slots rather than
       * the grid blinking out and back, and `popLayout` pulls a leaving card out
       * of the layout calculation immediately so the others do not wait for its
       * exit to finish.
       */}
      <Reveal>
        <motion.ul className={styles['grid']} layout={!reducedMotion}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.li
                key={project.id}
                layout={!reducedMotion}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.52,
                    ease: [0.16, 1, 0.3, 1],
                    // Position in the *new* arrangement, capped: past the sixth
                    // card a per-index delay stops reading as a cascade and
                    // starts reading as lag.
                    delay: Math.min(index, 5) * 0.04,
                  },
                }}
                // Leaving is faster than arriving, and drops rather than rises -
                // nothing about an exit deserves to be watched.
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18, ease: 'easeIn' } }}
              >
                <GlassSurface
                  radius="lg"
                  interactive
                  className={styles['card']}
                  lightAngle={135 + (index % 4) * 12}
                >
                  <div className={styles['body']}>
                    {/*
                     * The assets are 1024x1024 project marks, not screenshots, so
                     * they are presented as app icons - square, rounded, sitting
                     * beside the title. Cropping a logo into a 16:9 banner is how
                     * you end up showing the middle third of someone's wordmark.
                     */}
                    <header className={styles['head']}>
                      <span className={styles['icon']}>
                        <img
                          src={project.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={128}
                          height={128}
                        />
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
                      <a
                        className={styles['repo']}
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LuGithub aria-hidden="true" />
                        <span>{t(ui.actions.source)}</span>
                        <LuArrowUpRight aria-hidden="true" />
                        <span className="visually-hidden">— {t(project.title)}</span>
                      </a>
                    ) : (
                      <p className={styles['private']}>
                        {t({ en: 'Internal — source not public', zh: '企业内部项目 · 源码未公开' })}
                      </p>
                    )}
                  </div>
                </GlassSurface>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </Reveal>
    </Section>
  )
}
