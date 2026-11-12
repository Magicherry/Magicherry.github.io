import { useEffect, useRef } from 'react'

/**
 * The hero's moving sky: folds of steel-blue and grey light that drift and
 * re-form slowly, after DeepSeek Harness's hero.
 *
 * Harness draws its field with a WebGL shader, and a static CSS version of it
 * - soft radial pools, which this replaces - looked right in a screenshot and
 * dull on the page: the life of the original is that the light *flows*, its
 * bands bending and sliding past each other over a few seconds. Gradients can
 * only translate; folding needs a field computed per pixel.
 *
 * The shader is domain-warped noise: fbm sampled through two layers of fbm
 * offsets, which is what turns blobs into folds. Its value picks a colour from
 * a short palette (navy, the blue body, a grey-blue sheen), weighted upward so
 * the light gathers behind the header and headline. Everything is smooth at
 * the scale of the noise, so it is rendered at a third of the CSS size and
 * the browser's upscale does the defocus - a ~200k-pixel canvas on a 1440px
 * screen, at a 30fps cap.
 *
 * It costs nothing when nobody is looking: the loop stops while the hero is
 * off screen, the tab is hidden, or the page is scrolling. Under reduced motion one frame is drawn and
 * left still. If WebGL is missing, the canvas never shows and the CSS sky
 * behind it (Hero.module.css) stands in.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;
uniform float t;
/* The palette, per appearance (see PALETTES below). */
uniform vec3 cNavy;
uniform vec3 cDeep;
uniform vec3 cBlue;
uniform vec3 cSheen;
uniform float shade;
uniform float ambient;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  /* Aspect-correct, and stretched sideways so the folds lie as wide bands. */
  vec2 p = vec2(uv.x * r.x / r.y * 0.6, uv.y) * 0.95;
  float T = t * 0.06;

  vec2 q = vec2(fbm(p + vec2(0.0, T)), fbm(p + vec2(5.2, 1.3) - T * 0.8));
  vec2 w = vec2(fbm(p + 2.4 * q + vec2(1.7, 9.2) + T * 0.6),
                fbm(p + 2.4 * q + vec2(8.3, 2.8) - T * 0.5));
  float f = fbm(p + 2.6 * w);

  vec3 navy  = cNavy;
  vec3 deep  = cDeep;
  vec3 blue  = cBlue;
  vec3 sheen = cSheen;

  /* Light gathers toward the top; the bottom settles to the page. */
  float lift = smoothstep(0.0, 1.0, uv.y);

  vec3 col = mix(navy, deep, smoothstep(0.15, 0.55, f));
  col = mix(col, blue, smoothstep(0.32, 0.7, f) * (0.5 + 0.5 * lift));
  /* The sheen rides the crest of the folds, where the warp bunches up. */
  float crest = smoothstep(0.5, 0.88, f + 0.5 * (w.x - 0.5));
  col = mix(col, sheen, crest * 0.7 * lift * lift);
  /* Shadow lobes, where the first warp dips. */
  col *= mix(shade, 1.0, smoothstep(0.25, 0.6, q.y));
  col = mix(navy, col, 0.45 + 0.55 * lift);
  /* A little ambient light from above, so no turn of the folds leaves the
     header sitting on black. */
  col += blue * ambient * pow(lift, 1.6);

  gl_FragColor = vec4(col, 1.0);
}
`

/*
 * The sky per appearance. Dark is the original: navy settling to the page,
 * a blue body, a grey-blue sheen on the crests. Light is the same field in
 * daylight - the ground is the light page's own pale blue (so the mask still
 * dissolves into it), the folds a soft cornflower, the crests white - with
 * shallower shadow lobes and less ambient lift, both of which were tuned to
 * pull a dark sky up off black and would only wash a light one out.
 */
type Palette = { navy: number[]; deep: number[]; blue: number[]; sheen: number[]; shade: number; ambient: number }
const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    navy: [0.035, 0.058, 0.105],
    deep: [0.09, 0.2, 0.36],
    blue: [0.2, 0.37, 0.59],
    sheen: [0.6, 0.65, 0.72],
    shade: 0.7,
    ambient: 0.38,
  },
  light: {
    navy: [0.918, 0.941, 0.969],
    deep: [0.8, 0.866, 0.945],
    blue: [0.62, 0.75, 0.91],
    sheen: [1, 1, 1],
    shade: 0.93,
    ambient: 0.06,
  },
}

const SCALE = 1 / 3
const FRAME_MS = 1000 / 30

export default function HeroSky({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')
    const uNavy = gl.getUniformLocation(prog, 'cNavy')
    const uDeep = gl.getUniformLocation(prog, 'cDeep')
    const uBlue = gl.getUniformLocation(prog, 'cBlue')
    const uSheen = gl.getUniformLocation(prog, 'cSheen')
    const uShade = gl.getUniformLocation(prog, 'shade')
    const uAmbient = gl.getUniformLocation(prog, 'ambient')
    /* Uniforms persist on the program, so the palette is only written when
       the appearance changes - see the observer below. */
    const setPalette = () => {
      const p = PALETTES[document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark']
      gl.uniform3fv(uNavy, p.navy)
      gl.uniform3fv(uDeep, p.deep)
      gl.uniform3fv(uBlue, p.blue)
      gl.uniform3fv(uSheen, p.sheen)
      gl.uniform1f(uShade, p.shade)
      gl.uniform1f(uAmbient, p.ambient)
    }
    setPalette()

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE))
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    /* A random start, so the sky is not the same picture on every visit. */
    const t0 = Math.random() * 600
    const draw = (seconds: number) => {
      resize()
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, t0 + seconds)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let timer = 0
    let last = 0 // ms of sky elapsed - advances only while drawn
    let prev = 0
    let visible = true
    let scrolling = false
    let settle = 0
    draw(0)
    canvas.dataset['ready'] = ''
    const ro = new ResizeObserver(() => draw(last / 1000))
    ro.observe(canvas)
    /* A switch of appearance repaints the current frame in the new palette -
       which also covers reduced motion, where no later frame would. */
    const mo = new MutationObserver(() => {
      setPalette()
      draw(last / 1000)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    /*
     * The clock. A timer waits out the frame interval and only then asks for an
     * animation frame, so the loop wakes 30 times a second - not on every
     * display refresh, which on a 240Hz screen was 240 wake-ups a second to
     * draw 30.
     */
    const tick = (now: number) => {
      raf = 0
      last += Math.min(now - prev, 100)
      prev = now
      draw(last / 1000)
      schedule()
    }
    const schedule = () => {
      timer = window.setTimeout(() => {
        timer = 0
        raf = requestAnimationFrame(tick)
      }, FRAME_MS)
    }
    const run = () => {
      if (reduced || raf || timer || !visible || scrolling || document.hidden) return
      prev = performance.now()
      schedule()
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      raf = 0
      timer = 0
    }

    /*
     * Still while the page scrolls, and for 150ms after. Scrolling is when a
     * dropped frame shows, and every frame the sky changes is also a frame the
     * header's refracting glass, which sits over it, has to filter again. Mid-
     * scroll the slow drift of the light is invisible anyway; it picks up
     * where it stopped.
     */
    const onScroll = () => {
      scrolling = true
      stop()
      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        scrolling = false
        run()
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* `intersectionRatio`, not just `isIntersecting`: Chrome reports a box that
       merely touches the viewport's edge as intersecting, and with the next
       section scrolled to the top the sky kept running out of sight. */
    const io = new IntersectionObserver(([e]) => {
      visible = !!e && e.isIntersecting && e.intersectionRatio > 0
      if (visible) run()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : run())
    document.addEventListener('visibilitychange', onVis)
    run()

    return () => {
      stop()
      window.clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      /* Free what this run made, but never `loseContext()`: a canvas hands
         back the same context to every later getContext call, so a lost one
         stays lost - and StrictMode's second effect run (or a remount) would
         get a dead context and paint nothing. */
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
