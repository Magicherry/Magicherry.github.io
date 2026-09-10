import { useEffect, useRef } from 'react'

/**
 * Tracks the pointer inside an element and publishes its position as
 * `--gx` / `--gy` custom properties, plus a `data-lit` flag.
 *
 * Two things matter here. First, reads and writes are batched into a single
 * rAF: `getBoundingClientRect()` in a raw pointermove handler forces layout on
 * every event, which on a page with a dozen glass cards is the difference
 * between 120fps and a stutter. The rect is measured once on enter and reused.
 *
 * Second, the element is only observed while the pointer is inside it - the
 * listener is attached on `pointerenter` and torn down on `pointerleave`, so an
 * idle page has no move handlers running at all.
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

    const flush = () => {
      frame = 0
      if (!rect || rect.width === 0) return
      el.style.setProperty('--gx', `${((px - rect.left) / rect.width) * 100}%`)
      el.style.setProperty('--gy', `${((py - rect.top) / rect.height) * 100}%`)
    }

    const onMove = (event: PointerEvent) => {
      px = event.clientX
      py = event.clientY
      if (!frame) frame = requestAnimationFrame(flush)
    }

    const onEnter = (event: PointerEvent) => {
      rect = el.getBoundingClientRect()
      el.dataset['lit'] = 'true'
      onMove(event)
      el.addEventListener('pointermove', onMove, { passive: true })
    }

    const onLeave = () => {
      el.removeEventListener('pointermove', onMove)
      delete el.dataset['lit']
      rect = null
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
