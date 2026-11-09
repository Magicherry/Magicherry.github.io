import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'

/**
 * Text that resolves out of noise, left to right.
 *
 * It is the frame's one piece of *narrative* motion: the rail's section readout
 * does not cross-fade to the next label, it re-acquires it, which is the whole
 * difference between a page that highlights the current section and an
 * instrument that has just locked onto one.
 *
 * ---------------------------------------------------------------------------
 * Two things about where this may be used.
 *
 * It takes a plain string and it may only ever be given one. Section titles run
 * through <RichText>, which parses `**accent**`, `*aside*` and `[text](url)` out
 * of the copy - shuffling characters underneath that would either destroy the
 * markers or scramble the parsed output's React elements, neither of which this
 * component can see from here. Titles get the acquisition *bloom* instead (see
 * Section.module.css). That split is the better design anyway: a screen where
 * everything decodes is a screen where nothing is being decoded.
 *
 * And the noise is chosen per character rather than per locale, because a string
 * can be mixed and the two alphabets have incompatible failure modes. Latin
 * scrambles to Latin and reads as a cipher. Han must *not* scramble to random
 * Han: the glyphs are dense enough that the run turns to mud, the substitutes
 * vary wildly in stroke weight, and picking real characters at random can
 * assemble something that means a great deal more than intended. So Han
 * scrambles to Hangzhou numerals and the geta mark - all East Asian Wide, so the
 * line does not change length mid-decode, and all unambiguously non-lexical.
 * 〓 is the nicest accident in the set: in Japanese typesetting it is literally
 * the mark for a character that could not be set.
 */

const LATIN_NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const WIDE_NOISE = '〓※〡〢〣〤〥〦〧〨〩'

/** CJK ideographs, including the extension A block and compatibility forms. */
const WIDE = /[㐀-鿿豈-﫿]/

/**
 * How much of the run is spent decoding rather than already resolved.
 *
 * The first character settles a quarter of the way in, the last exactly at the
 * end. A span of 1 (everything still scrambling until its own moment) reads as a
 * wall of noise that empties; starting the resolve early means the label is
 * legible for most of its own animation, which is what keeps this a readout
 * rather than a puzzle.
 */
const RESOLVE_SPAN = 0.75
const RESOLVE_HEAD = 0.25

function noiseFor(char: string): string {
  const set = WIDE.test(char) ? WIDE_NOISE : LATIN_NOISE
  return set[Math.floor(Math.random() * set.length)] ?? char
}

/**
 * One frame of the decode at progress `p`.
 *
 * Whitespace is never scrambled. It carries the word boundaries, and a space
 * that briefly becomes a letter makes the whole label appear to re-wrap.
 */
function render(chars: string[], p: number): string {
  return chars
    .map((char, index) => {
      if (char === ' ' || char === '　') return char
      const settled = (index / chars.length) * RESOLVE_SPAN + RESOLVE_HEAD
      return p >= settled ? char : noiseFor(char)
    })
    .join('')
}

interface ScrambleProps {
  text: string
  className?: string
  /** Milliseconds for the whole run to resolve. */
  duration?: number
}

export default function Scramble({ text, className, duration = 620 }: ScrambleProps) {
  const reducedMotion = usePrefersReducedMotion()

  /*
   * Seeded at full noise rather than at the final text, and that is not a
   * detail - it is the only way to avoid showing the answer first.
   *
   * `useEffect` runs after the commit it belongs to, so a component that starts
   * holding `text` and begins scrambling from an effect paints one frame of
   * resolved type before dissolving it. One frame is enough to read a six-letter
   * label, and the decode then looks like a glitch corrupting something that had
   * already arrived. `usePrefersReducedMotion` reads its media query *during*
   * render (see useMediaQuery), so the right initial value is available here
   * without a layout effect.
   */
  const [display, setDisplay] = useState(() =>
    reducedMotion ? text : render([...text], 0),
  )

  useEffect(() => {
    const chars = [...text]

    if (reducedMotion) {
      // The designed path, not a disabled one: the readout still changes, it
      // simply arrives rather than resolving.
      setDisplay(text)
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setDisplay(render(chars, p))
      if (p < 1) raf = requestAnimationFrame(tick)
      else raf = 0
    }

    raf = requestAnimationFrame(tick)

    // Stops the run if `text` changes mid-decode - switching language while the
    // rail is resolving would otherwise leave two loops writing the same state.
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [duration, reducedMotion, text])

  /*
   * The accessible name is the real string, always. A screen reader hearing
   * `〓※〡〢` - or worse, hearing it re-announced on every frame of the decode -
   * is being given noise the effect was never meant to reach it.
   */
  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="visually-hidden">{text}</span>
    </span>
  )
}
