import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../i18n'
import { LANG_COLOR, repos, type Repo } from '../data'
import { PLATFORM_LABEL } from '../data/curated'
import { EASE } from './Motion'

export function CommandPalette({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (r: Repo) => void }) {
  return (
    <AnimatePresence>
      {open && <PaletteDialog onClose={onClose} onSelect={onSelect} />}
    </AnimatePresence>
  )
}

function PaletteDialog({ onClose, onSelect }: { onClose: () => void; onSelect: (r: Repo) => void }) {
  const { t, pick, lang, setLang } = useI18n()
  const [query, setQuery] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return repos.slice(0, 8)
    return repos
      .filter((r) => [r.title, r.name, r.tagline.en, r.tagline.he, r.language ?? '', ...r.stack, ...r.platforms].join(' ').toLowerCase().includes(q))
      .slice(0, 10)
  }, [query])

  useEffect(() => { setIdx(0) }, [query])

  useEffect(() => {
    inputRef.current?.focus()
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)) }
      else if (e.key === 'Enter' && results[idx]) {
        e.preventDefault()
        const r = results[idx]
        onClose()
        onSelect(r)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [idx, onClose, onSelect, results])

  return createPortal(
    <div lang={lang} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <motion.div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
        <motion.div
          role="dialog" aria-modal="true" aria-label={t('cmdLabel')}
          className="glass-panel pointer-events-auto w-full max-w-[600px] overflow-hidden rounded-2xl shadow-[0_40px_120px_-20px_rgb(0_0_0/0.95)]"
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -8, transition: { duration: 0.14 } }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 text-ember-2" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('cmdPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-fg placeholder:text-muted/75 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
              className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-xs text-muted transition-colors hover:border-white/20 hover:text-fg"
            >
              {t('switchLang')}
            </button>
            <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-muted sm:inline">ESC</kbd>
          </div>

          <div className="max-h-[52vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted">{t('empty', { q: query })}</p>
            ) : (
              <ul role="listbox">
                {results.map((r, i) => {
                  const active = i === idx
                  return (
                    <li key={r.name} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onMouseEnter={() => setIdx(i)}
                        onClick={() => { onClose(); onSelect(r) }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors ${active ? 'bg-white/[0.09] text-white' : 'text-fg/85 hover:bg-white/[0.05]'}`}
                      >
                        <span
                          aria-hidden
                          className="size-2.5 shrink-0 rounded-full"
                          style={{
                            background: (r.language && LANG_COLOR[r.language]) || 'var(--color-ember)',
                            boxShadow: active ? `0 0 10px ${(r.language && LANG_COLOR[r.language]) || 'var(--color-ember)'}` : undefined,
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{r.title}</span>
                          <span className="block truncate text-xs text-muted">{pick(r.tagline)}</span>
                        </span>
                        <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
                          {r.platforms.slice(0, 2).map((p) => (
                            <span key={p} className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-muted">
                              {pick(PLATFORM_LABEL[p])}
                            </span>
                          ))}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[11px] text-muted">
            <span>{t('cmdHint')}</span>
            <span className="font-mono">{results.length} / {repos.length}</span>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  )
}
