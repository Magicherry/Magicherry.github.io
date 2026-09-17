import { lazy, Suspense } from 'react'
import { motion, useTransform } from 'motion/react'
import { useScrollNav } from '@/lib/scroll'
import styles from './Backdrop.module.css'

// The canvas field is pointer-driven decoration. Splitting it keeps it off the
// critical path entirely - the aurora paints immediately, the grid arrives when
// the main bundle is done.
const LensGrid = lazy(() => import('./LensGrid'))

/**
 * Everything behind the glass.
 *
 * Glass without a rich, *moving* backdrop is just a grey rectangle: refraction
 * has nothing to bend and the saturation lift has nothing to lift. These aurora
 * fields exist to give the panels above them something worth distorting, which
 * is why they are far more saturated than a background would normally be — by
 * the time you see them through 18px of blur they read as a faint wash.
 *
 * The whole backdrop is four compositor layers: this wrapper (which also carries
 * the grain and vignette as paint-time backgrounds), two aurora fields, and the
 * dot canvas. See the stylesheet for why that number matters.
 */
export default function Backdrop() {
  const { velocity } = useScrollNav()

  /*
   * The field answers the reader's own speed.
   *
   * This is the largest-scale version of the thing the whole redesign is after:
   * up to now the backdrop ran on its own clock and would have looked identical
   * whether someone was reading it or had left the tab. Tying a light to how
   * fast the page is moving means the single biggest surface on screen is
   * reporting something about the person in front of it.
   *
   * Dead below 0.12 rather than rising from zero, and that threshold is what
   * keeps it from being a gimmick. Reading - a line at a time, a nudge of the
   * wheel - stays entirely dark, so the bloom is not a thing that happens
   * constantly; it is reserved for someone actually travelling. It also means an
   * idle page holds a literal `opacity: 0` and paints nothing at all.
   *
   * Clamped by the two-argument range form, which (unlike the function form -
   * see Hero) clamps for free at both ends.
   */
  const surge = useTransform(velocity, [0.12, 1], [0, 1])

  return (
    <div className={styles['backdrop']} aria-hidden="true">
      {/* Two counter-drifting fields, four gradients. The grain and vignette are
          painted onto the wrapper itself rather than taking layers of their own. */}
      <div className={styles['aurora']}>
        <span className={`${styles['field']} ${styles['fieldA']}`} />
        <span className={`${styles['field']} ${styles['fieldB']}`} />
      </div>

      {/*
        * Above the aurora and *under* the dot field, so the lens still reads as
        * the nearest thing to the viewer. Ordered by DOM position rather than
        * z-index: `.aurora` is the only layer here that needed one, to get
        * beneath the grain its parent paints.
        */}
      <motion.span className={styles['surge']} style={{ opacity: surge }} />

      {/* No pointer gate. The lens follows a finger as readily as a cursor, and
          `prefers-reduced-motion` - which LensGrid reads itself - is the only
          thing that should ever take it away. */}
      <Suspense fallback={null}>
        <LensGrid />
      </Suspense>
    </div>
  )
}
