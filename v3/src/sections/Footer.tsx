import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import { ui } from '@/content/copy'
import { profile } from '@/content/profile'
import styles from './Footer.module.css'

/**
 * A hairline, then three things on one line: v2's motto on the left, the
 * licence and copyright in the middle, and two links on the right.
 *
 * The left slot used to be WeChat with its QR rising on hover. It went: the
 * contact section directly above already offers WeChat with the same QR, and
 * the last line of the page is a better place to sign off than to repeat a
 * button. The motto is v2's closing line, carried over so the two versions end
 * the same way.
 */
export default function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className={`container ${styles['footer']}`}>
      <div className={styles['rule']} />
      <div className={styles['row']}>
        <p className={`text-caption ${styles['start']} ${styles['motto']}`}>{t(ui.footer.motto)}</p>

        <p className={`text-caption description ${styles['center']}`}>
          {t(site.footer.license)} · © {year} {t(profile.name)}
        </p>

        <nav className={styles['end']} aria-label="Footer">
          <a className="text-caption" href={profile.repo} target="_blank" rel="noopener noreferrer">
            {t(site.footer.source)}
          </a>
          <span aria-hidden="true" className="text-caption description">
            ·
          </span>
          <a className="text-caption" href={t(profile.cv)} download={t(profile.cvFileName)}>
            {t(site.footer.cv)}
          </a>
        </nav>
      </div>
    </footer>
  )
}
