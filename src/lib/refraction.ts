/**
 * Decides whether this browser can refract through `backdrop-filter: url()`,
 * and records the answer as `data-refraction` on <html> so CSS can branch
 * without waiting for React. Ported from v2's `glassSupport.ts`.
 *
 * Allow-list, not feature detection. `CSS.supports('backdrop-filter', 'url(#x)')`
 * answers the *parser*: Safari and Firefox both accept the value and then drop
 * the SVG reference when they composite - and what they drop to is not the
 * plain blur but no backdrop filter at all, a clear pane with nav links sitting
 * straight on scrolling text. Chromium is the only engine known to composite
 * it, so opting Chromium *in* is the honest test. Everything else keeps the
 * frosted pill, which is a designed state rather than a broken one.
 */
export type RefractionMode = 'on' | 'off'

function isChromium(): boolean {
  const ua = navigator.userAgent
  return /Chrome|Chromium|Edg\//.test(ua) && !/OPR\//.test(ua)
}

export function detectRefraction(): RefractionMode {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) return 'off'
  if (!CSS.supports('backdrop-filter', 'blur(1px)')) return 'off'
  if (!CSS.supports('backdrop-filter', 'url("#probe")')) return 'off'
  if (!isChromium()) return 'off'
  /* A visitor who asked for flatter surfaces is not handed the heaviest one. */
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return 'off'
  return 'on'
}

export function applyRefractionMode(): RefractionMode {
  const mode = detectRefraction()
  document.documentElement.dataset['refraction'] = mode
  return mode
}
