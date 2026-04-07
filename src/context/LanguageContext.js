import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useTimedAutoPreference } from "../hooks/useTimedAutoPreference";

const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "languagePreference";
const LANGUAGE_OVERRIDE_TTL_MS = 1000 * 60 * 60 * 24;
const isValidLocale = (value) => value === "en" || value === "zh";

function normalizeLocale(value) {
  return typeof value === "string" && value.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function getBrowserLocale() {
  if (typeof navigator === "undefined") return "en";
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];
  return normalizeLocale(candidates.find(Boolean) || "en");
}

export function LanguageProvider({ children }) {
  const { value: locale, setManualValue: setLocale, isAutoMode } = useTimedAutoPreference({
    storageKey: LANGUAGE_STORAGE_KEY,
    getAutoValue: getBrowserLocale,
    isValid: isValidLocale,
    ttlMs: LANGUAGE_OVERRIDE_TTL_MS,
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    isAutoLocale: isAutoMode,
    setManualLocale: (nextLocale) => {
      setLocale(normalizeLocale(nextLocale));
    },
    toggleLocale: () => {
      setLocale(locale === "zh" ? "en" : "zh");
    }
  }), [isAutoMode, locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
