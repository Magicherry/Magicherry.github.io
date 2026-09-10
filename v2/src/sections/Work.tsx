import { useRef } from 'react'
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

  return (
    <Section
      id="work"
      title={ui.sections.work.title}
      aside={<p className={styles['order']}>{t(ui.sections.work.order)}</p>}
    >
      <div className={styles['timelineWrap']}>
        <div className={styles['rail']} aria-hidden="true">
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
                  <span className={styles['nodeCore']} data-current={role.current || undefined} />
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
