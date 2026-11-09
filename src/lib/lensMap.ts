/**
 * The displacement map behind the header's liquid glass. Written for any
 * rounded rectangle - pill, disc or card - since it was briefly also the CV
 * menu's and the back-to-top button's.
 *
 * `feDisplacementMap` reads R as an x offset and G as a y offset, 128 meaning
 * "stay put": each output pixel is fetched from `scale * (channel/255 - 0.5)`
 * pixels away. So the map *is* the lens - paint where each pixel of the pane
 * looks through to, and the filter does the rest.
 *
 * Why this is painted per pixel rather than borrowed from v2. v2 draws one
 * 200x200 map with gradients and stretches it over every surface. That is fine
 * for squarish panels, and wrong for a 980x41 pill: stretched 5:1, a bevel that
 * is 14px tall at the top is 70px wide at the caps, and the ends smear while
 * the long edges barely bend. Here the map is computed at the surface's own size
 * from its signed distance field, so the bevel is the same physical width all
 * the way round and every pixel moves along the true normal of the edge -
 * radially in the corners and caps, straight out of the sides.
 *
 * The profile is a convex slab. Looking down through a convex edge, the ray
 * bends toward the inward normal, so a pixel near the rim shows what lies a
 * little further *inside*: content is drawn toward the centre and compressed
 * against the edge, which is the bright, magnified rim Apple's material has.
 * Sampling inward also means the filter never reads past the pane, where
 * Chromium would clamp the backdrop's last row into a smear.
 *
 * Magnitude is strongest at the rim and reaches zero where the bevel ends, so
 * the middle of the surface is untouched and whatever type sits there stays
 * as legible as it was on frosted glass.
 */

export interface LensOptions {
  /** Bevel width in px: how far in from the edge the glass is curved. */
  bevel: number
  /** Exponent of the bend profile - see `bend`. */
  falloff: number
  /** Corner radius in px. Omitted, the shape is a pill (half the height);
      equal width and height then make a disc. */
  radius?: number
}

/**
 * How hard the edge bends at t in [0, 1] (0 = rim, 1 = where the flat top
 * begins). A power of the distance to the flat top: `falloff` 1 is a straight
 * ramp, higher concentrates the bend at the rim.
 *
 * Not the slope of a squircle, which is what this first was. That slope is
 * infinite at the rim and falls to ~5% of it within a tenth of the bevel, so
 * on a 41px pill the whole lens was spent in its outermost pixel or two and
 * read as no refraction at all.
 */
function bend(t: number, falloff: number) {
  return Math.pow(1 - Math.min(Math.max(t, 0), 1), falloff)
}

export function buildLensMap(width: number, height: number, options: LensOptions): string | null {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const img = ctx.createImageData(w, h)
  const data = img.data
  const hw = w / 2
  const hh = h / 2
  const r = Math.min(options.radius ?? hh, hw, hh)
  /*
   * The bevel never runs deeper than the corner radius. Inside a rounded
   * rectangle the nearest edge switches from the side to the top along a
   * diagonal, and the normal flips across it; kept within the radius, every
   * point that bends is either in a corner (radial normal, continuous) or
   * clearly nearer one side, and that seam stays in the flat middle.
   */
  const bevel = Math.min(options.bevel, r)
  const { falloff } = options

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw
      const py = y + 0.5 - hh
      const sx = Math.sign(px)
      const sy = Math.sign(py)
      /* Offsets past the straight core - the rectangle the corners are swept
         around. Both positive means a corner. */
      const qx = Math.abs(px) - (hw - r)
      const qy = Math.abs(py) - (hh - r)

      /* Distance in from the rim, and the outward normal at the nearest edge
         point: radial from the corner's centre in a corner, straight out of
         the nearer side elsewhere. A pill is the case where the core has no
         height, so its sides are the long edges and its corners the caps. */
      let depth: number
      let nx = 0
      let ny = 0
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1
        depth = r - len
        nx = (qx / len) * sx
        ny = (qy / len) * sy
      } else {
        const dx = hw - Math.abs(px)
        const dy = hh - Math.abs(py)
        if (dx < dy) {
          depth = dx
          nx = sx
        } else {
          depth = dy
          ny = sy
        }
      }

      const i = (y * w + x) * 4
      let m = 0
      if (depth > 0 && depth < bevel) m = bend(depth / bevel, falloff)
      /* Inward: subtract the outward normal. */
      data[i] = 128 - nx * m * 127
      data[i + 1] = 128 - ny * m * 127
      data[i + 2] = 128
      data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}
