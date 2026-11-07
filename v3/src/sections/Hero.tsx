import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { LuArrowUpRight, LuMapPin } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import { useScrollTilt } from '@/lib/useScrollTilt'
import AgentWindow from '@/components/AgentWindow'
import CvDownload from '@/components/CvDownload'
import HeroSky from '@/components/fx/HeroSky'
import styles from './Hero.module.css'

/**
 * One block's entrance - rise in px, starting blur in px, duration and delay
 * in seconds. The reference's values; see `.hero-enter` in base.css.
 */
const enter = (y: number, blur: number, dur: number, delay: number) =>
  ({
    '--enter-y': `${y}px`,
    '--enter-blur': `${blur}px`,
    '--enter-dur': `${dur}s`,
    '--enter-delay': `${delay}s`,
  }) as CSSProperties

export default function Hero() {
  const { t, locale } = useLocale()
  const { sectionRef, targetRef } = useScrollTilt<HTMLElement, HTMLDivElement>()

  /*
   * A change of language replays the entrance, as on the reference, where the
   * switch loads the other locale's page and its hero enters afresh. Here
   * nothing reloads: the animations are restarted in place - cleared, a
   * reflow, restored - so the agent window keeps its conversation and its
   * intro is not played twice. A layout effect, so the new copy is never
   * painted once at rest before the replay hides it.
   */
  const firstLocale = useRef(locale)
  useLayoutEffect(() => {
    if (locale === firstLocale.current) return
    firstLocale.current = locale
    sectionRef.current?.querySelectorAll<HTMLElement>('.hero-enter').forEach((el) => {
      el.style.animation = 'none'
      void el.offsetWidth
      el.style.animation = ''
    })
  }, [locale, sectionRef])

  return (
    <section ref={sectionRef} id="top" className={styles['hero']} aria-labelledby="hero-title">
      {/* Only the bloom behind the headline. The dot field this used to hold
          is gone: v2's lens field (components/fx) now covers the whole page,
          and a second grid at a different pitch beat against it. */}
      <div className={styles['field']} aria-hidden="true">
        <HeroSky className={styles['sky']} />
      </div>

      <div className={`container ${styles['inner']}`}>
        <div className={styles['copy']}>
          <div className={`hero-enter ${styles['heading']}`} style={enter(24, 10, 0.9, 0)}>
            <span className={styles['badge']}>
              <LuMapPin className={styles['pin']} aria-hidden="true" />
              {t(site.hero.label)}
            </span>
            <h1 id="hero-title" className="text-hero">
              {t(site.hero.headline)}
            </h1>
          </div>

          <div className={`hero-enter ${styles['lines']}`} style={enter(20, 8, 0.8, 0.15)}>
            {t(site.hero.lines).map((line) => (
              <p key={line} className="text-body description">
                {line}
              </p>
            ))}
          </div>

          <div className={`hero-enter ${styles['actions']}`} style={enter(16, 0, 0.7, 0.3)}>
            <CvDownload size="m" placement="bottom" />
            {/* v2's figure for this link: a trailing ↗ that nudges on hover. */}
            <a className={`btn btn-secondary ${styles['viewWork']}`} href="#projects">
              {t(site.hero.viewWork)}
              <LuArrowUpRight aria-hidden="true" className={styles['trailing']} />
            </a>
          </div>
        </div>

        <div className={`hero-enter ${styles['preview']}`} style={enter(20, 0, 0.8, 0.4)}>
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
