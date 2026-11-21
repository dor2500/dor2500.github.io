import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n, useFormat } from '../i18n'
import { others, LANG_COLOR, type Repo } from '../data'
import { CATEGORIES, PLATFORM_LABEL, type Category, type Platform } from '../data/curated'
import { Mockup } from './Mockups'
import { EASE, Sweep, TuneIn } from './Motion'

export function Explorer({ platform, setPlatform, onOpen }: { platform: Platform | null; setPlatform: (p: Platform | null) => void; onOpen: (r: Repo) => void }) {
  const { t, pick } = useI18n()
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim().toLowerCase())

  const list = useMemo(
    () => others.filter((r) =>
      (cat === 'all' || r.category === cat) &&
      (!platform || r.platforms.includes(platform)) &&
      (!q || [r.title, r.name, r.description ?? '', r.tagline.en, r.tagline.he, r.language ?? '', ...r.stack, ...r.topics].join(' ').toLowerCase().includes(q))),
    [cat, platform, q],
  )
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: others.length }
    for (const r of others) m[r.category] = (m[r.category] ?? 0) + 1
    return m
  }, [])

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative isolate border-t border-line">
      <Sweep />
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <TuneIn ch={3} id="projects-title" className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-[-0.03em]">{t('projectsTitle')}</TuneIn>
            <p className="mt-3 max-w-[52ch] text-lg text-muted">{t('projectsLead')}</p>
          </div>
          <div className="relative w-full sm:w-80">
            <label htmlFor="search" className="sr-only">{t('search')}</label>
            <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" strokeLinecap="round" /></svg>
            <input
              id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPh')}
              className="w-full rounded-lg border border-line bg-s1 py-2.5 pe-3 ps-9 text-[15px] placeholder:text-muted/80 transition-colors focus:border-line-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-cyan"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-1 gap-y-2" role="group" aria-label={t('navProjects')}>
          {CATEGORIES.map((c) => {
            const on = cat === c.id
            return (
              <button
                key={c.id} type="button" aria-pressed={on} onClick={() => setCat(c.id)}
                className={`relative rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${on ? 'text-fg' : 'text-muted hover:text-fg'}`}
              >
                {on && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-md bg-s2 ring-1 ring-line-2" transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }} />}
                <span className="relative">{pick(c.label)} <span className="num text-muted">{counts[c.id] ?? 0}</span></span>
              </button>
            )
          })}
          {platform && (
            <button type="button" onClick={() => setPlatform(null)} aria-label={t('clearPlatform')}
              className="ms-2 flex items-center gap-1.5 rounded-md border border-ember/50 bg-ember/10 px-2.5 py-1.5 text-sm text-ember-2 transition-colors hover:bg-ember/20">
              {t('onPlatform', { p: pick(PLATFORM_LABEL[platform]) })}
              <svg aria-hidden viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
        <p className="sr-only" aria-live="polite">{t('showing', { n: list.length })}</p>

        <motion.ul layout className="mt-8 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((r, n) => (
              <motion.li
                key={r.name} layout
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={r.wide ? 'sm:col-span-2' : ''}
              >
                {/* First time a card scrolls in it flickers on, like a channel finding its picture. */}
                <motion.div className="h-full"
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: [0, 1, 0.35, 1], y: 0 }} viewport={{ once: true, amount: 0.25 }}
                  transition={{ y: { duration: 0.6, ease: EASE, delay: (n % 3) * 0.09 }, opacity: { duration: 0.55, times: [0, 0.3, 0.5, 1], delay: (n % 3) * 0.09 } }}>
                  <Card repo={r} onOpen={() => onOpen(r)} />
                </motion.div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {list.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-line-2 p-10 text-center">
            <p className="text-muted">{t('empty', { q: query })}</p>
            <button type="button" onClick={() => { setQuery(''); setCat('all'); setPlatform(null) }} className="mt-4 rounded-md border border-line-2 px-3 py-1.5 text-sm hover:bg-s1">{t('clearSearch')}</button>
          </div>
        )}
      </div>
    </section>
  )
}

export function Preview({ repo, large }: { repo: Repo; large?: boolean }) {
  if (repo.mockup) return <Mockup m={repo.mockup} large={large} />
  const c = repo.cover
  if (!c) return null
  const portrait = c.h > c.w * 1.1
  if (portrait) {
    const imgs = repo.shots.filter((s) => s.h > s.w * 1.1).slice(0, repo.wide ? 4 : 3)
    return (
      <div dir="ltr" className="absolute inset-0 flex items-start justify-center gap-[3%] px-[6%] pt-[7%]">
        {imgs.map((s, i) => {
          const o = i - (imgs.length - 1) / 2 // offset from the middle shot, for the hover fan
          return (
            <img key={s.src} src={s.src} alt="" loading="lazy" decoding="async" width={s.w} height={s.h}
              className="preview-img fan-img w-[28%] max-w-[150px] rounded-[10px] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8),0_0_0_1px_rgb(255_255_255/0.06)]"
              style={{ '--o': o, '--a': Math.abs(o), transitionDelay: `${Math.abs(o) * 30}ms` } as React.CSSProperties} />
          )
        })}
      </div>
    )
  }
  return <img src={c.src} alt="" loading="lazy" decoding="async" width={c.w} height={c.h} className="preview-img absolute inset-0 size-full object-cover object-top" />
}

function Card({ repo, onOpen }: { repo: Repo; onOpen: () => void }) {
  const { t, pick } = useI18n()
  const f = useFormat()
  // Feed the pointer position to CSS so the spotlight follows it without re-rendering.
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--ry', `${px * 7}deg`)
    e.currentTarget.style.setProperty('--rx', `${py * -7}deg`)
  }
  const reset = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }
  return (
    <article onPointerMove={track} onPointerLeave={reset} className="tilt spot group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-s1 transition-colors duration-200 hover:border-line-2">
      <motion.div layoutId={`media-${repo.name}`} transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
        className={`tv-static relative grow overflow-hidden border-b border-line bg-s2 ${repo.wide ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
        <Preview repo={repo} />
      </motion.div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-[-0.01em]">
            <button type="button" onClick={onOpen} className="text-start after:absolute after:inset-0 after:content-[''] focus-visible:outline-none" aria-label={t('open', { n: repo.title })}>
              {repo.title}
            </button>
          </h3>
          {repo.release && <span className="shrink-0 font-mono text-xs text-muted" dir="ltr">{repo.release.tag}</span>}
        </div>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted text-pretty">{pick(repo.tagline)}</p>
        <div className="mt-auto flex items-center gap-4 pt-5 text-[13px] text-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-full" style={{ background: LANG_COLOR[repo.language] ?? '#888' }} />
              {repo.language}
            </span>
          )}
          {repo.homepage?.includes('github.io') && <span className="flex items-center gap-1.5 text-pulse"><span aria-hidden className="size-1.5 rounded-full bg-pulse" />{t('live')}</span>}
          <span className="ms-auto">{f.ago(repo.release?.date ?? repo.pushedAt)}</span>
        </div>
      </div>
      {/* Keyboard focus ring for the whole card, driven by the stretched button. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-cyan opacity-0 transition-opacity group-has-[:focus-visible]:opacity-100" />
    </article>
  )
}
