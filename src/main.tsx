import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'
import { SoundProvider } from './sound'
import { ToastProvider } from './components/DynamicIsland'
import type { Platform } from './data/curated'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Flagships } from './components/Flagships'
import { Statement } from './components/Statement'
import { Explorer } from './components/Explorer'
import { Footer, Stack } from './components/Stack'
import { ProjectModal } from './components/ProjectModal'
import { CommandPalette } from './components/CommandPalette'
import { ShowcaseStrip } from './components/ShowcaseStrip'
import { UniverseMap } from './components/UniverseMap'
import { LiveTerminal } from './components/LiveTerminal'
import { FLAGSHIPS } from './data/curated'
import type { Repo } from './data'

function App() {
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [open, setOpen] = useState<{ repo: Repo; morph: boolean } | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
  const openCard = useCallback((repo: Repo) => setOpen({ repo, morph: true }), [])
  // From the hero bento, galaxy map, terminal or command palette: flagships scroll to their section, others open details.
  const openFromTv = useCallback((repo: Repo) => {
    if (FLAGSHIPS.includes(repo.name as never)) document.getElementById(repo.name === 'pulse-speed' ? 'pulse-title' : 'tvplus-title')?.scrollIntoView({ block: 'start' })
    else setOpen({ repo, morph: false })
  }, [])
  const close = useCallback(() => setOpen(null), [])
  const pickPlatform = useCallback((p: Platform) => {
    setPlatform(p)
    document.getElementById('projects')?.scrollIntoView({ block: 'start' })
  }, [])

  // Global shortcuts: Cmd/Ctrl+K for Command Palette, backtick (`) for Live Terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((v) => !v)
      } else if (e.key === '`' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = e.target
        if (el instanceof Element && el.closest('input, textarea, [contenteditable]')) return
        e.preventDefault()
        setTermOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Header onOpenCmd={() => setCmdOpen(true)} onOpenTerm={() => setTermOpen(true)} />
      <main id="main">
        <Hero onPlatform={pickPlatform} onOpen={openFromTv} onOpenCmd={() => setCmdOpen(true)} />
        <ShowcaseStrip onOpen={openFromTv} />
        <Statement />
        <Flagships />
        <Explorer platform={platform} setPlatform={setPlatform} onOpen={openCard} onOpenCmd={() => setCmdOpen(true)} />
        <UniverseMap onOpen={openFromTv} />
        <Stack />
      </main>
      <Footer />
      <ProjectModal repo={open?.repo ?? null} morph={open?.morph ?? false} onClose={close} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={openFromTv} />
      <LiveTerminal open={termOpen} onClose={() => setTermOpen(false)} onOpenRepo={openFromTv} />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <SoundProvider>
          <I18nProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </I18nProvider>
        </SoundProvider>
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
)
