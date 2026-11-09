import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { animate, useMotionValue, type MotionValue } from 'motion/react'
import { usePrefersReducedMotion } from './hooks/useMediaQuery'

export const SECTION_IDS = ['home', 'about', 'stack', 'work', 'projects', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

/**
 * Scroll speed, in px/frame, that counts as "full throttle" for the readouts and
 * the backdrop sweep that ride `velocity`.
 *
 * Lenis reports raw px/frame and it is unbounded - a trackpad flick peaks near
 * 200, a scrollbar drag can exceed 1000, and a value with no ceiling cannot
 * drive an opacity. Normalising against a fixed reference turns it into the 0..1
 * the consumers actually want, and 90 is roughly a brisk wheel scroll: fast
 * enough that ordinary reading stays at zero, low enough that the sweep reaches
 * full strength during a normal flick rather than only under a violent one.
 */
const VELOCITY_REFERENCE = 90

interface ScrollContextValue {
  /** Id of the section currently owning the viewport. Drives the nav pill. */
  active: SectionId
  scrollTo: (id: SectionId) => void
  /**
   * Page scroll, 0..1, and absolute normalised scroll speed, 0..1.
   *
   * Motion values rather than state, and that is not an optimisation - it is the
   * only shape this can take. These update on every scroll frame, and the
   * provider sits above the entire tree: putting either in `useState` would
   * re-render every section, every glass card and the nav sixty times a second.
   * As motion values they are written straight to the elements that subscribe,
   * and React never sees a single one of the updates.
   *
   * Every existing scroll-linked effect on the site already works this way -
   * Work's `railScale`, Hero's `parallaxGate` - so consumers have a pattern to
   * follow rather than a new one to invent.
   */
  progress: MotionValue<number>
  velocity: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const [active, setActive] = useState<SectionId>('home')

  const progress = useMotionValue(0)
  const velocity = useMotionValue(0)

  /* ------------------------------------------------------------- velocity */
  /*
   * Speed is *pushed* by scroll events and decays on a timer, because there is
   * no event for "the scrolling stopped".
   *
   * Lenis emits `scroll` only while the position is changing, so whatever speed
   * the last event carried would otherwise stand forever - the backdrop sweep
   * would stay lit on a page nobody is touching. The obvious fix, a rAF loop
   * easing the value down, costs a frame every frame for the life of the page
   * and breaks the rule the whole backdrop is built around (see LensGrid: an
   * idle page runs zero frames).
   *
   * So the decay is an animation that is *started* once the events stop and ends
   * on its own. Idle costs nothing, and the 120ms delay is longer than the gap
   * between frames of a real scroll, so an ordinary drag never trips it.
   */
  const decayRef = useRef<ReturnType<typeof animate> | null>(null)
  const idleRef = useRef(0)

  const pushVelocity = useCallback(
    (raw: number) => {
      decayRef.current?.stop()
      velocity.set(Math.min(Math.abs(raw) / VELOCITY_REFERENCE, 1))
      window.clearTimeout(idleRef.current)
      idleRef.current = window.setTimeout(() => {
        // The exit curve, for the reason tokens.css gives it: the sweep going
        // out is not a thing anyone should be asked to watch.
        decayRef.current = animate(velocity, 0, { duration: 0.45, ease: [0.5, 0, 0.75, 0] })
      }, 120)
    },
    [velocity],
  )

  useEffect(
    () => () => {
      window.clearTimeout(idleRef.current)
      decayRef.current?.stop()
    },
    [],
  )

  /* --------------------------------------------------------- smooth scroll */
  useEffect(() => {
    // Momentum scrolling is a *motion* effect. Someone who asked for reduced
    // motion gets the browser's native, instant scrolling instead - hijacking it
    // anyway is one of the most common accessibility failures in sites like this.
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.05,
      // A long, flat tail: the page keeps drifting just past where the wheel
      // stopped, which is what makes the scroll feel weighted rather than sticky.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Touch devices already have excellent native inertia; overriding it costs
      // a frame of latency and gains nothing.
      syncTouch: false,
    })
    lenisRef.current = lenis

    // The telemetry tap. Lenis already computes both of these for its own
    // easing, so reading them here costs nothing beyond the two `set` calls -
    // a second scroll listener measuring the same page would not be free.
    const offScroll = lenis.on('scroll', (instance) => {
      progress.set(instance.progress || 0)
      pushVelocity(instance.velocity)
    })

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      offScroll()
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [progress, pushVelocity, reducedMotion])

  /* ------------------------------------------------ progress, without Lenis */
  /*
   * Under reduced motion there is no Lenis, and the HUD still has to know where
   * on the page it is - the rail's progress graticule is *information*, not
   * decoration, so taking it away with the animation would be the wrong
   * degradation.
   *
   * `velocity` is deliberately left at zero on this path rather than computed
   * from successive scroll positions. Everything that reads it is a light that
   * rises with speed, and someone who asked for less motion should not be handed
   * a field that flares every time they scroll. Zero is the designed answer
   * here, not a missing one.
   */
  useEffect(() => {
    if (!reducedMotion) return

    let frame = 0
    const read = () => {
      frame = 0
      const limit = document.documentElement.scrollHeight - window.innerHeight
      progress.set(limit > 0 ? Math.min(Math.max(window.scrollY / limit, 0), 1) : 0)
    }
    // Coalesced to one read per frame: `scroll` can fire several times between
    // paints, and each one of these is a forced layout.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [progress, reducedMotion])

  /* ------------------------------------------------------------ section spy */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    /*
     * A band across the middle of the viewport, not the whole of it. With a full
     * viewport root the observer reports two or three sections intersecting at
     * once during a fast scroll and the nav flickers between them; a thin band
     * can only ever be owned by one.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id as SectionId)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback(
    (id: SectionId) => {
      const target = document.getElementById(id)
      if (!target) return

      // Anchor navigation should land the section title clear of the floating
      // nav, not underneath it.
      const offset = id === 'home' ? 0 : -84

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset, duration: 1.25 })
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + offset,
          behavior: reducedMotion ? 'auto' : 'smooth',
        })
      }

      // Moving focus keeps keyboard and screen-reader users in sync with the
      // visual jump; without it, Tab continues from wherever the nav was.
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    },
    [reducedMotion],
  )

  const value = useMemo(
    () => ({ active, scrollTo, progress, velocity }),
    [active, scrollTo, progress, velocity],
  )

  return <ScrollContext value={value}>{children}</ScrollContext>
}

export function useScrollNav(): ScrollContextValue {
  const context = use(ScrollContext)
  if (!context) throw new Error('useScrollNav must be used inside <ScrollProvider>')
  return context
}
