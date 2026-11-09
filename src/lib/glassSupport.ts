/**
 * Decides whether this browser can actually refract, and records the answer as
 * `data-refraction` on <html> so CSS can branch without a JS round-trip.
 *
 * The refraction is an *enhancement*: every glass surface is fully designed at
 * the blur-only tier, and the displacement filter is layered on top where it
 * renders correctly. Nothing about the layout, contrast or legibility depends on
 * it, which is the only reason it is safe to ship a Chromium-first effect.
 */

export type RefractionMode = 'on' | 'off'

/*
 * Allow-list rather than a block-list, and deliberately so.
 *
 * `CSS.supports('backdrop-filter', 'url(...)')` answers the *parser*, not the
 * compositor: Safari and Firefox both parse the value happily and then drop the
 * SVG reference when they composite, which does not degrade to a plain blur - it
 * degrades to an invisible panel with unreadable text on it. Since the only
 * engine known to composite this correctly is Chromium, opting *in* to Chromium
 * is the honest test. A future engine shipping it will render the blur-only
 * tier, which is a designed state rather than a broken one.
 */
function isChromium(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Chrome|Chromium|Edg\//.test(ua) && !/OPR\//.test(ua)
}

export function detectRefraction(): RefractionMode {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) return 'off'

  const hasBackdrop =
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  if (!hasBackdrop) return 'off'

  if (!CSS.supports('backdrop-filter', 'url("#probe")')) return 'off'
  if (!isChromium()) return 'off'

  // Respect the accessibility preference for reduced transparency - a visitor
  // who asked for flatter surfaces should not be handed the heaviest one.
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return 'off'

  return 'on'
}

export function applyRefractionMode(): RefractionMode {
  const mode = detectRefraction()
  document.documentElement.dataset['refraction'] = mode
  return mode
}
