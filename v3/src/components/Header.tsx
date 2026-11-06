import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa6'
import { LuMenu, LuX } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { profile } from '@/content/profile'
import LocaleToggle from './LocaleToggle'
import CvDownload from './CvDownload'
import styles from './Header.module.css'

/** In-page destinations, in page order. Ids match the `<section id>`s in App. */
export const NAV = [
  { id: 'about', label: ui.nav.about },
  { id: 'work', label: ui.nav.work },
  { id: 'projects', label: ui.nav.projects },
  { id: 'stack', label: ui.nav.stack },
  { id: 'contact', label: ui.nav.contact },
] as const

/** Past this many pixels the header leaves the hero and becomes a pill. */
const SCROLL_THRESHOLD = 80

/**
 * The header has two states and moves between them as one object.
 *
 * At the top of the page it is full-width type sitting on the hero, with the
 * language toggle on the right. Past 80px of scroll it gathers itself into a
 * glass pill: it contracts to 980px (1180 on very wide screens) on a physical
 * spring, takes a little inner padding, fades its glass in behind, and swaps
 * the language toggle for the two actions a reader mid-page actually wants -
 * GitHub and the CV.
 *
 * The reference also slides a label in beside the logo once the hero's eyebrow
 * scrolls away. That was tried here and taken out: the logo and the nav say
 * enough, and the role belongs to the hero, not the chrome.
 */
export default function Header() {
  const { t, locale } = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  /* A boolean, not a scroll position in state: the header re-renders when it
     crosses the threshold, not on every scroll frame. */
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [])

  /* The open menu covers the page; scrolling what is under it would move
     content nobody can see. Escape closes it, as any overlay should. */
  useEffect(() => {
    if (!menuOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header className={styles['wrapper']}>
        <div className={styles['bar']} data-scrolled={scrolled || undefined}>
          <div className={styles['start']}>
            <a className={styles['brand']} href="#top" aria-label={t(ui.actions.backToTop)}>
              <img className={styles['avatar']} src={profile.avatar} alt="" width={28} height={28} />
              <span className={styles['handle']}>{profile.handle}</span>
            </a>
          </div>

          <nav className={styles['nav']} aria-label="Primary">
            <ul className={styles['links']}>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <a className={styles['link']} href={`#${id}`}>
                    {t(label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The swap is immediate, as in the reference: the bar's own motion
              carries the transition, and a cross-fade between two differently
              sized groups would make the right edge of the pill wobble. */}
          <div className={styles['actions']}>
            {scrolled ? (
              <>
                <a className="btn btn-secondary btn-xs" href={profile.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub aria-hidden="true" />
                  GitHub
                </a>
                <CvDownload size="xs" placement="bottom-end" />
              </>
            ) : (
              <LocaleToggle />
            )}
          </div>

          <button
            type="button"
            className={styles['menuButton']}
            aria-label={t(site.menu.open)}
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <LuMenu aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={styles['menu']}
        data-open={menuOpen || undefined}
        aria-hidden={!menuOpen}
        {...(menuOpen ? {} : { inert: true })}
      >
        <div className={styles['menuHeader']}>
          <a className={styles['brand']} href="#top" onClick={() => setMenuOpen(false)}>
            <img className={styles['avatar']} src={profile.avatar} alt="" width={28} height={28} />
            <span className={styles['handle']}>{profile.handle}</span>
          </a>
          <button
            type="button"
            className={styles['menuButton']}
            data-always
            aria-label={t(site.menu.close)}
            onClick={() => setMenuOpen(false)}
          >
            <LuX aria-hidden="true" />
          </button>
        </div>
        <nav className={styles['menuBody']} aria-label="Primary" key={locale}>
          {NAV.map(({ id, label }) => (
            <a key={id} className={styles['menuItem']} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {t(label)}
            </a>
          ))}
        </nav>
        <div className={styles['menuFooter']}>
          <LocaleToggle />
          {/* At the foot of the screen, so its menu opens upward. */}
          <CvDownload size="sm" placement="top-end" />
        </div>
      </div>
    </>
  )
}
