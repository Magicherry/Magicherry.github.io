import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuArrowUpRight, LuDownload, LuMail, LuPhone, LuX } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import Section from '@/components/Section'
import Reveal from '@/components/Reveal'
import Action from '@/components/Action'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { profile, socials } from '@/content/profile'
import { ui } from '@/content/copy'
import styles from './Contact.module.css'

/*
 * Only for the entries that have no brand mark. Email and phone are protocols,
 * not products - there is no official logo to use, so they keep a line icon in
 * the site's own accent rather than borrowing Gmail's or a handset vendor's.
 */
const FALLBACK_ICONS: Record<string, IconType> = {
  email: LuMail,
  phone: LuPhone,
}

export default function Contact() {
  const { t } = useLocale()
  const [qrOpen, setQrOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  /*
   * Escape closes, the page underneath must not scroll, and focus goes back to
   * whatever opened the overlay. That last part is the one most often skipped:
   * without it a keyboard user closes the dialog and their next Tab starts from
   * the top of the document rather than from the link they were on.
   */
  useEffect(() => {
    if (!qrOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQrOpen(false)
    }
    document.body.dataset['locked'] = 'true'
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      delete document.body.dataset['locked']
      openerRef.current?.focus()
      openerRef.current = null
    }
  }, [qrOpen])

  return (
    <Section
      id="contact"
      title={ui.sections.contact.title}
      lede={ui.sections.contact.body}
    >
      <Reveal>
        <GlassSurface variant="regular" radius="xl" className={styles['panel']} lightAngle={150}>
          <div className={styles['links']}>
            {socials.map((social) => {
              const Fallback = FALLBACK_ICONS[social.id] ?? LuMail
              const isOverlay = social.overlay === 'wechat'
              const href = t(social.href)
              /*
               * mailto: and tel: must not open in a new tab - the handoff to the
               * mail or dialer app leaves an orphaned blank tab behind. Only real
               * navigations get target="_blank".
               */
              const isExternal = href.startsWith('http')

              return (
                <a
                  key={social.id}
                  className={styles['link']}
                  // Drives the hover tint. Falls back to the site accent for the
                  // marks whose brand colour reads badly in one of the themes.
                  style={social.brand ? ({ ['--brand' as string]: social.brand } as CSSProperties) : undefined}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  title={t(social.hint)}
                  onClick={
                    isOverlay
                      ? (event) => {
                          event.preventDefault()
                          openerRef.current = event.currentTarget
                          setQrOpen(true)
                        }
                      : undefined
                  }
                >
                  <span className={styles['linkIcon']} data-mark={social.mark ? '' : undefined}>
                    {social.mark ? (
                      <img
                        src={social.mark}
                        alt=""
                        width={28}
                        height={28}
                        loading="lazy"
                        decoding="async"
                        data-adaptive={social.adaptive || undefined}
                      />
                    ) : (
                      <Fallback aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles['linkText']}>
                    <span className={styles['linkLabel']}>{t(social.label)}</span>
                    <span className={styles['linkHint']}>{t(social.hint)}</span>
                  </span>
                  {isExternal ? <LuArrowUpRight className={styles['linkArrow']} aria-hidden="true" /> : null}
                </a>
              )
            })}
          </div>

          <div className={styles['cta']}>
            <Action
              tone="primary"
              href={t(profile.cv)}
              download={t(profile.cvFileName)}
              target="_blank"
              rel="noopener noreferrer"
              icon={<LuDownload aria-hidden="true" />}
            >
              {t(ui.actions.downloadCv)}
            </Action>
          </div>
        </GlassSurface>
      </Reveal>

      <AnimatePresence>
        {qrOpen ? (
          <motion.div
            className={styles['overlay']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setQrOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t(ui.a11y.wechatQr)}
          >
            <motion.div
              className={styles['qr']}
              initial={{ scale: 0.9, y: 18, filter: 'blur(10px)' }}
              animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ scale: 0.94, y: 10, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <GlassSurface variant="regular" radius="lg" backdrop="live" className={styles['qrCard']}>
                <button
                  type="button"
                  className={styles['qrClose']}
                  onClick={() => setQrOpen(false)}
                  aria-label={t(ui.actions.close)}
                  autoFocus
                >
                  <LuX aria-hidden="true" />
                </button>
                <img src={profile.wechatQr} alt={t(ui.a11y.wechatQr)} width={280} height={280} />
              </GlassSurface>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  )
}
