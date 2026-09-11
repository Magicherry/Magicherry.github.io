import { LuGithub } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { profile } from '@/content/profile'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className={styles['footer']}>
      <div className={`shell ${styles['inner']}`}>
        <p className={styles['motto']}>{t(ui.footer.motto)}</p>

        {/* `.en` rather than `t()`: the copyright line names the rights holder,
            and that stays the Latin name whichever locale the page is reading. */}
        <p className={styles['legal']}>
          © {year} {profile.name.en}. {t(ui.footer.rights)}
        </p>

        {/*
          * This column used to hold a second back-to-top button. By the time the
          * footer is on screen you are as far down the page as it goes, which is
          * precisely when the floating one is showing - two identical controls
          * within sixty pixels of each other, and the one down here was the
          * poorer of the two, with no progress on it.
          */}
        <a
          className={styles['source']}
          href={profile.repo}
          target="_blank"
          rel="noopener noreferrer"
          title={t(ui.footer.sourceHint)}
        >
          <LuGithub aria-hidden="true" />
          <span>{t(ui.footer.source)}</span>
        </a>
      </div>
    </footer>
  )
}
