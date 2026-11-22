import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'dark' | 'light'

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void }
const ThemeCtx = createContext<Ctx>(null!)

function initialTheme(): Theme {
  try {
    const s = localStorage.getItem('theme')
    if (s === 'light' || s === 'dark') return s
  } catch {}
  return matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useLayoutEffect(() => {
    const el = document.documentElement
    el.dataset.theme = theme
    el.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    const go = () => flushSync(() => setThemeState(next))
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(go)
    } else {
      go()
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  return <ThemeCtx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
