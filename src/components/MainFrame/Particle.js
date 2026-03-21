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
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      particles: {
        color: {
          value: "#38bdf8", // 科技蓝
        },
        links: {
          color: "#38bdf8",
          distance: 160, // 增加连线判定距离，让更多节点连接
          enable: true,
          opacity: 0.15, // 稍微提高连线可见度
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
    []
  );

  return (
    <Particles id="tsparticles" options={options} />
  );
}

export default React.memo(Particle);
