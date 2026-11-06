import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import styles from './CopyLine.module.css'

/**
 * A one-line terminal: a blue `$` prompt, the command, and a Copy button.
 *
 * The prompt is `user-select: none` so a manual drag-select copies only the
 * command, and the button copies `value` rather than the visible text - the
 * two differ when the display wraps a long command, or abbreviates it.
 */
export default function CopyLine({ command, value }: { command: string; value: string }) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* Clipboard API refused (insecure context, permissions): fall back to a
         hidden textarea, which every browser still honours on a user gesture. */
      const area = document.createElement('textarea')
      area.value = value
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.append(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={styles['line']}>
      <code className={styles['code']}>
        <span className={styles['prompt']} aria-hidden="true">
          ${' '}
        </span>
        {command}
      </code>
      <button type="button" className={styles['copy']} onClick={copy} data-copied={copied || undefined}>
        <span aria-live="polite">{copied ? t(site.connect.copied) : t(site.connect.copy)}</span>
      </button>
    </div>
  )
}
