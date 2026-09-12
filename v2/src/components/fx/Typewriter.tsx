import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import styles from './Typewriter.module.css'

/**
 * Stands in for the typed text between words. Named and escaped rather than
 * pasted in: a literal zero-width space is invisible in an editor, which makes
 * it the kind of character someone deletes while tidying whitespace and cannot
 * see they have removed. See the comment at the render site for what it holds up.
 */
const ZWSP = '\u200B'

const TYPE_MS = 62
const DELETE_MS = 32
const HOLD_MS = 1650
const PAUSE_MS = 320

/**
 * A typewriter that handles CJK correctly.
 *
 * `Array.from` rather than `.slice()` on the raw string: a Chinese title is fine
 * either way, but the moment an emoji or any astral-plane character appears,
 * index-based slicing splits a surrogate pair and renders a replacement glyph
 * for one frame. Iterating by code point costs nothing and cannot do that.
 *
 * The whole effect is also announced once, as static text, to assistive tech -
 * a live region that retypes itself letter by letter is unusable.
 */
export default function Typewriter({
  words,
  start = true,
}: {
  words: readonly string[]
  /** Hold the cycle until the intro curtain has lifted. */
  start?: boolean
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [text, setText] = useState('')
  const stateRef = useRef({ index: 0, length: 0, deleting: false })

  useEffect(() => {
    // Restart cleanly when the locale swaps the word list underneath us.
    stateRef.current = { index: 0, length: 0, deleting: false }
    setText('')

    if (!start || reducedMotion || words.length === 0) return

    let timer = 0

    const step = () => {
      const state = stateRef.current
      const chars = Array.from(words[state.index] ?? '')

      if (!state.deleting) {
        state.length += 1
        setText(chars.slice(0, state.length).join(''))

        if (state.length >= chars.length) {
          state.deleting = true
          timer = window.setTimeout(step, HOLD_MS)
          return
        }
        timer = window.setTimeout(step, TYPE_MS)
        return
      }

      state.length -= 1
      setText(chars.slice(0, state.length).join(''))

      if (state.length <= 0) {
        state.deleting = false
        state.index = (state.index + 1) % words.length
        timer = window.setTimeout(step, PAUSE_MS)
        return
      }
      timer = window.setTimeout(step, DELETE_MS)
    }

    timer = window.setTimeout(step, 480)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, start, words])

  if (reducedMotion) {
    return <span className={styles['line']}>{words[0]}</span>
  }

  return (
    <span className={styles['line']}>
      {/*
       * The zero-width space is what stops the page twitching between words.
       *
       * `.line` is an `inline-flex` and this span is its first flex item, which
       * makes two things depend on the span having content. Its height: empty,
       * it is a flex item with nothing in it and contributes 0, so the line's
       * height falls back to the caret's 1.05em where a moment ago it was the
       * text's 1.55em line-height. And its baseline: an inline-flex takes its
       * baseline from its first item, and an item with no baseline to give makes
       * the box fall back to aligning by its bottom edge instead - so the whole
       * line hops vertically inside the paragraph at the same time as the
       * paragraph changes height.
       *
       * Both go away if the span is never truly empty. U+200B renders nothing,
       * measures nothing horizontally, and still generates the line box that
       * fixes the height and the baseline for good. It sits inside an
       * `aria-hidden` span, so no assistive tech ever sees it.
       */}
      <span aria-hidden="true">{text || ZWSP}</span>
      <span className={styles['caret']} aria-hidden="true" />
      <span className="visually-hidden">{words.join(', ')}</span>
    </span>
  )
}
