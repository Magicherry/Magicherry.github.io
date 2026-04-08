import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24;

function readStoredOverride(storageKey, isValid) {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const { value, expiresAt } = parsed || {};
    if (!isValid(value) || typeof expiresAt !== "number") {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    if (Date.now() >= expiresAt) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return { value, expiresAt };
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function writeStoredOverride(storageKey, value, ttlMs) {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const expiresAt = Date.now() + ttlMs;
  window.localStorage.setItem(storageKey, JSON.stringify({ value, expiresAt }));
  return expiresAt;
}

function clearStoredOverride(storageKey) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(storageKey);
}

export function useTimedAutoPreference({
  storageKey,
  getAutoValue,
  isValid,
  ttlMs = DEFAULT_TTL_MS,
  subscribeToAutoChanges,
}) {
  const getResolvedValue = useCallback(() => {
    const stored = readStoredOverride(storageKey, isValid);
    return stored ? stored.value : getAutoValue();
  }, [getAutoValue, isValid, storageKey]);

  const [value, setValue] = useState(getResolvedValue);
  const [isAutoMode, setIsAutoMode] = useState(() => !readStoredOverride(storageKey, isValid));
  const expiryTimerRef = useRef(null);

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const setAutoValue = useCallback(() => {
    clearStoredOverride(storageKey);
    setValue(getAutoValue());
    setIsAutoMode(true);
  }, [getAutoValue, storageKey]);

  const scheduleExpiry = useCallback((expiresAt) => {
    clearExpiryTimer();

    if (!expiresAt || typeof window === "undefined") {
      return;
    }

    const delay = Math.max(expiresAt - Date.now(), 0);
    expiryTimerRef.current = window.setTimeout(() => {
      setAutoValue();
      expiryTimerRef.current = null;
    }, delay);
  }, [clearExpiryTimer, setAutoValue]);

  const syncFromSource = useCallback(() => {
    const stored = readStoredOverride(storageKey, isValid);

    if (stored) {
      setValue(stored.value);
      setIsAutoMode(false);
      return stored.expiresAt;
    }

    setAutoValue();
    return null;
  }, [isValid, setAutoValue, storageKey]);

  useEffect(() => {
    const expiresAt = syncFromSource();
    scheduleExpiry(expiresAt);

    const handleAutoSourceChange = () => {
      const nextExpiresAt = syncFromSource();
      scheduleExpiry(nextExpiresAt);
    };

    window.addEventListener("focus", handleAutoSourceChange);
    document.addEventListener("visibilitychange", handleAutoSourceChange);

    let unsubscribeAutoChanges;
    if (typeof subscribeToAutoChanges === "function") {
      unsubscribeAutoChanges = subscribeToAutoChanges(() => {
        const nextExpiresAt = syncFromSource();
        scheduleExpiry(nextExpiresAt);
      });
    }

    return () => {
      window.removeEventListener("focus", handleAutoSourceChange);
      document.removeEventListener("visibilitychange", handleAutoSourceChange);
      if (typeof unsubscribeAutoChanges === "function") {
        unsubscribeAutoChanges();
      }
      clearExpiryTimer();
    };
  }, [clearExpiryTimer, scheduleExpiry, subscribeToAutoChanges, syncFromSource]);

  const setManualValue = useCallback((nextValue) => {
    if (!isValid(nextValue)) return;

    const expiresAt = writeStoredOverride(storageKey, nextValue, ttlMs);
    setValue(nextValue);
    setIsAutoMode(false);
    scheduleExpiry(expiresAt);
  }, [isValid, scheduleExpiry, storageKey, ttlMs]);

  return {
    value,
    setManualValue,
    isAutoMode,
  };
}
