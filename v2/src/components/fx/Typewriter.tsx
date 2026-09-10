import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import styles from './Typewriter.module.css'

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
      <span aria-hidden="true">{text}</span>
      <span className={styles['caret']} aria-hidden="true" />
      <span className="visually-hidden">{words.join(', ')}</span>
    </span>
  )
}
