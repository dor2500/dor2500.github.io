import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useI18n } from '../i18n'
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
      <rect x="2" y="12" width="4" height="6" rx="1" fill="var(--color-ember)" />
      <rect x="8" y="7" width="4" height="11" rx="1" fill="var(--color-ember)" />
      <rect x="14" y="2" width="4" height="16" rx="1" fill="var(--color-ember)" />
    </svg>
  )
}

export function Header() {
  const { t, lang, setLang } = useI18n()
  const link = 'rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors duration-150 hover:text-fg'
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // Fixed, with a spacer holding its place, so shrinking it never shifts the page.
  return (
    <>
    <div aria-hidden className="h-12" />
    <header className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color] duration-300 ${scrolled ? 'border-white/10 bg-[rgb(22_22_23/0.78)]' : 'border-transparent bg-black/40'}`}>
      <a href="#main" className="sr-only rounded-md bg-ember px-3 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:start-4 focus:top-3">{t('skip')}</a>
      <div className={`mx-auto flex max-w-[1200px] items-center gap-2 px-5 transition-[height] duration-300 ease-out-quint sm:px-8 ${scrolled ? 'h-11' : 'h-12'}`}>
        <a href="#top" className="me-auto flex items-center gap-2 font-semibold tracking-tight" aria-label="dor2500">
          <SignalMark />
          <span>dor2500</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center sm:flex">
          <a className={link} href="#flagships">{t('navFlagships')}</a>
          <a className={link} href="#projects">{t('navProjects')}</a>
          <a className={link} href="#stack">{t('navStack')}</a>
        </nav>
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
          aria-label={t('switchLangLabel')}
          lang={lang === 'en' ? 'he' : 'en'}
          className="rounded-md border border-line px-2.5 py-1 text-sm font-medium transition-[border-color,background-color] duration-150 hover:border-line-2 hover:bg-s1 active:scale-[0.97]"
        >
          {t('switchLang')}
        </button>
        <a href={profile.url} className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-s1 hover:text-fg" aria-label={t('ctaGithub')}>
          <GithubIcon className="size-[18px]" />
        </a>
      </div>
      {/* How far down the page you are, as a thin line along the bottom edge. */}
      <motion.div aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] origin-[var(--o)] bg-ember [--o:left] rtl:[--o:right]" style={{ scaleX: progress }} />
    </header>
    </>
  )
}
