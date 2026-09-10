import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { usePointerGlow } from '@/lib/hooks/usePointerGlow'
import styles from './GlassSurface.module.css'

export type GlassVariant = 'thin' | 'regular' | 'thick'
export type GlassRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full'

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
  className?: string
  children?: ReactNode
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
      {children}
    </Component>
  )
}
