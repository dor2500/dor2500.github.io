import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useI18n } from '../i18n'
import { flagships, LANG_COLOR, others, type Repo } from '../data'
import { Preview } from './Explorer'
import { EASE } from './Motion'

const DWELL = 5200 // ms on each channel while surfing

// Flagships first, then every project that has real screenshots (drawn mockups stay in the grid).
export const CHANNELS: Repo[] = [...flagships, ...others.filter((r) => r.cover && !r.mockup)].slice(0, 12)
const pad = (n: number) => String(n).padStart(2, '0')

/** A burst of TV snow, drawn into a tiny canvas and scaled up. Runs only while `burst` changes. */
function Snow({ burst }: { burst: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx || reduce || burst === 0) return
    const img = ctx.createImageData(c.width, c.height)
    const end = performance.now() + 420
    let raf = 0
    const draw = (now: number) => {
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
      c.style.opacity = String(Math.max(0, (end - now) / 420) * 0.9)
      if (now < end) raf = requestAnimationFrame(draw)
      else c.style.opacity = '0'
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [burst, reduce])
  return <canvas ref={ref} width={160} height={90} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full opacity-0 [image-rendering:pixelated]" />
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return <span className="num">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
}

export function ChannelTv({ onOpen }: { onOpen: (r: Repo) => void }) {
  const { t, pick, lang } = useI18n()
  const reduce = useReducedMotion()
  const [ch, setCh] = useState(0)
  const [burst, setBurst] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const [osd, setOsd] = useState(true)
  const box = useRef<HTMLDivElement>(null)
  const visible = useInView(box, { amount: 0.3 })
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'end start'] })
  const tvLift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -22])
  const surfing = !paused && !hover && visible && !reduce
  const repo = CHANNELS[ch]

  const tune = useCallback((next: number) => {
    setCh(((next % CHANNELS.length) + CHANNELS.length) % CHANNELS.length)
    setBurst((b) => b + 1)
    setOsd(true)
  }, [])

  // Auto-surf. The timer restarts on every change, so a manual pick gets the full dwell time.
  useEffect(() => {
    if (!surfing) return
    const id = setTimeout(() => tune(ch + 1), DWELL)
    return () => clearTimeout(id)
  }, [surfing, ch, tune])

  // The channel number fades out a while after each change, like a real set.
  useEffect(() => {
    const id = setTimeout(() => setOsd(false), 2600)
    return () => clearTimeout(id)
  }, [burst])

  // Number keys jump to a channel while the TV is on screen (not while typing or with a dialog open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if ((el instanceof Element && el.closest('input, textarea, [contenteditable]')) || document.getElementById('root')?.inert) return
      const n = Number(e.key)
      if (n >= 1 && n <= Math.min(9, CHANNELS.length)) tune(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, tune])

  const rtl = lang === 'he'
  const remote = 'grid size-10 place-items-center rounded-full border border-line-2 bg-s1 text-muted transition-[color,background-color,transform] duration-150 hover:bg-s2 hover:text-fg active:scale-90'
  // Ambilight: backlight shifts smoothly to match the tuned channel.
  const ambilight = repo.name === 'israel-tv-plus'
    ? 'var(--color-tv)'
    : repo.name === 'pulse-speed'
      ? 'var(--color-pulse)'
      : (repo.language && LANG_COLOR[repo.language]) || 'var(--color-ember)'

  const onTvMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--ry', `${px * 8}deg`)
    e.currentTarget.style.setProperty('--rx', `${py * -6}deg`)
  }
  const onTvLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.div ref={box} style={{ y: tvLift }} className="relative" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[16%] -z-10 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(closest-side, color-mix(in srgb, ${ambilight} 28%, transparent), transparent)` }}
      />

      {/* Razor-thin OLED glass & titanium frame with live 3D mouse tilt */}
      <div
        onPointerMove={onTvMove}
        onPointerLeave={onTvLeave}
        className="tilt relative rounded-[28px] bg-gradient-to-b from-[#232730] via-[#13151b] to-[#08090c] p-[2.2%] shadow-[0_50px_110px_-36px_rgb(0_0_0/0.98),0_0_0_1px_rgb(255_255_255/0.12),inset_0_1px_0_rgb(255_255_255/0.18)]"
      >
        {/* Tiny power LED on the bottom-right bezel */}
        <span aria-hidden className="absolute bottom-[0.95%] end-[4.5%] size-1.5 rounded-full bg-phosphor shadow-[0_0_8px_var(--color-phosphor)]" />
        <motion.div
          className="crt relative aspect-video overflow-hidden rounded-[18px] bg-black"
          initial={{ clipPath: 'inset(49.6% 0 49.6% 0 round 18px)', filter: 'brightness(3)' }}
          animate={{ clipPath: ['inset(49.6% 50% 49.6% 50% round 18px)', 'inset(49.6% 0% 49.6% 0% round 18px)', 'inset(0% 0% 0% 0% round 18px)'], filter: ['brightness(3)', 'brightness(3)', 'brightness(1)'] }}
          transition={{ duration: 0.9, times: [0, 0.4, 1], ease: EASE, delay: 0.35 }}
        >
          <button type="button" onClick={() => onOpen(repo)} aria-label={t('tvOpen', { n: repo.title })} className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none" />

          <AnimatePresence initial={false}>
            <motion.div
              key={repo.name}
              className="absolute inset-0 bg-s2"
              initial={{ opacity: 0, y: '-6%', scaleY: 1.06 }}
              animate={{ opacity: 1, y: '0%', scaleY: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Preview repo={repo} />
            </motion.div>
          </AnimatePresence>

          <Snow burst={burst} />

          {/* On-screen display */}
          <div className="pointer-events-none absolute inset-0 z-30 font-osd text-phosphor [text-shadow:0_0_8px_rgb(141_255_164/0.7)]">
            <AnimatePresence>
              {osd && (
                <motion.span key={`ch-${ch}`} dir="ltr" className="absolute left-[4%] top-[5%] text-[clamp(1.4rem,3.2vw,2.4rem)] leading-none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.4 } }} transition={{ duration: 0.05 }}>
                  CH {pad(ch + 1)}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="absolute right-[4%] top-[5%] flex items-center gap-2 text-[clamp(1rem,2vw,1.4rem)] leading-none text-fg [text-shadow:0_1px_4px_rgb(0_0_0/0.9)]">
              <span className="size-2.5 animate-pulse rounded-full bg-rec shadow-[0_0_8px_var(--color-rec)]" />
              {t('onAir')} <Clock />
              <span className="ms-1 hidden h-3 items-end gap-[2px] sm:flex" aria-hidden>
                {[0, 1, 2].map((k) => (
                  <span key={k} className="eq-bar w-[2.5px] rounded-full bg-phosphor/85" style={{ height: '100%', animationDelay: `${k * 0.24}s` }} />
                ))}
              </span>
            </span>

            {/* Lower third */}
            <AnimatePresence mode="wait">
              <motion.div key={repo.name} className="absolute inset-x-[4%] bottom-[6%] font-sans text-white [text-shadow:none]"
                initial={{ opacity: 0, x: rtl ? 24 : -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}>
                <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-md bg-black/80 shadow-lg backdrop-blur">
                  <span className="w-1.5 shrink-0 bg-ember" />
                  <span className="min-w-0 px-3 py-2">
                    <span dir="ltr" className="block truncate text-[clamp(0.95rem,1.8vw,1.25rem)] font-bold leading-tight text-white">{repo.title}</span>
                    <span className="block truncate text-[clamp(0.75rem,1.3vw,0.9rem)] text-white/75">{pick(repo.tagline)}</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Time left on this channel while surfing */}
            {surfing && (
              <motion.span key={`bar-${burst}-${ch}`} className="absolute inset-x-0 bottom-0 h-[3px] origin-[var(--o)] bg-ember [--o:left] rtl:[--o:right]"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DWELL / 1000, ease: 'linear' }} />
            )}
          </div>
        </motion.div>
      </div>
      <div aria-hidden className="mx-auto h-4 w-[18%] bg-gradient-to-b from-[#161a20] to-[#0b0d11]" />
      <div aria-hidden className="mx-auto h-2 w-[42%] rounded-full bg-[#161a20]" />

      {/* Sleek frosted glass remote dock, centered under the TV */}
      <div className="mt-5 flex flex-col items-center">
      <div role="group" aria-label={t('tvLabel')} className="bento-tile inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-2xl p-2 backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <button type="button" className={remote} aria-label={t('chDown')} onClick={() => tune(ch - 1)}>
            <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className={remote} aria-label={t('chUp')} onClick={() => tune(ch + 1)}>
            <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className={remote} aria-label={paused ? t('resume') : t('pause')} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused
              ? <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor"><path d="M5 3.5v9l7-4.5z" /></svg>
              : <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor"><rect x="4" y="3.5" width="3" height="9" rx="0.8" /><rect x="9" y="3.5" width="3" height="9" rx="0.8" /></svg>}
          </button>
        </div>
        <span aria-hidden className="hidden h-5 w-px bg-[var(--hairline-strong)] sm:block" />
        <div className="flex flex-wrap gap-1" dir="ltr">
          {CHANNELS.map((r, i) => (
            <button key={r.name} type="button" onClick={() => tune(i)} aria-pressed={i === ch} aria-label={t('chN', { n: i + 1, t: r.title })}
              className={`h-7 min-w-7 rounded-lg px-1.5 font-osd text-base leading-none transition-[background-color,color,box-shadow] duration-150 ${i === ch ? 'bg-ember text-white shadow-[0_0_16px_color-mix(in_srgb,var(--color-ember)_55%,transparent)]' : 'bg-[var(--chip-bg)] text-muted hover:bg-[var(--chip-hover)] hover:text-fg'}`}>
              {pad(i + 1)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 hidden text-center text-xs text-muted md:block">{t('tvHint')}</p>
      </div>
    </motion.div>
  )
}
