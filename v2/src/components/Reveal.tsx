import { motion, type Variants } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 26 },
  down: { y: -26 },
  left: { x: 26 },
  right: { x: -26 },
  none: {},
}

interface RevealProps {
  children: ReactNode
  as?: ElementType
  direction?: Direction
  delay?: number
  /** Seconds between children when `stagger` is on. */
  stagger?: number
  className?: string
  /** Re-run every time the element re-enters, instead of only the first time. */
  repeat?: boolean
}

/**
 * The site's one scroll-entrance primitive.
 *
 * Two decisions are baked in deliberately. Entrances fire `once` by default:
 * elements that re-animate on every pass make a long page feel twitchy and
 * punish anyone scrolling back to re-read something. And the viewport margin
 * pulls the trigger line *up* from the bottom edge, so content animates while it
 * is still arriving rather than after it has been sitting in view for 100px.
 */
export default function Reveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  stagger,
  className,
  repeat = false,
}: RevealProps) {
  const reducedMotion = usePrefersReducedMotion()
  const MotionTag = motion[as as 'div']

  if (reducedMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const offset = OFFSET[direction]

  /*
   * Opacity and transform only - no `filter: blur()`.
   *
   * Blur is not a compositor property: animating it forces a full filter pass on
   * that element every frame it runs. With a stack grid and a project grid that
   * is a dozen simultaneous filter animations mid-scroll, which is exactly when
   * there are the fewest frames to spare. The softness was never worth it.
   */
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay,
        ...(stagger === undefined ? {} : { staggerChildren: stagger, delayChildren: delay }),
      },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: !repeat, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </MotionTag>
  )
}

/** Child of a `<Reveal stagger>`; inherits the parent's timeline. */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}
