import { useMemo } from 'react'
import { buildDisplacementMap, type DisplacementMapOptions } from './displacementMap'

/**
 * The SVG filters every glass surface refracts through. Mounted once, at the
 * app root, in a zero-size <svg> so it costs no layout.
 *
 * Each variant is a different *thickness* of glass. Thin glass (a pill, a small
 * button) has a proportionally larger bevel and a shorter throw; thick glass (a
 * panel) bends less per pixel but over a wider band. Getting this ratio wrong is
 * what makes CSS glass read as plastic.
 */

interface Variant extends DisplacementMapOptions {
  id: string
  /** Displacement throw in px. */
  scale: number
  /** Split R/G/B into three slightly different throws to fake dispersion. */
  chromatic?: number
}

const VARIANTS: Variant[] = [
  { id: 'thin', radius: 78, inset: 14, blur: 9, scale: 26 },
  { id: 'regular', radius: 62, inset: 20, blur: 13, scale: 40 },
  { id: 'thick', radius: 54, inset: 26, blur: 17, scale: 58, chromatic: 0.14 },
]

/** Keeps only one channel, so three displaced copies can be recombined. */
const CHANNEL_MATRIX = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
} as const

function GlassFilter({ variant }: { variant: Variant }) {
  const { id, scale, chromatic, ...map } = variant
  const href = useMemo(() => buildDisplacementMap(map), [map.radius, map.inset, map.blur]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <filter
      id={`glass-${id}`}
      x="0"
      y="0"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
      colorInterpolationFilters="sRGB"
    >
      {/* preserveAspectRatio="none" is what lets one 200x200 map serve a
          1200px panel and a 34px icon button alike. */}
      <feImage href={href} preserveAspectRatio="none" result="map" />

      {chromatic ? (
        <>
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={scale * (1 + chromatic)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp-r"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp-g"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={scale * (1 - chromatic)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp-b"
          />
          <feColorMatrix in="disp-r" type="matrix" values={CHANNEL_MATRIX.r} result="only-r" />
          <feColorMatrix in="disp-g" type="matrix" values={CHANNEL_MATRIX.g} result="only-g" />
          <feColorMatrix in="disp-b" type="matrix" values={CHANNEL_MATRIX.b} result="only-b" />
          <feBlend in="only-r" in2="only-g" mode="screen" result="rg" />
          <feBlend in="rg" in2="only-b" mode="screen" />
        </>
      ) : (
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      )}
    </filter>
  )
}

export default function GlassDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {VARIANTS.map((variant) => (
          <GlassFilter key={variant.id} variant={variant} />
        ))}
      </defs>
    </svg>
  )
}
