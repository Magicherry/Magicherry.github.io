import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import {
  LuAppWindow,
  LuCamera,
  LuCheck,
  LuCircleCheck,
  LuCodeXml,
  LuCornerDownRight,
  LuFileText,
  LuClapperboard,
  LuFlag,
  LuGamepad2,
  LuLoaderCircle,
  LuNotebookPen,
  LuPause,
  LuPlay,
  LuSend,
  LuSquareTerminal,
  LuTrendingDown,
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
          <Ship />
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

/*
 * Agent run: a cost-analysis agent taking a request from question to a brief
 * someone can act on, in two acts of one window.
 *
 *   Run    0 the request is sent, alone; 1 the agent lays out its plan -
 *          all four steps arrive, pending; 2-5 step n runs - its tool lit,
 *          what it found opening beneath - and is ticked off; 6 all four
 *          are done
 *   Brief  7 the run folds into one line (steps, time, tokens) and the
 *          brief writes itself out, three findings and then the hand-off
 *
 * The figures agree with the full-stack card's dashboard - the same 6.8% fall
 * in Q4 cost - so the two demos read as one system: the agent decides, the
 * stack ships it. Under reduced motion the window holds the brief.
 */
const RUN = [1300, 1000, 1400, 1400, 1400, 1400, 900, 3800] as const
const TOOLS = ['rag.search', 'sql.query', 'forecast.run', 'brief.write'] as const
const TOOK = ['1.2s', '2.6s', '3.6s', '1.7s'] as const

function AgentRun() {
  const { t } = useLocale()
  const demo = useDemo(RUN, 7)
  const a = site.about
  const f = demo.frame
  const done = f >= 6
  const act = f < 7 ? 'run' : 'brief'

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
        <div key={act} className={styles['pane']}>
          {act === 'run' ? <RunPane f={f} /> : <BriefPane />}
        </div>
      </div>
    </DemoFrame>
  )
}

function RunPane({ f }: { f: number }) {
  const { t } = useLocale()
  const a = site.about
  return (
    <div className={styles['run']}>
      <div className={styles['ask']}>
        <span className={styles['askText']}>{t(a.ask)}</span>
      </div>
      <ol className={styles['runSteps']}>
        {/* Request first, then the plan: the four steps arrive together (a
            beat apart), and only then are they worked through in order. */}
        {(f >= 1 ? a.steps : []).map((step, i) => {
          const state = i < f - 2 ? 'done' : i === f - 2 ? 'active' : 'pending'
          return (
            <li key={i} className={styles['runStep']} data-state={state} style={{ animationDelay: `${i * 90}ms` }}>
              <div className={styles['runRow']}>
                <span className={styles['stepIcon']}>
                  {state === 'done' ? (
                    <LuCheck />
                  ) : state === 'active' ? (
                    <LuLoaderCircle className={styles['spin']} />
                  ) : (
                    <span className={styles['pending']} />
                  )}
                </span>
                <span className={styles['stepLabel']}>{t(step.label)}</span>
                <span className={styles['toolTag']}>{TOOLS[i]}</span>
                <span className={styles['runTook']}>{state === 'done' ? TOOK[i] : ''}</span>
              </div>
              {/* What the step found, opening beneath it while it runs. */}
              <div className={styles['runDetail']}>
                <span>
                  <LuCornerDownRight />
                  {t(step.detail)}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function BriefPane() {
  const { t } = useLocale()
  const b = site.about.brief
  return (
    <div className={styles['briefPane']}>
      <div className={styles['runSummary']}>
        <LuCircleCheck />
        <span>{t(b.summary)}</span>
      </div>
      <div className={styles['briefCard']}>
        <div className={styles['briefHead']}>
          <LuFileText />
          <span>{t(b.title)}</span>
        </div>
        <ol className={styles['briefList']}>
          {t(b.points).map((p, i) => (
            <li key={i} style={{ animationDelay: `${0.25 + i * 0.45}s` }}>
              <span className={styles['briefNo']}>{i + 1}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <div className={styles['briefFoot']} style={{ animationDelay: '1.75s' }}>
          <LuSend />
          <span>{t(b.sent)}</span>
        </div>
      </div>
    </div>
  )
}

/*
 * Ship: one change carried across the stack, in three tabs of one window.
 *
 * The card claims front end, back end, APIs, data and containerised
 * deployment, and a diff alone only showed the first step of that. So the
 * window walks the change all the way out:
 *
 *   Changes   0 context; 1 the removed line; 2-3 the added lines type in;
 *             4 the counts settle
 *   Terminal  5 the tests run; 6 they pass and the image starts building;
 *             7 its layers fill; 8 the rollout starts; 9 every pod is ready
 *   Preview   10 the dashboard calls the new endpoint and waits, skeleton
 *             shimmering; 11 the response lands - 200 in 84 ms - the bars
 *             grow in and the headline figure counts up; 12 hold
 *
 * The finish is in the small things a real tool does: the tab underline
 * slides rather than jumps; a status pill in the tab bar carries the whole
 * story (editing, building, live); commands type in and show a spinner until
 * they report their time; the chart has a grid, its production lines, and a
 * tooltip on the peak. Under reduced motion the window holds the finished
 * preview - the end of the story, and the most to look at.
 */
const SHIP = [900, 800, 1000, 1000, 1200, 1100, 1000, 1500, 1100, 1500, 900, 1000, 3000] as const
const CHART: readonly number[] = [0.62, 0.84, 0.48, 0.71, 0.93, 0.56]
const PEAK = CHART.indexOf(Math.max(...CHART))

function Ship() {
  const { t, locale } = useLocale()
  const demo = useDemo(SHIP, 12)
  const f = demo.frame
  const s = site.about.ship
  const pane = f < 5 ? 'code' : f < 10 ? 'terminal' : 'preview'
  const stage = f < 5 ? 'editing' : f < 9 ? 'building' : 'live'
  const tabs = [
    { id: 'code', label: t(s.code), icon: LuCodeXml },
    { id: 'terminal', label: t(s.terminal), icon: LuSquareTerminal },
    { id: 'preview', label: t(s.preview), icon: LuAppWindow },
  ] as const

  /* The underline is one element that slides to the active tab, measured from
     the tab itself so it fits either language's label. */
  const barRef = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const tab = barRef.current?.querySelector<HTMLElement>('[data-active]')
    if (tab) setLine({ x: tab.offsetLeft, w: tab.offsetWidth })
  }, [pane, locale])

  return (
    <DemoFrame demo={demo}>
      <div className={styles['app']}>
        <div ref={barRef} className={styles['tabBar']}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <span key={id} className={styles['tab']} data-active={pane === id || undefined}>
              <Icon />
              {label}
            </span>
          ))}
          {line ? (
            <span
              className={styles['tabLine']}
              style={{ transform: `translateX(${line.x}px)`, width: line.w }}
            />
          ) : null}
          <span className={styles['shipStage']} data-stage={stage}>
            {stage === 'building' ? <LuLoaderCircle className={styles['spin']} /> : <span className={styles['shipStageDot']} />}
            <span className={styles['shipStageLabel']}>{t(s.stages[stage])}</span>
          </span>
        </div>
        <div key={pane} className={styles['pane']}>
          {pane === 'code' ? <CodePane f={f} /> : pane === 'terminal' ? <TermPane f={f} /> : <PreviewPane f={f} />}
        </div>
      </div>
    </DemoFrame>
  )
}

function CodePane({ f }: { f: number }) {
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
    <>
      <div className={styles['diffHeader']}>
        <span className={styles['filePath']}>api/plan.ts</span>
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
    </>
  )
}

/* The terminal. Each command appears on frame `at`, spins until frame `done`,
   then reports how long it took; its result line (if any) appears with it.
   Commands and tool output stay in English in both languages, as they would
   on a real machine. */
const TERM: readonly { at: number; done: number; cmd: string; took: string; result?: 'ok' | 'build'; text?: string }[] = [
  { at: 5, done: 6, cmd: 'pnpm test', took: '1.8s', result: 'ok', text: '24 passed' },
  { at: 6, done: 8, cmd: 'docker build -t plan-api:1.4 .', took: '12.4s', result: 'build', text: '6/6 layers' },
  { at: 8, done: 9, cmd: 'kubectl rollout status deploy/plan-api', took: '6.1s', result: 'ok', text: '3/3 pods ready' },
]

function TermPane({ f }: { f: number }) {
  return (
    <div className={styles['term']}>
      {TERM.filter((c) => f >= c.at).map((c) => {
        const done = f >= c.done
        /* The build bar shows while the image builds, the others on success. */
        const result = c.result === 'build' ? f >= c.at + 1 : done
        return (
          <div key={c.cmd} className={styles['termBlock']}>
            <div className={styles['termLine']}>
              <span className={styles['prompt']}>$</span>
              <span className={styles['cmd']}>{c.cmd}</span>
              <span className={styles['took']}>
                {done ? c.took : <LuLoaderCircle className={styles['spin']} />}
              </span>
            </div>
            {result && c.result === 'ok' ? (
              <div className={styles['termResult']} data-kind="ok">
                <LuCheck className={styles['ok']} />
                <span>{c.text}</span>
              </div>
            ) : null}
            {result && c.result === 'build' ? (
              <div className={styles['termResult']}>
                <span className={styles['buildBar']}>
                  <span />
                </span>
                <span className={styles['muted']}>{c.text}</span>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/** Counts from 0 to `to` once `on` turns true - the figure arriving with its
    data rather than appearing whole. */
function Count({ to, on, decimals }: { to: number; on: boolean; decimals: number }) {
  const [v, setV] = useState(on ? to : 0)
  useEffect(() => {
    if (!on) {
      setV(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min((now - start) / 800, 1)
      setV(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, on])
  return <>{v.toFixed(decimals)}</>
}

function PreviewPane({ f }: { f: number }) {
  const { t } = useLocale()
  const s = site.about.ship
  const loaded = f >= 11
  const lines = t(s.lines)
  return (
    <div className={styles['preview']}>
      <div className={styles['request']}>
        <span className={styles['method']}>POST</span>
        <span className={styles['endpoint']}>/api/plan</span>
        {loaded ? (
          <span key="ok" className={styles['response']}>
            <span className={styles['httpOk']}>200</span>
            <span className={styles['muted']}>84 ms</span>
          </span>
        ) : (
          <span key="wait" className={styles['response']}>
            <LuLoaderCircle className={styles['spin']} />
            <span className={styles['muted']}>pending</span>
          </span>
        )}
      </div>
      <div className={styles['chartCard']} data-loading={!loaded || undefined}>
        <div className={styles['chartHead']}>
          <span>
            <span className={styles['chartTitle']}>{t(s.chartTitle)}</span>
            <span className={styles['chartMeta']}>{t(s.chartMeta)}</span>
          </span>
          {loaded ? (
            <span className={styles['figure']}>
              ¥<Count to={12.4} on={loaded} decimals={1} />M
              <span className={styles['delta']}>
                <LuTrendingDown />
                6.8% {t(s.delta)}
              </span>
            </span>
          ) : (
            <span className={styles['figureSkeleton']} />
          )}
        </div>
        <div className={styles['chart']}>
          {CHART.map((h, i) => (
            <span key={i} className={styles['col']}>
              <span
                className={styles['barFill']}
                data-peak={i === PEAK || undefined}
                style={{ height: `calc((100% - 18px) * ${loaded ? h * 0.74 : 0.14})`, transitionDelay: loaded ? `${i * 70}ms` : '0ms' }}
              >
                {i === PEAK ? <span className={styles['tip']}>¥2.9M</span> : null}
              </span>
              <span className={styles['colLabel']}>{lines[i]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
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
