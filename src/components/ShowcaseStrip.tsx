import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n'
import { bySlug, LANG_COLOR, type Repo } from '../data'
import { PLATFORM_LABEL } from '../data/curated'
import { Preview } from './Explorer'
import { TuneIn } from './Motion'

const FEATURED_SLUGS = [
  'antigravity-remote',
  'israel-tv-plus',
  'pulse-speed',
  'tiktok-webos-tv',
  'home-rms',
  'tafnit',
  'drift-browser',
  'nebula-ide',
]

export function ShowcaseStrip({ onOpen }: { onOpen: (r: Repo) => void }) {
  const { t, pick } = useI18n()
  const items = FEATURED_SLUGS.map((s) => bySlug[s]).filter(Boolean)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((i) => (i + 1) % items.length), 4200)
    return () => clearInterval(id)
  }, [paused, items.length])

  const step = (by: number) => setActive((i) => (i + by + items.length) % items.length)

  return (
    <section
      aria-labelledby="spotlight-title"
      className="relative isolate overflow-hidden border-t border-[var(--hairline)] py-20 md:py-28"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">{t('spotlightKicker')}</p>
            <TuneIn id="spotlight-title" className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              {t('spotlightTitle')}
            </TuneIn>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t('prev')}
              className="bento-tile grid size-11 place-items-center rounded-full text-fg transition-[transform,background-color] duration-150 hover:bg-[var(--chip-hover)] active:scale-90"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t('next')}
              className="bento-tile grid size-11 place-items-center rounded-full text-fg transition-[transform,background-color] duration-150 hover:bg-[var(--chip-hover)] active:scale-90"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Interactive Coverflow Stage */}
      <div className="relative mx-auto mt-10 h-[370px] max-w-[1280px] [perspective:1400px] sm:h-[430px]" dir="ltr">
        {items.map((repo, i) => {
          let offset = i - active
          if (offset > items.length / 2) offset -= items.length
          if (offset < -items.length / 2) offset += items.length
          const abs = Math.abs(offset)
          if (abs > 2) return null

          const isCenter = offset === 0
          const accent = (repo.language && LANG_COLOR[repo.language]) || 'var(--color-ember)'

          return (
            <motion.article
              key={repo.name}
              onClick={() => (isCenter ? onOpen(repo) : setActive(i))}
              initial={false}
              animate={{
                x: `${offset * 58}%`,
                scale: isCenter ? 1 : abs === 1 ? 0.84 : 0.7,
                rotateY: offset * -22,
                zIndex: 10 - abs,
                opacity: isCenter ? 1 : abs === 1 ? 0.68 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              style={{
                '--card-accent': accent,
                transformStyle: 'preserve-3d',
              } as React.CSSProperties}
              className={`bento-card neon-card absolute left-1/2 top-0 flex h-full w-[min(86vw,540px)] -translate-x-1/2 cursor-pointer flex-col overflow-hidden rounded-[28px] transition-shadow duration-300 ${
                isCenter ? 'shadow-[0_36px_90px_-24px_rgb(0_0_0/0.65)] ring-1 ring-ember/40' : ''
              }`}
            >
              <div className="relative flex-1 overflow-hidden" style={{ background: 'var(--media-bg)' }}>
                <Preview repo={repo} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 start-4 end-4 flex items-center justify-between gap-2 text-white">
                  <div className="flex flex-wrap gap-1.5">
                    {repo.platforms.slice(0, 3).map((p) => (
                      <span key={p} className="rounded-full border border-white/20 bg-black/55 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-md">
                        {pick(PLATFORM_LABEL[p])}
                      </span>
                    ))}
                  </div>
                  {isCenter && (
                    <span className="rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      {t('inspect')} →
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5" dir="auto">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-bold tracking-tight">{repo.title}</h3>
                  {repo.release && <span className="rounded-md border border-[var(--hairline)] bg-[var(--chip-bg)] px-2 py-0.5 font-mono text-xs text-muted" dir="ltr">{repo.release.tag}</span>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{pick(repo.tagline)}</p>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex justify-center gap-2">
        {items.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setActive(i)}
            aria-label={r.title}
            className={`h-2 rounded-full transition-[width,background-color] duration-300 ${i === active ? 'w-8 bg-ember' : 'w-2 bg-line-2 hover:bg-muted'}`}
          />
        ))}
      </div>
    </section>
  )
}
