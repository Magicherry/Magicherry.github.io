import { useEffect, useState } from 'react'

/**
 * Frames per second, averaged over one-second windows.
 *
 * ---------------------------------------------------------------------------
 * This hook breaks the site's standing rule, and it is the only thing that does.
 *
 * Everything else that animates here is built so that an idle page runs *zero*
 * frames: LensGrid stops its loop the moment the lens settles, the aurora drifts
 * in `steps()` so the nav is not re-blurred sixty times a second, the scroll
 * velocity decays on a one-shot animation rather than a standing rAF. A frame
 * counter cannot be written that way. To know how many frames the browser
 * produced you have to be present for every one of them, so this holds a
 * `requestAnimationFrame` loop open for the entire life of the page.
 *
 * Two things keep the cost honest. The callback does almost nothing - one
 * increment and one comparison - so the loop is close to the cheapest thing that
 * can be scheduled per frame. And React is only told once a second, not sixty
 * times: the count accumulates in a closure and `setState` fires on the window
 * boundary, so the frame it is measuring does not also cost a render.
 *
 * The honest caveat is that an FPS meter is partly self-fulfilling. With this
 * loop running the page always has work scheduled, so the browser keeps
 * producing frames even when nothing is moving, and the reading at rest is the
 * display's refresh rate rather than a statement about the page's workload. It
 * is a real measurement of frames delivered - it is just that the meter is one
 * of the reasons they are being delivered. That is true of every in-page frame
 * counter; it is worth knowing before reading anything into a steady 60.
 *
 * Gated by the caller rather than internally, so the loop never starts on the
 * layouts that do not display it.
 */
export function useFps(enabled: boolean): number {
  const [fps, setFps] = useState(0)

  useEffect(() => {
    if (!enabled) return

    let frames = 0
    let windowStart = performance.now()
    let raf = 0

    const tick = (now: number) => {
      frames += 1
      const elapsed = now - windowStart
      if (elapsed >= 1000) {
        setFps(Math.round((frames * 1000) / elapsed))
        frames = 0
        windowStart = now
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled])

  return fps
}
