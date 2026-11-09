import type { ReactNode } from 'react'
import { useScrollNav, type SectionId } from '@/lib/scroll'
import type { Localized } from '@/content/types'
import { useLocale } from '@/lib/i18n'
import Reveal from './Reveal'
import RichText from './RichText'
import styles from './Section.module.css'

/*
 * A "slate" strip used to sit above every title - the romanised section id and a
 * hairline rule trailing off to the right, `stack ─────────`, at one point with a
 * two-digit index in front of it.
 *
 * All of it is gone. Each piece was defensible on its own and none of it was
 * carrying information: the id restated, in English and at 11px, exactly what the
 * heading underneath says in the reader's own language, and the rule was a
 * horizontal drawn above a block that already begins with the largest type on the
 * page. Five sections deep, that is five decorations in the one position a reader
 * looks at first.
 *
 * <BlockHead> draws very nearly the same strip and is not a walking back of any
 * of that, because both arguments above are about *position* rather than about
 * the figure. It goes on blocks that have no heading at all - Certifications,
 * Tools, Education - several hundred pixels into a section whose title has
 * already been read, where the label is the only name the block has and the rule
 * is the only thing separating it from what came before. Neither is true here.
 * Nothing goes above the <h2>.
 */

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
  const { active } = useScrollNav()

  /*
   * The section answers the frame.
   *
   * The HUD locks onto whatever the spy hands it (see Frame.tsx); this is the
   * other half of that event, in the content. The attribute is *held* for as
   * long as the section owns the viewport rather than being pulsed and removed,
   * which is what makes re-acquisition work: scroll away and back and the
   * attribute genuinely leaves and returns, so the one-shot animations hanging
   * off it in base.css start again. An attribute that was set and cleared on a
   * timer would fire once and then be unable to fire a second time without a
   * reflow.
   *
   * Reading the context here re-renders five components when the active section
   * changes. That is a handful of renders on an event that happens at reading
   * speed - unlike `progress` and `velocity` on the same context, which is
   * exactly why those two are motion values and this one is not.
   */
  const acquired = active === id

  return (
    <section
      id={id}
      className={`section ${styles['section']}`}
      data-acquired={acquired || undefined}
      aria-labelledby={`${id}-title`}
    >
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
