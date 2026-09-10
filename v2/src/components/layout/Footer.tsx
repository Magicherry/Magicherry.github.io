import { LuArrowUp } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { useScrollNav } from '@/lib/scroll'
import { ui } from '@/content/copy'
import { profile } from '@/content/profile'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLocale()
  const { scrollTo } = useScrollNav()
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

        <button
          type="button"
          className={styles['top']}
          onClick={() => scrollTo('home')}
          aria-label={t(ui.actions.backToTop)}
        >
          <LuArrowUp aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
