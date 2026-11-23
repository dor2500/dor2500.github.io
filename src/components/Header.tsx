import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useI18n } from '../i18n'
import { useTheme } from '../theme'
import { useSound } from '../sound'
import { useToast } from './DynamicIsland'
import { profile } from '../data'

export function GithubIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export function SignalMark({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <rect x="2" y="12" width="4" height="6" rx="1" fill="var(--color-ember)" className="origin-bottom transition-transform duration-300 group-hover:scale-y-125" />
      <rect x="8" y="7" width="4" height="11" rx="1" fill="var(--color-ember)" className="origin-bottom transition-transform delay-75 duration-300 group-hover:scale-y-90" />
      <rect x="14" y="2" width="4" height="16" rx="1" fill="var(--color-ember)" className="origin-bottom transition-transform delay-150 duration-300 group-hover:scale-y-110" />
    </svg>
  )
}

const NAV_IDS = ['flagships', 'projects', 'stack'] as const

export function Header({ onOpenCmd, onOpenTerm }: { onOpenCmd: () => void; onOpenTerm: () => void }) {
  const { t, lang, setLang } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const sound = useSound()
  const toast = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<(typeof NAV_IDS)[number] | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 28)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as (typeof NAV_IDS)[number])
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const onTop = () => { if (window.scrollY < 260) setActive(null) }
    window.addEventListener('scroll', onTop, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onTop) }
  }, [])
  const navItems = [
    { id: 'flagships' as const, label: t('navFlagships') },
    { id: 'projects' as const, label: t('navProjects') },
    { id: 'stack' as const, label: t('navStack') },
  ]
  // Floating glass Dynamic Island header that tightens gracefully on scroll.
  return (
    <>
    <div aria-hidden className="h-16" />
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6">
      <a href="#main" className="pointer-events-auto sr-only rounded-md bg-ember px-3 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:start-4 focus:top-3">{t('skip')}</a>
      <div
        style={{
          background: scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
          borderColor: scrolled ? 'var(--hairline-strong)' : 'var(--hairline)',
        }}
        className={`pointer-events-auto relative mx-auto flex items-center gap-1.5 overflow-hidden rounded-full border backdrop-blur-2xl backdrop-saturate-150 transition-[max-width,height,background-color,border-color,box-shadow] duration-500 ease-out-quint sm:gap-2 ${
          scrolled
            ? 'h-12 max-w-[860px] px-4 shadow-[0_18px_48px_-20px_rgb(0_0_0/0.35)]'
            : 'h-13 max-w-[1200px] px-5 shadow-[0_8px_24px_-16px_rgb(0_0_0/0.2)]'
        }`}
      >
        <a href="#top" className="group me-auto flex items-center gap-2.5 font-semibold tracking-tight" aria-label="dor2500">
          <SignalMark />
          <span>dor2500</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-0.5 sm:flex">
          {navItems.map((item) => {
            const on = active === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={on ? 'location' : undefined}
                className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${on ? 'font-medium text-fg' : 'text-muted hover:text-fg'}`}
              >
                {on && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full border border-[var(--hairline-strong)] bg-[var(--chip-hover)]" transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }} />}
                {item.label}
              </a>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={onOpenCmd}
          aria-label={t('cmdLabel')}
          className="flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--chip-bg)] px-2.5 py-1.5 text-xs font-medium text-muted transition-[border-color,background-color,color] duration-150 hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)] hover:text-fg sm:px-3"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" strokeLinecap="round" /></svg>
          <span className="hidden md:inline">{t('cmdLabel')}</span>
          <kbd className="rounded bg-[var(--chip-hover)] px-1.5 py-0.5 font-mono text-[10px] text-fg/80" dir="ltr">⌘K</kbd>
        </button>
        <button
          type="button"
          onClick={() => { sound.play('pop'); onOpenTerm() }}
          aria-label={t('terminalLabel')}
          title={t('terminalLabel')}
          className="grid size-8 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--chip-bg)] font-mono text-[11px] font-bold text-muted transition-[border-color,background-color,color,transform] duration-200 hover:border-ember/50 hover:bg-ember/15 hover:text-ember active:scale-90"
          dir="ltr"
        >
          &gt;_
        </button>
        <button
          type="button"
          onClick={() => {
            const on = sound.toggle()
            toast.show(on ? '🔊' : '🔇', on ? t('soundOn') : t('soundOff'))
          }}
          aria-label={sound.enabled ? t('soundOff') : t('soundOn')}
          title={sound.enabled ? t('soundOff') : t('soundOn')}
          aria-pressed={sound.enabled}
          className={`grid size-8 place-items-center rounded-full border transition-[border-color,background-color,color,transform] duration-200 active:scale-90 ${
            sound.enabled
              ? 'border-pulse/50 bg-pulse/15 text-pulse'
              : 'border-[var(--hairline)] bg-[var(--chip-bg)] text-muted hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)] hover:text-fg'
          }`}
        >
          {sound.enabled ? (
            <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 8v4h3l4 3.5V4.5L7 8H4Z" strokeLinejoin="round" />
              <path d="M14.2 7.2a4 4 0 0 1 0 5.6M16.5 5a7 7 0 0 1 0 10" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 8v4h3l4 3.5V4.5L7 8H4Z" strokeLinejoin="round" />
              <path d="m14 8 4 4m0-4-4 4" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click')
            const next = theme === 'dark' ? 'light' : 'dark'
            toggleTheme()
            toast.show(next === 'light' ? '☀️' : '🌙', next === 'light' ? t('themeLight') : t('themeDark'))
          }}
          aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
          title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
          className="grid size-8 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--chip-bg)] text-muted transition-[border-color,background-color,color,transform] duration-200 hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)] hover:text-fg active:scale-90"
        >
          {theme === 'dark' ? (
            <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="10" cy="10" r="3.5" />
              <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M16.2 12.6A6.8 6.8 0 0 1 7.4 3.8a6.8 6.8 0 1 0 8.8 8.8Z" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
          aria-label={t('switchLangLabel')}
          lang={lang === 'en' ? 'he' : 'en'}
          className="rounded-full border border-[var(--hairline)] bg-[var(--chip-bg)] px-3 py-1 text-sm font-medium transition-[border-color,background-color] duration-150 hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)] active:scale-[0.97]"
        >
          {t('switchLang')}
        </button>
        <a href={profile.url} className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-[var(--chip-hover)] hover:text-fg" aria-label={t('ctaGithub')}>
          <GithubIcon className="size-[17px]" />
        </a>
        {/* Scroll progress hairline tucked neatly along the bottom edge of the island. */}
        <motion.div aria-hidden className="absolute inset-x-4 bottom-0 h-[1.5px] origin-[var(--o)] rounded-full bg-gradient-to-r from-ember via-ember-2 to-tv [--o:left] rtl:[--o:right]" style={{ scaleX: progress }} />
      </div>
    </header>
    </>
  )
}
