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
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const { t } = useLocale()
  const label = t(theme === 'dark' ? site.theme.toLight : site.theme.toDark)

  return (
    <button
      type="button"
      className={className ? `${styles['toggle']} ${className}` : styles['toggle']}
      data-theme-current={theme}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <LuMoon className={`${styles['glyph']} ${styles['moon']}`} aria-hidden="true" />
      <LuSun className={`${styles['glyph']} ${styles['sun']}`} aria-hidden="true" />
    </button>
  )
}
