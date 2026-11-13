import { useEffect, useRef, useState } from 'react'
import { LuArrowUp, LuLanguages } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import styles from './BackToTop.module.css'

/** Past this many pixels the floating controls appear - v2's threshold. */
const APPEAR_AT = 340

/**
 * v2's back-to-top button: a glass disc in the bottom-right corner, ringed by
 * a gauge that fills with the reader's progress down the page. At the very
 * bottom the gauge is complete and the disc fills with the accent.
 *
 * v2 drove all of it through Motion (`useScroll`, `pathLength`). v3 has no
 * motion library, so one passive scroll listener does the same: it writes the
 * ring's dash offset directly, every animation frame at most, and touches
 * React state only when `visible` or `complete` actually flips.
 *
 * The language shortcut shares the same wrapper, so both controls enter and
 * leave together. Hidden means unreachable, not merely invisible - no pointer
 * events and out of the tab order - so neither swallows a click or a Tab.
 */
export default function BackToTop() {
  const { t, toggle } = useLocale()
  const [visible, setVisible] = useState(false)
  const [complete, setComplete] = useState(false)
  const barRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0
      // `pathLength="1"` on the circle makes the dash offset a plain fraction.
      barRef.current?.style.setProperty('stroke-dashoffset', String(1 - progress))
      setVisible(y > APPEAR_AT)
      setComplete(progress >= 0.995)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toTop = () => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' })
  }

  return (
    <div className={styles['wrap']} data-visible={visible || undefined} inert={!visible} aria-hidden={!visible}>
      <button
        type="button"
        className={`${styles['button']} ${styles['language']}`}
        onClick={toggle}
        aria-label={t(ui.actions.switchLanguage)}
        title={t(ui.actions.switchLanguage)}
        tabIndex={visible ? 0 : -1}
      >
        <LuLanguages className={styles['languageIcon']} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles['button']}
        data-complete={complete || undefined}
        onClick={toTop}
        aria-label={t(ui.actions.backToTop)}
        title={t(ui.actions.backToTop)}
        tabIndex={visible ? 0 : -1}
      >
        <svg className={styles['ring']} viewBox="0 0 48 48" aria-hidden="true">
          <circle className={styles['track']} cx="24" cy="24" r="22.5" />
          <circle ref={barRef} className={styles['bar']} cx="24" cy="24" r="22.5" pathLength={1} />
        </svg>
        <LuArrowUp className={styles['icon']} aria-hidden="true" />
      </button>
    </div>
  )
}
