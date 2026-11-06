import { FaWeixin } from 'react-icons/fa6'
import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import { profile, socials } from '@/content/profile'
import styles from './Footer.module.css'

/**
 * A hairline, then three things on one line: WeChat on the left (its QR rises
 * on hover or focus), the licence and copyright in the middle, and two links on
 * the right.
 */
export default function Footer() {
  const { t } = useLocale()
  const wechat = socials.find((s) => s.id === 'wechat')
  const year = new Date().getFullYear()

  return (
    <footer className={`container ${styles['footer']}`}>
      <div className={styles['rule']} />
      <div className={styles['row']}>
        <div className={styles['start']}>
          {wechat?.qr ? (
            <div className={styles['qr']}>
              <button type="button" className={styles['qrTrigger']} aria-describedby="wechat-qr">
                <FaWeixin aria-hidden="true" />
                <span className="text-caption">{t(site.footer.wechat)}</span>
              </button>
              <div id="wechat-qr" role="tooltip" className={styles['qrPanel']}>
                <img src={wechat.qr.image} alt={t(wechat.qr.alt)} width={156} height={156} loading="lazy" />
                <span className="text-xs">{t(site.footer.scan)}</span>
              </div>
            </div>
          ) : null}
        </div>

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
