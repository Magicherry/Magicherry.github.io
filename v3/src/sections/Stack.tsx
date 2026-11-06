import { useLocale } from '@/lib/i18n'
import { ui } from '@/content/copy'
import { certifications, techStack, toolStack } from '@/content/stacks'
import Reveal from '@/components/Reveal'
import RichText from '@/components/RichText'
import TechIcon from '@/components/TechIcon'
import styles from './Stack.module.css'

export default function Stack() {
  const { t } = useLocale()

  return (
    <section id="stack" className={`container ${styles['section']}`} aria-labelledby="stack-title">
      <Reveal>
        <h2 id="stack-title" className={`text-h1 ${styles['title']}`}>
          <RichText tone="heading">{t(ui.sections.stack.title)}</RichText>
        </h2>
      </Reveal>

      <div className={styles['groups']}>
        {techStack.map((group, i) => (
          <Reveal key={group.id} className={`panel ${styles['group']}`} delay={(i % 3) * 0.06}>
            <div className={styles['groupHead']}>
              <h3 className={styles['groupLabel']}>{t(group.label)}</h3>
              <span className={styles['groupCount']}>{String(group.items.length).padStart(2, '0')}</span>
            </div>
            <ul className={styles['items']}>
              {group.items.map((item) => (
                <li key={item.name}>
                  <a className={styles['item']} href={item.href} target="_blank" rel="noopener noreferrer">
                    {/* Bare, no well: each mark has its own silhouette and
                        colour, and a box around it is an edge that belongs to
                        neither. The certifications below keep theirs. */}
                    <span className={styles['itemIcon']}>
                      <TechIcon src={item.icon} size={26} adaptive={item.adaptive} tile={item.tile} />
                    </span>
                    <span className={styles['itemName']}>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className={styles['lower']}>
        <Reveal className={`panel ${styles['block']}`}>
          <h3 className={styles['blockTitle']}>{t(ui.sections.stack.tools)}</h3>
          <dl className={styles['tools']}>
            {toolStack.map((group) => (
              <div key={group.id} className={styles['toolRow']}>
                <dt className={styles['toolLabel']}>{t(group.label)}</dt>
                <dd className={styles['toolItems']}>
                  {group.items.map((item) => (
                    <a
                      key={item.name}
                      className={styles['chip']}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TechIcon src={item.icon} size={16} adaptive={item.adaptive} tile={item.tile} />
                      {item.name}
                    </a>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className={`panel ${styles['block']}`} delay={0.08}>
          <h3 className={styles['blockTitle']}>{t(ui.sections.stack.certifications)}</h3>
          <ul className={styles['certs']}>
            {certifications.map((cert) => (
              <li key={cert.id}>
                <a className={styles['cert']} href={cert.href} target="_blank" rel="noopener noreferrer">
                  <span className={styles['well']}>
                    <TechIcon src={cert.icon} size={22} />
                  </span>
                  <span className={styles['certCopy']}>
                    <span className={styles['itemName']}>{t(cert.name)}</span>
                    <span className={styles['certIssuer']}>{t(cert.issuer)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
