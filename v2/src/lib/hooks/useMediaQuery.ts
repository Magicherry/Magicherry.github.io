import { useSyncExternalStore } from 'react'

/**
 * Media queries as an external store. `useSyncExternalStore` is the right
 * primitive here rather than useState+useEffect: it reads the *current* match
 * during render instead of after a commit, so a component never paints one
 * frame at the wrong breakpoint before correcting itself.
 */

const cache = new Map<string, MediaQueryList>()

function getList(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  let list = cache.get(query)
  if (!list) {
    list = window.matchMedia(query)
    cache.set(query, list)
  }
  return list
}

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = getList(query)
      if (!list) return () => {}
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => getList(query)?.matches ?? serverFallback,
    () => serverFallback,
  )
}

/**
 * The single most important toggle on this site. Every scroll-linked animation,
 * the canvas field and the smooth-scroll driver all read this and stand down.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery('(hover: none)')
}
