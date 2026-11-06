import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocale } from '@/lib/i18n'
import type { Locale } from '@/content/types'
import styles from './LocaleToggle.module.css'

/**
 * A two-segment pill, with the current language raised.
 *
 * Both options are always visible - a single button labelled with the *other*
 * language makes the reader work out what state they are in from what they are
 * not in. Each segment is a real button with `aria-pressed`, so the pair reads
 * as two toggles to assistive tech.
 *
 * The raised part is one pill that slides between the two, the same liquid
 * figure as the project filter: its edges are separate registered properties,
 * the leading edge moves first and the trailing one follows on a springier
 * curve, so the pill stretches across both segments mid-move.
 */
const OPTIONS: readonly { value: Locale; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' },
]

export default function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggle } = useLocale()
  const rowRef = useRef<HTMLDivElement>(null)
  const refs = useRef(new Map<Locale, HTMLButtonElement>())
  const [edges, setEdges] = useState<{ l: number; r: number; dir: 'left' | 'right' } | null>(null)
  const [settled, setSettled] = useState(false)

  /* Measured again on every change of language (the labels do not change
     width, but the active one does change) and on resize. */
  useLayoutEffect(() => {
    const row = rowRef.current
    if (!row) return
    const measure = () => {
      const b = refs.current.get(locale)
      if (!b) return
      const l = b.offsetLeft
      const r = l + b.offsetWidth
      setEdges((prev) => ({ l, r, dir: prev && l < prev.l ? 'left' : 'right' }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [locale])

  /* No transition on the first placement - the pill starts where it belongs. */
  useEffect(() => {
    if (edges && !settled) requestAnimationFrame(() => setSettled(true))
  }, [edges, settled])

  return (
    <div
      ref={rowRef}
      className={className ? `${styles['toggle']} ${className}` : styles['toggle']}
      role="group"
      aria-label="Language"
    >
      {edges ? (
        <span
          className={styles['indicator']}
          data-dir={edges.dir}
          data-settled={settled || undefined}
          style={{ '--lt-l': `${edges.l}px`, '--lt-r': `${edges.r}px` } as CSSProperties}
          aria-hidden="true"
        />
      ) : null}
      {OPTIONS.map(({ value, label }) => {
        const active = value === locale
        return (
          <button
            key={value}
            ref={(el) => {
              if (el) refs.current.set(value, el)
              else refs.current.delete(value)
            }}
            type="button"
            lang={value === 'zh' ? 'zh-CN' : 'en'}
            className={styles['item']}
            data-active={active || undefined}
            aria-pressed={active}
            onClick={active ? undefined : toggle}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
