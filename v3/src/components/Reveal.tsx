import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fade-up on first entry into the viewport. The styling lives in base.css.
 *
 * One shared IntersectionObserver for the page rather than one per element:
 * there are a few dozen of these, and each observer is its own set of
 * intersection computations on every scroll.
 *
 * The hidden state is opt-in. `<html data-reveal-armed>` is set only once this
 * module has run in a browser with IntersectionObserver and without reduced
 * motion, so a failed script or a reader who asked for stillness gets the
 * content immediately rather than a page of invisible blocks.
 */

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (!observer) {
    document.documentElement.setAttribute('data-reveal-armed', '')
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-shown', '')
          observer?.unobserve(entry.target)
        }
      },
      /* Fires a little before the element is fully in, so the motion is
         mostly done by the time the eye arrives. */
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
  }
  return observer
}

interface RevealProps {
  as?: ElementType
  className?: string
  /** Seconds. For staggering siblings in a grid. */
  delay?: number
  children: ReactNode
  [key: `aria-${string}`]: string | undefined
}

export default function Reveal({ as: Tag = 'div', className, delay, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    const io = getObserver()
    if (!node || !io) return
    io.observe(node)
    return () => io.unobserve(node)
  }, [])

  const style = delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined

  return (
    <Tag ref={ref} className={className ? `reveal ${className}` : 'reveal'} {...(style ? { style } : {})} {...rest}>
      {children}
    </Tag>
  )
}
