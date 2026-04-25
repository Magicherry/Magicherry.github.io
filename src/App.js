import React, { useState, useEffect, useCallback, useRef } from "react";
import Preloader from "./components/MainFrame/Pre";
import Navbar from "./components/MainFrame/Navbar";
import Footer from "./components/MainFrame/Footer";
import Particle from "./components/MainFrame/Particle";
import {
  BrowserRouter as Router
} from "react-router-dom";
import ScrollToTop from "./components/MainFrame/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";

import AnimatedRoutes from "./components/MainFrame/AnimatedRoutes";
import { LanguageProvider } from "./context/LanguageContext";
import { useTimedAutoPreference } from "./hooks/useTimedAutoPreference";

const THEME_STORAGE_KEY = "themePreference";
const THEME_OVERRIDE_TTL_MS = 1000 * 60 * 60 * 24;
const PRELOADER_DURATION_MS = 1500;

function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

function isValidTheme(value) {
  return value === "dark" || value === "light";
}

function subscribeToSystemThemeChanges(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return undefined;

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  const handleChange = () => {
    onChange();
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }

  if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }

  return undefined;
}

function App() {
  const [load, upadateLoad] = useState(true);
  const preloaderTimerRef = useRef(null);
  const themeTransitionTimerRef = useRef(null);
  const { value: theme, setManualValue: setManualTheme } = useTimedAutoPreference({
    storageKey: THEME_STORAGE_KEY,
    getAutoValue: getSystemTheme,
    isValid: isValidTheme,
    ttlMs: THEME_OVERRIDE_TTL_MS,
    subscribeToAutoChanges: subscribeToSystemThemeChanges,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (load) {
      document.body.classList.add("preloader-active");
    } else {
      document.body.classList.remove("preloader-active");
    }
  }, [load]);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add("theme-transition");
    setManualTheme(theme === "dark" ? "light" : "dark");

    if (themeTransitionTimerRef.current) {
      clearTimeout(themeTransitionTimerRef.current);
    }

    themeTransitionTimerRef.current = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
      themeTransitionTimerRef.current = null;
    }, 400);
  }, [setManualTheme, theme]);

  const triggerPreloader = useCallback(() => {
    upadateLoad(true);
    if (preloaderTimerRef.current) {
      clearTimeout(preloaderTimerRef.current);
    }
    preloaderTimerRef.current = setTimeout(() => {
      upadateLoad(false);
      preloaderTimerRef.current = null;
    }, PRELOADER_DURATION_MS);
  }, []);

  useEffect(() => {
    document.body.classList.add("homepage");
  }, []);

  // Mouse glow limited to nav panels and buttons (no background bleed)
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const selector = [
      ".floating-nav-link",
      ".floating-nav-icon-btn",
      ".floating-nav-ghost-btn",
      ".navbar-center-pill",
      ".navbar-center-pill .nav-link",
      "button",
      ".btn",
      ".layout-toggle-btn",
      ".main-nav-link"
    ].join(", ");

    const targets = Array.from(document.querySelectorAll(selector)).filter(
      (el) => !el.closest(".footer")
    );
    const targetSet = new Set(targets);
    const overlays = new Map();
    let activeTarget = null;
    let activeRect = null;
    let rafId = null;
    let pendingClientX = 0;
    let pendingClientY = 0;
    let pendingTarget = null;

    const getRecord = (target) => overlays.get(target);
    const clearFadeTimer = (target) => {
      const record = getRecord(target);
      if (record?.fadeTimer) {
        clearTimeout(record.fadeTimer);
        record.fadeTimer = null;
      }
    };
    const hideGlow = (target) => {
      const record = target ? getRecord(target) : null;

      if (record?.overlay) {
        record.overlay.classList.remove("visible");
      }

      clearFadeTimer(target);

      if (activeTarget === target) {
        activeTarget = null;
        activeRect = null;
      }
    };

    const setActiveTarget = (nextTarget) => {
      if (activeTarget === nextTarget) {
        return;
      }

      if (activeTarget) {
        hideGlow(activeTarget);
      }

      activeTarget = nextTarget;
      activeRect = nextTarget ? nextTarget.getBoundingClientRect() : null;
    };

    const flushPointerUpdate = () => {
      rafId = null;

      if (!pendingTarget) {
        if (activeTarget) {
          hideGlow(activeTarget);
        }
        return;
      }

      if (activeTarget !== pendingTarget || !activeRect) {
        setActiveTarget(pendingTarget);
      }

      const record = getRecord(pendingTarget);
      const rect = activeRect;

      if (!record?.overlay || !rect || rect.width === 0 || rect.height === 0) {
        return;
      }

      const x = ((pendingClientX - rect.left) / rect.width) * 100;
      const y = ((pendingClientY - rect.top) / rect.height) * 100;

      record.overlay.style.setProperty("--glow-x", `${x}%`);
      record.overlay.style.setProperty("--glow-y", `${y}%`);
      record.overlay.classList.add("visible");
    };

    const schedulePointerUpdate = (nextTarget, clientX, clientY) => {
      pendingTarget = nextTarget;
      pendingClientX = clientX;
      pendingClientY = clientY;

      if (rafId === null) {
        rafId = window.requestAnimationFrame(flushPointerUpdate);
      }
    };

    const resolveTarget = (startTarget) => {
      if (!(startTarget instanceof Element)) {
        return null;
      }

      const matchedTarget = startTarget.closest(selector);

      if (!matchedTarget || matchedTarget.closest(".footer") || !targetSet.has(matchedTarget)) {
        return null;
      }

      return matchedTarget;
    };

    targets.forEach((el) => {
      // Ensure positioning context for absolute overlay
      if (getComputedStyle(el).position === "static") {
        el.dataset.glowPositionPatched = "true";
        el.style.position = "relative";
      }

      const overlay = document.createElement("div");
      overlay.className = "mouse-glow-local";
      el.appendChild(overlay);
      overlays.set(el, { overlay, fadeTimer: null });
    });

    const handleMouseMove = (event) => {
      const target = resolveTarget(event.target);

      if (!target) {
        schedulePointerUpdate(null, 0, 0);
        return;
      }

      schedulePointerUpdate(target, event.clientX, event.clientY);
    };

    const handleMouseOutDocument = (event) => {
      if (event.relatedTarget === null) {
        schedulePointerUpdate(null, 0, 0);
      }
    };

    const handleWindowBlur = () => {
      schedulePointerUpdate(null, 0, 0);
    };

    const handleTouchStart = (event) => {
      const touch = event.touches?.[0];
      const target = resolveTarget(event.target);

      if (!touch || !target) {
        return;
      }

      const record = getRecord(target);

      clearFadeTimer(target);
      schedulePointerUpdate(target, touch.clientX, touch.clientY);

      if (record) {
        record.fadeTimer = setTimeout(() => {
          hideGlow(target);
        }, 220);
      }
    };

    const handleTouchEnd = () => {
      if (activeTarget) {
        hideGlow(activeTarget);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseout", handleMouseOutDocument);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOutDocument);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("blur", handleWindowBlur);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      targets.forEach((el) => {
        const record = getRecord(el);
        if (record) {
          const { overlay, fadeTimer } = record;
          if (fadeTimer) clearTimeout(fadeTimer);
          if (overlay && overlay.parentNode === el) {
            el.removeChild(overlay);
          }
        }
        if (el.dataset.glowPositionPatched) {
          el.style.position = "";
          delete el.dataset.glowPositionPatched;
        }
      });
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, PRELOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      if (preloaderTimerRef.current) {
        clearTimeout(preloaderTimerRef.current);
      }
      if (themeTransitionTimerRef.current) {
        clearTimeout(themeTransitionTimerRef.current);
      }
    };
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <Preloader load={load} />
        <div className={`App ${load ? "app-loading" : ""}`} id={load ? "no-scroll" : "scroll"}>
          <div className="app-top-blur" aria-hidden="true" />
          <Navbar triggerPreloader={triggerPreloader} theme={theme} toggleTheme={toggleTheme} />
          <Particle theme={theme} />
          <ScrollToTop />
          <div className="content-wrap">
            <AnimatedRoutes theme={theme} />
          </div>
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;
