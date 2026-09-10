import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { isLocale, type Locale, type Localized } from '@/content/types'
import { useTimedPreference } from './useTimedPreference'

interface LocaleContextValue {
  locale: Locale
  isAuto: boolean
  toggle: () => void
  /** Resolves any `Localized<T>` against the active locale. */
  t: <T>(entry: Localized<T>) => T
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  return candidates.some((tag) => tag?.toLowerCase().startsWith('zh')) ? 'zh' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { value: locale, isAuto, setValue } = useTimedPreference<Locale>({
    storageKey: 'v2:locale',
    getAutoValue: getBrowserLocale,
    isValid: isLocale,
  })

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  const toggle = useCallback(() => setValue(locale === 'zh' ? 'en' : 'zh'), [locale, setValue])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isAuto,
      toggle,
      t: (entry) => entry[locale],
    }),
    [isAuto, locale, toggle],
  )

  return <LocaleContext value={value}>{children}</LocaleContext>
}

export function useLocale(): LocaleContextValue {
  const context = use(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>')
  return context
}
