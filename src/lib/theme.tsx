import { createContext, use, useCallback, useLayoutEffect, useMemo, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useTimedPreference } from './useTimedPreference'

export type Theme = 'dark' | 'light'

const isTheme = (v: unknown): v is Theme => v === 'dark' || v === 'light'

/*
 * Kept in step with the pre-paint script in index.html, which reads the same
 * key before React exists so the first frame is already on the right side.
 */
export const THEME_STORAGE_KEY = 'v3:theme'

/*
 * The root canvas colour per appearance - `--bg-edge` - for the browser's own
 * chrome (the status bar and toolbar tint on phones). A meta tag cannot read a
 * custom property, so the two values are repeated here and in index.html.
 */
const THEME_COLOR: Record<Theme, string> = { dark: '#0a111b', light: '#eaf0f7' }

interface ThemeContextValue {
  theme: Theme
  isAuto: boolean
  /** Flip the appearance. `origin`, in viewport pixels, is where the new one
      spreads out from; without it the switch is instant. */
  toggle: (origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/* Fall back to dark where the environment cannot report a colour scheme. */
const getSystemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

const subscribeToSystemTheme = (onChange: () => void) => {
  const query = window.matchMedia?.('(prefers-color-scheme: light)')
  if (!query) return
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * The appearance follows the system, including changes while the page is open.
 * A manual flip overrides it for a day, then returns to the current system
 * appearance (see useTimedPreference). Both paths share the same pre-paint
 * rules so a light system never opens on a dark frame.
 *
 * Written to `<html data-theme>`, which is what tokens.css keys on, in a layout
 * effect so a change lands in the same frame as the toggle's own re-render.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { value: theme, isAuto, setValue } = useTimedPreference<Theme>({
    storageKey: THEME_STORAGE_KEY,
    getAutoValue: getSystemTheme,
    subscribeToAuto: subscribeToSystemTheme,
    isValid: isTheme,
  })

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset['theme'] = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  /*
   * The switch as a reveal: the new appearance opens out of the toggle in a
   * circle until it covers the page, over the old one held still beneath.
   *
   * A View Transition does the holding: the browser snapshots the page, the
   * update runs, and the two snapshots are composited while the circle grows -
   * so nothing on the page has to know it is being animated, the canvas field
   * and the hero shader included (both repaint from a MutationObserver, a
   * microtask, which lands before the new snapshot is taken). `flushSync`
   * makes the update synchronous inside the callback; without it React would
   * commit later and the browser would capture the old page twice.
   *
   * The radius is the distance to the farthest corner, so the circle ends
   * exactly as it covers the last pixel. Where the API is missing, or under
   * reduced motion, the switch is instant - the designed path, not a broken
   * one: a page-wide wipe is precisely the motion that setting asks to avoid.
   */
  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (!origin || reduced || typeof document.startViewTransition !== 'function') {
        setValue(next)
        return
      }
      const { x, y } = origin
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const transition = document.startViewTransition(() => flushSync(() => setValue(next)))
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
        .catch(() => {
          /* Skipped (another transition, a hidden tab): the theme still changed. */
        })
    },
    [setValue, theme],
  )

  const value = useMemo<ThemeContextValue>(() => ({ theme, isAuto, toggle }), [isAuto, theme, toggle])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
