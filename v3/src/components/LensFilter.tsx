import { useEffect, useRef, useState } from 'react'
import { buildLensMap, type LensOptions } from '@/lib/lensMap'

/**
 * The SVG filter a liquid-glass surface refracts through, and the hook that
 * keeps its map the size of the surface.
 *
 * The map is rebuilt when the element changes size, *after* it stops changing:
 * the header's contraction is a 0.77s spring, and repainting 40k pixels on
 * every frame of it would be work nobody can see. In between, the filter
 * stretches the last map over the new box (`preserveAspectRatio="none"`), which
 * for a pill going from 1280 to 980px wide is a bevel briefly 25% narrower in
 * the caps - imperceptible while the shape is moving, and exact once it lands.
 */

const SETTLE_MS = 140

/**
 * Takes the element itself, not a ref object, so a surface that mounts later
 * than its owner (a menu that renders only when open) is still picked up - an
 * effect keyed on a ref would never see it arrive. Callers hold the element in
 * state via a callback ref. Today only the header uses it, which mounts at
 * once; the CV menu and the back-to-top disc were liquid for a while and went
 * back to their own materials.
 */
export function useLensMap(el: HTMLElement | null, options: LensOptions): string | null {
  const [href, setHref] = useState<string | null>(null)
  const { bevel, falloff, radius } = options

  useEffect(() => {
    if (!el || document.documentElement.dataset['refraction'] !== 'on') return
    let timer = 0
    let last = ''
    const build = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const key = `${w}x${h}`
      if (key === last || !w || !h) return
      last = key
      setHref(buildLensMap(w, h, { bevel, falloff, ...(radius === undefined ? {} : { radius }) }))
    }
    build()
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(build, SETTLE_MS)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [el, bevel, falloff, radius])

  return href
}

/**
 * Grows the lens from flat to full when `on` turns true, and lets it go flat
 * again when it turns false - so the glass *condenses* onto the page instead of
 * fading in as a finished slab.
 *
 * Each `feDisplacementMap` carries its full throw in `data-throw`; this scales
 * the live `scale` attribute by k in [0, 1] once per frame. Written straight to
 * the DOM: a React state update per frame would re-render the whole header for
 * a change only the filter needs to see. React does not undo it, because it
 * only rewrites an attribute when the *prop* changes, and the prop - the full
 * throw - does not.
 *
 * In, k follows a back-out curve and overshoots by ~10% before settling: the
 * moment a drop lands, its edge bulges and relaxes, and that small surplus is
 * what reads as liquid rather than as a dimmer turning up. Out is a short,
 * plain ease-in, running under the glass's own 0.4s fade. Under reduced motion
 * k simply follows `on`.
 */
const CONDENSE_MS = 650
const EVAPORATE_MS = 280

function backOut(t: number) {
  const c = 1.7
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}

export function useLensCondense(id: string, on: boolean, ready: boolean) {
  const k = useRef(on ? 1 : 0)

  useEffect(() => {
    if (!ready) return
    const nodes = document.querySelectorAll<SVGElement>(`#${id} feDisplacementMap`)
    const apply = (v: number) => {
      k.current = Math.max(0, v)
      nodes.forEach((n) => n.setAttribute('scale', String(Number(n.dataset['throw']) * k.current)))
    }
    const target = on ? 1 : 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(target)
      return
    }
    const from = k.current
    const ms = on ? CONDENSE_MS : EVAPORATE_MS
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1)
      const e = on ? backOut(t) : t * t
      apply(from + (target - from) * e)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [id, on, ready])
}

/** Keeps one channel, so three displaced copies can be recombined as RGB. */
const CHANNEL = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
} as const

interface LensFilterProps {
  id: string
  href: string
  /** Throw at the rim, in px, is half of this. */
  scale: number
  /** Spread between the R, G and B throws - real glass bends blue further
      than red, and that fringe at the rim is most of what reads as "glass"
      rather than "distortion". */
  dispersion: number
}

export function LensFilter({ id, href, scale, dispersion }: LensFilterProps) {
  const throws = [scale * (1 + dispersion), scale, scale * (1 - dispersion)]
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
      <filter
        id={id}
        x="0"
        y="0"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={href} preserveAspectRatio="none" result="map" />
        {(['r', 'g', 'b'] as const).map((c, i) => (
          <feDisplacementMap
            key={c}
            in="SourceGraphic"
            in2="map"
            scale={throws[i]}
            data-throw={throws[i]}
            xChannelSelector="R"
            yChannelSelector="G"
            result={`d-${c}`}
          />
        ))}
        <feColorMatrix in="d-r" type="matrix" values={CHANNEL.r} result="r" />
        <feColorMatrix in="d-g" type="matrix" values={CHANNEL.g} result="g" />
        <feColorMatrix in="d-b" type="matrix" values={CHANNEL.b} result="b" />
        <feBlend in="r" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="b" mode="screen" />
      </filter>
    </svg>
  )
}
