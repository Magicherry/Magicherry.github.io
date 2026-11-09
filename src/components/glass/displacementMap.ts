/**
 * Builds the displacement map that gives the glass its refracting edge.
 *
 * `feDisplacementMap` reads two channels of a bitmap and treats them as a
 * per-pixel offset vector: R drives X, G drives Y, and the midpoint 128 means
 * "do not move". So to bend the backdrop outward at the rim and leave the
 * middle untouched we need an image whose channels ramp 0->255 across the
 * element but flatten to 128 everywhere except near the border.
 *
 * That is exactly what this SVG paints:
 *
 *   1. a black plate                     -> R=0,   G=0
 *   2. a red ramp, left to right         -> R=0..255   (X offset, negative to positive)
 *   3. a green ramp, top to bottom       -> G=0..255   (Y offset, negative to positive)
 *   4. a blurred inset rounded rect of                  <- the important bit
 *      mid-grey covering the interior    -> R=G=128 in the middle only
 *
 * The result: pixels near the left edge are pulled left, near the right edge
 * pulled right, and the centre is left alone - the optical signature of a thick
 * slab with a rounded, convex bevel. `blur` controls how gradually the bevel
 * rolls off, which reads as glass thickness.
 *
 * The map is authored in a fixed 200x200 space and stretched to whatever the
 * element measures (`preserveAspectRatio="none"` on the consuming `feImage`),
 * so one map serves every size; `inset` is therefore a *proportion* of the
 * element, not a pixel width.
 */

export interface DisplacementMapOptions {
  /** Corner radius of the neutral core, in the map's 200x200 space. */
  radius: number
  /** How far the neutral core sits from each edge - i.e. bevel width. */
  inset: number
  /** Softness of the bevel's roll-off. Higher reads as thicker glass. */
  blur: number
}

const SIZE = 200

export function buildDisplacementMap({ radius, inset, blur }: DisplacementMapOptions): string {
  const core = SIZE - inset * 2

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
<linearGradient id="x" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
<linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
<filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${blur}"/></filter>
</defs>
<rect width="${SIZE}" height="${SIZE}" fill="#000"/>
<rect width="${SIZE}" height="${SIZE}" fill="url(#x)" style="mix-blend-mode:screen"/>
<rect width="${SIZE}" height="${SIZE}" fill="url(#y)" style="mix-blend-mode:screen"/>
<rect x="${inset}" y="${inset}" width="${core}" height="${core}" rx="${radius}" fill="#808080" filter="url(#s)"/>
</svg>`

  // encodeURIComponent rather than base64: it survives DevTools inspection as
  // readable markup, and for a document this small it is also the shorter of
  // the two encodings.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
