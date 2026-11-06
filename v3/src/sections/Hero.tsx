import type { CSSProperties } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import { useScrollTilt } from '@/lib/useScrollTilt'
import AgentWindow from '@/components/AgentWindow'
import CvDownload from '@/components/CvDownload'
import styles from './Hero.module.css'

/** Staggers the load-time entrance; see `.hero-enter` in base.css. */
const delay = (s: number) => ({ '--enter-delay': `${s}s` }) as CSSProperties

export default function Hero() {
  const { t } = useLocale()
  const { sectionRef, targetRef } = useScrollTilt<HTMLElement, HTMLDivElement>()

  return (
    <section ref={sectionRef} id="top" className={styles['hero']} aria-labelledby="hero-title">
      {/* Only the bloom behind the headline. The dot field this used to hold
          is gone: v2's lens field (components/fx) now covers the whole page,
          and a second grid at a different pitch beat against it. */}
      <div className={styles['field']} aria-hidden="true" />

      <div className={`container ${styles['inner']}`}>
        <div className={styles['copy']}>
          <div className={`hero-enter ${styles['heading']}`}>
            <span className="eyebrow">
              <span className={styles['pulse']} aria-hidden="true" />
              {t(site.hero.label)}
            </span>
            <h1 id="hero-title" className="text-hero">
              {t(site.hero.headline)}
            </h1>
          </div>

          <div className={`hero-enter ${styles['lines']}`} style={delay(0.1)}>
            {t(site.hero.lines).map((line) => (
              <p key={line} className="text-body description">
                {line}
              </p>
            ))}
          </div>

          <div className={`hero-enter ${styles['actions']}`} style={delay(0.2)}>
            <CvDownload size="m" placement="bottom" />
            {/* v2's figure for this link: a trailing ↗ that nudges on hover. */}
            <a className={`btn btn-secondary ${styles['viewWork']}`} href="#projects">
              {t(site.hero.viewWork)}
              <LuArrowUpRight aria-hidden="true" className={styles['trailing']} />
            </a>
          </div>
        </div>

        <div className={`hero-enter ${styles['preview']}`} style={delay(0.4)}>
          {/* An inner wrapper takes the tilt: the outer one runs the load-time
              entrance, which animates `transform` itself. */}
          <div ref={targetRef} className={styles['tilt']}>
            <AgentWindow />
          </div>
        </div>
      </div>
    </section>
  )
}
