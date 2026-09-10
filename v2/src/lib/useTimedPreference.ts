import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24

interface StoredOverride<T> {
  value: T
  /** `null` means the choice is permanent - see `ttlMs` below. */
  expiresAt: number | null
}

/*
 * Safari in Lockdown/private mode and some embedded webviews throw on *access*
 * to localStorage, not just on write. An unguarded read here would take down the
 * whole provider tree on mount, so every touch goes through these.
 */
function safeRead(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* The preference simply will not persist; the session still works. */
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function readOverride<T>(key: string, isValid: (v: unknown) => v is T): StoredOverride<T> | null {
  if (typeof window === 'undefined') return null

  const raw = safeRead(key)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) throw new Error('malformed')

    const { value, expiresAt } = parsed as Partial<StoredOverride<unknown>>
    const permanent = expiresAt === null
    if (!isValid(value) || (!permanent && typeof expiresAt !== 'number')) {
      safeRemove(key)
      return null
    }
    if (!permanent && Date.now() >= (expiresAt as number)) {
      safeRemove(key)
      return null
    }
    return { value, expiresAt: permanent ? null : (expiresAt as number) }
  } catch {
    safeRemove(key)
    return null
  }
}

export interface TimedPreferenceOptions<T> {
  storageKey: string
  /** Read the ambient value: system theme, browser language, and so on. */
  getAutoValue: () => T
  isValid: (value: unknown) => value is T
  /** How long a manual choice lasts. `null` keeps it until it is changed. */
  ttlMs?: number | null
  /** Subscribe to changes in the ambient source; return an unsubscribe fn. */
  subscribeToAuto?: (onChange: () => void) => (() => void) | undefined
}

export interface TimedPreference<T> {
  value: T
  isAuto: boolean
  setValue: (next: T) => void
  clearOverride: () => void
}

/**
 * A preference that follows the system by default, honours a manual override,
 * and *expires that override* after a while.
 *
 * The expiry is the interesting part. A visitor who flips to light mode once to
 * read something in daylight has not declared a permanent preference, and
 * pinning it forever means their device switching to dark at night is silently
 * ignored months later. After the TTL the site quietly returns to following the
 * system - which is almost always what a returning visitor expects.
 */
export function useTimedPreference<T>({
  storageKey,
  getAutoValue,
  isValid,
  ttlMs = DEFAULT_TTL_MS,
  subscribeToAuto,
}: TimedPreferenceOptions<T>): TimedPreference<T> {
  const [value, setStateValue] = useState<T>(() => readOverride(storageKey, isValid)?.value ?? getAutoValue())
  const [isAuto, setIsAuto] = useState<boolean>(() => !readOverride(storageKey, isValid))
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearOverride = useCallback(() => {
    clearTimer()
    safeRemove(storageKey)
    setStateValue(getAutoValue())
    setIsAuto(true)
  }, [clearTimer, getAutoValue, storageKey])

  const scheduleExpiry = useCallback(
    (expiresAt: number | null) => {
      clearTimer()
      if (expiresAt === null) return
      timerRef.current = window.setTimeout(clearOverride, Math.max(expiresAt - Date.now(), 0))
    },
    [clearTimer, clearOverride],
  )

  const resync = useCallback((): number | null => {
    const stored = readOverride(storageKey, isValid)
    if (stored) {
      setStateValue(stored.value)
      setIsAuto(false)
      return stored.expiresAt
    }
    clearOverride()
    return null
  }, [clearOverride, isValid, storageKey])

  useEffect(() => {
    scheduleExpiry(resync())

    // A tab left open across the TTL boundary, or across sunset, should catch up
    // the moment it is looked at again rather than on next reload.
    const onWake = () => scheduleExpiry(resync())
    window.addEventListener('focus', onWake)
    document.addEventListener('visibilitychange', onWake)
    const unsubscribe = subscribeToAuto?.(onWake)

    return () => {
      window.removeEventListener('focus', onWake)
      document.removeEventListener('visibilitychange', onWake)
      unsubscribe?.()
      clearTimer()
    }
  }, [clearTimer, resync, scheduleExpiry, subscribeToAuto])

  const setValue = useCallback(
    (next: T) => {
      if (!isValid(next)) return
      const expiresAt = ttlMs === null ? null : Date.now() + ttlMs
      safeWrite(storageKey, JSON.stringify({ value: next, expiresAt }))
      setStateValue(next)
      setIsAuto(false)
      scheduleExpiry(expiresAt)
    },
    [isValid, scheduleExpiry, storageKey, ttlMs],
  )

  return { value, isAuto, setValue, clearOverride }
}
