import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useTimedPreference } from './useTimedPreference'

export type Theme = 'dark' | 'light'

/** Where the reveal should originate - normally the toggle that was pressed. */
export interface RevealOrigin {
  x: number
  y: number
}

interface ThemeContextValue {
  theme: Theme
  /** Flips dark <-> light. There is no third, device-following state. */
  cycle: (origin?: RevealOrigin) => void
}

/*
 * `startViewTransition` is not in the DOM lib this project compiles against, and
 * augmenting the global Document risks colliding with a future lib update. A
 * local structural type says exactly as much as this file needs.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

/*
 * A little past the far corner. Timing and easing live in base.css with the
 * keyframes; only the geometry has to be computed per click.
 *
 * The overshoot is a safety margin: sized to touch the corner at exactly 100%,
 * any rounding or early teardown leaves an uncovered wedge that snaps.
 */
const REVEAL_OVERSHOOT = 1.5

/**
 * The area the reveal has to cover.
 *
 * Not simply `innerWidth/innerHeight`. On a phone the layout viewport is
 * routinely *shorter* than the region a view-transition snapshot spans: the
 * browser reserves the strip the URL bar is about to vacate, so a radius derived
 * from `innerHeight` is short by the height of that bar no matter how large a
 * multiplier is put in front of it - which is why raising the overshoot alone
 * never fixed the bottom edge on mobile.
 *
 * `screen.height` is the one measure that is never short, and it is only a sane
 * ceiling on a device whose window fills the screen. A coarse pointer is the
 * cheap stand-in for that; on desktop it would wildly over-size the circle
 * whenever the browser window is not maximised.
 *
 * `bleed` covers the part that no measurement can reach. The clip-path is
 * resolved against the snapshot's own box, whose origin sits wherever the
 * collapsible browser UI leaves it - possibly *above* the layout viewport's
 * top. The button coordinates handed to `cycle` come from
 * `getBoundingClientRect`, which is relative to the layout viewport, so the two
 * spaces are offset by an amount the page cannot query. It is bounded, though:
 * it cannot exceed how much taller the screen is than the window. Adding that
 * bound to the reach makes the circle correct no matter which way the offset
 * runs, which raising the multiplier alone could never guarantee.
 */
function viewportExtent() {
  const width = Math.max(window.innerWidth, document.documentElement.clientWidth)
  let height = Math.max(window.innerHeight, document.documentElement.clientHeight)
  let bleed = 0

  if (window.matchMedia?.('(hover: none)').matches) {
    const screenHeight = window.screen?.height ?? 0
    bleed = Math.max(0, screenHeight - height)
    height = Math.max(height, screenHeight)
  }

  return { width, height, bleed }
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/*
 * What the phone paints its toolbars with - and deliberately *not* `--bg-base`.
 *
 * The base token is the colour underneath the aurora, near-black at #04060b. It
 * is never what any edge of the page actually looks like: by the time the aurora
 * and the vignette have composited, the top and bottom of the viewport sit
 * several stops lighter. Handing the browser the base value paints the toolbar
 * far darker than the page it borders, which is the black band on iOS and
 * Android - the seam is the whole symptom, not the darkness.
 *
 * These two are sampled from the composited backdrop at the viewport edges. The
 * aurora drifts, so no single value tracks it exactly; being within a stop is
 * the difference between a seam and none.
 *
 * KEEP IN SYNC with the pre-paint script in index.html, which sets the same
 * attribute before this module has parsed.
 */
const THEME_COLOR: Record<Theme, string> = {
  dark: '#0a1520',
  light: '#eef2f8',
}

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light'

/*
 * The device's own setting, on a first visit.
 *
 * This used to be dark for everyone, `prefers-color-scheme` included, on the
 * grounds that the site is composed dark and light mode is a second, separately
 * tuned design rather than an inversion. Both halves of that are still true and
 * neither is an argument for ignoring the setting: a visitor whose OS is in
 * light mode has already said which of the two designs they want to be handed,
 * and light mode being a real design rather than a fallback is precisely what
 * makes honouring it safe.
 *
 * Queried as `light` rather than `dark` so that the two answers that are not a
 * request for light - `no-preference`, and any engine that does not implement
 * the feature at all - both fall to dark. The site keeps its composed default
 * wherever the device has not actually asked for anything else.
 *
 * KEEP IN SYNC with the pre-paint script in index.html, which resolves the same
 * query before this module has parsed.
 */
const LIGHT_QUERY = '(prefers-color-scheme: light)'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia?.(LIGHT_QUERY).matches ? 'light' : 'dark'
}

/*
 * Module scope, not an inline arrow in the provider: `useTimedPreference` puts
 * both of these in effect dependency arrays, so a new identity every render
 * would tear down and re-add the listener on each one.
 */
function subscribeToSystemTheme(onChange: () => void): (() => void) | undefined {
  const query = window.matchMedia?.(LIGHT_QUERY)
  if (!query) return undefined
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  /*
   * Two rules, and the second is what keeps the first from being obnoxious.
   *
   * While no choice has been made the page follows the device live, so an OS
   * that flips at sunset takes the page with it. Once the toggle has been used
   * the stored choice wins and `ttlMs: null` keeps it for good - the visitor has
   * said which design they want and the OS does not get to argue.
   *
   * The old note here said a page that re-themes itself under you at sunset is
   * overriding a preference rather than following one. That is right, and it is
   * exactly what the override protects against; it was never an argument against
   * following a device that has *not* been overruled.
   */
  const { value: theme, setValue } = useTimedPreference<Theme>({
    storageKey: 'v2:theme',
    getAutoValue: getSystemTheme,
    isValid: isTheme,
    ttlMs: null,
    subscribeToAuto: subscribeToSystemTheme,
  })

  useEffect(() => {
    document.documentElement.dataset['theme'] = theme
    // Keeps the browser UI (address bar, scrollbar gutter) in step with the page.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  const cycle = useCallback(
    (origin?: RevealOrigin) => {
      const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
      const commit = () => setValue(nextTheme)

      const root = document.documentElement
      const doc = document as ViewTransitionDocument
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!doc.startViewTransition || reducedMotion) {
        commit()
        return
      }

      /*
       * Geometry first: the keyframes in base.css read these off <html>, and the
       * pseudo-element tree only inherits what is set before the snapshots are
       * taken.
       */
      const { width, height, bleed } = viewportExtent()
      const { x, y } = origin ?? { x: width / 2, y: 0 }
      const radius =
        (Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + bleed) * REVEAL_OVERSHOOT

      root.style.setProperty('--reveal-x', `${x}px`)
      root.style.setProperty('--reveal-y', `${y}px`)
      root.style.setProperty('--reveal-r', `${radius}px`)

      /*
       * The nav samples its backdrop through an SVG displacement filter. Holding
       * that pass open across the switch means the compositor has to rebuild it
       * the instant the snapshots come down, which lands as a hitch exactly at
       * the end. It is invisible under a full-page snapshot anyway, so it is
       * switched off for the duration and restored once the dust settles.
       */
      const refraction = root.dataset['refraction']
      root.dataset['refraction'] = 'off'

      /*
       * The whole page is captured as two snapshots and the new one is revealed
       * under an expanding circle - a single composited clip-path animation.
       *
       * The alternative, and what this used to do, was to put a 380ms transition
       * on `*, *::before, *::after` for background-color, color, border-color,
       * box-shadow and fill. That interpolates several hundred elements at once,
       * and every glass surface carries a seven-layer box-shadow, so each frame
       * of the switch repainted the entire document. Snapshots cost one texture.
       *
       * `data-theme` is set inside the callback rather than left to the provider
       * effect: the browser captures the "new" snapshot the moment the callback
       * returns, and a passive effect has not run by then.
       */
      const transition = doc.startViewTransition(() => {
        root.dataset['theme'] = nextTheme
        commit()
      })

      void transition.finished.finally(() => {
        if (refraction) root.dataset['refraction'] = refraction
        else delete root.dataset['refraction']
        root.style.removeProperty('--reveal-x')
        root.style.removeProperty('--reveal-y')
        root.style.removeProperty('--reveal-r')
      })
    },
    [setValue, theme],
  )

  const value = useMemo(() => ({ theme, cycle }), [cycle, theme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
