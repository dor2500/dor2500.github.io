import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type ToastItem = { id: number; icon: string; text: string }
type Ctx = { show: (icon: string, text: string) => void }

const ToastCtx = createContext<Ctx>({ show: () => {} })

/**
 * Apple Dynamic Island-style live activity pill that springs out beneath the floating header.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null)
  const timer = useRef<number | null>(null)

  const show = useCallback((icon: string, text: string) => {
    if (timer.current) window.clearTimeout(timer.current)
    setItem({ id: Date.now(), icon, text })
    timer.current = window.setTimeout(() => setItem(null), 2400)
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[70px] z-50 flex justify-center px-4">
        <AnimatePresence mode="wait">
          {item && (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -14, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium text-fg shadow-2xl"
            >
              <span aria-hidden className="text-sm">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
