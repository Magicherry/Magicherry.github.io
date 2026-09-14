import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import styles from './Backdrop.module.css'

/**
 * A field of dots that bends around the pointer with the same optics as the
 * glass panels above it — dots inside the lens radius are pushed radially
 * outward and brighten, exactly as `feDisplacementMap` treats the backdrop.
 *
 * The point is coherence: the background is not decoration running on its own
 * logic, it is the same lens metaphor applied to a different substrate.
 *
 * Cost control, in order of importance:
 *
 *   - under `prefers-reduced-motion` there is no lens and therefore no animation
 *     at all: the field is rasterised straight onto the visible canvas, once, and
 *     from then on the layer is an ordinary static texture;
 *   - the *static* field is rasterised once into an offscreen canvas and blitted
 *     as a single image each frame. Redrawing ~1,900 individual `arc()` calls
 *     per pointer event, which is what this did originally, is the difference
 *     between a free background and a stuttering one;
 *   - only the ~100 dots inside the lens are computed per frame;
 *   - the animation loop *stops completely* once the lens settles, so an idle
 *     page runs zero frames rather than 60 empty ones a second;
 *   - DPR is capped at 1.5, above which the dots are sub-pixel anyway.
 */

const SPACING = 34
const DOT_RADIUS = 1.1
const LENS_RADIUS = 190
const LENS_STRENGTH = 26
/** Below this, the eased pointer has effectively arrived; stop the loop. */
const SETTLE_EPSILON = 0.35
/** Same idea for the fade: below this the lens is fully in or fully out. */
const POWER_EPSILON = 0.004

export default function LensGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // The only thing that takes the lens away. It used to also require a fine
  // pointer, which meant a phone got a field it could not touch.
  const lens = !reducedMotion

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    // Bound after the guard so the non-null narrowing survives into the nested
    // draw/tick closures below.
    const ctx: CanvasRenderingContext2D = context

    /*
     * The offscreen copy exists so that a moving lens can blit the untouched
     * grid instead of re-running ~1,900 arcs per frame. With no lens there are
     * no frames, so it would be a second full-viewport backing store bought to
     * save work nobody is doing - the field goes straight onto the visible
     * canvas instead.
     */
    const field = lens ? document.createElement('canvas') : canvas
    const fieldCtx = field === canvas ? ctx : field.getContext('2d')
    if (!fieldCtx) return

    /*
     * 1.5, not 2. The canvas is a full-viewport layer that gets blended on every
     * composite, so its pixel count is a standing cost - and at 2x on a 4K panel
     * that is 33M pixels for a field of 1px dots under a noise overlay. Half a
     * step down removes 44% of them and is not visible.
     */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let originX = 0
    let originY = 0
    let cols = 0
    let rows = 0

    // Where the pointer is, and where the lens has eased to. Chasing the target
    // rather than snapping is what gives the field its viscous, liquid feel.
    // Both start at the origin and it does not matter: nothing reads a position
    // until `power` has risen, and `aim` places the lens before it does.
    let targetX = 0
    let targetY = 0
    let lensX = 0
    let lensY = 0
    /*
     * How *present* the lens is, 0..1, eased on its own clock.
     *
     * A cursor is always somewhere, so presence used to be implied by position:
     * "gone" meant easing the lens off the corner of the screen. A finger is not
     * always somewhere - it appears, drags, and ceases to exist - and a lens
     * that answered every lift by streaking to the top-left would turn each
     * scroll into a comet. Held separately, it fades up where a touch lands and
     * back down where it is released, never travelling somewhere nobody pointed.
     */
    let power = 0
    let targetPower = 0
    let frame = 0
    let running = false

    const readVar = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

    let hotColor = readVar('--accent', '#03e8f8')
    // Kept alongside, because the fade has to be able to repaint a lensed dot
    // exactly as the field drew it.
    let restColor = readVar('--fg-ghost', 'rgba(255,255,255,0.14)')

    /** Rasterises the untouched grid once. Everything else just blits this. */
    const renderField = () => {
      fieldCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fieldCtx.clearRect(0, 0, width, height)
      fieldCtx.fillStyle = restColor
      fieldCtx.beginPath()
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = originX + col * SPACING
          const y = originY + row * SPACING
          fieldCtx.moveTo(x + DOT_RADIUS, y)
          fieldCtx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
        }
      }
      fieldCtx.fill()
    }

    const draw = () => {
      // Static field: `renderField` painted the visible canvas directly and
      // there is nothing to composite on top of it.
      if (!lens) return

      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(field, 0, 0, width, height)

      // Fully released: the blit above is already the whole picture.
      if (power < POWER_EPSILON) return

      /*
       * Punch the lens area out of the blitted field before drawing the
       * displaced dots, otherwise each dot inside the radius appears twice -
       * once where it belongs and once where the lens moved it.
       */
      ctx.save()
      ctx.beginPath()
      ctx.arc(lensX, lensY, LENS_RADIUS, 0, Math.PI * 2)
      ctx.clip()
      ctx.clearRect(lensX - LENS_RADIUS, lensY - LENS_RADIUS, LENS_RADIUS * 2, LENS_RADIUS * 2)
      ctx.restore()

      // Only the cells whose grid coordinates can fall inside the lens.
      const minCol = Math.max(0, Math.floor((lensX - LENS_RADIUS - originX) / SPACING))
      const maxCol = Math.min(cols - 1, Math.ceil((lensX + LENS_RADIUS - originX) / SPACING))
      const minRow = Math.max(0, Math.floor((lensY - LENS_RADIUS - originY) / SPACING))
      const maxRow = Math.min(rows - 1, Math.ceil((lensY + LENS_RADIUS - originY) / SPACING))

      /*
       * The rest pass, and only while the lens is fading.
       *
       * The clip above took the field's own dots out of this circle, so on the
       * way in or out something has to put them back - otherwise releasing a
       * touch would punch a hole in the grid. These are those dots: same places,
       * no displacement, the field's own colour, at `1 - power`. Neither colour
       * nor alpha varies across them, so the whole pass is one path and one fill,
       * exactly as `renderField` draws the field itself.
       */
      const rest = 1 - power
      if (rest > POWER_EPSILON) {
        ctx.fillStyle = restColor
        ctx.globalAlpha = rest
        ctx.beginPath()
        for (let row = minRow; row <= maxRow; row += 1) {
          for (let col = minCol; col <= maxCol; col += 1) {
            const x = originX + col * SPACING
            const y = originY + row * SPACING
            const dx = x - lensX
            const dy = y - lensY
            if (dx * dx + dy * dy > LENS_RADIUS * LENS_RADIUS) continue
            ctx.moveTo(x + DOT_RADIUS, y)
            ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
          }
        }
        ctx.fill()
      }

      // The lens itself, rising over the pass above. At power 1 that pass is
      // skipped and this is exactly the lens it has always been.
      ctx.fillStyle = hotColor
      for (let row = minRow; row <= maxRow; row += 1) {
        for (let col = minCol; col <= maxCol; col += 1) {
          const x = originX + col * SPACING
          const y = originY + row * SPACING
          const dx = x - lensX
          const dy = y - lensY
          const distanceSq = dx * dx + dy * dy
          if (distanceSq > LENS_RADIUS * LENS_RADIUS) continue

          const distance = Math.sqrt(distanceSq) || 0.0001
          const falloff = 1 - distance / LENS_RADIUS
          // Cubic falloff: a linear one makes the lens boundary visible as a
          // hard ring, which reads as a shader bug rather than as glass.
          const push = falloff * falloff * falloff * LENS_STRENGTH * power

          ctx.globalAlpha = (0.25 + falloff * 0.75) * power
          ctx.beginPath()
          ctx.arc(
            x + (dx / distance) * push,
            y + (dy / distance) * push,
            DOT_RADIUS + falloff * 1.5 * power,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const nextWidth = window.innerWidth
      const nextHeight = window.innerHeight

      /*
       * A shrink at the same width is ignored, and that is what makes the field
       * affordable on a phone.
       *
       * Collapsing and re-showing the URL bar changes `innerHeight` and fires
       * `resize`, repeatedly, during a single flick - and honouring each one
       * would re-rasterise ~1,900 arcs in the middle of a scroll, which is the
       * exact cost this canvas used to be kept off mobile to avoid. The field is
       * a uniform grid inside a fixed, `overflow: hidden` wrapper, so a canvas
       * left *taller* than the viewport is indistinguishable from one that fits.
       * Keeping the tallest height ever seen means the bar can come and go for
       * free, and only a genuine growth or a rotation (which changes the width)
       * has to be paid for.
       */
      if (nextWidth === width && nextHeight <= height) return

      width = nextWidth
      height = nextHeight
      cols = Math.ceil(width / SPACING) + 1
      rows = Math.ceil(height / SPACING) + 1
      originX = (width - (cols - 1) * SPACING) / 2
      originY = (height - (rows - 1) * SPACING) / 2

      for (const surface of field === canvas ? [canvas] : [canvas, field]) {
        surface.width = Math.round(width * dpr)
        surface.height = Math.round(height * dpr)
      }
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      renderField()
      draw()
    }

    const tick = () => {
      lensX += (targetX - lensX) * 0.12
      lensY += (targetY - lensY) * 0.12
      /*
       * Asymmetric on purpose: in fast, out slow. Appearing is a response and
       * has to feel like one - at the position easing's own 0.12 the lens spent
       * roughly four tenths of a second arriving, which is most of a swipe, so
       * a quick flick was over before the field had finished answering it.
       * Leaving is not a response to anything and can take its time.
       */
      power += (targetPower - power) * (targetPower > power ? 0.24 : 0.09)
      draw()

      if (
        Math.abs(targetX - lensX) < SETTLE_EPSILON &&
        Math.abs(targetY - lensY) < SETTLE_EPSILON &&
        Math.abs(targetPower - power) < POWER_EPSILON
      ) {
        lensX = targetX
        lensY = targetY
        power = targetPower
        draw()
        running = false
        frame = 0
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(tick)
    }

    /**
     * Aim the lens at a point and light it.
     *
     * Arriving from nothing, the lens is *placed* rather than driven there.
     * Easing in from wherever it was last released would drag a bright wake
     * across the whole field - and on a phone "arriving from nothing" is not the
     * edge case it is with a mouse, it is what every interaction looks like.
     * Only the fade is animated on arrival; position picks up its easing for the
     * rest of the gesture.
     */
    const aim = (x: number, y: number) => {
      if (targetPower === 0) {
        lensX = x
        lensY = y
      }
      targetX = x
      targetY = y
      targetPower = 1
      wake()
    }

    const release = () => {
      targetPower = 0
      wake()
    }

    // Mouse and pen. Touch has its own handlers below and would otherwise be
    // aimed twice with the same coordinates until the browser cancels it.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      aim(event.clientX, event.clientY)
    }

    /*
     * Touch is tracked through the *touch* events, not the pointer ones, and that
     * is the whole reason the field reacts to a swipe at all.
     *
     * The browser withdraws the pointer the instant it decides a touch is a
     * scroll: `pointercancel` fires and `pointermove` simply stops. Since a
     * scroll is what nearly every touch on a page like this turns into, driving
     * the lens from pointer events meant it lit up for a few milliseconds at the
     * start of a swipe and then went out for the rest of it - reacting to
     * everything except the gesture people actually make.
     *
     * A passive `touchmove` keeps firing for the entire scroll, so the lens
     * follows the finger the whole way down the page. `touchstart` lights it on
     * contact rather than waiting for the first movement, which is the difference
     * between the field answering a touch and the field noticing one.
     */
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) aim(touch.clientX, touch.clientY)
    }

    const onTouchEnd = (event: TouchEvent) => {
      // Lifting one of two fingers is not the end of the gesture.
      if (event.touches.length === 0) release()
    }

    /*
     * The theme swap rewrites the custom properties this reads, so the field has
     * to be re-rasterised - about 1,900 arcs plus two `getComputedStyle` calls,
     * which forces a style recalc.
     *
     * Deferred to a frame rather than run in the observer's microtask: the theme
     * switch is a view transition, and doing this work synchronously puts a
     * multi-millisecond canvas redraw on the main thread in the middle of it.
     * One frame late is invisible - the canvas is under a full-page snapshot at
     * that moment anyway.
     */
    let themeFrame = 0
    const themeObserver = new MutationObserver(() => {
      if (themeFrame) return
      themeFrame = requestAnimationFrame(() => {
        themeFrame = 0
        // Both, and `restColor` is the one that bites: the themes put the field
        // on opposite sides of the background it sits on - pale dots on ink in
        // dark, ink dots on paper in light - so carrying the old value across a
        // switch does not tint the grid, it erases it.
        hotColor = readVar('--accent', hotColor)
        restColor = readVar('--fg-ghost', restColor)
        renderField()
        draw()
      })
    })
    themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] })

    resize()
    window.addEventListener('resize', resize, { passive: true })
    if (lens) {
      // Mouse and pen. `pointerup` is deliberately not listened for - a cursor
      // still exists after its button comes up, and clicking should not put the
      // lens out. Only leaving the window does.
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', release, { passive: true })

      // Touch. Passive, so following the finger can never delay a scroll.
      window.addEventListener('touchstart', onTouch, { passive: true })
      window.addEventListener('touchmove', onTouch, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', release)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      themeObserver.disconnect()
      if (themeFrame) cancelAnimationFrame(themeFrame)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [lens])

  return <canvas ref={canvasRef} className={styles['grid']} aria-hidden="true" />
}
