import React, { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function Particle() {
  useEffect(() => {
    initParticlesEngine(loadSlim);
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1
      },
      particles: {
        number: {
          value: 220,
          density: {
            enable: true,
            value_area: 1500
          }
        },
        line_linked: {
          enable: false,
          opacity: 0.03
        },
        move: {
          direction: "right",
          speed: 0.05
        },
        size: {
          value: 1
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            startValue: "random",
            destroy: "none"
          }
        }
      },
      interactivity: {
        events: {
          onclick: {
            enable: true,
            mode: "push"
          }
        },
        modes: {
          push: {
            particles_nb: 1
          }
        }
      },
      retina_detect: true
    }),
    []
  );

  return (
    <Particles id="tsparticles" options={options} />
  );
}

export default React.memo(Particle);
