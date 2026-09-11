import { Fragment, type ReactNode } from 'react'
import styles from './RichText.module.css'

/**
 * Renders the two inline markers used across the content layer:
 *
 *   **text**        an accented emphasis run
 *   *text*          a quiet italic aside
 *   [text](href)    an external link
 *
 * One regex, one pass, no dependency. A markdown library would be ~40 kB to
 * support a syntax this site deliberately does not use.
 */

/**
 * How a `**...**` run is drawn. Both tones are the theme colour - v1's approach,
 * where an emphasised phrase simply *is* accent-coloured - and they differ only
 * in weight.
 *
 * `body` also goes semi-bold, matching the `<b>` v1 wrapped these in. `heading`
 * inherits the heading's own weight instead: at 52px a 560 run set inside a 620
 * title reads as the accent word being *lighter* than the words around it.
 */
export type EmphasisTone = 'body' | 'heading'

// Ordered so `**` is consumed before `*` can match half of it.
const TOKEN = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g

/*
 * Han ideographs only - deliberately *not* the CJK punctuation or fullwidth
 * blocks. Chinese typography puts air between a run of emphasis and the
 * characters around it, which is why v1 wrote its headings as
 * `进一步了解 <strong>我</strong>`; but it does not put air before a full-width
 * comma, and `**...**，` must stay closed up.
 */
const HAN = /[㐀-䶿一-鿿豈-﫿]/

/**
 * Decides whether a marked run needs breathing room on either side.
 *
 * Done here rather than by typing spaces into the content, for three reasons: a
 * literal space is a full space-width where the convention wants roughly a
 * sixth of one; it would be copied along with the text; and it would have to be
 * remembered by hand at every one of the two dozen marked runs on this site,
 * forever. Where an author *has* already written a space the neighbouring
 * character is not Han, so no second gap is added - the rule is self-correcting.
 */
function spacingProps(source: string, start: number, end: number) {
  const before = start > 0 ? source[start - 1] : undefined
  const after = source[end]
  return {
    ...(before && HAN.test(before) ? { 'data-gap-before': '' } : {}),
    ...(after && HAN.test(after) ? { 'data-gap-after': '' } : {}),
  }
}

function parseRichText(source: string, tone: EmphasisTone = 'body'): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  TOKEN.lastIndex = 0
  while ((match = TOKEN.exec(source)) !== null) {
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index))

    const [, accent, italic, linkText, href] = match
    const key = `${match.index}`
    const spacing = spacingProps(source, match.index, match.index + match[0].length)

    if (accent !== undefined) {
      nodes.push(
        <strong key={key} className={styles[tone === 'heading' ? 'accentHeading' : 'accentBody']} {...spacing}>
          {accent}
        </strong>,
      )
    } else if (italic !== undefined) {
      nodes.push(
        <em key={key} className={styles['aside']}>
          {italic}
        </em>,
      )
    } else if (linkText !== undefined && href !== undefined) {
      nodes.push(
        <a
          key={key}
          className={styles['link']}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...spacing}
        >
          {linkText}
        </a>,
      )
    }

    cursor = match.index + match[0].length
  }

  if (cursor < source.length) nodes.push(source.slice(cursor))
  return nodes
}

export default function RichText({
  children,
  tone = 'body',
}: {
  children: string
  tone?: EmphasisTone
}) {
  return <Fragment>{parseRichText(children, tone)}</Fragment>
}
