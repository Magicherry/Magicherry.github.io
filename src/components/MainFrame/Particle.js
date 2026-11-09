import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

let particlesEngineInitPromise;

function getParticlesEngineInitPromise() {
  if (!particlesEngineInitPromise) {
    particlesEngineInitPromise = initParticlesEngine(loadSlim);
  }

  return particlesEngineInitPromise;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COMPACT_VIEWPORT_QUERY = "(max-width: 767px)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false
  ));

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    setMatches(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

function Particle({ theme }) {
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const isCompactViewport = useMediaQuery(COMPACT_VIEWPORT_QUERY);

  useEffect(() => {
    // Nothing to initialise when the field will not be drawn at all.
    if (prefersReducedMotion) return undefined;

    let mounted = true;

    getParticlesEngineInitPromise().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [prefersReducedMotion]);

  const particleColor = theme === "light" ? "#0284c7" : "#38bdf8";

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1
      },
      background: {
        color: {
          value: "transparent",
        },
      },
      // The field drifts at speed 0.4; anything past display refresh is spent
      // redrawing a near-identical frame, so cap it and let phones idle.
      fpsLimit: 60,
      particles: {
        color: {
          value: particleColor,
        },
        links: {
          color: particleColor,
          distance: 160,
          enable: true,
          opacity: 0.15,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.4, // 极慢的呼吸感漂浮
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          // Link-drawing cost grows with the square of the node count, which is
          // what makes this expensive on phone GPUs.
          value: isCompactViewport ? 45 : 120,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
          resize: true,
        },
      },
      detectRetina: true,
    }),
    [isCompactViewport, particleColor]
  );

  if (prefersReducedMotion || !isReady) {
    return null;
  }

  return (
    <Particles id="tsparticles" options={options} />
  );
}

export default React.memo(Particle);
