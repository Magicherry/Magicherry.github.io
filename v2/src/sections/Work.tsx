import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { LuArrowUpRight, LuGraduationCap } from 'react-icons/lu'
import Section from '@/components/Section'
import Reveal from '@/components/Reveal'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { education, roles, trackLabels } from '@/content/experience'
import { ui } from '@/content/copy'
import styles from './Work.module.css'

export default function Work() {
  const { t } = useLocale()
  const reducedMotion = usePrefersReducedMotion()
  const timelineRef = useRef<HTMLOListElement>(null)

  /*
   * The rail fills as the timeline passes through the viewport. The offsets
   * anchor "empty" to the moment the list's top reaches 85% down the screen and
   * "full" to the moment its bottom reaches 55% - so the line completes as you
   * read the last entry, not once the section has already scrolled away.
   */
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 55%'],
  })
  const railScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })

  /*
   * Light each node as the rail reaches it.
   *
   * The rail's fill is a `scaleY` on the same vertical axis the nodes sit on, so
   * a node is reached exactly when that scale passes the node's own fraction of
   * the rail's height. Measuring gives that fraction directly - which matters
   * because the cards are wildly different heights and get taller again when the
   * text wraps, so nothing about the spacing is derivable up front. An
   * IntersectionObserver on a fixed viewport line would drift away from the rail
   * head instead of tracking it, and drift is precisely what reads as broken.
   *
   * The attribute is written straight to the DOM rather than held in state: this
   * runs on every frame of a spring, and re-rendering five glass cards per frame
   * to change one dot's colour is how a scroll starts to stutter.
   */
  const wrapRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    const rail = railRef.current
    if (!wrap || !rail) return

    let marks: number[] = []
    // Only touch the DOM on an actual transition; a spring settles over many
    // frames and would otherwise rewrite the same attribute on every one.
    let lit: boolean[] = []

    const paint = (progress: number) => {
      nodeRefs.current.forEach((node, index) => {
        if (!node) return
        const next = progress >= (marks[index] ?? 1)
        if (next === lit[index]) return
        lit[index] = next
        if (next) node.dataset['lit'] = ''
        else delete node.dataset['lit']
      })
    }

    /*
     * `offsetTop`, not `getBoundingClientRect`. Every entry is wrapped in a
     * Reveal that holds it at `y: 26` until it scrolls into view, and a rect is
     * measured *after* transforms - so entries below the fold would each report
     * a position 26px low, and the error would then disappear as they animated
     * in. Offsets are layout metrics and ignore transforms entirely.
     */
    const offsetWithin = (el: HTMLElement) => {
      let y = 0
      let cursor: HTMLElement | null = el
      while (cursor && cursor !== wrap) {
        y += cursor.offsetTop
        cursor = cursor.offsetParent as HTMLElement | null
      }
      return y
    }

    const measure = () => {
      const height = rail.offsetHeight
      if (height === 0) return
      const top = rail.offsetTop
      marks = nodeRefs.current.map((node) =>
        node ? (offsetWithin(node) + node.offsetHeight / 2 - top) / height : 1,
      )
      lit = []
      paint(reducedMotion ? 1 : railScale.get())
    }

    measure()
    // Cards reflow on resize, on locale switch, and as fonts settle. The rail's
    // own height changing is the one signal that covers all three.
    const observer = new ResizeObserver(measure)
    observer.observe(rail)

    const unsubscribe = reducedMotion ? undefined : railScale.on('change', paint)

    return () => {
      observer.disconnect()
      unsubscribe?.()
    }
  }, [railScale, reducedMotion])

  return (
    <Section
      id="work"
      title={ui.sections.work.title}
      aside={<p className={styles['order']}>{t(ui.sections.work.order)}</p>}
    >
      <div className={styles['timelineWrap']} ref={wrapRef}>
        <div className={styles['rail']} ref={railRef} aria-hidden="true">
          <motion.span
            className={styles['railFill']}
            style={reducedMotion ? { scaleY: 1 } : { scaleY: railScale }}
          />
        </div>

        <ol className={styles['timeline']} ref={timelineRef}>
          {roles.map((role, index) => (
            <li key={role.id} className={styles['entry']}>
              <Reveal direction="up" delay={index * 0.04} className={styles['entryInner']}>
                <span className={styles['node']} aria-hidden="true">
                  <span
                    className={styles['nodeCore']}
                    ref={(el) => {
                      nodeRefs.current[index] = el
                    }}
                    data-current={role.current || undefined}
                  />
                </span>

                <GlassSurface radius="lg" className={styles['card']} lightAngle={148}>
                  <header className={styles['cardHead']}>
                    <div className={styles['tags']}>
                      <span className={styles['track']}>{t(trackLabels[role.track])}</span>
                      {role.current ? (
                        <span className={styles['live']}>
                          <span className={styles['liveDot']} aria-hidden="true" />
                          {t(ui.sections.work.current)}
                        </span>
                      ) : null}
                    </div>
                    <time className={styles['duration']}>{role.duration}</time>
                  </header>

                  <h3 className={styles['role']}>{t(role.title)}</h3>

                  {role.companyUrl ? (
                    <a
                      className={styles['company']}
                      href={role.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(role.company)}
                      <LuArrowUpRight aria-hidden="true" />
                    </a>
                  ) : (
                    <p className={styles['company']}>{t(role.company)}</p>
                  )}

                  <p className={styles['focus']}>{t(role.focus)}</p>

                  <ul className={styles['bullets']}>
                    {t(role.bullets).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                </GlassSurface>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <Reveal className={styles['education']}>
        <h3 className={styles['educationTitle']}>
          <LuGraduationCap aria-hidden="true" />
          {t(ui.sections.work.education)}
        </h3>
        <div className={styles['educationGrid']}>
          {education.map((entry) => (
            <GlassSurface
              key={entry.duration}
              as="a"
              variant="thin"
              radius="md"
              interactive
              className={styles['degree']}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Decorative: the school's name is right beside it in text, so an
                  alt here would just be read out twice. */}
              <span className={styles['crest']}>
                <img src={entry.crest} alt="" width={40} height={40} loading="lazy" decoding="async" />
              </span>

              <span className={styles['degreeText']}>
                <span className={styles['degreeName']}>{t(entry.degree)}</span>
                <span className={styles['school']}>
                  {t(entry.school)}
                  <LuArrowUpRight aria-hidden="true" />
                </span>
              </span>

              {/* Pushed to the trailing edge, matching the experience cards
                  above: the year is metadata, not part of the title block. */}
              <time className={`${styles['duration']} ${styles['degreeYear']}`}>{entry.duration}</time>
            </GlassSurface>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
