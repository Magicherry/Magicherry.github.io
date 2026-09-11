import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuArrowUpRight, LuDownload, LuMail, LuPhone, LuX } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import Section from '@/components/Section'
import Reveal from '@/components/Reveal'
import Action from '@/components/Action'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { profile, socials, type SocialLink } from '@/content/profile'
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
  /*
   * Which code is open, not whether one is. The overlay used to be a boolean
   * reading a hardcoded `profile.wechatQr`, which made it a component that could
   * show exactly one image; holding the entry means a second platform is a row
   * of data rather than another branch in here.
   */
  const [qrFor, setQrFor] = useState<SocialLink | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  /*
   * Which row has just been copied, so its hint can say so for a moment.
   *
   * A copy leaves no trace anywhere on screen - the clipboard is invisible - so
   * without this the row is indistinguishable from one that did nothing at all.
   */
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const copyHandle = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /*
       * No clipboard: an insecure context, or the user declined. Say nothing
       * rather than claim success - the handle is already printed in the hint
       * beside the label, so it can still be read off and typed.
       */
      return
    }
    setCopiedId(id)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopiedId(null), 1600)
  }

  /*
   * Escape closes, the page underneath must not scroll, and focus goes back to
   * whatever opened the overlay. That last part is the one most often skipped:
   * without it a keyboard user closes the dialog and their next Tab starts from
   * the top of the document rather than from the link they were on.
   */
  useEffect(() => {
    if (!qrFor) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQrFor(null)
    }
    document.body.dataset['locked'] = 'true'
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      delete document.body.dataset['locked']
      openerRef.current?.focus()
      openerRef.current = null
    }
  }, [qrFor])

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
              // Rows that do something here instead of going somewhere.
              const intercepts = Boolean(social.qr || social.copy)
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
                    intercepts
                      ? (event) => {
                          event.preventDefault()
                          if (social.qr) {
                            openerRef.current = event.currentTarget
                            setQrFor(social)
                          } else if (social.copy) {
                            void copyHandle(social.copy, social.id)
                          }
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
                        data-tile={social.tile || undefined}
                      />
                    ) : (
                      <Fallback aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles['linkText']}>
                    <span className={styles['linkLabel']}>{t(social.label)}</span>
                    {/* Live only on the rows that can change, so the other six
                        are not announced every time the locale switches. */}
                    <span
                      className={styles['linkHint']}
                      aria-live={social.copy ? 'polite' : undefined}
                    >
                      {copiedId === social.id ? t(ui.actions.copied) : t(social.hint)}
                    </span>
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
        {qrFor?.qr ? (
          <motion.div
            className={styles['overlay']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setQrFor(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t(qrFor.qr.alt)}
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
                  onClick={() => setQrFor(null)}
                  aria-label={t(ui.actions.close)}
                  autoFocus
                >
                  <LuX aria-hidden="true" />
                </button>
                <img src={qrFor.qr.image} alt={t(qrFor.qr.alt)} width={280} height={280} />
              </GlassSurface>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  )
}
