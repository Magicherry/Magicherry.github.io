import { useEffect, useState, type ReactNode } from 'react'
import { motion, useTransform } from 'motion/react'
import Scramble from '@/components/fx/Scramble'
import { useLocale } from '@/lib/i18n'
import { SECTION_IDS, useScrollNav } from '@/lib/scroll'
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { useClock } from '@/lib/hooks/useClock'
import { useFps } from '@/lib/hooks/useFps'
import { ui } from '@/content/copy'
import styles from './Frame.module.css'

/**
 * The instrument frame: the chrome that lives at the viewport edges rather than
 * in the column.
 *
 * This is the piece that changes what the site *is*. Everything tactical about
 * the design used to be a style applied to a document - bracketed plates, mono
 * caps, a survey grid - and a style is static by definition, which is why a page
 * full of correct tactical detail still read as wallpaper. An instrument is not
 * a look, it is a thing that reports: where you are, how fast you are moving,
 * what it has locked onto. None of that can be drawn. It has to run.
 *
 * ---------------------------------------------------------------------------
 * Every value in here is true.
 *
 * The standing failure of this genre is invented telemetry - a coordinate that
 * is not a coordinate, a bar that fills because bars fill - and it gives itself
 * away within seconds, because nothing the reader does changes it. So the frame
 * reports exactly three kinds of fact and no others: the reader's position in
 * the document, the state of their own window, and the clock on their machine.
 * Nothing here is decorative data. If a readout cannot be traced to something
 * real it does not go in.
 *
 * ---------------------------------------------------------------------------
 * `aria-hidden` on the whole layer, deliberately.
 *
 * Every fact the frame reports is either already conveyed better by something
 * else - the nav announces the current section with `aria-current`, the browser
 * conveys scroll position natively - or is about the viewport, which is not
 * information a screen-reader user is missing. An overlay repeating all of it in
 * a fourth voice is noise. The frame is chrome, and this is the honest way to
 * say so.
 */

/** Which facts are worth a readout, and where each comes from. */
function Readout({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles['readout']}>
      <span className={styles['readoutLabel']}>{label}</span>
      <span className={styles['readoutValue']}>{value}</span>
    </div>
  )
}

/**
 * The window's own size. Low frequency by nature - this changes when someone
 * drags a window edge, not sixty times a second - so ordinary state is right
 * here, unlike everything riding `progress` below.
 */
function useViewport(): string {
  const [size, setSize] = useState(() =>
    typeof window === 'undefined' ? '' : `${window.innerWidth}×${window.innerHeight}`,
  )

  useEffect(() => {
    const read = () => setSize(`${window.innerWidth}×${window.innerHeight}`)
    read()
    window.addEventListener('resize', read, { passive: true })
    return () => window.removeEventListener('resize', read)
  }, [])

  return size
}

export default function Frame() {
  const { t, locale } = useLocale()
  const { active, progress } = useScrollNav()
  const reducedMotion = usePrefersReducedMotion()
  const clock = useClock()
  const viewport = useViewport()

  /*
   * Two gates, and they are render gates rather than `display: none`.
   *
   * The rail runs a decode animation and subscribes to a motion value that
   * updates on every scroll frame; the readouts hold a one-second interval.
   * Hiding all of that with CSS would leave every bit of it running on a phone
   * that cannot see any of it - which is the same mistake the canvas field was
   * originally kept off mobile to avoid, made in the other direction.
   *
   * 1280 is where the rail fits. The shell is 1180px and centred, so the margin
   * is (viewport - 1180) / 2 - at 1280 that is 50px against the 58px the rail
   * needs, which is why base.css pulls the shell in at exactly this breakpoint
   * rather than letting the two overlap.
   *
   * 1045 is where the *nav* stops reaching the corners, and it is derived rather
   * than chosen. The bar is `min(100% - 24px, 940px)`, centred, so its side
   * margin is `(viewport - 940) / 2` once it has hit the cap and 12px before
   * that. A top bracket sits at `--hud-inset` and runs `--hud-frame-len`, so it
   * occupies out to about 52px from the edge - and the bar has to clear that:
   * `(viewport - 940) / 2 > 52` gives 1044.
   *
   * Below it the two objects genuinely overlap. At 900px the bar spans the full
   * width bar twelve pixels and lands directly on both top brackets, which is
   * not a near miss - it is a hairline right-angle drawn underneath a floating
   * glass capsule.
   *
   * A canopy needs a margin to live in, and under about a thousand pixels there
   * is not one - so below 1045 the frame withdraws entirely and renders nothing
   * at all. That is the honest outcome rather than a loss: the angular language
   * is carried in parallel by the panel brackets, the HUD rules and the
   * stencilled caps - the same argument base.css makes about `corner-shape`
   * degrading outside Chromium - so a narrow window gets a quieter edition of
   * the design rather than a broken one.
   */
  const wideFrame = useMediaQuery('(min-width: 1280px)')
  const cornerFrame = useMediaQuery('(min-width: 1045px)')

  /*
   * Gated on the same breakpoint as the readouts, and the gate matters more here
   * than anywhere else in this file.
   *
   * `useFps` is the one thing on this site that holds a `requestAnimationFrame`
   * loop open permanently - it has to, since counting frames means being present
   * for all of them - so letting it run on a layout that never displays it would
   * be paying the site's only standing per-frame cost for nothing. Passing the
   * breakpoint in keeps the loop unstarted on every phone and tablet. Read the
   * note at the top of that file before moving this.
   */
  const fps = useFps(wideFrame)

  /*
   * The lock, and it is the one thing here that is an *event* rather than a
   * reading.
   *
   * When the spy hands over a new section the frame does not simply start
   * showing a different label - it re-acquires: the corner brackets light and
   * fall back, and the rail's readout decodes. That difference is the entire
   * argument for this component. A highlight that changes is a page reacting; a
   * frame that visibly re-locks is an instrument tracking.
   *
   * The corners light rather than move, and Frame.module.css carries the long
   * argument for why. Briefly: a boundary is crossed every few seconds of
   * ordinary reading, and four marks jumping in the corners of the visual field
   * that often is an interruption rather than a signal.
   *
   * State rather than a CSS animation restarted by hand, because the animation
   * has to be retriggerable - scrolling up and down across a boundary fires this
   * repeatedly, and a keyframe animation that is already running ignores a
   * second request unless the element is reflowed. Mounting an attribute for the
   * duration sidesteps that entirely.
   *
   * The timer is deliberately *longer* than the 420ms keyframe it is holding
   * open. Matching the two exactly is a race: `setTimeout` is not accurate to
   * the millisecond and a frame of jitter either way meant the attribute was
   * sometimes pulled while the animation was still on its last step, cutting the
   * decay off part-lit. Forty milliseconds of slack costs nothing - the
   * animation has ended and the brackets are already at rest through all of it -
   * and guarantees the lock always completes on its own terms.
   */
  const [locking, setLocking] = useState(false)
  useEffect(() => {
    if (reducedMotion) return
    setLocking(true)
    const timer = window.setTimeout(() => setLocking(false), 460)
    return () => window.clearTimeout(timer)
  }, [active, reducedMotion])

  /*
   * Derived straight off the motion value, so the number and the head both
   * update without React rendering anything.
   *
   * Motion writes a `MotionValue` passed as a child directly into the text node.
   * That is the whole reason this component can carry a live percentage at all:
   * as state it would re-render the frame - and with it the decode and the three
   * readouts - on every frame of every scroll.
   */
  const percent = useTransform(progress, (p) => String(Math.round(p * 100)).padStart(2, '0'))
  const headY = useTransform(progress, (p) => `${p * 100}%`)

  const index = String(SECTION_IDS.indexOf(active) + 1).padStart(2, '0')
  const total = String(SECTION_IDS.length).padStart(2, '0')

  /*
   * Nothing to draw, so nothing is mounted - not an empty fixed layer with
   * `contain` on it.
   *
   * With the top edge gone there is no longer any part of the frame that
   * survives to every width, so below 1045px the wrapper would be a
   * full-viewport positioned element containing no marks at all. It costs
   * little, but "little" on the layout that can least afford it is the wrong
   * default.
   *
   * Placed *after* every hook above rather than up beside the breakpoint it
   * reads. An early return between hooks changes how many of them run between
   * one render and the next, which is the one thing React's hook order cannot
   * survive - and this component crosses the breakpoint by being resized, so it
   * would be a rule violation that only fires when someone drags a window edge.
   * The hooks are cheap; the ordering is not negotiable.
   */
  if (!cornerFrame) return null

  return (
    <div
      className={styles['frame']}
      data-locking={locking || undefined}
      aria-hidden="true"
    >
      {/* Unconditional: the early return above already established that this
          width has a frame at all, so a second test for the same thing would
          only invite the two drifting apart. */}
      <span className={`${styles['bracket']} ${styles['tl']}`} />
      <span className={`${styles['bracket']} ${styles['tr']}`} />
      <span className={`${styles['bracket']} ${styles['bl']}`} />
      <span className={`${styles['bracket']} ${styles['br']}`} />

      {wideFrame ? (
        <>
          {/* --------------------------------------------------------- fps */}
          {/*
            * Top left, opposite the readouts, because it is a different kind of
            * fact from the three over there.
            *
            * Those describe the *session* - the time, the window, the language -
            * and they change slowly or not at all. This one describes the
            * machine's behaviour right now and moves every second. Putting it in
            * the block with them would have one restless number among three
            * settled ones, which makes the whole block look unstable; on its own
            * at the other corner it reads as a separate instrument, which is what
            * it is.
            */}
          <div className={styles['fps']}>
            <Readout label="FPS" value={String(fps).padStart(2, '0')} />
          </div>

          {/* ------------------------------------------------------- rail */}
          <div className={styles['rail']}>
            <div className={styles['railTop']}>
              <span className={styles['railIndex']}>
                {index}
                <span className={styles['railTotal']}>/{total}</span>
              </span>
              {/*
                * Keyed on both, and both are necessary. `active` is the
                * obvious one - a new section is a new acquisition. `locale`
                * is not: switching language replaces the string without any
                * section changing, and a readout that silently swapped
                * languages would be the one place on this page where a
                * change of state was not announced by the frame that exists
                * to announce changes of state.
                */}
              <Scramble
                key={`${active}-${locale}`}
                text={t(ui.nav[active])}
                className={styles['railLabel']}
              />
            </div>

            {/*
              * The graticule and the head.
              *
              * The track is combed with the site's one pitch (`--comb`, 5 on /
              * 2 off) for the reason base.css gives under `.hud-rule`: a scale
              * you can count beats a bar you have to estimate. Unlike that
              * rule, this one *does* have something on it - which is exactly
              * why it is allowed a gauge where the graticules elsewhere are
              * not. There is a real quantity here.
              */}
            <div className={styles['railTrack']}>
              <span className={styles['railComb']} />
              {/* Driven by the raw value rather than a derived one: `scaleY`
                  takes a 0..1 number, which is exactly what `progress` already
                  is, so the fill and the head below are reading the same
                  quantity through two different transforms and cannot drift. */}
              <motion.span className={styles['railFill']} style={{ scaleY: progress }} />
              <motion.span className={styles['railHeadTrack']} style={{ y: headY }}>
                <span className={styles['railHead']} />
              </motion.span>
            </div>

            <span className={styles['railPct']}>
              {/* Carries its own cell: the reading runs 00 to 100, so the digit
                  count changes once at the very bottom of the page and would
                  shove the whole block sideways exactly when the reader has
                  arrived there. See `.railPctValue`. */}
              <motion.span className={styles['railPctValue']}>{percent}</motion.span>
              <span className={styles['railPctMark']}>%</span>
            </span>
          </div>

          {/* --------------------------------------------------- readouts */}
          <div className={styles['readouts']}>
            <Readout label="TIME" value={clock} />
            <Readout label="VIEW" value={viewport} />
            <Readout label="LANG" value={locale === 'zh' ? 'ZH-CN' : 'EN'} />
          </div>
        </>
      ) : null}
    </div>
  )
}
