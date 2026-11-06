import { useEffect, useRef } from 'react'

/**
 * The hero window tipping back as the page scrolls away from it - the
 * reference page's effect, with its numbers:
 *
 *   progress  0 when the section's top meets the viewport's top, 1 when its
 *             bottom does ("start start" -> "end start")
 *   amount    progress mapped from [0, 0.65] to [0, 1], so the tilt is fully
 *             in before the window has scrolled far out of view
 *   spring    stiffness 160, damping 28, mass 0.6 on that amount, so the
 *             window settles into each position rather than tracking the
 *             scrollbar rigidly
 *   transform perspective(1600px) rotateX(5deg * s) scale(1 - 0.015 * s),
 *             and no transform at all below s = 0.001
 *
 * The reference drives this through Motion's useScroll / useSpring. v3 has no
 * motion library, so the spring is integrated here in a requestAnimationFrame
 * loop that runs only while scrolling or settling, and writes the transform
 * straight to the element - no React render per frame.
 *
 * Reduced motion: never runs; the window stays flat.
 */
const STIFFNESS = 160
const DAMPING = 28
const MASS = 0.6

export function useScrollTilt<S extends HTMLElement, T extends HTMLElement>() {
  const sectionRef = useRef<S>(null)
  const targetRef = useRef<T>(null)

  useEffect(() => {
    const section = sectionRef.current
    const target = targetRef.current
    if (!section || !target) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let value = 0
    let velocity = 0
    let last = 0
    let raf = 0

    const goal = () => {
      const r = section.getBoundingClientRect()
      const progress = r.height > 0 ? Math.min(Math.max(-r.top / r.height, 0), 1) : 0
      return Math.min(progress / 0.65, 1)
    }

    const write = (s: number) => {
      target.style.transform =
        s < 0.001 ? '' : `perspective(1600px) rotateX(${5 * s}deg) scale(${1 - 0.015 * s})`
    }

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      const g = goal()
      const force = -STIFFNESS * (value - g) - DAMPING * velocity
      velocity += (force / MASS) * dt
      value += velocity * dt
      write(Math.min(Math.max(value, 0), 1))
      if (Math.abs(value - g) < 0.0005 && Math.abs(velocity) < 0.0005) {
        value = g
        write(g)
        raf = 0
        return
      }
      raf = requestAnimationFrame(step)
    }

    const wake = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(step)
    }

    value = goal()
    write(value)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      target.style.transform = ''
    }
  }, [])

  return { sectionRef, targetRef }
}
