import { useEffect, useLayoutEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

export const EASE = [0.22, 1, 0.36, 1] as const

/** A number that counts up from zero the first time it scrolls into view. */
export function CountUp({ value, decimals = 0, suffix = '', className, style }: {
  value: number; decimals?: number; suffix?: string; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const done = useRef(false)
  const fmt = (n: number) => n.toFixed(decimals) + suffix

  // React never owns these digits (no children), so the animation can write them freely.
  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = fmt(reduce || done.current ? value : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, value])

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduce) return
    const c = animate(0, value, { duration: 1.1, ease: EASE, onUpdate: (n) => { el.textContent = fmt(n) }, onComplete: () => { done.current = true } })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value])

  // Screen readers get the final value; the visible digits do the counting.
  return (
    <span className={className} style={style}>
      <span className="sr-only">{fmt(value)}</span>
      <span ref={ref} aria-hidden />
    </span>
  )
}

/** Slide direction for an index change; flipped in RTL so "next" comes from the reading direction. */
export function useDirection(index: number, rtl: boolean) {
  const prev = useRef(index)
  const dir = useRef(1)
  if (prev.current !== index) {
    dir.current = (index > prev.current ? 1 : -1) * (rtl ? -1 : 1)
    prev.current = index
  }
  return dir.current
}

export const slide = {
  enter: (d: number) => ({ x: `${d * 14}%`, opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (d: number) => ({ x: `${d * -14}%`, opacity: 0 }),
}

/** A section heading that rises into place the first time it scrolls into view. */
export function TuneIn({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return (
    <motion.h2 id={id} className={className}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }}
      transition={{ type: 'spring', bounce: 0, duration: 1 }}>
      {children}
    </motion.h2>
  )
}

/** A CRT refresh line that travels down a section once, the first time it comes into view. */
export function Sweep({ color = 'var(--color-cyan)' }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { once: true, amount: 0.12 })
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {on && (
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent calc(100% - 10rem), color-mix(in srgb, ${color} 9%, transparent) calc(100% - 1px), color-mix(in srgb, ${color} 55%, transparent) 100%)` }}
          initial={{ y: '-100%', opacity: 1 }}
          animate={{ y: '0%', opacity: [1, 1, 0] }}
          transition={{ y: { duration: 1.6, ease: [0.45, 0, 0.55, 1] }, opacity: { duration: 1.9, times: [0, 0.8, 1] } }}
        />
      )}
    </div>
  )
}

/** Magnetic pull wrapper: smoothly pulls a button toward the pointer on hover. */
export function Magnetic({ children, strength = 0.25, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18 })
  const y = useSpring(my, { stiffness: 260, damping: 18 })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.div onPointerMove={onMove} onPointerLeave={onLeave} style={{ x, y }} className={`inline-block ${className ?? ''}`}>
      {children}
    </motion.div>
  )
}

/** Giant background typography that glides horizontally as you scroll past. */
export function KineticWatermark({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : reverse ? ['-12%', '12%'] : ['12%', '-12%'])
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-12 -z-10 overflow-hidden select-none">
      <motion.p
        style={{ x }}
        className="whitespace-nowrap text-center text-[clamp(5rem,17vw,15rem)] font-black uppercase leading-none tracking-[-0.05em] text-fg opacity-[0.035]"
      >
        {text}
      </motion.p>
    </div>
  )
}
