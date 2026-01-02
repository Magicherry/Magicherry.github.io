import React, { useState, useEffect } from "react";
import Preloader from "./components/MainFrame/Pre";
import Navbar from "./components/MainFrame/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/MainFrame/Footer";
import Resume from "./components/Resume/ResumeNew";
import Experiences from "./components/Experiences/Experiences";
import Particle from "./components/MainFrame/Particle";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/MainFrame/ScrollToTop";
import "./css/style.css";
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/responsive.css";


function App() {
  const [load, upadateLoad] = useState(true);

  const triggerPreloader = () => {
    upadateLoad(true);
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    document.body.classList.add("homepage");
  }, []);

  // Mouse glow limited to nav panels and buttons (no background bleed)
  useEffect(() => {
    const selector = [
      ".floating-nav-panel",
      ".floating-nav-link",
      ".floating-nav-icon-btn",
      ".floating-nav-ghost-btn",
      ".floating-nav-container",
      ".custom-navbar-container",
      ".custom-navbar-container .nav-link",
      ".custom-navbar-container .navbar-brand",
      ".footer",
      "button",
      ".btn",
      ".layout-toggle-btn",
      ".main-nav-link",
      ".github-nav-button"
    ].join(", ");

    const targets = Array.from(document.querySelectorAll(selector));
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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <div className="app-top-blur" aria-hidden="true" />
        <Navbar triggerPreloader={triggerPreloader} />
        <Particle />
        <ScrollToTop />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;