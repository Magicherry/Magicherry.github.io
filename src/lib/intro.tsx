import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'

interface IntroContextValue {
  /** True once the opening curtain has lifted (or was skipped entirely). */
  ready: boolean
  markReady: () => void
}

const IntroContext = createContext<IntroContextValue>({ ready: true, markReady: () => {} })

/**
 * Holds the one bit of state the hero needs from the preloader.
 *
 * Without it the hero's entrance runs its full ~1.4s timeline while the curtain
 * is still covering the screen, and the visitor's first sight of the page is the
 * *end* of an animation they never saw. Gating on this flag means the sequence
 * starts the moment there is someone to watch it.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => setReady(true), [])
  const value = useMemo(() => ({ ready, markReady }), [markReady, ready])

  return <IntroContext value={value}>{children}</IntroContext>
}

export function useIntro(): IntroContextValue {
  return use(IntroContext)
}
