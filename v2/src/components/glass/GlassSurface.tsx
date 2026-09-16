import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { usePointerGlow } from '@/lib/hooks/usePointerGlow'
import styles from './GlassSurface.module.css'

export type GlassVariant = 'thin' | 'regular' | 'thick'
/**
 * `sm` through `full` are *cut plates* - the radius scale holds four-value
 * shorthands and the global `corner-shape: bevel` in base.css turns them into
 * chamfers (see tokens.css).
 *
 * `square`, `rounded` and `circle` are the escape hatches, and they are whole
 * options rather than a consumer overriding `--surface-radius` because that
 * property is written as an inline style here: a stylesheet cannot outrank it
 * without `!important`. The latter two additionally have to bring
 * `corner-shape: round` with them, which is a class and not a custom property,
 * so the shape and the radius can only be kept in step inside this component.
 */
export type GlassRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'square' | 'rounded' | 'circle'

/**
 * Whether the surface genuinely samples what is behind it.
 *
 * `live` runs a real `backdrop-filter` - a full blur (plus refraction) pass over
 * the region behind the element, re-executed every frame the backdrop changes.
 * Since the aurora animates continuously, that cost is permanent and per
 * element, so it is opt-in and used on roughly six surfaces site-wide.
 *
 * `flat` keeps every other optical layer - fill, rim, inner glow, specular,
 * shadow - and simply does not sample. Over a soft gradient background the two
 * are hard to tell apart, and the flat one is free.
 */
export type GlassBackdrop = 'flat' | 'live'

interface GlassOwnProps {
  /** Optical thickness. Drives blur depth, bevel width and refraction throw. */
  variant?: GlassVariant
  radius?: GlassRadius
  /** Defaults to the cheap tier, so a new surface cannot silently cost a frame. */
  backdrop?: GlassBackdrop
  /** Adds hover lift, gel press and the pointer-tracked specular highlight. */
  interactive?: boolean
  /** Angle the virtual light arrives from. Vary it so surfaces aren't clones. */
  lightAngle?: number
  /**
   * A single band of light crossing the plate as it arrives.
   *
   * Costs nothing at rest and never repeats, but it needs a variant-driven
   * parent - a `<Reveal>` - to fire at all. Reserved for the two panels that
   * carry a screen: a grid of them is the dozen simultaneous animations mid
   * scroll that `<Reveal>` refuses to animate blur for.
   */
  sweep?: boolean
  className?: string
  children?: ReactNode
}

/**
 * The sweep reads its parent's timeline rather than owning one.
 *
 * `hidden`/`shown` are the labels `<Reveal>` sets, and Motion propagates a
 * variant label down through arbitrary intermediate components - which is
 * already how `revealItem` reaches a `<motion.li>` two DOM levels inside a
 * `<Reveal>` in Stack. So a swept surface animates when the block it belongs to
 * animates, with no second observer and nothing to keep in step.
 *
 * Two consequences are worth knowing. Outside a variant-driven parent this does
 * nothing at all, which is why the CSS rests at `opacity: 0` rather than relying
 * on `initial` - a wedge of light parked permanently on a panel's left edge
 * would be worse than no sweep. And under reduced motion `<Reveal>` returns a
 * plain tag with no motion context, so the band never receives `shown` and never
 * runs: the designed path, reached without a media query.
 *
 * Opacity keyframes rather than a plain fade. A band that arrives at the edge
 * already lit reads as the panel switching on, and one that leaves lit reads as
 * it switching off; the light has to enter and leave the plate.
 */
const surfaceSweep: Variants = {
  hidden: { x: '-130%', opacity: 0 },
  shown: {
    x: '260%',
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.18 },
  },
}

type GlassSurfaceProps<E extends ElementType> = GlassOwnProps & {
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, keyof GlassOwnProps | 'as'>

const RADIUS_TOKEN: Record<GlassRadius, string> = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  full: 'var(--radius-full)',
  square: 'var(--radius-chip)',
  rounded: 'var(--radius-round)',
  circle: 'var(--radius-circle)',
}

/**
 * The one component every frosted element on the site renders through.
 *
 * Centralising it is not tidiness for its own sake: the refraction filter, the
 * fallback tiers, the pointer-glow lifecycle and the reduced-motion behaviour
 * all have to agree across a nav pill, a project card and a modal. Letting each
 * of those hand-roll `backdrop-filter` is how a glass system drifts apart.
 */
export default function GlassSurface<E extends ElementType = 'div'>({
  as,
  variant = 'regular',
  radius = 'lg',
  backdrop = 'flat',
  interactive = false,
  lightAngle,
  sweep = false,
  className,
  style,
  children,
  ...rest
}: GlassSurfaceProps<E>) {
  const Component = (as ?? 'div') as ElementType
  const ref = usePointerGlow<HTMLElement>(interactive)

  return (
    <Component
      ref={ref}
      className={[
        styles['surface'],
        styles[variant],
        // Both carry `corner-shape: round` to the element and its two optical
        // pseudo-elements. Without it the global bevel in base.css turns the
        // radius into a chamfer - and at `circle`'s 999px, into a diamond.
        radius === 'circle' && styles['circle'],
        radius === 'rounded' && styles['rounded'],
        backdrop === 'live' && styles['live'],
        interactive && styles['interactive'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ['--surface-radius' as string]: RADIUS_TOKEN[radius],
        ...(lightAngle === undefined ? {} : { ['--surface-light-angle' as string]: `${lightAngle}deg` }),
        ...style,
      }}
      {...rest}
    >
      {sweep ? (
        <span className={styles['sweep']} aria-hidden="true">
          <motion.span className={styles['sweepBand']} variants={surfaceSweep} />
        </span>
      ) : null}
      {children}
    </Component>
  )
}
