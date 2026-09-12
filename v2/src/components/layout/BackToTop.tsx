import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { LuArrowUp } from 'react-icons/lu'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { useScrollNav } from '@/lib/scroll'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { ui } from '@/content/copy'
import styles from './BackToTop.module.css'

/** Past roughly half a screen, which is where "back to top" stops being absurd. */
const APPEAR_AT = 340

/**
 * Return to the top, with the reading progress drawn around it.
 *
 * This replaces the hairline that used to run along the top edge of the page.
 * That bar had the same problem every top-pinned progress bar has: it reports on
 * a journey at the one place you are not looking, in a strip two pixels tall,
 * and it is *only* a report - it does not do anything. Wrapping the same value
 * around a control that acts on it makes the measurement and the way to undo it
 * the same object, and puts it where the thumb already is.
 *
 * The ring is `pathLength` bound straight to scroll progress rather than sprung.
 * Everything else on this site that follows the pointer is eased, deliberately,
 * but a progress indicator that lags is simply wrong for a moment - and the
 * moment it is wrong is exactly when you are watching it move.
 */
export default function BackToTop() {
  const { t } = useLocale()
  const { scrollTo } = useScrollNav()
  const reducedMotion = usePrefersReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)
  const [complete, setComplete] = useState(false)

  useMotionValueEvent(scrollY, 'change', (value) => setVisible(value > APPEAR_AT))
  /*
   * 0.995, not 1. The ring's own stroke has round caps, so at 99.5% its two ends
   * are already overlapping - the last half-percent is about 0.7px of arc and
   * cannot be seen. Waiting for an exact 1 would mean the fill never arrives on
   * the devices that land at 0.9997, which is most of them once a URL bar or a
   * sub-pixel scroll height is involved.
   */
  useMotionValueEvent(scrollYProgress, 'change', (value) => setComplete(value >= 0.995))

  return (
    <motion.div
      className={styles['wrap']}
      initial={false}
      animate={
        visible
          ? { opacity: 1, scale: 1, y: 0 }
          : // Hidden means *unreachable*, not merely invisible: a transparent
            // 48px target parked over the corner of the page would still take
            // taps meant for whatever is underneath it.
            { opacity: 0, scale: reducedMotion ? 1 : 0.85, y: reducedMotion ? 0 : 10 }
      }
      transition={{ duration: reducedMotion ? 0.12 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <GlassSurface
        as="button"
        type="button"
        radius="full"
        interactive
        lightAngle={120}
        className={styles['button']}
        data-complete={complete || undefined}
        onClick={() => scrollTo('home')}
        aria-label={t(ui.actions.backToTop)}
        title={t(ui.actions.backToTop)}
        tabIndex={visible ? 0 : -1}
      >
        {/*
         * Rotated so zero sits at twelve o'clock. Doing it on the SVG rather
         * than on the circle keeps the element's own box unrotated, which is
         * what lets `pathLength` stay a plain 0..1 value.
         */}
        <svg className={styles['ring']} viewBox="0 0 48 48" aria-hidden="true">
          <circle className={styles['track']} cx="24" cy="24" r="22.5" />
          <motion.circle
            className={styles['bar']}
            cx="24"
            cy="24"
            r="22.5"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>

        <LuArrowUp className={styles['icon']} aria-hidden="true" />
      </GlassSurface>
    </motion.div>
  )
}
