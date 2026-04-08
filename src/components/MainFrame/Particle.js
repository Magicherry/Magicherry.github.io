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

function Particle({ theme }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    getParticlesEngineInitPromise().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

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
      fpsLimit: 120,
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
          value: 120, // 节点数量
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
    [particleColor]
  );

  if (!isReady) {
    return null;
  }

  return (
    <Particles id="tsparticles" options={options} />
  );
}

export default React.memo(Particle);
