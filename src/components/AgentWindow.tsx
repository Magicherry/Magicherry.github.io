import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  LuArrowUp,
  LuBriefcase,
  LuChevronDown,
  LuChevronRight,
  LuEye,
  LuFolder,
  LuFolderOpen,
  LuGithub,
  LuLayoutGrid,
  LuPanelLeft,
  LuPlus,
  LuSquarePen,
} from 'react-icons/lu'
import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import { profile } from '@/content/profile'
import { agent, routeTopic, type Topic } from '@/content/agent'
import { Chips, Reply } from './agent/Replies'
import Stream, { StreamProgress } from './agent/Stream'
import styles from './AgentWindow.module.css'

/**
 * An agent desktop client, in the hero - and it works.
 *
 * It opens on the introduction, which plays once like the reference's hero
 * demo: the question is typed into the composer and sent, the agent thinks,
 * the reply arrives a block at a time. From then on it is a small chat client:
 *
 *   - every sidebar entry opens a topic in a fresh thread - the projects, the
 *     experience, the GitHub activity (a live contribution calendar and recent
 *     repositories), the NIO role, the CAIT research;
 *   - suggestion chips pinned above the composer ask a follow-up in the same
 *     thread;
 *   - the composer takes a typed question and routes it by keyword
 *     (content/agent.ts). It is not a model and does not pretend to be one -
 *     anything it cannot place gets an honest "try these instead".
 *
 * Every answer is built from the same content files as the page, so the
 * window cannot drift from what the rest of the site says.
 *
 * The decorative chrome - traffic lights, the "+", permission and model
 * pickers - stays decorative and `aria-hidden`; everything that responds is a
 * real button, link or input.
 *
 * Sized in `--u`, a scale unit, so the whole window shrinks as one object;
 * below ~720px of its own width the sidebar is dropped (container query), and
 * the pinned chips carry the navigation instead.
 */

const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* -------------------------------------------------------------- the intro */
type Stage = 'idle' | 'typing' | 'thinking' | 'reply' | 'done'

/** Intro reply blocks: intro, lead-in, the items, the closing line. */
const BLOCKS = 2 + site.window.items.length + 1
const START_MS = 1300
const CHAR_MS = 55
const SEND_MS = 380
const THINK_MS = 1100
const BLOCK_MS = 170

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function useIntro(questionLength: number) {
  const [reduced] = useState(still)
  const [stage, setStage] = useState<Stage>(reduced ? 'done' : 'idle')
  const [typed, setTyped] = useState(0)
  const [shown, setShown] = useState(reduced ? BLOCKS : 0)
  /* The question's length is read live: a language switch mid-typing must
     type to the *new* question's end, or the composer stalls short of it
     (or runs past it) and the send button never lights. */
  const length = useRef(questionLength)
  length.current = questionLength
  /* Two separate stops. `skipped` is the visitor's, and is final. Each run of
     the effect also has its own local flag: a single shared one would be
     reset by StrictMode's second run, and the first run's loop - still
     asleep - would wake up and type alongside it. */
  const skipped = useRef(false)

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const stopped = () => cancelled || skipped.current
    void (async () => {
      await sleep(START_MS)
      if (stopped()) return
      setStage('typing')
      for (let i = 1; i <= length.current; i++) {
        await sleep(CHAR_MS)
        if (stopped()) return
        setTyped(i)
      }
      await sleep(SEND_MS)
      if (stopped()) return
      setStage('thinking')
      await sleep(THINK_MS)
      if (stopped()) return
      setStage('reply')
      for (let i = 1; i <= BLOCKS; i++) {
        await sleep(BLOCK_MS)
        if (stopped()) return
        setShown(i)
      }
      setStage('done')
    })()
    return () => {
      cancelled = true
    }
    // Runs once; a language switch mid-sequence finishes in the new language.
  }, [reduced])

  /** The visitor did something first: drop the show and finish at once. */
  const skip = useCallback(() => {
    skipped.current = true
    setStage('done')
    setShown(BLOCKS)
  }, [])

  return { stage, typed, shown, skip }
}

/* ----------------------------------------------------------------- thread */
interface Turn {
  id: number
  topic: Topic
  /** What the visitor typed, or '' for a chip, sidebar or intro turn - those
      bubbles show the topic's own question, translated at render time so a
      language switch changes them along with the replies under them. */
  question: string
}

/** Which sidebar entry is lit. Sessions and folders share topics, so the key
 *  records where the click came from. */
type ActiveKey = string

const THINK_TURN_MS = 650

export default function AgentWindow() {
  const { t, locale } = useLocale()
  const w = site.window
  const introQuestion = t(agent.questions.intro)
  const intro = useIntro(introQuestion.length)

  const nextId = useRef(1)
  const [turns, setTurns] = useState<Turn[]>([{ id: 0, topic: 'intro', question: '' }])
  const [active, setActive] = useState<ActiveKey>('session:intro')
  const [pending, setPending] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [reduced] = useState(still)
  const logRef = useRef<HTMLDivElement>(null)
  const pendingTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(pendingTimer.current), [])

  const think = (id: number) => {
    window.clearTimeout(pendingTimer.current)
    if (reduced) return
    setPending(id)
    pendingTimer.current = window.setTimeout(() => setPending(null), THINK_TURN_MS)
  }

  const makeTurn = (topic: Topic, question?: string): Turn => ({
    id: nextId.current++,
    topic,
    question: question ?? '',
  })

  /** Sidebar: start a fresh thread on this topic. */
  const open = (topic: Topic, key: ActiveKey) => {
    intro.skip()
    const turn = makeTurn(topic)
    setTurns([turn])
    setActive(key)
    think(turn.id)
    logRef.current?.scrollTo({ top: 0 })
  }

  /** Chips and the composer: a follow-up in the same thread. */
  const ask = (topic: Topic, question?: string) => {
    intro.skip()
    const turn = makeTurn(topic, question)
    setTurns((prev) => [...prev, turn])
    think(turn.id)
  }

  const newSession = () => {
    intro.skip()
    setTurns([])
    setActive('new')
    setPending(null)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    /* Sending while the intro types itself sends *that* question: finish the
       show at once, as any other first move does. The button is enabled then,
       and without this it submitted an empty draft and did nothing. */
    if (intro.stage === 'typing') {
      intro.skip()
      return
    }
    const text = draft.trim()
    if (!text) return
    ask(routeTopic(text), text)
    setDraft('')
  }

  /*
   * The log follows a reply as it streams, the way a chat client does.
   *
   * Sending a question scrolls it into view (with "thinking" under it). Then,
   * as the reply streams, every frame the stream reports how far it has got
   * (`StreamProgress`) and the log scrolls just enough to keep that line above
   * the bottom fade - always down, never back up - so it ends at the bottom of
   * the answer.
   *
   * It used to stop once the question reached the top of the log, so a long
   * reply would be read from its start. On a phone the log is ~270px tall and
   * almost every reply is longer than that, so in practice the follow gave up
   * a third of the way down - and the GitHub reply, whose data lands seconds
   * later, was never followed at all. It now follows to the end, like every
   * chat client, and the one thing that stops it is the reader: a wheel, a
   * swipe or a key in the log, and it never fights them. The next question
   * starts it again.
   *
   * Under reduced motion there is no stream: the reply appears whole, and the
   * log jumps to its bottom whenever the log's content changes while
   * following - including the GitHub data arriving late.
   */
  const following = useRef<number | null>(null)
  /* The follow's scroll target and its frame loop. `released` is set when the
     reader takes over, which stops a glide still in flight. */
  const glide = useRef({ target: 0, raf: 0, released: false })
  const lastId = turns[turns.length - 1]?.id

  /** Where this turn's question sits at the top of the log. */
  const questionTop = (log: HTMLElement, id: number) => {
    const el = log.querySelector<HTMLElement>(`[data-turn="${id}"]`)
    return el ? el.offsetTop - 12 : null
  }

  useEffect(() => {
    const log = logRef.current
    if (!log || lastId === undefined || lastId === 0) return
    const top = questionTop(log, lastId)
    if (top === null) return
    following.current = lastId
    cancelAnimationFrame(glide.current.raf)
    glide.current = { target: 0, raf: 0, released: false }
    if (reduced) {
      log.scrollTo({ top: log.scrollHeight })
      return
    }
    /* The browser clamps this to what there is to scroll: with only the
       question and "thinking" below the old content, it lands with both in
       view, and the stream takes it from there. */
    log.scrollTo({ top, behavior: 'smooth' })
  }, [lastId, reduced])

  /* Reduced motion: no stream reports progress, so watch the log itself. */
  useEffect(() => {
    const log = logRef.current
    if (!log || !reduced) return
    const mo = new MutationObserver(() => {
      if (following.current !== null) log.scrollTop = log.scrollHeight
    })
    mo.observe(log, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [reduced])

  const followStream = useCallback((frontier: Element) => {
    const log = logRef.current
    if (!log || following.current === null) return
    /* The frontier's bottom in the log's scroll coordinates, kept clear of
       the 16-unit fade at the bottom edge with a line's room to spare - and
       never past what the log can scroll, or the glide below would chase a
       target the browser keeps clamping and never finish. */
    const bottom = frontier.getBoundingClientRect().bottom - log.getBoundingClientRect().top + log.scrollTop
    const want = Math.min(log.scrollHeight - log.clientHeight, bottom + 40 - log.clientHeight)
    /* Only ever down: past both the last target and where the log is now. */
    if (want <= Math.max(glide.current.target, log.scrollTop + 1)) return
    glide.current.target = want
    /*
     * Glide there rather than jump. The stream reveals a whole row - a project
     * card, a list item - in one step, so the target moves in 50-odd pixel
     * leaps; a quarter of the remaining distance per frame turns each leap
     * into a short ease-out, and catches up within ~150ms of the stream
     * pausing. A hand on the log cancels the glide with the follow.
     */
    if (glide.current.raf) return
    const step = () => {
      const g = glide.current
      const d = g.target - log.scrollTop
      if (following.current === null && g.released) {
        g.raf = 0
        return
      }
      if (d < 0.5) {
        if (d > 0) log.scrollTop = g.target
        g.raf = 0
        return
      }
      log.scrollTop += Math.max(1, d * 0.25)
      g.raf = requestAnimationFrame(step)
    }
    glide.current.raf = requestAnimationFrame(step)
  }, [])

  /* A hand on the log ends the follow. Input events, not `scroll` - the log
     scrolls itself while following, and must not take that as the reader. */
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const release = () => {
      following.current = null
      glide.current.released = true
    }
    log.addEventListener('wheel', release, { passive: true })
    log.addEventListener('touchstart', release, { passive: true })
    log.addEventListener('keydown', release)
    return () => {
      log.removeEventListener('wheel', release)
      log.removeEventListener('touchstart', release)
      log.removeEventListener('keydown', release)
    }
  }, [])

  const title =
    active === 'new'
      ? t(agent.newSession)
      : active.startsWith('session:')
        ? t(agent.sessions.find((s) => `session:${s.topic}` === active)?.label ?? agent.sessions[0]!.label)
        : active.startsWith('folder:')
          ? t(agent.folders.find((f) => `folder:${f.topic}` === active)?.label ?? agent.folder)
          : t(agent.nav[active.replace('nav:', '') as keyof typeof agent.nav] ?? agent.newSession)

  const typingIntro = intro.stage === 'typing'
  const onlyIntro = turns.length === 1 && turns[0]!.id === 0
  const welcome = turns.length === 0 || (onlyIntro && intro.stage !== 'done')
  const welcomeGone = onlyIntro && intro.stage !== 'idle' && intro.stage !== 'typing'

  return (
    <div className={styles['viewport']}>
      <div className={styles['window']} role="region" aria-label={t(agent.a11y)}>
        <aside className={styles['sidebar']}>
          <div className={styles['windowBar']} aria-hidden="true">
            <TrafficLights />
            <LuPanelLeft className={styles['icon']} />
          </div>

          <div className={styles['sidebarBrand']}>
            <img src={profile.avatar} alt="" />
            <span>{profile.handle}</span>
          </div>

          <nav className={styles['sidebarBody']} aria-label={t(agent.workspace)}>
            <button type="button" className={styles['newSession']} onClick={newSession} aria-current={active === 'new' || undefined}>
              <LuSquarePen className={styles['icon']} aria-hidden="true" />
              <span>{t(agent.newSession)}</span>
            </button>
            <SideButton icon={LuLayoutGrid} label={t(agent.nav.projects)} on={active === 'nav:projects'} onClick={() => open('projects', 'nav:projects')} />
            <SideButton icon={LuBriefcase} label={t(agent.nav.experience)} on={active === 'nav:experience'} onClick={() => open('experience', 'nav:experience')} />
            <SideButton icon={LuGithub} label={t(agent.nav.github)} on={active === 'nav:github'} onClick={() => open('github', 'nav:github')} />

            <div className={styles['workspaceHeader']}>
              <span>{t(agent.workspace)}</span>
            </div>

            <div className={`${styles['folderRow']} ${styles['activeFolder']}`}>
              <LuFolderOpen className={styles['icon']} aria-hidden="true" />
              <span>{t(agent.folder)}</span>
            </div>
            <div className={styles['sessions']}>
              {agent.sessions.map((s) => {
                const key = `session:${s.topic}`
                return (
                  <button
                    key={key}
                    type="button"
                    className={styles['sessionRow']}
                    data-selected={active === key || undefined}
                    aria-current={active === key || undefined}
                    onClick={() => open(s.topic, key)}
                  >
                    <span>{t(s.label)}</span>
                  </button>
                )
              })}
            </div>
            {agent.folders.map((f) => {
              const key = `folder:${f.topic}`
              return (
                <SideButton
                  key={key}
                  icon={LuFolder}
                  label={t(f.label)}
                  on={active === key}
                  onClick={() => open(f.topic, key)}
                  folder
                />
              )
            })}
          </nav>

          <div className={styles['account']}>
            <img src={profile.avatar} alt="" />
            <span>{t(profile.name)}</span>
          </div>
        </aside>

        <div className={styles['main']}>
          <div className={styles['mainBar']}>
            <span className={styles['mainLights']} aria-hidden="true">
              <TrafficLights />
            </span>
            <span className={styles['conversationTitle']}>{title}</span>
            <LuChevronDown className={styles['iconSm']} aria-hidden="true" />
          </div>

          <div ref={logRef} className={styles['conversation']} role="log" aria-live="polite">
            {/*
              * The empty state, as a chat client shows before the first
              * message: the agent's face, a greeting and a line on what it
              * can answer, centred in the log. Shown on a new session, and
              * on load for the moment before the intro question is typed -
              * which used to be a blank pane. When the intro question is
              * sent it fades out under it rather than vanishing, and once
              * the intro has played it is gone for good.
              */}
            {welcome ? (
              <div className={styles['welcome']} data-gone={welcomeGone || undefined}>
                <img src={profile.avatar} alt="" />
                <p className={styles['welcomeTitle']}>{t(agent.greeting)}</p>
                <p className={styles['welcomeHint']}>{t(agent.welcomeHint)}</p>
              </div>
            ) : null}
            <StreamProgress.Provider value={followStream}>
            <div className={styles['transcript']}>

              {turns.map((turn) => {
                const first = turn.id === 0
                /* The opening intro turn follows the load-time show. */
                const sent = !first || intro.stage === 'thinking' || intro.stage === 'reply' || intro.stage === 'done'
                const thinking = first ? intro.stage === 'thinking' : pending === turn.id
                const answered = first ? intro.stage === 'reply' || intro.stage === 'done' : pending !== turn.id
                const asked =
                  turn.question ||
                  (first ? introQuestion : turn.topic === 'unknown' ? '' : t(agent.questions[turn.topic]))
                return (
                  <div key={turn.id} className={styles['turn']} data-turn={turn.id}>
                    {sent && asked ? (
                      <div className={`${styles['userMessage']} ${styles['enter']}`}>{asked}</div>
                    ) : null}
                    {thinking ? (
                      <div className={`${styles['thought']} ${styles['thinking']} ${styles['enter']}`}>
                        <span>{t(w.thinking)}</span>
                      </div>
                    ) : null}
                    {answered ? (
                      <>
                        <div className={styles['thought']}>
                          <span>{t(w.thought)}</span>
                          <LuChevronRight className={styles['iconSm']} aria-hidden="true" />
                        </div>
                        {first ? (
                          /* The opening intro has its own load-time reveal. */
                          <div className={styles['assistant']}>
                            {turn.topic === 'intro' ? <IntroText shown={intro.shown} locale={locale} /> : null}
                            {turn.topic !== 'intro' || intro.stage === 'done' ? (
                              <Reply topic={turn.topic} />
                            ) : null}
                          </div>
                        ) : (
                          /* Every later answer streams in, the way a model's
                             reply does. Keyed on the language too, so a switch
                             mid-stream restarts it in the new language. */
                          <Stream key={`${turn.id}-${locale}`} className={styles['assistant']}>
                            {turn.topic === 'intro' ? <IntroText shown={BLOCKS} locale={locale} /> : null}
                            <Reply topic={turn.topic} />
                          </Stream>
                        )}
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
            </StreamProgress.Provider>
          </div>

          <div className={styles['composerDock']}>
            <Chips className={styles['dockChips']} onPick={(topic) => ask(topic)} />
            <form className={styles['composer']} onSubmit={submit}>
              <label className="visually-hidden" htmlFor="agent-input">
                {t(agent.inputLabel)}
              </label>
              <input
                id="agent-input"
                className={styles['input']}
                value={typingIntro ? introQuestion.slice(0, intro.typed) : draft}
                readOnly={typingIntro}
                onFocus={() => intro.stage !== 'done' && intro.skip()}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t(w.placeholder)}
                autoComplete="off"
                enterKeyHint="send"
              />
              <div className={styles['toolbar']}>
                <div className={styles['toolbarSide']} aria-hidden="true">
                  <span className={styles['add']}>
                    <LuPlus className={styles['icon']} />
                  </span>
                  <span className={styles['chip']}>
                    <LuEye className={styles['iconSm']} />
                    <span>{t(w.permission)}</span>
                    <LuChevronDown className={styles['iconSm']} />
                  </span>
                </div>
                <div className={styles['toolbarSide']}>
                  <span className={styles['model']} aria-hidden="true">
                    <span>
                      {w.model} <span className={styles['effort']}>{t(w.effort)}</span>
                    </span>
                    <LuChevronDown className={styles['iconSm']} />
                  </span>
                  <button
                    type="submit"
                    className={styles['send']}
                    aria-label={t(agent.send)}
                    disabled={!typingIntro && !draft.trim()}
                    data-ready={(typingIntro && intro.typed >= introQuestion.length) || undefined}
                  >
                    <LuArrowUp className={styles['icon']} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The introduction's text, revealed a block at a time on first load. */
function IntroText({ shown, locale }: { shown: number; locale: string }) {
  const { t } = useLocale()
  const w = site.window
  const block = (i: number) => i < shown
  return (
    <>
      {block(0) ? <p className={styles['enter']}>{t(w.intro)}</p> : null}
      {block(1) ? <p className={styles['enter']}>{t(w.canHelp)}</p> : null}
      {block(2) ? (
        <ol>
          {w.items.map((item, i) =>
            block(2 + i) ? (
              <li key={i} className={styles['enter']}>
                <strong>{t(item.title)}</strong>
                {/* Chinese sets its dash as a doubled em dash; English as one, spaced. */}
                {locale === 'zh' ? ' —— ' : ' — '}
                {t(item.body)}
              </li>
            ) : null,
          )}
        </ol>
      ) : null}
      {block(BLOCKS - 1) ? <p className={`${styles['more']} ${styles['enter']}`}>{t(w.more)}</p> : null}
    </>
  )
}

function SideButton({
  icon: Icon,
  label,
  on,
  onClick,
  folder,
}: {
  icon: typeof LuFolder
  label: string
  on: boolean
  onClick: () => void
  folder?: boolean
}) {
  return (
    <button
      type="button"
      className={folder ? styles['folderRow'] : styles['navRow']}
      data-selected={on || undefined}
      aria-current={on || undefined}
      onClick={onClick}
    >
      <Icon className={styles['icon']} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function TrafficLights() {
  return (
    <span className={styles['lights']}>
      <i />
      <i />
      <i />
    </span>
  )
}
