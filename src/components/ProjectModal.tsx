import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n, useFormat } from '../i18n'
import { LANG_COLOR, type Repo } from '../data'
import { PLATFORM_LABEL } from '../data/curated'
import { Mockup } from './Mockups'
import { GithubIcon } from './Header'
import { EASE, slide } from './Motion'

export function ProjectModal({ repo, onClose }: { repo: Repo | null; onClose: () => void }) {
  return <AnimatePresence>{repo && <Dialog key={repo.name} repo={repo} onClose={onClose} />}</AnimatePresence>
}

function Dialog({ repo, onClose }: { repo: Repo; onClose: () => void }) {
  const { t, pick } = useI18n()
  const f = useFormat()
  const panel = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [d, setD] = useState(1)
  const shots = repo.shots

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')!
    root.inert = true
    document.documentElement.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.inert = false
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [onClose])

  const step = (by: number) => { setD(by); setI((x) => (x + by + shots.length) % shots.length) }

  return (
    <Portal>
      <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <motion.div
          ref={panel} role="dialog" aria-modal="true" aria-labelledby="modal-title"
          className="pointer-events-auto flex max-h-[92dvh] w-full max-w-[980px] flex-col overflow-hidden rounded-t-2xl border border-line-2 bg-s1 shadow-2xl sm:rounded-2xl"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <header className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
            <div className="min-w-0 flex-1">
              <h2 id="modal-title" className="text-2xl font-bold tracking-[-0.02em]">{repo.title}</h2>
              <p className="mt-1 text-muted">{pick(repo.tagline)}</p>
            </div>
            <button type="button" data-autofocus onClick={onClose} aria-label={t('close')}
              className="grid size-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-s2 hover:text-fg">
              <svg aria-hidden viewBox="0 0 16 16" className="size-4" stroke="currentColor" strokeWidth="1.8"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
            </button>
          </header>

          <div className="overflow-y-auto overscroll-contain">
            {/* Shares a layoutId with the card's preview, so the picture grows out of the card. */}
            <motion.div layoutId={`media-${repo.name}`} transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
              className="relative z-10 aspect-[16/9] overflow-hidden border-b border-line bg-s2">
              {repo.mockup || !shots.length ? (
                repo.mockup && <><Mockup m={repo.mockup} large /><p className="absolute bottom-3 start-4 text-xs text-muted">{t('conceptPreview')}</p></>
              ) : (
                <>
                  <AnimatePresence initial={false} custom={d}>
                    <motion.img key={shots[i].src} src={shots[i].src} alt={`${repo.title}, ${t('screenshots').toLowerCase()} ${i + 1}/${shots.length}`}
                      className="absolute inset-0 size-full object-contain"
                      custom={d} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: EASE }} />
                  </AnimatePresence>
                  {shots.length > 1 && (
                    <div className="absolute bottom-3 end-3 flex items-center gap-1 rounded-lg bg-ink/80 p-1 backdrop-blur" dir="ltr">
                      <button type="button" onClick={() => step(-1)} aria-label={t('prev')} className="grid size-8 place-items-center rounded-md hover:bg-s3 active:scale-95">
                        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <span className="num w-10 text-center text-xs text-muted">{i + 1}/{shots.length}</span>
                      <button type="button" onClick={() => step(1)} aria-label={t('next')} className="grid size-8 place-items-center rounded-md hover:bg-s3 active:scale-95">
                        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            <div className="grid gap-10 p-5 sm:p-6 md:grid-cols-[1fr_260px]">
              <div className="min-w-0">
                {repo.readme.summary && <p dir="auto" className="max-w-[62ch] leading-relaxed text-pretty">{repo.readme.summary}</p>}
                {repo.readme.bullets.length > 0 && (
                  <>
                    <h3 className="mt-7 text-sm font-semibold text-muted">{t('fromReadme')}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {repo.readme.bullets.map((b, k) => (
                        <li key={k} dir="auto" className="flex gap-3 text-[15px] leading-relaxed">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-line-2" />
                          <span className="min-w-0">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <aside className="space-y-6 text-sm">
                <div>
                  <h3 className="text-muted">{t('latest')}</h3>
                  {repo.release ? (
                    <p className="mt-1"><a href={repo.release.url} className="font-mono underline decoration-line-2 underline-offset-4 hover:decoration-fg">{repo.release.tag}</a>, {f.date(repo.release.date)}</p>
                  ) : <p className="mt-1">{t('noRelease')}</p>}
                </div>
                <div>
                  <h3 className="text-muted">{t('platforms')}</h3>
                  <p className="mt-1">{repo.platforms.map((p) => pick(PLATFORM_LABEL[p])).join(', ')}</p>
                </div>
                <div>
                  <h3 className="text-muted">{t('builtWith')}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {repo.stack.map((s) => (
                      <li key={s} className="flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5 text-[13px]">
                        {LANG_COLOR[s] && <span aria-hidden className="size-1.5 rounded-full" style={{ background: LANG_COLOR[s] }} />}{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <a href={repo.url} className="flex items-center justify-center gap-2 rounded-lg bg-ember px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-ember-2"><GithubIcon /> {t('viewCode')}</a>
                  {repo.release && <a href={`${repo.url}/releases/latest`} className="rounded-lg border border-line-2 px-4 py-2.5 text-center font-medium transition-colors hover:bg-s2">{t('download')}</a>}
                  {repo.homepage?.includes('github.io') && <a href={repo.homepage} className="rounded-lg border border-line-2 px-4 py-2.5 text-center font-medium transition-colors hover:bg-s2">{t('openSite')}</a>}
                </div>
                <p className="text-muted">{t('updated', { d: f.date(repo.pushedAt) })}</p>
              </aside>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  )
}

// The page behind is made inert, so the dialog is mounted on <body>, outside #root.
function Portal({ children }: { children: ReactNode }) {
  const { lang } = useI18n()
  return createPortal(<div lang={lang} dir={lang === 'he' ? 'rtl' : 'ltr'}>{children}</div>, document.body)
}
