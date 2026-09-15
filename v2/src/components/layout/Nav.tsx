import { motion } from 'motion/react'
import type { IconType } from 'react-icons'
import { LuBriefcase, LuFolderGit2, LuLanguages, LuLayers, LuMail, LuUser } from 'react-icons/lu'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { useScrollNav, type SectionId } from '@/lib/scroll'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import type { Localized } from '@/content/types'
import { profile } from '@/content/profile'
import { ui } from '@/content/copy'
import styles from './Nav.module.css'

interface NavItem {
  id: Exclude<SectionId, 'home'>
  icon: IconType
  label: Localized
}

const ITEMS: readonly NavItem[] = [
  { id: 'about', icon: LuUser, label: ui.nav.about },
  { id: 'stack', icon: LuLayers, label: { en: 'Stack', zh: '技术栈' } },
  { id: 'work', icon: LuBriefcase, label: ui.nav.work },
  { id: 'projects', icon: LuFolderGit2, label: ui.nav.projects },
  { id: 'contact', icon: LuMail, label: ui.nav.contact },
]

/**
 * The site's settings, which is now one button: the language toggle.
 *
 * Still a component and still a fragment rather than being inlined twice. There
 * is exactly one instance of it on the page at any width, and rendering a
 * desktop copy and a mobile copy and hiding one with CSS is the usual shortcut -
 * but both stay in the accessibility tree, and a screen-reader user then hears
 * two "switch language" buttons and has to guess which one is real.
 *
 * It kept the fragment when the theme toggle beside it was removed. A single
 * child does not need one, but the parents lay these out as a row and would both
 * have to change the day a second control arrives.
 */
function Controls() {
  const { t, locale, toggle: toggleLocale } = useLocale()

  return (
    <>
      <button
        type="button"
        className={styles['iconBtn']}
        onClick={toggleLocale}
        title={t(ui.language.toggle)}
        aria-label={t(ui.language.toggle)}
      >
        <LuLanguages aria-hidden="true" />
        <span className={styles['iconBtnTag']} aria-hidden="true">
          {locale === 'zh' ? 'EN' : '中'}
        </span>
      </button>
    </>
  )
}

export default function Nav() {
  const { t, locale } = useLocale()
  const { active, scrollTo } = useScrollNav()

  /*
   * Below 760px the nav docks to the bottom of the screen, which is the right
   * place for *navigation* but the wrong place for settings: they end up in the
   * thumb's path competing with the section links. The two toggles move to their
   * own top bar instead - the same split V1 used.
   */
  const dockedNav = useMediaQuery('(max-width: 760px)')

  return (
    <>
      {/*
        * Docked-nav widths only: the mark and the language toggle get their own
        * bar at the top, so the bottom bar stays purely navigational.
        *
        * The mark is here because the docked bar has no room for it - five
        * equal cells, no sixth - and a site whose name appears nowhere on a
        * phone is a site you cannot identify from a screenshot. Pinning it to
        * the top-left also puts it back where it sits on desktop, so the two
        * layouts are the same arrangement at different widths rather than two
        * different headers.
        */}
      {dockedNav ? (
        <motion.div
          className={styles['topbar']}
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className={styles['topMark']}
            onClick={() => scrollTo('home')}
            aria-label={t(ui.actions.backToTop)}
          >
            {/* Decorative: the button is already labelled, and an alt here would
                have a screen reader announce the portrait twice. Same URL the
                hero card uses, so it is served from cache. */}
            <img src={profile.avatar} alt="" width={44} height={44} decoding="async" />
          </button>

          <Controls />
        </motion.div>
      ) : null}

      <motion.header
        className={styles['wrap']}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/*
          * Rounded, and the only surface on the site that is.
          *
          * Everything else is square with bracketed corners, which is a hard
          * figure and meant to be - a panel is something you arrive at, look at,
          * and scroll past. The bar is the one element that is *never* off
          * screen, and a hard corner held in the periphery for an entire visit
          * reads as pressure rather than as precision. Softening the one
          * permanent object is what lets the rest of the page stay sharp.
          *
          * `rounded` rather than a value off the radius scale: those entries are
          * two-corner shorthands under a global `corner-shape: bevel`, so they
          * cannot express an arc on all four corners. See GlassSurface.
          */}
        <GlassSurface
          as="nav"
          variant="thick"
          radius="rounded"
          backdrop="live"
          className={styles['bar']}
          aria-label="Primary"
        >
          <button
            type="button"
            className={styles['mark']}
            onClick={() => scrollTo('home')}
            aria-label={t(ui.actions.backToTop)}
          >
            {/* Decorative: the button is already labelled, and an alt here
                would have a screen reader announce the portrait twice. The
                asset is the same URL the hero card uses, so it is served from
                cache rather than fetched again. */}
            <span className={styles['markGlyph']}>
              <img src={profile.avatar} alt="" width={29} height={29} decoding="async" />
            </span>
            <span className={styles['markText']}>Magicherry</span>
          </button>

          <ul className={styles['links']}>
            {ITEMS.map(({ id, icon: Icon, label }) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={styles['link']}
                    data-active={isActive || undefined}
                    onClick={() => scrollTo(id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {/*
                     * A single shared layoutId means the highlight physically
                     * travels between items rather than cross-fading. That is the
                     * difference between the nav reading as an object and reading
                     * as two CSS states.
                     *
                     * Scoped to the locale, and the key forces a remount with it,
                     * because a layout animation answers "the active item moved"
                     * and a locale switch is not that. Every label changes width
                     * at once and the bar's `1fr auto 1fr` centre column resizes
                     * under them, so the pill's box moves a long way for a reason
                     * that has nothing to do with navigation - and the spring
                     * cheerfully flings it across the bar to get there. A layoutId
                     * that has never existed has nothing to travel from, so the
                     * pill simply redraws where it already is. Within one locale
                     * the id is constant and the travel is exactly as before.
                     */}
                    {isActive ? (
                      <motion.span
                        key={locale}
                        layoutId={`nav-indicator-${locale}`}
                        className={styles['indicator']}
                        transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
                      />
                    ) : null}
                    <Icon className={styles['linkIcon']} aria-hidden="true" />
                    <span className={styles['linkText']}>{t(label)}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {dockedNav ? null : (
            <div className={styles['controls']}>
              <Controls />
            </div>
          )}

        </GlassSurface>
      </motion.header>
    </>
  )
}
