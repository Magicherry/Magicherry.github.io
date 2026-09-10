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
import { usePrefersReducedMotion } from './hooks/useMediaQuery'

export const SECTION_IDS = ['home', 'about', 'stack', 'work', 'projects', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

interface ScrollContextValue {
  /** Id of the section currently owning the viewport. Drives the nav pill. */
  active: SectionId
  scrollTo: (id: SectionId) => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const [active, setActive] = useState<SectionId>('home')

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

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

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

  const value = useMemo(() => ({ active, scrollTo }), [active, scrollTo])

  return <ScrollContext value={value}>{children}</ScrollContext>
}

export function useScrollNav(): ScrollContextValue {
  const context = use(ScrollContext)
  if (!context) throw new Error('useScrollNav must be used inside <ScrollProvider>')
  return context
}
