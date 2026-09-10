import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import type { IconType } from 'react-icons'
import {
  LuBriefcase,
  LuFolderGit2,
  LuLanguages,
  LuLayers,
  LuMail,
  LuMoon,
  LuSun,
  LuUser,
} from 'react-icons/lu'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
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

// The icon shows the theme you would switch *to*, matching the label.
const THEME_ICON: Record<'dark' | 'light', IconType> = {
  dark: LuSun,
  light: LuMoon,
}

/**
 * Language and theme toggles, as a fragment so the parent owns their layout.
 *
 * There is exactly one instance of these on the page at any width. Rendering a
 * desktop copy and a mobile copy and hiding one with CSS is the usual shortcut,
 * but both stay in the accessibility tree - a screen-reader user then hears two
 * "switch theme" buttons and has to guess which one is real.
 */
function Controls() {
  const { t, locale, toggle: toggleLocale } = useLocale()
  const { theme, cycle } = useTheme()
  const ThemeIcon = THEME_ICON[theme]

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

      <button
        type="button"
        className={styles['iconBtn']}
        // The reveal expands from the button that was pressed, so the change
        // visibly originates at the control rather than from nowhere.
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          cycle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        }}
        title={t(ui.theme[theme])}
        aria-label={t(ui.theme[theme])}
      >
        <ThemeIcon aria-hidden="true" />
      </button>
    </>
  )
}

export default function Nav() {
  const { t } = useLocale()
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
      {/* Docked-nav widths only: the toggles get their own bar at the top so the
          bottom bar stays purely navigational. */}
      {dockedNav ? (
        <motion.div
          className={styles['topbar']}
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Controls />
        </motion.div>
      ) : null}

      <motion.header
        className={styles['wrap']}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassSurface
          as="nav"
          variant="thick"
          radius="full"
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
                     */}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-indicator"
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

/** Reading-progress hairline pinned to the top edge of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (value) => setVisible(value > 0.005))

  return (
    <motion.div
      className={styles['progress']}
      style={{ scaleX: scrollYProgress }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      // Decorative: the same information is already carried by the nav
      // indicator, and a continuously changing progressbar role is pure noise
      // for a screen reader.
      aria-hidden="true"
    />
  )
}
