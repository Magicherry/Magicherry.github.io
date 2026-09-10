import { lazy, Suspense } from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
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
  // Below tablet width the canvas competes with scrolling for the same GPU and
  // the pointer that drives it does not exist.
  const showGrid = useMediaQuery('(min-width: 900px) and (hover: hover)')

  return (
    <div className={styles['backdrop']} aria-hidden="true">
      {/* Two counter-drifting fields, four gradients. The grain and vignette are
          painted onto the wrapper itself rather than taking layers of their own. */}
      <div className={styles['aurora']}>
        <span className={`${styles['field']} ${styles['fieldA']}`} />
        <span className={`${styles['field']} ${styles['fieldB']}`} />
      </div>

      {showGrid ? (
        <Suspense fallback={null}>
          <LensGrid />
        </Suspense>
      ) : null}
    </div>
  )
}
