import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import styles from './Preloader.module.css'

const SESSION_KEY = 'v2:seen-intro'
const DURATION_MS = 1250

// sessionStorage throws on access in some privacy modes; a failure here should
// cost the visitor an extra intro, never a blank page.
function seenIntro(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== null
  } catch {
    return false
  }
}

function rememberIntro(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

/**
 * The opening curtain.
 *
 * It runs *once per session*, not once per navigation. An intro animation is a
 * first impression; on the fourth reload of the same tab it is a toll booth. The
 * flag lives in sessionStorage so a genuinely new visit still gets it.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !seenIntro()
  })

  useEffect(() => {
    if (!visible) {
      onDone()
      return
    }

    document.body.dataset['locked'] = 'true'
    const timer = window.setTimeout(
      () => {
        rememberIntro()
        setVisible(false)
        onDone()
      },
      reducedMotion ? 200 : DURATION_MS,
    )

    return () => {
      window.clearTimeout(timer)
      delete document.body.dataset['locked']
    }
  }, [onDone, reducedMotion, visible])

  useEffect(() => {
    if (!visible) delete document.body.dataset['locked']
  }, [visible])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          className={styles['screen']}
          /*
           * The curtain leaves by sliding up behind a blur, not by fading. A
           * fade reads as "the loading screen disappeared"; a lift reads as
           * "the page was underneath the whole time".
           */
          exit={{ y: '-100%', filter: 'blur(14px)' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className={styles['stage']}>
            <motion.span
              className={styles['glyph']}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              YZ
            </motion.span>

            <motion.span
              className={styles['sweep']}
              initial={{ x: '-130%' }}
              animate={{ x: '130%' }}
              transition={{ duration: 1.1, ease: [0.5, 0, 0.2, 1], delay: 0.15 }}
            />
          </div>

          <div className={styles['meter']}>
            <motion.span
              className={styles['meterFill']}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
