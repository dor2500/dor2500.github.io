import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useI18n, useFormat } from '../i18n'
import { bySlug, LANG_COLOR, languageShare, platformCounts, repos, stats, type Repo } from '../data'
import { PLATFORM_LABEL, type Platform } from '../data/curated'
import { Preview } from './Explorer'
import { CountUp, EASE } from './Motion'

const HERO_PICKS = ['antigravity-remote', 'israel-tv-plus', 'pulse-speed', 'tiktok-webos-tv'] as const

const WORLDS: { platform: Platform; icon: string; color: string }[] = [
  { platform: 'android', icon: '📱', color: '#6fd6b5' },
  { platform: 'windows', icon: '🖥️', color: '#4fb3ff' },
  { platform: 'webos', icon: '📺', color: '#ff6b35' },
  { platform: 'web', icon: '🌐', color: '#a97bff' },
]

export function HeroBento({
  onOpen,
  onPlatform,
  onOpenCmd,
}: {
  onOpen: (r: Repo) => void
  onPlatform: (p: Platform) => void
  onOpenCmd: () => void
}) {
  const { t, pick, lang } = useI18n()
  const f = useFormat()
  const reduce = useReducedMotion()
  const picks = HERO_PICKS.map((s) => bySlug[s]).filter(Boolean)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const current = picks[idx] ?? picks[0]
  const newest = repos.filter((r) => r.release).sort((a, b) => b.release!.date.localeCompare(a.release!.date))[0]
  const countsMap = Object.fromEntries(platformCounts)
  const topLangs = languageShare.slice(0, 5)

  useEffect(() => {
    if (paused || reduce) return
    const id = setInterval(() => setIdx((i) => (i + 1) % picks.length), 4800)
    return () => clearInterval(id)
  }, [paused, reduce, picks.length])

  const surprise = () => {
    onOpen(repos[Math.floor(Math.random() * repos.length)])
  }

  return (
    <div className="mx-auto mt-12 grid max-w-[1160px] grid-cols-1 gap-4 text-start md:mt-16 lg:grid-cols-12">
      {/* Main Apple-style Live Product Stage (7 cols, 2 rows) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className="bento-card neon-card group relative flex min-h-[380px] flex-col overflow-hidden rounded-[30px] sm:min-h-[440px] lg:col-span-7 lg:row-span-2"
        style={{ '--card-accent': (current.language && LANG_COLOR[current.language]) || 'var(--color-ember)' } as React.CSSProperties}
      >
        {/* Top segmented glass pill switcher */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
          <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-black/55 p-1 backdrop-blur-xl">
            {picks.map((r, i) => {
              const on = i === idx
              return (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`relative shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${on ? 'text-black' : 'text-white/75 hover:text-white'}`}
                >
                  {on && <motion.span layoutId="hero-bento-tab" className="absolute inset-0 rounded-full bg-white shadow" transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }} />}
                  <span className="relative" dir="ltr">{r.title}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => onOpen(current)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-colors hover:bg-ember hover:border-ember"
          >
            {t('inspect')}
            <svg aria-hidden viewBox="0 0 16 16" className="size-3 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 11 11 5m0 0H6m5 0v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Full-bleed crisp product preview (no retro TV bezel or scanlines) */}
        <div
          onClick={() => onOpen(current)}
          className="relative flex-1 cursor-pointer overflow-hidden"
          style={{ background: 'var(--media-bg)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-0"
            >
              <Preview repo={current} />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 dir="ltr" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{current.title}</h2>
                {current.release && (
                  <span dir="ltr" className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-mono text-xs text-white/90 backdrop-blur">
                    {current.release.tag}
                  </span>
                )}
              </div>
              <p className="mt-1.5 max-w-[48ch] text-sm leading-relaxed text-white/80 sm:text-[15px]">{pick(current.tagline)}</p>
            </div>
          </div>
          {/* Subtle progress hairline at the bottom */}
          {!paused && !reduce && (
            <motion.span
              key={`prog-${idx}`}
              aria-hidden
              className="absolute inset-x-0 bottom-0 z-20 h-[2.5px] origin-[var(--o)] bg-ember [--o:left] rtl:[--o:right]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.8, ease: 'linear' }}
            />
          )}
        </div>
      </motion.div>

      {/* Top-Right Tile: 4-Platform Interactive Ecosystem Bento (5 cols) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.22 }}
        className="bento-card flex flex-col justify-between rounded-[30px] p-5 sm:p-6 lg:col-span-5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {lang === 'he' ? 'אקוסיסטם רב־מכשירי' : 'MULTI-DEVICE ECOSYSTEM'}
          </span>
          <span className="size-2 rounded-full bg-pulse shadow-[0_0_10px_var(--color-pulse)]" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {WORLDS.map((w) => (
            <button
              key={w.platform}
              type="button"
              onClick={() => onPlatform(w.platform)}
              className="bento-tile group/w flex items-center justify-between rounded-2xl px-3.5 py-3 text-start transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)]"
            >
              <div>
                <span className="block text-sm font-semibold">{pick(PLATFORM_LABEL[w.platform])}</span>
                <span className="num text-xs text-muted">{countsMap[w.platform] ?? 0} {lang === 'he' ? 'אפליקציות' : 'apps'}</span>
              </div>
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-xl text-base transition-transform duration-200 group-hover/w:scale-110"
                style={{ background: `color-mix(in srgb, ${w.color} 16%, transparent)` }}
              >
                {w.icon}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Middle-Right Tile: Latest Shipped Release + Quick Actions (5 cols) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.28 }}
        className="bento-card flex flex-col justify-between gap-4 rounded-[30px] p-5 sm:p-6 lg:col-span-5"
      >
        {newest && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ember">
                <span className="size-1.5 animate-pulse rounded-full bg-ember" />
                {t('latest')}
              </span>
              <span className="text-xs text-muted">{f.ago(newest.release!.date)}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpen(newest)}
              className="group/new mt-2.5 flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--chip-bg)] p-3.5 text-start transition-colors hover:border-ember/40 hover:bg-[var(--chip-hover)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span dir="ltr" className="truncate font-bold">{newest.title}</span>
                  <span dir="ltr" className="rounded-md bg-ember/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ember">{newest.release!.tag}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{pick(newest.tagline)}</p>
              </div>
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-ember/15 text-ember transition-transform duration-200 group-hover/new:translate-x-0.5 group-hover/new:-translate-y-0.5">
                <svg viewBox="0 0 16 16" className="size-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 11 11 5m0 0H6m5 0v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onOpenCmd}
            className="bento-tile flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium text-fg transition-colors hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)]"
          >
            <span>{t('cmdLabel')}</span>
            <kbd className="rounded bg-[var(--chip-hover)] px-1.5 py-0.5 font-mono text-[10px] text-muted" dir="ltr">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={surprise}
            className="sheen flex items-center justify-center gap-1.5 rounded-2xl bg-ember px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ember-2 active:scale-95"
          >
            <span aria-hidden>⚡</span>
            {t('surpriseMe')}
          </button>
        </div>
      </motion.div>

      {/* Bottom 3-Column Telemetry Strip (12 cols) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.34 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-12"
      >
        <div className="bento-card flex items-center justify-between rounded-[24px] px-6 py-4">
          <div>
            <CountUp value={stats.repos} className="num block text-3xl font-bold tracking-tight" style={{ color: 'var(--color-ember)' }} />
            <span className="text-xs text-muted">{t('statProjects')}</span>
          </div>
          <div className="flex h-2 w-24 overflow-hidden rounded-full bg-[var(--chip-bg)]" aria-hidden>
            {topLangs.map((l) => (
              <span key={l.lang} style={{ width: `${l.share * 100}%`, background: LANG_COLOR[l.lang] ?? '#888' }} />
            ))}
          </div>
        </div>

        <div className="bento-card flex items-center justify-between rounded-[24px] px-6 py-4">
          <div>
            <CountUp value={stats.releases} className="num block text-3xl font-bold tracking-tight" style={{ color: 'var(--color-tv)' }} />
            <span className="text-xs text-muted">{t('statReleases')}</span>
          </div>
          <span className="rounded-full border border-tv/30 bg-tv/10 px-3 py-1 font-mono text-[11px] font-medium text-tv">
            GitHub Releases
          </span>
        </div>

        <div className="bento-card flex items-center justify-between rounded-[24px] px-6 py-4">
          <div>
            <CountUp value={platformCounts.length} className="num block text-3xl font-bold tracking-tight" style={{ color: 'var(--color-pulse)' }} />
            <span className="text-xs text-muted">{t('statPlatforms')}</span>
          </div>
          <span className="rounded-full border border-pulse/30 bg-pulse/10 px-3 py-1 font-mono text-[11px] font-medium text-pulse">
            EN · עברית RTL
          </span>
        </div>
      </motion.div>
    </div>
  )
}
