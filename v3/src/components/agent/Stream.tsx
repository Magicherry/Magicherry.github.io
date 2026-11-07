import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react'

/**
 * Reveals its children the way a model's answer streams in: the text appears
 * a few characters at a time, in reading order, and anything that is not text
 * (an icon, an image, a calendar cell, a card's frame) appears when the stream
 * reaches it.
 *
 * It works on the rendered DOM rather than on a string, so a reply can be any
 * markup - lists, project rows, a contribution calendar - and stream without
 * being written for it. On mount, before the first paint:
 *
 *   - every text node is emptied and its text remembered;
 *   - every element is hidden (`visibility`, so layout does not jump as it is
 *     revealed - the reply's box is its final size from the start);
 *
 * then an animation frame loop walks forward through the remembered units,
 * refilling text and un-hiding each element as the stream first reaches
 * something inside it.
 *
 * The pace is set by the clock, not the frame rate (a 120Hz screen would
 * otherwise stream twice as fast): about 6ms a character, held between 0.6s
 * for a short answer and 1.8s for a long list, so a sentence visibly types
 * and the full project list still lands quickly.
 *
 * Cleanup restores everything, so an interrupted stream (unmount, StrictMode's
 * double effect, a language switch remounting it via `key`) never leaves text
 * half-written. A nested <Stream> owns its own subtree and is skipped here -
 * that is how a reply whose content arrives later (the GitHub data) streams
 * its second part when it lands.
 *
 * Reduced motion: no stream; the reply is simply there.
 *
 * While it runs, the enclosing live region (the window's `role="log"`) is
 * marked `aria-busy`. Writing a few characters per frame into text nodes is,
 * to a screen reader, a stream of tiny insertions, and a polite live region
 * would read the reply out in fragments - twice for the GitHub reply, whose
 * data streams a second time. Busy, it holds the announcement and reads the
 * finished reply once. Counted per region, since a nested stream and a
 * follow-up turn can overlap.
 */

const busy = new Map<Element, number>()

function hold(region: Element | null) {
  if (!region) return () => {}
  busy.set(region, (busy.get(region) ?? 0) + 1)
  region.setAttribute('aria-busy', 'true')
  let released = false
  return () => {
    if (released) return
    released = true
    const n = (busy.get(region) ?? 1) - 1
    if (n > 0) busy.set(region, n)
    else {
      busy.delete(region)
      region.removeAttribute('aria-busy')
    }
  }
}

/**
 * Where the stream has got to, for whoever wants to keep it in view - the
 * window's log, which scrolls to follow a reply the way a chat client does.
 * Called at most once a frame with the element the stream is writing into
 * (or the icon or cell it just revealed). A context rather than a prop so a
 * nested <Stream> - the GitHub data that streams in after its lead line -
 * reports to the same listener without the reply passing it down.
 */
export const StreamProgress = createContext<((frontier: Element) => void) | null>(null)

const MS_PER_CHAR = 6
const MIN_MS = 600
const MAX_MS = 1800
/** What a non-text unit (icon, cell, image) costs in "characters". */
const ATOM_COST = 0.4

type Unit =
  | { kind: 'text'; node: Text; text: string; owners: HTMLElement[] }
  | { kind: 'atom'; el: HTMLElement | SVGElement; owners: HTMLElement[] }

const ATOMS = new Set(['IMG', 'SVG', 'I', 'svg', 'CANVAS', 'INPUT'])

export default function Stream({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useContext(StreamProgress)
  /* Read through a ref: the effect runs once per mount, and the listener's
     identity is not a reason to restart a stream. */
  const progressRef = useRef(progress)
  progressRef.current = progress

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const units: Unit[] = []
    const hidden: HTMLElement[] = []

    /* Walk in document order, collecting units and hiding every element. */
    const walk = (node: Node, owners: HTMLElement[]) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.nodeValue ?? ''
          if (!text.trim()) continue
          units.push({ kind: 'text', node: child as Text, text, owners })
          ;(child as Text).nodeValue = ''
        } else if (child instanceof HTMLElement || child instanceof SVGElement) {
          if (child instanceof HTMLElement && child.hasAttribute('data-stream')) continue
          /* Atoms: icons and images, and any element with nothing inside it
             to stream (a status dot, a bar) - otherwise it would never be
             reached and would stay hidden. */
          const empty = !child.textContent?.trim() && !child.querySelector('img, svg, i')
          if (ATOMS.has(child.tagName) || empty) {
            units.push({ kind: 'atom', el: child, owners })
            if (child instanceof HTMLElement) {
              child.style.visibility = 'hidden'
              hidden.push(child)
            } else {
              child.style.visibility = 'hidden'
            }
            continue
          }
          if (child instanceof HTMLElement) {
            child.style.visibility = 'hidden'
            hidden.push(child)
            walk(child, [...owners, child])
          } else {
            walk(child, owners)
          }
        }
      }
    }
    walk(root, [])
    const release = hold(root.closest('[aria-live]'))

    const total = units.reduce((n, u) => n + (u.kind === 'text' ? u.text.length : ATOM_COST), 0)
    const duration = Math.min(MAX_MS, Math.max(MIN_MS, total * MS_PER_CHAR))
    let start = 0
    let spent = 0 // characters' worth written so far

    const show = (owners: HTMLElement[]) => {
      for (const el of owners) if (el.style.visibility === 'hidden') el.style.visibility = ''
    }

    let i = 0
    let written = 0 // characters of units[i] written so far
    let raf = 0

    const step = (now: number) => {
      if (!start) start = now
      const target = Math.min(total, ((now - start) / duration) * total)
      let budget = target - spent
      spent = target
      let frontier: Element | null = null
      while (budget > 0 && i < units.length) {
        const u = units[i]!
        show(u.owners)
        if (u.kind === 'atom') {
          u.el.style.visibility = ''
          frontier = u.el
          budget -= ATOM_COST
          i++
          continue
        }
        frontier = u.node.parentElement
        const take = Math.min(u.text.length - written, Math.ceil(budget))
        written += take
        budget -= take
        u.node.nodeValue = u.text.slice(0, written)
        if (written >= u.text.length) {
          i++
          written = 0
        }
      }
      if (frontier) progressRef.current?.(frontier)
      if (i < units.length) raf = requestAnimationFrame(step)
      else release()
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      release()
      for (const u of units) {
        if (u.kind === 'text') u.node.nodeValue = u.text
        else u.el.style.visibility = ''
      }
      for (const el of hidden) el.style.visibility = ''
    }
  }, [])

  return (
    <div ref={ref} data-stream className={className}>
      {children}
    </div>
  )
}
