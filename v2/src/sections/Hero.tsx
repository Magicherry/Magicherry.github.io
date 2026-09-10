import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type Variants } from 'motion/react'
import { LuArrowDown, LuArrowUpRight, LuBriefcase, LuDownload, LuMapPin } from 'react-icons/lu'
import GlassSurface from '@/components/glass/GlassSurface'
import Action from '@/components/Action'
import Typewriter from '@/components/fx/Typewriter'
import { useLocale } from '@/lib/i18n'
import { useScrollNav } from '@/lib/scroll'
import { useIntro } from '@/lib/intro'
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { profile, roles, stats } from '@/content/profile'
import { ui } from '@/content/copy'
import styles from './Hero.module.css'

const TILT_SPRING = { stiffness: 140, damping: 18, mass: 0.6 } as const
const EASE_ENTER = [0.16, 1, 0.3, 1] as const

/**
 * One timeline for the whole hero, expressed as variants rather than a delay on
 * each element. The order is then a property of the tree - move a block and it
 * keeps its place in the cascade - and the entire sequence can be held back
 * until the intro curtain lifts by flipping a single `animate` value.
 */
const stage: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_ENTER } },
}

/*
 * The name rises as one line, and the animated element is the one carrying the
 * gradient - not a descendant of it.
 *
 * That ordering is load-bearing. `background-clip: text` clips a background to
 * the text painted *in the same layer*; a transformed or `will-change`d child is
 * promoted out of that layer, so its glyphs stop participating in the clip and
 * render with the inherited `color: transparent`. The name was invisible for
 * exactly this reason when each glyph was its own animated span.
 */
const nameRise: Variants = {
  hidden: { y: '106%' },
  shown: { y: '0%', transition: { duration: 0.9, ease: EASE_ENTER } },
}

const slab: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(16px)' },
  shown: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_ENTER, delay: 0.15 },
  },
}

export default function Hero() {
  const { t } = useLocale()
  const { scrollTo } = useScrollNav()
  const { ready } = useIntro()
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const phase = ready ? 'shown' : 'hidden'

  /*
   * Two effects, two conditions - and both have to be off on a phone.
   *
   * The parallax breakpoint mirrors the CSS one exactly. Below it the grid
   * collapses to a single column, and the copy drifting up (-22%) while the card
   * drifts down (+14%) stops being depth and becomes a collision: the two blocks
   * are now stacked, so opposite parallax drives them straight into each other.
   *
   * The tilt needs a real pointer. On touch, `pointermove` fires throughout a
   * scroll gesture, so the card would swing about while you are just trying to
   * get past it.
   */
  const wideLayout = useMediaQuery('(min-width: 981px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const parallax = wideLayout && !reducedMotion
  const tilt = finePointer && !reducedMotion

  /* ------------------------------------------------------------ pointer tilt */
  // Raw pointer position, -0.5..0.5 across the card, smoothed by a spring so the
  // slab has mass. Driving the transform through motion values keeps the whole
  // interaction off React's render path: no state, no re-renders, no jank.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, TILT_SPRING)
  const sy = useSpring(py, TILT_SPRING)

  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9])
  const shiftX = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const shiftY = useTransform(sy, [-0.5, 0.5], [-8, 8])
  // The rear chip travels further, and the other way. Parallax only reads as
  // depth when the layers disagree about how far they moved.
  const chipBX = useTransform(shiftX, (value) => -value * 1.4)
  const chipBY = useTransform(shiftY, (value) => -value * 1.2)

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetPointer = () => {
    px.set(0)
    py.set(0)
  }

  /* ---------------------------------------------------------- scroll parallax */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  // The hero recedes as it leaves rather than simply scrolling off: the copy
  // drifts up faster than the page and dims, so the next section reads as
  // arriving *over* it.
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])

  // Spread rather than `style={cond ? undefined : {...}}`: under
  // exactOptionalPropertyTypes an explicit `undefined` is not the same as an
  // absent prop, and motion's style type rejects it.
  const withParallax = <T extends object>(style: T) => (parallax ? { style } : {})
  const withTilt = <T extends object>(style: T) => (tilt ? { style } : {})

  const nameTarget = t(profile.name)

  return (
    <section id="home" ref={sectionRef} className={styles['hero']} aria-labelledby="hero-title">
      <div className={`shell ${styles['grid']}`}>
        <motion.div
          className={styles['copy']}
          variants={stage}
          initial="hidden"
          animate={phase}
          {...withParallax({ y: copyY, opacity: copyOpacity })}
        >
          {/*
            * Greeting, name, cycling role - v1's hero, unchanged. The status
            * pill and the headline paragraph that used to sit here both restated
            * the job title the typewriter is already cycling through, so the
            * first thing a visitor read was the same phrase three times.
            */}
          <h1 id="hero-title" className={styles['title']}>
            <motion.span className={styles['greeting']} variants={rise}>
              {t(ui.hero.greeting)}
              <span className={styles['wave']} role="img" aria-hidden="true">
                👋🏻
              </span>
            </motion.span>

            {/*
              * The gradient lives on `.name`, *inside* the element that moves.
              * The other way round - gradient on the parent, transform on the
              * children - promotes the glyphs out of the parent's paint layer,
              * `background-clip: text` stops clipping to them, and the name
              * renders as nothing at all.
              */}
            <span className={styles['nameClip']}>
              <motion.span className={styles['nameLine']} variants={nameRise}>
                {t(ui.hero.intro)} <span className={styles['name']}>{nameTarget}</span>.
              </motion.span>
            </span>
          </h1>

          <motion.p className={styles['role']} variants={rise}>
            <Typewriter words={t(roles)} start={ready} />
          </motion.p>

          <motion.div className={styles['actions']} variants={rise}>
            <Action
              tone="primary"
              onClick={() => scrollTo('projects')}
              trailing={<LuArrowUpRight aria-hidden="true" />}
            >
              {t(ui.actions.viewWork)}
            </Action>
            <Action
              tone="glass"
              href={t(profile.cv)}
              download={t(profile.cvFileName)}
              target="_blank"
              rel="noopener noreferrer"
              title={t(ui.actions.downloadCvHint)}
              icon={<LuDownload aria-hidden="true" />}
            >
              {t(ui.actions.downloadCv)}
            </Action>
          </motion.div>
        </motion.div>

        {/* ------------------------------------------------------ glass slab */}
        <motion.div
          className={styles['showcase']}
          variants={slab}
          initial="hidden"
          animate={phase}
          onPointerMove={handlePointer}
          onPointerLeave={resetPointer}
          {...withParallax({ y: cardY })}
        >
          <motion.div ref={cardRef} className={styles['stack']} {...withTilt({ rotateX, rotateY })}>
            {/* Two chips behind the card, offset in Z and moving at a different
                rate, which is what sells the stack as having real depth. */}
            <motion.div
              className={`${styles['chip']} ${styles['chipA']}`}
              {...withTilt({ x: shiftX, y: shiftY })}
              aria-hidden="true"
            />
            <motion.div
              className={`${styles['chip']} ${styles['chipB']}`}
              {...withTilt({ x: chipBX, y: chipBY })}
              aria-hidden="true"
            />

            <GlassSurface variant="regular" radius="xl" className={styles['card']} lightAngle={140}>
              <div className={styles['portrait']}>
                <img
                  src={profile.portrait}
                  alt={t(ui.a11y.avatar)}
                  width={320}
                  height={320}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              <div className={styles['cardMeta']}>
                <p className={styles['cardName']}>{t(profile.name)}</p>
                <p className={styles['cardHandle']}>@{profile.handle}</p>
              </div>

              <ul className={styles['facts']}>
                <li>
                  <LuBriefcase aria-hidden="true" />
                  <span>
                    {profile.current.titles.map(t).join(' & ')} @{' '}
                    <a
                      className={styles['company']}
                      href={profile.current.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(profile.current.company)}
                    </a>
                  </span>
                </li>
                <li>
                  <LuMapPin aria-hidden="true" />
                  <span>{t(profile.location)}</span>
                </li>
              </ul>

              <ul className={styles['stats']}>
                {stats.map((stat) => (
                  <li key={stat.value}>
                    <span className={styles['statValue']}>{stat.value}</span>
                    <span className={styles['statLabel']}>{t(stat.label)}</span>
                  </li>
                ))}
              </ul>
            </GlassSurface>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        className={styles['scrollCue']}
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0, y: 8 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <span>{t(ui.actions.scroll)}</span>
        <LuArrowDown aria-hidden="true" />
      </motion.button>
    </section>
  )
}
