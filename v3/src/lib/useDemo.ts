import { useEffect, useRef, useState } from 'react'

/**
 * A clock for the looping illustrations - the small "software caught mid-task"
 * pictures in the About cards.
 *
 * Each demo is a list of frames with a duration each; this steps through them
 * and loops. It only runs while all of these hold:
 *
 *   - the illustration is on screen (IntersectionObserver) - a loop nobody can
 *     see is a timer and a re-render every second for nothing;
 *   - the tab is visible;
 *   - the visitor has not pressed its pause button;
 *   - the visitor has not asked for reduced motion.
 *
 * Under reduced motion it never runs and reports `staticFrame` - the picture
 * at its finished, most informative state - so the card is still complete.
 *
 * Paused or off-screen, the frame stays where it was. On resume the current
 * frame plays its full duration again, which reads as a held beat rather than
 * a skip.
 *
 * `durations` must be a stable reference (a module-level constant): it is an
 * effect dependency.
 */
export interface Demo<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  frame: number
  /** True while frames are advancing - CSS loops gate on this too. */
  running: boolean
  paused: boolean
  togglePause: () => void
  /** Reduced motion: no loop, no pause control. */
  still: boolean
}

const prefersStill = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useDemo<T extends HTMLElement = HTMLDivElement>(
  durations: readonly number[],
  staticFrame: number,
): Demo<T> {
  const ref = useRef<T>(null)
  const [still] = useState(prefersStill)
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || still) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      threshold: 0.25,
    })
    io.observe(node)
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [still])

  const running = !still && visible && !hidden && !paused

  useEffect(() => {
    if (!running || durations.length < 2) return
    const id = window.setTimeout(() => setFrame((f) => (f + 1) % durations.length), durations[frame] ?? 1000)
    return () => window.clearTimeout(id)
  }, [running, frame, durations])

  return {
    ref,
    frame: still ? staticFrame : frame,
    running,
    paused,
    togglePause: () => setPaused((p) => !p),
    still,
  }
}
