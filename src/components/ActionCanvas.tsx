import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTheme } from '../theme'

type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: number }
type Ripple = { x: number; y: number; r: number; max: number; alpha: number; color: string }

const DARK_COLORS = ['#ff6b35', '#4fb3ff', '#6fd6b5', '#a97bff']
const LIGHT_COLORS = ['#e8531e', '#0071e3', '#059669', '#7c3aed']

/**
 * Full-viewport 60fps interactive particle constellation + click shockwave canvas.
 * Connects nodes to the pointer with glowing energy lines and bursts ripples on click.
 */
export function ActionCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    if (reduce) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count = Math.min(72, Math.max(32, Math.floor((w * h) / 22000)))
    const pts: Particle[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      r: 1.4 + Math.random() * 1.8,
      c: i % 4,
    }))
    const ripples: Ripple[] = []
    const mouse = { x: -9999, y: -9999, active: false }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => { mouse.active = false }
    const onDown = (e: PointerEvent) => {
      const palette = themeRef.current === 'light' ? LIGHT_COLORS : DARK_COLORS
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 6,
        max: 140,
        alpha: 0.75,
        color: palette[Math.floor(Math.random() * palette.length)],
      })
      // Give nearby particles a kinetic impulse outward.
      for (const p of pts) {
        const dx = p.x - e.clientX
        const dy = p.y - e.clientY
        const d = Math.hypot(dx, dy)
        if (d > 1 && d < 180) {
          const force = (1 - d / 180) * 3.8
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }
      }
    }

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })

    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const isLight = themeRef.current === 'light'
      const palette = isLight ? LIGHT_COLORS : DARK_COLORS

      // Update & draw particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        // Gentle velocity damping back to cruise speed
        const speed = Math.hypot(p.vx, p.vy)
        if (speed > 0.85) { p.vx *= 0.96; p.vy *= 0.96 }

        // Soft magnetic attraction/orbit near cursor
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const d = Math.hypot(dx, dy)
          if (d < 170 && d > 28) {
            p.vx += (dx / d) * 0.03
            p.vy += (dy / d) * 0.03
          }
        }

        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        else if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = palette[p.c]
        ctx.globalAlpha = isLight ? 0.38 : 0.55
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = palette[p.c]
            ctx.globalAlpha = (1 - dist / 120) * (isLight ? 0.14 : 0.18)
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Connect to mouse with brighter laser filaments
        if (mouse.active) {
          const md = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          if (md < 180) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = palette[p.c]
            ctx.globalAlpha = (1 - md / 180) * (isLight ? 0.28 : 0.42)
            ctx.lineWidth = 1.2
            ctx.stroke()
          }
        }
      }

      // Click shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 5.5
        rp.alpha *= 0.92
        if (rp.alpha < 0.02 || rp.r > rp.max) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = rp.color
        ctx.globalAlpha = rp.alpha
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [reduce])

  if (reduce) return null
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 size-full" />
}
