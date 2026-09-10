import { motion } from 'motion/react'
import { LuChevronRight, LuQuote } from 'react-icons/lu'
import Section from '@/components/Section'
import Reveal, { revealItem } from '@/components/Reveal'
import RichText from '@/components/RichText'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import styles from './About.module.css'

export default function About() {
  const { t } = useLocale()

  return (
    <Section id="about" title={ui.sections.about.title}>
      <div className={styles['layout']}>
        <Reveal className={styles['prose']} stagger={0.12}>
          {t(ui.about.paragraphs).map((paragraph, index) => (
            <motion.p key={index} variants={revealItem} className={styles['paragraph']}>
              <RichText>{paragraph}</RichText>
            </motion.p>
          ))}
        </Reveal>

        <div className={styles['side']}>
          <Reveal direction="left" delay={0.1}>
            <GlassSurface radius="lg" className={styles['interests']} lightAngle={165}>
              <h3 className={styles['sideTitle']}>
                {t({ en: 'Off the clock', zh: '工作之外' })}
              </h3>
              <ul>
                {t(ui.about.interests).map((interest) => (
                  <li key={interest}>
                    <LuChevronRight aria-hidden="true" />
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </GlassSurface>
          </Reveal>

          <Reveal direction="left" delay={0.2}>
            <figure className={styles['quote']}>
              <LuQuote className={styles['quoteMark']} aria-hidden="true" />
              <blockquote>{t(ui.about.quote)}</blockquote>
              <figcaption>— {t(ui.about.quoteAuthor)}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
