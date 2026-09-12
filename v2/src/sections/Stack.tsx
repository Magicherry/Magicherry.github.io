import { motion } from 'motion/react'
import Section from '@/components/Section'
import Reveal, { revealItem } from '@/components/Reveal'
import GlassSurface from '@/components/glass/GlassSurface'
import { useLocale } from '@/lib/i18n'
import { certifications, techStack, toolStack, type StackItem } from '@/content/stacks'
import { ui } from '@/content/copy'
import styles from './Stack.module.css'

function Mark({ item }: { item: StackItem }) {
  return (
    <a
      className={styles['item']}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      title={item.name}
    >
      <span className={styles['icon']} data-adaptive={item.adaptive || undefined}>
        <img
          src={item.icon}
          alt=""
          width={22}
          height={22}
          loading="lazy"
          decoding="async"
          data-tile={item.tile || undefined}
        />
      </span>
      <span className={styles['name']}>{item.name}</span>
    </a>
  )
}

export default function Stack() {
  const { t } = useLocale()

  return (
    <Section id="stack" title={ui.sections.stack.title}>
      <div className={styles['groups']}>
        {techStack.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.05} className={styles['groupWrap']}>
            <GlassSurface radius="lg" className={styles['group']} lightAngle={140 + index * 8}>
              <h3 className={styles['groupTitle']}>
                <span>{t(group.label)}</span>
                <span className={styles['groupCount']}>{group.items.length}</span>
              </h3>
              <div className={styles['grid']}>
                {group.items.map((item) => (
                  <Mark key={item.name} item={item} />
                ))}
              </div>
            </GlassSurface>
          </Reveal>
        ))}
      </div>

      {/*
        * Before the tools, not after. The section runs skills -> credentials ->
        * tools, which is the order they carry weight in: what someone else
        * certified is a stronger claim than which editor I open.
        */}
      <Reveal className={styles['block']} stagger={0.06}>
        <h3 className={styles['blockTitle']}>{t(ui.sections.stack.certifications)}</h3>

        <ul className={styles['certs']}>
          {certifications.map((cert) => (
            <motion.li key={cert.id} variants={revealItem}>
              <a
                className={styles['cert']}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                /* Issuer first here, because the tooltip has no layout to say
                   which line is which - "NVIDIA - Transformer-Based NLP" reads
                   as a credential, the reverse reads as two loose nouns. */
                title={`${t(cert.issuer)} — ${t(cert.name)}`}
              >
                <span className={styles['certIcon']}>
                  <img src={cert.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <span className={styles['certText']}>
                  <span className={styles['certName']}>{t(cert.name)}</span>
                  <span className={styles['certIssuer']}>{t(cert.issuer)}</span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <Reveal className={styles['block']} stagger={0.06}>
        <h3 className={styles['blockTitle']}>{t(ui.sections.stack.tools)}</h3>

        {/* One labelled row per category. A definition list is the honest
            element here: each row really is a term and the things under it. */}
        <dl className={styles['toolGroups']}>
          {toolStack.map((group) => (
            <motion.div key={group.id} className={styles['toolGroup']} variants={revealItem}>
              <dt className={styles['toolLabel']}>{t(group.label)}</dt>
              <dd className={styles['toolRow']}>
                {group.items.map((item) => (
                  <Mark key={item.name} item={item} />
                ))}
              </dd>
            </motion.div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
