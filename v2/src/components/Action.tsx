import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { usePointerGlow } from '@/lib/hooks/usePointerGlow'
import styles from './Action.module.css'

type Tone = 'primary' | 'glass'

interface ActionOwn {
  tone?: Tone
  icon?: ReactNode
  /** Trailing element - usually an arrow that animates on hover. */
  trailing?: ReactNode
  children: ReactNode
}

type AnchorProps = ActionOwn & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, keyof ActionOwn>
type ButtonProps = ActionOwn & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, keyof ActionOwn>

/**
 * Buttons and link-buttons share one surface treatment. The discriminant on
 * `href` means an anchor cannot be given `type="submit"` and a button cannot be
 * given `download` - the two shapes stay honest at the type level rather than
 * being merged into a permissive `any`-ish props bag.
 */
export default function Action(props: AnchorProps | ButtonProps) {
  const { tone = 'glass', icon, trailing, children, className, ...rest } = props
  const classes = [styles['action'], styles[tone], className].filter(Boolean).join(' ')
  const glowRef = usePointerGlow<HTMLElement>()

  const content = (
    <>
      {icon ? <span className={styles['icon']}>{icon}</span> : null}
      <span className={styles['label']}>{children}</span>
      {trailing ? <span className={styles['trailing']}>{trailing}</span> : null}
    </>
  )

  if (rest && 'href' in rest && typeof rest.href === 'string') {
    return (
      <a ref={glowRef as React.Ref<HTMLAnchorElement>} className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    )
  }

  return (
    <button
      ref={glowRef as React.Ref<HTMLButtonElement>}
      type="button"
      className={classes}
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    >
      {content}
    </button>
  )
}
