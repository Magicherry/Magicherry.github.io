import { useEffect, useRef } from 'react'

/**
 * Tracks the pointer inside an element and publishes its position as
 * `--gx` / `--gy` custom properties, plus a `data-lit` flag.
 *
 * Two things matter here. First, reads and writes are batched into a single
 * rAF: `getBoundingClientRect()` in a raw pointermove handler forces layout on
 * every event, which on a page with a dozen glass cards is the difference
 * between 120fps and a stutter.
 *
 * Second, the element is only observed while the pointer is inside it - the
 * listeners are attached on `pointerenter` and torn down on `pointerleave`, so
 * an idle page has no handlers running at all.
 */
export function usePointerGlow<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (window.matchMedia('(hover: none)').matches) return

    let rect: DOMRect | null = null
    let frame = 0
    let px = 0
    let py = 0
    /*
     * Whether the cached rect still describes where the element is.
     *
     * The rect used to be measured once on enter and trusted until leave, which
     * is only true while the element holds still. It does not: the page scrolls
     * under a resting pointer, and since `--gx`/`--gy` are percentages *of the
     * element*, a stale `rect.top` pins the highlight to the spot on the card it
     * was over one scroll ago while the pointer is now somewhere else on it. The
     * glow visibly comes off the cursor and trails it.
     *
     * Re-measuring inside `flush` rather than in the scroll handler is what
     * keeps the original bargain: the read is still batched, still at most one
     * per frame, and still only for the single element the pointer is inside -
     * not the dozen glass cards on the page.
     */
    let measured = false

    const flush = () => {
      frame = 0
      if (!measured) {
        rect = el.getBoundingClientRect()
        measured = true
      }
      if (!rect || rect.width === 0) return
      el.style.setProperty('--gx', `${((px - rect.left) / rect.width) * 100}%`)
      el.style.setProperty('--gy', `${((py - rect.top) / rect.height) * 100}%`)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(flush)
    }

    const onMove = (event: PointerEvent) => {
      px = event.clientX
      py = event.clientY
      schedule()
    }

    /*
     * The pointer has not moved in viewport space, so `px`/`py` are still right
     * and only the element's position is wrong. Scheduling a frame matters as
     * much as invalidating: with the cursor resting, no `pointermove` fires at
     * all, so without this nothing would recompute until the pointer twitched.
     *
     * Capture phase, because a `scroll` event does not bubble - this is the only
     * way one window listener also hears the page's inner scrollers. Lenis
     * drives a real scroll, so its frames arrive here like any other.
     */
    const onViewportChange = () => {
      measured = false
      schedule()
    }

    const onEnter = (event: PointerEvent) => {
      measured = false
      el.dataset['lit'] = 'true'
      onMove(event)
      el.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
      window.addEventListener('resize', onViewportChange, { passive: true })
    }

    const onLeave = () => {
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onViewportChange, { capture: true })
      window.removeEventListener('resize', onViewportChange)
      delete el.dataset['lit']
      rect = null
      measured = false
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    el.addEventListener('pointerenter', onEnter, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    el.addEventListener('pointercancel', onLeave, { passive: true })

    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointercancel', onLeave)
      onLeave()
    }
  }, [enabled])

  return ref
}
