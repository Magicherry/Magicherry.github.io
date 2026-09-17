import { useEffect, useState } from 'react'

/**
 * The wall clock, as `HH:MM:SS`, ticking once a second.
 *
 * It exists because the HUD readouts have to report something *true*. A frame
 * full of invented telemetry - a fake coordinate, a fake signal strength, a
 * number that counts for the look of counting - is the standard failure of this
 * genre and it reads as a screensaver within about four seconds. Every value in
 * the frame is either the reader's own state (where they are on the page, which
 * section owns the viewport, the size of their window) or this: the actual time
 * on the machine looking at it.
 *
 * Fixed-width by construction. `hour12: false` plus 2-digit parts means the
 * string never changes length, so a mono readout does not reflow from `9:05:01`
 * to `10:05:01` and shove the block beside it sideways once an hour.
 *
 * The interval is aligned to the next whole second rather than started
 * immediately: mounted at .94 of a second, a plain 1000ms interval would tick
 * 60ms after each visible change and the display would appear to skip. Aligning
 * once costs one extra timer and keeps the readout in step with the clock it is
 * reporting.
 */
const FORMAT: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}

function stamp(): string {
  // `en-GB` rather than the site locale: this is an instrument readout, and it
  // is set in the same mono caps as every other one. A Chinese locale would
  // render it as `09时05分01秒` - four extra glyphs of a different width, in a
  // block whose entire point is that it does not move.
  return new Date().toLocaleTimeString('en-GB', FORMAT)
}

export function useClock(): string {
  const [time, setTime] = useState(stamp)

  useEffect(() => {
    let interval = 0
    const align = window.setTimeout(
      () => {
        setTime(stamp())
        interval = window.setInterval(() => setTime(stamp()), 1000)
      },
      1000 - (Date.now() % 1000),
    )

    return () => {
      window.clearTimeout(align)
      if (interval) window.clearInterval(interval)
    }
  }, [])

  return time
}
