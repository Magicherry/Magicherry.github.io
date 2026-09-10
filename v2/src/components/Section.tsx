import type { ReactNode } from 'react'
import type { SectionId } from '@/lib/scroll'
import type { Localized } from '@/content/types'
import { useLocale } from '@/lib/i18n'
import Reveal from './Reveal'
import RichText from './RichText'
import styles from './Section.module.css'

interface SectionProps {
  id: SectionId
  title: Localized
  lede?: Localized
  /** Rendered to the right of the heading on wide viewports. */
  aside?: ReactNode
  children: ReactNode
}

export default function Section({ id, title, lede, aside, children }: SectionProps) {
  const { t } = useLocale()

  return (
    <section id={id} className={`section ${styles['section']}`} aria-labelledby={`${id}-title`}>
      <div className="shell">
        <Reveal className={styles['head']}>
          <div className={styles['headMain']}>
            <h2 id={`${id}-title`} className="sectionTitle">
              <RichText tone="heading">{t(title)}</RichText>
            </h2>
            {lede ? <p className="lede">{t(lede)}</p> : null}
          </div>
          {aside ? <div className={styles['headAside']}>{aside}</div> : null}
        </Reveal>

        <div className={styles['body']}>{children}</div>
      </div>
    </section>
  )
}
