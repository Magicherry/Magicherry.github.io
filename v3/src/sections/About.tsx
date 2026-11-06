import type { ComponentType, ReactNode } from 'react'
import {
  LuCamera,
  LuCheck,
  LuChevronRight,
  LuClapperboard,
  LuFlag,
  LuGamepad2,
  LuLoaderCircle,
  LuNotebookPen,
  LuPause,
  LuPlay,
  LuX,
} from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { useDemo, type Demo } from '@/lib/useDemo'
import { ui } from '@/content/copy'
import { site } from '@/content/site'
import { techStack, type StackItem } from '@/content/stacks'
import RichText from '@/components/RichText'
import Reveal from '@/components/Reveal'
import TechIcon from '@/components/TechIcon'
import styles from './About.module.css'

/**
 * About: the prose, then four cards. Each card is a title, a sentence, and an
 * illustration drawn in the same idiom as the hero window - small pieces of
 * software caught mid-task - so the claims in the copy have something to point
 * at.
 *
 * The illustrations loop, the way the reference page's feature demos do: an
 * agent working through its steps, a diff being written, a classifier scoring
 * records, the stack scrolling past. `useDemo` runs each one only while it is
 * on screen and unpaused, and holds its finished frame under reduced motion.
 */
/** One glyph per interest, keyed by the ids in copy.ts - v2's set. */
const INTEREST_ICONS: Record<string, ComponentType> = {
  writing: LuNotebookPen,
  games: LuGamepad2,
  f1: LuFlag,
  film: LuClapperboard,
  photo: LuCamera,
}

export default function About() {
  const { t } = useLocale()
  const c = site.about.cards

  return (
    <section id="about" className={`container ${styles['section']}`} aria-labelledby="about-title">
      <Reveal>
        <h2 id="about-title" className={`text-h1 ${styles['title']}`}>
          <RichText tone="heading">{t(site.about.heading)}</RichText>
        </h2>
      </Reveal>

      <div className={styles['grid']}>
        <Card title={t(c.agents.title)} body={t(c.agents.body)} delay={0}>
          <AgentRun />
        </Card>
        <Card title={t(c.fullstack.title)} body={t(c.fullstack.body)} delay={0.08}>
          <Diff />
        </Card>
        <Card title={t(c.research.title)} body={t(c.research.body)} delay={0}>
          <Labels />
        </Card>
        <Card title={t(c.stack.title)} body={t(c.stack.body)} delay={0.08}>
          <Stack />
        </Card>
      </div>

      {/* After the work, what is not work: the interests as pills, and the
          quote as a quiet sign-off line beneath them rather than a headline. */}
      <Reveal className={`panel ${styles['strip']}`}>
        <div className={styles['interests']}>
          <h3 className={styles['sideTitle']}>{t(site.about.offClock)}</h3>
          <ul>
            {ui.about.interests.map((interest) => {
              const Icon = INTEREST_ICONS[interest.id]
              return (
                <li key={interest.id}>
                  {/* Decorative: the label beside it already says what it is. */}
                  <span className={styles['interestIcon']} aria-hidden="true">
                    {Icon ? <Icon /> : null}
                  </span>
                  <span>{t(interest.label)}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <figure className={styles['quote']}>
          <blockquote>“{t(ui.about.quote)}”</blockquote>
          <figcaption>— {t(ui.about.quoteAuthor)}</figcaption>
        </figure>
      </Reveal>
    </section>
  )
}

function Card({ title, body, delay, children }: { title: string; body: string; delay: number; children: ReactNode }) {
  return (
    <Reveal as="article" className={styles['card']} delay={delay}>
      <div className={styles['copy']}>
        <h4 className="text-subtitle">{title}</h4>
        <p className="text-body description">{body}</p>
      </div>
      {children}
    </Reveal>
  )
}

/**
 * The frame every illustration sits in: the media slot, the gates the CSS
 * loops read (`data-running`, `data-static`), and the pause control.
 *
 * The picture itself is `aria-hidden` - it is a drawing of software, and its
 * fake rows and buttons are not content. The pause button is the one real
 * control, so it sits outside that subtree. It shows on hover or keyboard
 * focus, and is not rendered under reduced motion, where nothing moves.
 */
function DemoFrame({ demo, children }: { demo: Demo<HTMLDivElement>; children: ReactNode }) {
  const { t } = useLocale()
  const label = t(demo.paused ? site.about.play : site.about.pause)
  return (
    <div
      ref={demo.ref}
      className={styles['media']}
      data-running={demo.running || undefined}
      data-static={demo.still || undefined}
    >
      {demo.still ? null : (
        <button
          type="button"
          className={styles['pause']}
          onClick={demo.togglePause}
          aria-pressed={demo.paused}
          aria-label={label}
          title={label}
        >
          {demo.paused ? <LuPlay aria-hidden="true" /> : <LuPause aria-hidden="true" />}
        </button>
      )}
      <div className={styles['stage']} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ illustrations */

/** Colours a call like `fn("str", arg)`: the name, the strings, the rest plain. */
function Call({ fn, args }: { fn: string; args: string }) {
  return (
    <code>
      <span className={styles['tkFn']}>{fn}</span>(
      {args.split(/("[^"]*")/).map((part, i) =>
        part.startsWith('"') ? (
          <span key={i} className={styles['tkStr']}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
      )
    </code>
  )
}

/*
 * Agent run. Frames: 0 queued; 1-4 step n running; 5 all done.
 * Each step goes pending -> spinning -> checked; the tool call at the foot is
 * the one the running step is making; the badge reads Done at the end.
 */
const RUN = [700, 1500, 1500, 1500, 1500, 2400] as const
const CALLS = [
  { fn: 'rag.search', args: '"cost reports", k=8' },
  { fn: 'sql.query', args: '"cost_by_line", Q3' },
  { fn: 'forecast.run', args: 'horizon="Q4"' },
  { fn: 'brief.write', args: 'lang="zh"' },
] as const
const TIMES = ['00:01.2', '00:03.8', '00:07.4', '00:09.1']

function AgentRun() {
  const { t } = useLocale()
  const demo = useDemo(RUN, 5)
  const a = site.about
  const done = demo.frame === 5
  const active = Math.min(Math.max(demo.frame - 1, 0), 3)
  const call = CALLS[active]!

  return (
    <DemoFrame demo={demo}>
      <div className={styles['app']}>
        <div className={styles['appBar']}>
          <span className={styles['appTitle']}>{t(a.agentRun)}</span>
          <span className={styles['status']} data-done={done || undefined}>
            <span className={styles['statusDot']} />
            {t(done ? a.done : a.running)}
          </span>
        </div>
        <ol className={styles['steps']}>
          {a.steps.map((step, i) => {
            const state = i < demo.frame - 1 ? 'done' : i === demo.frame - 1 ? 'active' : 'pending'
            return (
              <li key={i} className={styles['step']} data-state={state}>
                <span className={styles['stepIcon']}>
                  {state === 'done' ? (
                    <LuCheck />
                  ) : state === 'active' ? (
                    <LuLoaderCircle className={styles['spin']} />
                  ) : (
                    <span className={styles['pending']} />
                  )}
                </span>
                <span className={styles['stepLabel']}>{t(step)}</span>
                <span className={styles['stepTime']}>{state === 'done' ? TIMES[i] : ''}</span>
              </li>
            )
          })}
        </ol>
        {/* Keyed on the step, so each new call slides in rather than the text
            silently swapping. */}
        <div key={active} className={styles['toolCall']}>
          <LuChevronRight />
          <Call fn={call.fn} args={call.args} />
        </div>
      </div>
    </DemoFrame>
  )
}

/*
 * Diff. Frames: 0 context only; 1 the removed line appears; 2 and 3 the
 * added lines type in; 4 the counts settle and it holds.
 */
const DIFF = [1000, 900, 1100, 1100, 2200] as const

function Diff() {
  const { t } = useLocale()
  const demo = useDemo(DIFF, 4)
  const f = demo.frame
  type Line = { a?: number; b?: number; kind: 'ctx' | 'add' | 'del'; at: number; code: ReactNode }
  const lines: Line[] = [
    { a: 12, b: 12, kind: 'ctx', at: 0, code: <><K>export async function</K> <F>plan</F>(task: <K>Task</K>) {'{'}</> },
    { a: 13, kind: 'del', at: 1, code: <>  <K>return</K> llm.<F>run</F>(task)</> },
    { b: 13, kind: 'add', at: 2, code: <>  <K>const</K> docs = <K>await</K> rag.<F>retrieve</F>(task.query)</> },
    { b: 14, kind: 'add', at: 3, code: <>  <K>return</K> llm.<F>run</F>(task, {'{'} docs {'}'})</> },
    { a: 14, b: 15, kind: 'ctx', at: 0, code: <>{'}'}</> },
  ]
  const adds = lines.filter((l) => l.kind === 'add' && f >= l.at).length
  const dels = lines.filter((l) => l.kind === 'del' && f >= l.at).length

  return (
    <DemoFrame demo={demo}>
      <div className={styles['app']}>
        <div className={styles['tabBar']}>
          <span className={styles['tab']}>
            {t(site.about.diffTab)}
            <LuX />
          </span>
        </div>
        <div className={styles['diffHeader']}>
          <span className={styles['filePath']}>src/agent/plan.ts</span>
          <span className={styles['counts']}>
            <span className={styles['plus']}>+{adds}</span>
            <span className={styles['minus']}>−{dels}</span>
          </span>
        </div>
        <div className={styles['diffBody']}>
          <div className={styles['hunk']}>@@ -12,3 +12,4 @@</div>
          {lines.map((line, i) => (
            <div key={i} className={styles['line']} data-kind={line.kind} data-shown={f >= line.at || undefined}>
              <span className={styles['lineNo']}>{line.a ?? ''}</span>
              <span className={styles['lineNo']}>{line.b ?? ''}</span>
              <span className={styles['sign']}>{line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : ''}</span>
              <code>{line.code}</code>
            </div>
          ))}
        </div>
      </div>
    </DemoFrame>
  )
}

const K = ({ children }: { children: ReactNode }) => <span className={styles['tkKw']}>{children}</span>
const F = ({ children }: { children: ReactNode }) => <span className={styles['tkFn']}>{children}</span>

/*
 * Classifier. Several records, five frames each: the record arrives, the three
 * levels of its label fill in turn, then it holds and the next one comes in.
 */
/* Five frames per record - arrive, score three levels, hold - for however
   many records site.ts holds. Built once at module level, so it is a stable
   reference for useDemo. */
const LABELS: readonly number[] = site.about.records.flatMap(() => [700, 650, 650, 650, 2000])

function Labels() {
  const { t } = useLocale()
  const demo = useDemo(LABELS, 4)
  const record = site.about.records[Math.floor(demo.frame / 5)]!
  /* Levels below this index are scored. */
  const filled = demo.frame % 5

  return (
    <DemoFrame demo={demo}>
      <div className={styles['app']}>
        <div className={styles['appBar']}>
          <span className={styles['appTitle']}>deberta-hier · eval</span>
          <span className={styles['mono']}>{record.id}</span>
        </div>
        <p key={record.id} className={styles['record']}>
          {t(record.text)}
        </p>
        <div className={styles['labelsTitle']}>{t(site.about.labels)}</div>
        <ul className={styles['labels']}>
          {record.labels.map(({ path, score }, i) => {
            const on = i < filled
            return (
              <li key={`${record.id}-${i}`} className={styles['label']} data-on={on || undefined}>
                <span className={styles['labelPath']}>
                  {path.map((p, j) => (
                    <span key={p} data-leaf={j === path.length - 1 || undefined}>
                      {j > 0 && <span className={styles['sep']}>›</span>}
                      {p}
                    </span>
                  ))}
                </span>
                <span className={styles['bar']}>
                  <span style={{ width: on ? `${score * 100}%` : '0%' }} />
                </span>
                <span className={styles['score']}>{on ? score.toFixed(2) : '—'}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </DemoFrame>
  )
}

/** Marks for the scrolling tile column. Looked up by name in stacks.ts so the
 *  icons and groups stay whatever that file says they are. */
const PICKS = [
  'TypeScript',
  'Python',
  'React',
  'PyTorch',
  'LangChain',
  'Docker',
  'Next.js',
  'FastAPI',
  'PostgreSQL',
  'Kubernetes',
  'LangGraph',
  'Vue.js',
]
/* One frame: this demo needs the clock only for its running / paused state.
   The motion itself is a CSS loop gated on `data-running`. */
const TILES = [60_000] as const

function Stack() {
  const { t } = useLocale()
  const demo = useDemo(TILES, 0)
  const found: { item: StackItem; group: string }[] = []
  for (const name of PICKS) {
    for (const group of techStack) {
      const item = group.items.find((it) => it.name === name)
      if (item) {
        found.push({ item, group: t(group.label) })
        break
      }
    }
  }

  /* Two identical halves, so moving the track by exactly -50% lands the second
     half where the first began and the loop has no seam. */
  const half = (copy: number) => (
    <div className={styles['tileHalf']} key={copy}>
      {found.map(({ item, group }) => (
        <div key={item.name} className={styles['tile']}>
          <span className={styles['iconWell']}>
            <TechIcon src={item.icon} size={24} adaptive={item.adaptive} tile={item.tile} />
          </span>
          <span className={styles['tileCopy']}>
            <span className={styles['tileName']}>{item.name}</span>
            <span className={styles['tileMeta']}>{group}</span>
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <DemoFrame demo={demo}>
      <div className={styles['tiles']}>
        <div className={styles['tileTrack']}>
          {half(0)}
          {half(1)}
        </div>
      </div>
    </DemoFrame>
  )
}
