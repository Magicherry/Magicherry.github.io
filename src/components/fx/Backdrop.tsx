import { lazy, Suspense, useEffect, useRef } from 'react'
import styles from './Backdrop.module.css'

/* The canvas field is its own chunk, as in v2: the page paints without waiting
   for it, and the field fades in on top of a backdrop that is already there. */
const LensGrid = lazy(() => import('./LensGrid'))

/**
 * v2's backdrop, ported. Backdrop.module.css and LensGrid.tsx began as copies
 * of v2's (LensGrid has since learned to redraw only the lens patch); this
 * wrapper is new.
 *
 * v2 drove the scroll "surge" (the accent glow that gathers at the top and
 * bottom edges during a fast scroll) from Lenis's velocity through Motion's
 * `useTransform` and `useSpring`. v3 has neither library, so the same chain is
 * done by hand here, with v2's constants:
 *
 *   velocity  = |scroll delta per frame| / 90, capped at 1, decaying to 0 over
 *               ~0.45s once scrolling stops
 *   reach     = velocity mapped from [0.22, 1] to [0, 1] - ordinary reading
 *               speed stays at zero, only a fling lights the edges
 *   surge     = reach through a spring (stiffness 58, damping 26, mass 0.7),
 *               written straight to the element's opacity
 *
 * The loop only runs while there is something to animate: it starts on a
 * scroll event and stops once the spring has settled at zero.
 */
const VELOCITY_REFERENCE = 90
const DECAY_MS = 450
const STIFFNESS = 58
const DAMPING = 26
const MASS = 0.7

export default function Backdrop() {
  const surgeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const surge = surgeRef.current
    if (!surge) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lastY = window.scrollY
    let lastScrollAt = 0
    let velocity = 0
    let value = 0 // the spring's position = the surge's opacity
    let speed = 0 // the spring's velocity
    let prev = 0
    let raf = 0

    const step = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 1 / 30)
      prev = now

      // Velocity: measured while scroll events arrive, decaying after they stop.
      const y = window.scrollY
      const delta = Math.abs(y - lastY)
      lastY = y
      if (delta > 0) {
        velocity = Math.min(delta / VELOCITY_REFERENCE, 1)
        lastScrollAt = now
      } else {
        const idle = now - lastScrollAt
        velocity = idle >= DECAY_MS ? 0 : velocity * (1 - Math.min(dt / ((DECAY_MS - idle) / 1000 + dt), 1))
      }

      const reach = Math.min(Math.max((velocity - 0.22) / (1 - 0.22), 0), 1)
      const force = -STIFFNESS * (value - reach) - DAMPING * speed
      speed += (force / MASS) * dt
      value += speed * dt
      surge.style.opacity = String(Math.max(0, Math.min(value, 1)))

      if (velocity === 0 && reach === 0 && Math.abs(value) < 0.001 && Math.abs(speed) < 0.001) {
        value = 0
        speed = 0
        surge.style.opacity = '0'
        raf = 0
        return
      }
      raf = requestAnimationFrame(step)
    }

    const onScroll = () => {
      if (raf) return
      prev = performance.now()
      raf = requestAnimationFrame(step)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={styles['backdrop']} aria-hidden="true">
      {/* Two counter-drifting fields, four gradients. The grain and
          vignette are painted onto the wrapper itself. */}
      <div className={styles['aurora']}>
        <span className={`${styles['field']} ${styles['fieldA']}`} />
        <span className={`${styles['field']} ${styles['fieldB']}`} />
      </div>
      <span ref={surgeRef} className={styles['surge']} style={{ opacity: 0 }} />
      <Suspense fallback={null}>
        <LensGrid />
      </Suspense>
    </div>
  )
}
