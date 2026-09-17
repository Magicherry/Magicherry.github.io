import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import type { IconType } from 'react-icons'
import { LuBriefcase, LuFolderGit2, LuLanguages, LuLayers, LuMail, LuUser } from 'react-icons/lu'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { useScrollNav, type SectionId } from '@/lib/scroll'
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
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
  { id: 'stack', icon: LuLayers, label: ui.nav.stack },
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
  const reducedMotion = usePrefersReducedMotion()

  /*
   * The indicator is lit while a *section* owns the viewport, and the hero is
   * not one of them - it has no nav item, so there is nothing for the marker to
   * sit under while you are at the top of the page.
   *
   * It used to simply not be rendered then, which meant the bar's one moving
   * part appeared and vanished with a hard cut at the two moments it is most
   * likely to be watched: the first scroll of a visit, and every return to the
   * top. Everything else about this control is continuous - the marker travels
   * between items rather than cross-fading - and the entrance was the one edit
   * in it.
   *
   * So it stays mounted on the last item it belonged to and is switched off
   * instead. Keeping the anchor is what makes the two directions symmetric: the
   * light goes out where it was and comes back on in the same place, rather than
   * vanishing here and reappearing somewhere else. The `layoutId` travel is
   * untouched - within one locale it is still one element moving between cells.
   */
  const lit = active !== 'home'
  const [anchor, setAnchor] = useState<NavItem['id']>(ITEMS[0]!.id)
  // Adjusting state during render, which is the documented way to derive one
  // piece of state from another: this needs the *previous* active section, and
  // an effect would paint one frame with the marker on the wrong item first.
  if (lit && active !== anchor) setAnchor(active)

  /*
   * Below 760px the nav docks to the bottom of the screen, which is the right
   * place for *navigation* but the wrong place for settings: they end up in the
   * thumb's path competing with the section links. The two toggles move to their
   * own top bar instead - the same split V1 used.
   */
  const dockedNav = useMediaQuery('(max-width: 760px)')

  /*
   * Whether the page is at the top, which is the only place the phone layout
   * prints the wordmark. See `.topMarkText` in Nav.module.css for why it is a
   * top-of-page thing rather than a permanent one.
   *
   * Two thresholds, not one. A single boundary sits exactly where a finger
   * resting mid-flick leaves the page, and the name would open and shut on every
   * pixel of overscroll wobble; leaving needs 48px of real scrolling and coming
   * back needs a return to within 8px of the top, so the two states cannot
   * chatter across a shared edge.
   *
   * Reading `scrollY` rather than `active === 'home'`, even though that state is
   * already to hand: the hero owns the viewport band for its whole height, so
   * the wordmark would have stayed out for the first screen and a half. This is
   * about being at the top, not about which section is in view.
   */
  const { scrollY } = useScroll()
  const [atTop, setAtTop] = useState(true)
  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop((prev) => (prev ? y < 48 : y < 8))
  })

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
            <span className={styles['topMarkGlyph']}>
              {/* Decorative: the button is already labelled, and an alt here
                  would have a screen reader announce the portrait twice. Same
                  URL the hero card uses, so it is served from cache. */}
              <img src={profile.avatar} alt="" width={44} height={44} decoding="async" />
            </span>

            {/*
             * `width: auto` rather than a measured number, so the box is
             * whatever the word sets at the reader's own text size - this is
             * one of the few strings on the site with no `clamp()` behind it.
             *
             * The margin animates with the width because it has to reach zero
             * too: a gap left standing beside a collapsed box is the disc
             * sitting 10px off the corner it is supposed to be pinned to.
             *
             * `initial={false}` because the page loads at the top with the name
             * already out. Animating to that from a closed box would play the
             * open every time the layout crosses 760px.
             */}
            <motion.span
              className={styles['topMarkText']}
              initial={false}
              animate={
                atTop
                  ? { width: 'auto', marginLeft: 10, opacity: 1 }
                  : { width: 0, marginLeft: 0, opacity: 0 }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      /* Out faster than in, and out on the exit curve: the name
                         arriving is worth watching, the name leaving is
                         answering a scroll that is still in progress. */
                      duration: atTop ? 0.44 : 0.26,
                      ease: atTop ? [0.16, 1, 0.3, 1] : [0.5, 0, 0.75, 0],
                      /* Ahead of the box on the way out, behind it on the way
                         in - the letters are gone before the width finishes
                         closing, and the box is open before they arrive, so
                         neither direction shows type mid-clip. */
                      opacity: { duration: atTop ? 0.3 : 0.16, delay: atTop ? 0.12 : 0 },
                    }
              }
            >
              Magicherry
            </motion.span>
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
                    {id === anchor ? (
                      <motion.span
                        key={locale}
                        layoutId={`nav-indicator-${locale}`}
                        className={styles['indicator']}
                        /*
                         * No entrance on mount. At the top of the page the
                         * marker is already off, and animating to that from a
                         * default would flash it on for a few frames during the
                         * first paint of every visit.
                         */
                        initial={false}
                        /*
                         * Off is narrow as well as dark. Fading alone leaves a
                         * full-width bar dimming in place, which reads as the
                         * page losing contrast; closing it toward the middle at
                         * the same time is a light being switched off. It stops
                         * at 0.3 rather than 0 because the last of the travel
                         * happens under an opacity nobody can see, and a marker
                         * that collapses to nothing has to grow back from
                         * nothing.
                         */
                        animate={{ opacity: lit ? 1 : 0, scaleX: lit ? 1 : 0.3 }}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                layout: { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 },
                                /* Slower on than off. Arriving is the state
                                   change worth watching; leaving should be out
                                   of the way before you have finished the
                                   scroll that caused it. */
                                opacity: {
                                  duration: lit ? 0.34 : 0.2,
                                  ease: lit ? [0.16, 1, 0.3, 1] : [0.5, 0, 0.75, 0],
                                },
                                scaleX: {
                                  duration: lit ? 0.42 : 0.22,
                                  ease: lit ? [0.16, 1, 0.3, 1] : [0.5, 0, 0.75, 0],
                                },
                              }
                        }
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
