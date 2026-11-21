import { StrictMode, useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import { I18nProvider } from './i18n'
import type { Platform } from './data/curated'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Flagships } from './components/Flagships'
import { Explorer } from './components/Explorer'
import { Footer, Stack } from './components/Stack'

function App() {
  const [platform, setPlatform] = useState<Platform | null>(null)
  const pickPlatform = useCallback((p: Platform) => {
    setPlatform(p)
    document.getElementById('projects')?.scrollIntoView({ block: 'start' })
  }, [])
  return (
    <>
      <Header />
      <main id="main">
        <Hero onPlatform={pickPlatform} />
        <Flagships />
        <Explorer platform={platform} setPlatform={setPlatform} />
        <Stack />
      </main>
      <Footer />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <I18nProvider>
        <App />
      </I18nProvider>
    </MotionConfig>
  </StrictMode>,
)
