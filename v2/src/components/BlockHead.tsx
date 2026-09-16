import type { ReactNode } from 'react'
import type { Localized } from '@/content/types'
import { useLocale } from '@/lib/i18n'
import styles from './BlockHead.module.css'

type HeadTag = 'h3' | 'h4' | 'p'

interface BlockHeadProps {
  label: Localized
  /** Defaults to `h3` - these head sub-blocks *inside* a section, under its h2. */
  as?: HeadTag
  /** A glyph before the label. Decorative: the label beside it is the name. */
  icon?: ReactNode
  className?: string
}

/**
 * `LABEL ┄┄┄┄┄┄┄┄┄┄┄┄┤` - the header for a block that has no heading of its own.
 *
 * Read the note at the top of Section.tsx before extending this. A strip of
 * very nearly this shape used to sit above every <h2> and was deleted, on two
 * grounds that both turn on *position*: the label restated the heading directly
 * beneath it, and it put a horizontal rule in the first place a reader looks,
 * five times down one page. Neither argument survives moving down the page.
 * This names blocks that are otherwise unnamed - Certifications, Tools,
 * Education - underneath a section title that has already been read. It must
 * never appear above an <h2>.
 *
 * The one other place it is forbidden is inside a GlassSurface. A full-width
 * horizontal twenty-odd pixels below the panel's 10px bracket arm is two
 * rectangles a few pixels apart, which is the exact misprint the brackets were
 * moved off `inset: 7px` to stop drawing. Glass cards head themselves.
 *
 * There is no readout at the far end, and there was one for about an hour. A
 * count of the entries directly beneath it is a number restating something
 * already on screen - the same charge that took down the strip in Section.tsx,
 * and it does not become untrue further down the page. What the rule needs at
 * its end is a *terminus*, which it draws itself; what it does not need is a
 * figure.
 */
export default function BlockHead({ label, as = 'h3', icon, className }: BlockHeadProps) {
  const { t } = useLocale()
  const Tag = as

  return (
    <div className={className ? `${styles['head']} ${className}` : styles['head']}>
      <Tag className={styles['label']}>
        {icon ? (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {t(label)}
      </Tag>
      <span className="hud-rule" aria-hidden="true" />
    </div>
  )
}
