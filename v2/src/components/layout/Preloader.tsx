import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'
import { profile } from '@/content/profile'
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
          {/*
           * Mark over name over meter, which is the account-screen column: the
           * thing you recognise first, what it is called, and then the one piece
           * of state. The wordmark used to stand alone and carry the whole screen
           * at 3rem; with a mark above it, it can step back to being a caption
           * for it.
           */}
          <div className={styles['stage']}>
            <motion.img
              className={styles['brand']}
              src={profile.avatar}
              alt=""
              width={164}
              height={164}
              /* First paint of the session, and the nav and hero card reuse the
                 same file - so fetching it here warms them both. */
              fetchPriority="high"
              decoding="async"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, filter: 'blur(14px)' }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: reducedMotion ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.span
              className={styles['wordmark']}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              /* A beat behind the mark, so the two read as a sequence rather than
                 as one block arriving with a soft edge. */
              transition={{ duration: reducedMotion ? 0.2 : 0.7, delay: reducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.handle}
            </motion.span>
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
