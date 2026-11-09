import { useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { FaGithub, FaLinkedin, FaWeixin } from 'react-icons/fa6'
import { SiBilibili } from 'react-icons/si'
/* rednote's only mark is its wordmark, which at 16px is an unreadable smudge of
   Han - a generic notebook glyph says "notes app" more clearly. */
import { LuMail, LuNotebookPen, LuPhone } from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { profile, socials, type SocialLink } from '@/content/profile'
import Reveal from '@/components/Reveal'
import RichText from '@/components/RichText'
import CopyLine from '@/components/CopyLine'
import styles from './Contact.module.css'

/** Strips the `mailto:` / `tel:` scheme for display and copying. */
const bare = (href: string) => href.replace(/^(mailto|tel):/, '')

const byId = (id: string): SocialLink | undefined => socials.find((s) => s.id === id)

/**
 * Two parts. First, two terminal cards for the things worth copying - an email
 * address and this site's clone URL. Then the closing call to action: a
 * centred heading over a pool of blue light, with every other channel as a button.
 */
export default function Contact() {
  const { t } = useLocale()
  const email = byId('email')
  const emailAddress = email ? bare(t(email.href)) : ''

  return (
    <>
      <section id="contact" className={`container ${styles['connect']}`} aria-labelledby="connect-title">
        <Reveal>
          <h2 id="connect-title" className={`text-h1 ${styles['title']}`}>
            <RichText tone="heading">{t(ui.sections.contact.title)}</RichText>
          </h2>
        </Reveal>
        <div className={styles['cards']}>
          <Reveal className={`panel ${styles['card']}`}>
            <h3 className="text-subtitle">{t(site.connect.email.title)}</h3>
            <p className="text-body description">{t(site.connect.email.body)}</p>
            <CopyLine command={`mail ${emailAddress}`} value={emailAddress} />
          </Reveal>
          <Reveal className={`panel ${styles['card']}`} delay={0.08}>
            <h3 className="text-subtitle">{t(site.connect.github.title)}</h3>
            <p className="text-body description">{t(site.connect.github.body)}</p>
            <CopyLine command={`git clone ${profile.repo}`} value={`git clone ${profile.repo}`} />
          </Reveal>
        </div>
      </section>

      <div className={styles['ctaWrap']}>
        <div className={styles['glows']} aria-hidden="true">
          <span className={styles['glowA']} />
          <span className={styles['glowB']} />
          <span className={styles['glowC']} />
        </div>
        <section className={`container ${styles['cta']}`} aria-labelledby="cta-title">
          <Reveal className={styles['ctaInner']}>
            <h2 id="cta-title" className="text-h1">
              {t(site.cta.title)}
            </h2>
            <p className={`text-body description ${styles['ctaBody']}`}>{t(site.cta.body)}</p>
            <div className={styles['actions']}>
              <a className="btn btn-primary" href={profile.github} target="_blank" rel="noopener noreferrer">
                <FaGithub aria-hidden="true" />
                GitHub
              </a>
              <SocialButton id="email" Icon={LuMail} />
              <SocialButton id="linkedin" Icon={FaLinkedin} />
              <SocialButton id="bilibili" Icon={SiBilibili} />
              <SocialButton id="xiaohongshu" Icon={LuNotebookPen} />
              <WeChatButton />
              <SocialButton id="phone" Icon={LuPhone} />
            </div>
          </Reveal>
        </section>
      </div>
    </>
  )
}

function SocialButton({ id, Icon }: { id: string; Icon: IconType }) {
  const { t } = useLocale()
  const social = byId(id)
  if (!social) return null
  const href = t(social.href)
  const external = /^https?:/.test(href)
  return (
    <a
      className="btn btn-secondary"
      href={href}
      title={t(social.hint)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <Icon aria-hidden="true" />
      {id === 'phone' ? (
        /* The number on desktop; the label on a phone, where the button is a
           half-width cell and tapping it dials anyway. */
        <>
          <span className={styles['phoneFull']}>{t(social.hint)}</span>
          <span className={styles['phoneShort']}>{t(social.label)}</span>
        </>
      ) : (
        t(social.label)
      )}
    </a>
  )
}

/**
 * WeChat has no link a desktop visitor can follow, so the button shows the QR
 * code instead - in a small white card above the button, the same surface as
 * the CV menu. Click toggles it; a press outside or Escape closes it.
 *
 * The card is a sibling of the button rather than inside it: `.btn` clips its
 * overflow for the hover disc, which would clip the card too.
 */
function WeChatButton() {
  const { t } = useLocale()
  const social = byId('wechat')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!social?.qr) return null

  return (
    <span ref={rootRef} className={styles['qrRoot']}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-secondary"
        aria-expanded={open}
        aria-controls="cta-wechat-qr"
        onClick={() => setOpen((v) => !v)}
      >
        <FaWeixin aria-hidden="true" />
        {t(social.label)}
      </button>
      {open ? (
        <span id="cta-wechat-qr" role="dialog" aria-label={t(social.qr.alt)} className={styles['qrCard']}>
          <img src={social.qr.image} alt={t(social.qr.alt)} width={168} height={168} />
          <span className={styles['qrCaption']}>{t(site.footer.scan)}</span>
        </span>
      ) : null}
    </span>
  )
}
