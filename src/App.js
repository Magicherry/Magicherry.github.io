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

function App() {
  const [load, upadateLoad] = useState(true);
  const preloaderTimerRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage && window.localStorage.getItem("theme")) {
        return window.localStorage.getItem("theme");
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return "light";
      }
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (load) {
      document.body.classList.add("preloader-active");
    } else {
      document.body.classList.remove("preloader-active");
    }
  }, [load]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (typeof window !== "undefined" && window.localStorage && !window.localStorage.getItem("theme")) {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transition');
    setTheme((prev) => prev === "dark" ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  }, []);

  const triggerPreloader = useCallback(() => {
    upadateLoad(true);
    if (preloaderTimerRef.current) {
      clearTimeout(preloaderTimerRef.current);
    }
    preloaderTimerRef.current = setTimeout(() => {
      upadateLoad(false);
      preloaderTimerRef.current = null;
    }, 1600);
  }, []);

  useEffect(() => {
    document.body.classList.add("homepage");
  }, []);

  // Mouse glow limited to nav panels and buttons (no background bleed)
  useEffect(() => {
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
    const overlays = new WeakMap();

    targets.forEach((el) => {
      // Ensure positioning context for absolute overlay
      if (getComputedStyle(el).position === "static") {
        el.dataset.glowPositionPatched = "true";
        el.style.position = "relative";
      }

      const overlay = document.createElement("div");
      overlay.className = "mouse-glow-local";
      el.appendChild(overlay);
      overlays.set(el, overlay);

      const setGlowPosition = (clientX, clientY) => {
        const rect = el.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        overlay.style.setProperty("--glow-x", `${x}%`);
        overlay.style.setProperty("--glow-y", `${y}%`);
        overlay.classList.add("visible");
      };

      const handleMove = (event) => {
        setGlowPosition(event.clientX, event.clientY);
      };

      const handleLeave = () => {
        overlay.classList.remove("visible");
      };

      const handleTouchStart = (event) => {
        const touch = event.touches?.[0];
        if (!touch) return;
        setGlowPosition(touch.clientX, touch.clientY);

        // Instant feedback on touch, auto fade
        const record = overlays.get(el) || {};
        if (record.fadeTimer) clearTimeout(record.fadeTimer);
        const fadeTimer = setTimeout(() => {
          overlay.classList.remove("visible");
        }, 220);
        overlays.set(el, { ...record, fadeTimer, overlay, handleMove, handleLeave, handleTouchStart });
      };

      const handleTouchEnd = () => {
        overlay.classList.remove("visible");
      };

      const handleTouchCancel = handleTouchEnd;

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchend", handleTouchEnd, { passive: true });
      el.addEventListener("touchcancel", handleTouchCancel, { passive: true });

      // Store listeners for cleanup
      overlays.set(el, { overlay, handleMove, handleLeave, handleTouchStart, handleTouchEnd, handleTouchCancel, fadeTimer: null });
    });

    return () => {
      targets.forEach((el) => {
        const record = overlays.get(el);
        if (record) {
          const { overlay, handleMove, handleLeave, handleTouchStart, handleTouchEnd, handleTouchCancel, fadeTimer } = record;
          el.removeEventListener("mousemove", handleMove);
          el.removeEventListener("mouseleave", handleLeave);
          el.removeEventListener("touchstart", handleTouchStart);
          el.removeEventListener("touchend", handleTouchEnd);
          el.removeEventListener("touchcancel", handleTouchCancel);
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
    }, 1600);

    return () => {
      clearTimeout(timer);
      if (preloaderTimerRef.current) {
        clearTimeout(preloaderTimerRef.current);
      }
    };
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <div className="app-top-blur" aria-hidden="true" />
        <Navbar triggerPreloader={triggerPreloader} theme={theme} toggleTheme={toggleTheme} />
        <Particle theme={theme} />
        <ScrollToTop />
        <div className="content-wrap">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;