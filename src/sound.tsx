import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type SoundKind = 'click' | 'pop' | 'chime' | 'whoosh' | 'tick'

type Ctx = {
  enabled: boolean
  toggle: () => boolean
  play: (kind: SoundKind) => void
}

const SoundCtx = createContext<Ctx>({
  enabled: false,
  toggle: () => false,
  play: () => {},
})

/**
 * Zero-asset Web Audio API synthesizer for subtle Apple / Teenage-Engineering tactile micro-sounds.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!audioRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AC) audioRef.current = new AC()
    }
    if (audioRef.current?.state === 'suspended') audioRef.current.resume().catch(() => {})
    return audioRef.current
  }, [])

  const synth = useCallback((kind: SoundKind) => {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (kind === 'tick') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(920, now)
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.03)
      gain.gain.setValueAtTime(0.035, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
      osc.start(now)
      osc.stop(now + 0.04)
    } else if (kind === 'click') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(640, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
      osc.start(now)
      osc.stop(now + 0.055)
    } else if (kind === 'pop') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.075)
      gain.gain.setValueAtTime(0.065, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
      osc.start(now)
      osc.stop(now + 0.095)
    } else if (kind === 'whoosh') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(240, now)
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
      osc.start(now)
      osc.stop(now + 0.15)
    } else if (kind === 'chime') {
      // Two-note crystalline chime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.setValueAtTime(880, now + 0.07) // A5
      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
      osc.start(now)
      osc.stop(now + 0.29)
    }
  }, [getCtx])

  const play = useCallback((kind: SoundKind) => {
    if (enabled) synth(kind)
  }, [enabled, synth])

  const toggle = useCallback(() => {
    const next = !enabled
    setEnabled(next)
    if (next) synth('chime')
    return next
  }, [enabled, synth])

  return <SoundCtx.Provider value={{ enabled, toggle, play }}>{children}</SoundCtx.Provider>
}

export const useSound = () => useContext(SoundCtx)
