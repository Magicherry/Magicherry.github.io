import { LuMoon, LuSun } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { site } from '@/content/site'
import styles from './ThemeToggle.module.css'

/**
 * One round button, sun or moon.
 *
 * A single toggle rather than a two-segment pill like the language one: there
 * are two states and each has a universally read glyph, so the button shows
 * the current appearance and its label says what pressing it will do. Both
 * glyphs are always mounted and cross over (one turns out as the other turns
 * in), so the change reads as the same object flipping rather than a swap.
 *
 * The new appearance spreads out from the button itself (see `toggle` in
 * lib/theme.tsx), so it hands over its own centre - not the pointer's, which
 * a keyboard press does not have.
 */
export default function ThemeToggle({ className, secondary = false }: { className?: string; secondary?: boolean }) {
  const { theme, toggle } = useTheme()
  const { t } = useLocale()
  const label = t(theme === 'dark' ? site.theme.toLight : site.theme.toDark)

  return (
    <button
      type="button"
      className={`${styles['toggle']}${secondary ? ` btn btn-secondary ${styles['secondary']}` : ''}${className ? ` ${className}` : ''}`}
      data-theme-current={theme}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={label}
      title={label}
    >
      <LuMoon className={`${styles['glyph']} ${styles['moon']}`} aria-hidden="true" />
      <LuSun className={`${styles['glyph']} ${styles['sun']}`} aria-hidden="true" />
    </button>
  )
}
