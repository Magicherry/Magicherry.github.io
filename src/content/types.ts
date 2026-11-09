export const LOCALES = ['en', 'zh'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Every piece of visible copy is a `Localized`, never a bare string. Making the
 * type total over `Locale` means adding a language is a compile error at each
 * site that has not been translated, rather than a silent English fallback
 * discovered in production.
 */
export type Localized<T = string> = { readonly [K in Locale]: T }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
