import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { FaGithub } from 'react-icons/fa6'
import { LuBriefcaseBusiness, LuFolderCode, LuLayers, LuMenu, LuSend, LuUserRound, LuX } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { profile } from '@/content/profile'
import LocaleToggle from './LocaleToggle'
import CvDownload from './CvDownload'
import { LensFilter, useLensCondense, useLensMap } from './LensFilter'
import styles from './Header.module.css'

/**
 * In-page destinations, in page order. Ids match the `<section id>`s in App.
 *
 * The icons are for the phone menu only. There each destination is a full-width
 * row of large type, and a glyph in front gives the eye a column to run down;
 * in the desktop bar the five words sit in one short line and an icon apiece
 * would only crowd it.
 */
export const NAV = [
  { id: 'about', label: ui.nav.about, icon: LuUserRound },
  { id: 'work', label: ui.nav.work, icon: LuBriefcaseBusiness },
  { id: 'projects', label: ui.nav.projects, icon: LuFolderCode },
  { id: 'stack', label: ui.nav.stack, icon: LuLayers },
  { id: 'contact', label: ui.nav.contact, icon: LuSend },
] as const

/** Past this many pixels the header leaves the hero and becomes a pill. */
const SCROLL_THRESHOLD = 80

/** The pill's lens. A 16px bevel on a 41px bar leaves the middle 9px - the
    x-height of the nav type - optically flat; the rest bends, up to 28px of
    throw at the rim. Tuned against body text scrolling underneath: half this
    throw read as plain frosted glass. */
const LENS = { bevel: 16, falloff: 2, scale: 56, dispersion: 0.12 }

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
  const [bar, setBar] = useState<HTMLDivElement | null>(null)
  const lens = useLensMap(bar, LENS)
  useLensCondense('header-lens', scrolled, !!lens)

  /*
   * The hover droplet: one small glass pill behind the nav links that slides
   * to whichever link the pointer is over, with the same liquid figure as the
   * language toggle and the project filter - leading edge first, trailing edge
   * following on a springier curve, so it stretches across both links
   * mid-move. `live` is false when the pointer has just entered the nav: then
   * the droplet appears where it is needed (fading and swelling in) rather than
   * sliding over from wherever it was last left.
   *
   * Edges are `offsetLeft` against the <nav>, which is the links' offset
   * parent; the <ul> is deliberately left unpositioned.
   */
  const [drop, setDrop] = useState<{ l: number; r: number; dir: 'left' | 'right'; live: boolean } | null>(null)
  const [dropShown, setDropShown] = useState(false)
  const moveDrop = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const a = e.currentTarget
    const l = a.offsetLeft
    const r = l + a.offsetWidth
    setDrop((prev) => ({ l, r, dir: prev && l < prev.l ? 'left' : 'right', live: dropShown && !!prev }))
    setDropShown(true)
  }

  /* A boolean, not a scroll position in state: the header re-renders when it
     crosses the threshold, not on every scroll frame. */
  const actionsRef = useRef<HTMLDivElement>(null)
  /* Whether focus was inside the actions group when the scroll was read -
     taken *before* React re-renders, since the swap below unmounts whatever
     held it. */
  const actionsHadFocus = useRef(false)
  useEffect(() => {
    const read = () => {
      actionsHadFocus.current = !!actionsRef.current?.contains(document.activeElement)
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [])

  /* The actions swap (language toggle <-> GitHub and CV) unmounts the focused
     control when a keyboard user scrolls across the threshold - Home from the
     CV button, say - and focus would fall to <body>. Hand it to the first
     control of the group that replaced it instead. */
  useLayoutEffect(() => {
    const group = actionsRef.current
    if (!actionsHadFocus.current || !group || group.contains(document.activeElement)) return
    actionsHadFocus.current = false
    group.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus({ preventScroll: true })
  }, [scrolled])

  /* The open menu covers the page; scrolling what is under it would move
     content nobody can see. Escape closes it, as any overlay should.

     It is also modal for focus. Opening it moves focus to its close button,
     and everything else on the page - the header, <main>, the footer, the
     skip link: every sibling of the menu - goes `inert`, so Tab stays inside
     the sheet instead of walking through the page hidden behind it. Closing
     hands focus back to the button that opened it. */
  const menuRef = useRef<HTMLDivElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const menu = menuRef.current
    if (!menuOpen || !menu) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const others = Array.from(menu.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el !== menu && el instanceof HTMLElement && !el.inert,
    )
    for (const el of others) el.inert = true
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      for (const el of others) el.inert = false
      openRef.current?.focus({ preventScroll: true })
    }
  }, [menuOpen])

  return (
    <>
      <header className={styles['wrapper']}>
        {lens ? <LensFilter id="header-lens" href={lens} scale={LENS.scale} dispersion={LENS.dispersion} /> : null}
        <div
          ref={setBar}
          className={styles['bar']}
          data-scrolled={scrolled || undefined}
          data-lens={lens ? '' : undefined}
        >
          <div className={styles['start']}>
            <a className={styles['brand']} href="#top" aria-label={t(ui.actions.backToTop)}>
              <img className={styles['avatar']} src={profile.avatar} alt="" width={28} height={28} />
              <span className={styles['handle']}>{profile.handle}</span>
            </a>
          </div>

          <nav className={styles['nav']} aria-label={t(site.a11y.primaryNav)}>
            {drop ? (
              <span
                className={styles['drop']}
                data-shown={dropShown || undefined}
                data-live={drop.live || undefined}
                data-dir={drop.dir}
                style={{ '--nh-l': `${drop.l}px`, '--nh-r': `${drop.r}px` } as CSSProperties}
                aria-hidden="true"
              />
            ) : null}
            <ul className={styles['links']} onPointerLeave={() => setDropShown(false)}>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <a className={styles['link']} href={`#${id}`} onPointerEnter={moveDrop}>
                    {t(label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The swap is immediate, as in the reference: the bar's own motion
              carries the transition, and a cross-fade between two differently
              sized groups would make the right edge of the pill wobble. */}
          <div ref={actionsRef} className={styles['actions']}>
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
            ref={openRef}
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
        ref={menuRef}
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
            ref={closeRef}
            type="button"
            className={styles['menuButton']}
            data-always
            aria-label={t(site.menu.close)}
            onClick={() => setMenuOpen(false)}
          >
            <LuX aria-hidden="true" />
          </button>
        </div>
        <nav className={styles['menuBody']} aria-label={t(site.a11y.menuNav)} key={locale}>
          {NAV.map(({ id, label, icon: Icon }, i) => (
            <a
              key={id}
              className={styles['menuItem']}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              style={{ '--i': i } as CSSProperties}
            >
              <Icon className={styles['menuIcon']} aria-hidden="true" />
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
