import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { LuChevronDown, LuDownload } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { profile } from '@/content/profile'
import { LOCALES } from '@/content/types'
import styles from './CvDownload.module.css'

type Size = 'xs' | 'sm' | 'm'
type Placement = 'bottom' | 'bottom-end' | 'top-end'

/**
 * A split button, after the reference site's desktop-download control.
 *
 * The main half downloads the CV in the page's current language - the version
 * a reader most likely wants, one click away. The chevron opens a small menu
 * holding both versions, each with its file name underneath, so the other
 * language is never more than two clicks away and is never a guess.
 *
 * The menu items are real `<a download>` links rather than buttons that start
 * a download from script: the browser handles them natively, they can be
 * middle-clicked or saved with a context menu, and nothing depends on a
 * synthetic click being allowed.
 *
 * Keyboard: Enter, Space or ArrowDown on the chevron opens the menu with focus
 * on the first item; ArrowUp/ArrowDown move between items; Escape closes and
 * returns focus to the chevron; Tab moves on and closes. A pointer press
 * anywhere outside closes it too.
 */
export default function CvDownload({
  size = 'm',
  placement = 'bottom-end',
  className,
}: {
  size?: Size
  placement?: Placement
  className?: string
}) {
  const { t, locale } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const focusOnOpen = useRef(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    if (focusOnOpen.current) {
      itemRefs.current[0]?.focus()
      focusOnOpen.current = false
    }
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onResize = () => setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const onArrowKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      focusOnOpen.current = true
      setOpen(true)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter((el): el is HTMLAnchorElement => el !== null)
    const i = items.indexOf(document.activeElement as HTMLAnchorElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length
      items[next]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      arrowRef.current?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const classes = [styles['root'], styles[size], className].filter(Boolean).join(' ')

  return (
    <div ref={rootRef} className={classes}>
      <div className={styles['split']}>
        <a
          className={styles['action']}
          href={t(profile.cv)}
          download={t(profile.cvFileName)}
          title={t(ui.actions.downloadCvHint)}
        >
          <LuDownload aria-hidden="true" className={styles['icon']} />
          {t(ui.actions.downloadCv)}
        </a>
        <button
          ref={arrowRef}
          type="button"
          className={styles['arrow']}
          aria-label={t(site.cv.options)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onArrowKey}
        >
          <span className={styles['divider']} aria-hidden="true" />
          <LuChevronDown aria-hidden="true" className={styles['chevron']} data-open={open || undefined} />
        </button>
      </div>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t(site.cv.options)}
          className={styles['menu']}
          data-placement={placement}
          onKeyDown={onMenuKey}
        >
          {/* Current language first: it is the one the main button already
              downloads, so the list reads "this one, or the other". */}
          {[locale, ...LOCALES.filter((l) => l !== locale)].map((l, i) => (
            <a
              key={l}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              role="menuitem"
              className={styles['option']}
              href={profile.cv[l]}
              download={profile.cvFileName[l]}
              onClick={() => setOpen(false)}
            >
              <span className={styles['optionTitle']}>{t(site.cv[l])}</span>
              <span className={styles['optionNote']}>PDF · {profile.cvFileName[l]}</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
