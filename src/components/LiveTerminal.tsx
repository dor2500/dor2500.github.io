import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../i18n'
import { useTheme } from '../theme'
import { useSound } from '../sound'
import { useToast } from './DynamicIsland'
import { languageShare, platformCounts, repos, stats, type Repo } from '../data'
import { EASE } from './Motion'

type Line = { id: number; kind: 'cmd' | 'out' | 'accent' | 'err'; text: string }

const QUICK_CMDS = ['neofetch', 'ls', 'stats', 'random', 'theme', 'help']

export function LiveTerminal({
  open,
  onClose,
  onOpenRepo,
}: {
  open: boolean
  onClose: () => void
  onOpenRepo: (r: Repo) => void
}) {
  return (
    <AnimatePresence>
      {open && <TerminalWindow onClose={onClose} onOpenRepo={onOpenRepo} />}
    </AnimatePresence>
  )
}

function TerminalWindow({ onClose, onOpenRepo }: { onClose: () => void; onOpenRepo: (r: Repo) => void }) {
  const { lang, setLang } = useI18n()
  const { theme, setTheme } = useTheme()
  const sound = useSound()
  const toast = useToast()
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 1, kind: 'accent', text: 'dor2500 OS v2.6 — interactive portfolio shell' },
    { id: 2, kind: 'out', text: 'Type "help" or click a command below. Press Esc to close.' },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const seq = useRef(10)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const push = (items: Omit<Line, 'id'>[]) => {
    setLines((prev) => [...prev, ...items.map((x) => ({ ...x, id: ++seq.current }))])
  }

  const run = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    sound.play('click')
    const [head, ...rest] = cmd.split(/\s+/)
    const name = head.toLowerCase()
    const arg = rest.join(' ').toLowerCase()

    if (name === 'clear' || name === 'cls') {
      setLines([])
      return
    }

    const out: Omit<Line, 'id'>[] = [{ kind: 'cmd', text: `dor2500@studio:~$ ${cmd}` }]

    if (name === 'help') {
      out.push(
        { kind: 'accent', text: 'Available commands:' },
        { kind: 'out', text: '  neofetch        System & developer summary' },
        { kind: 'out', text: '  ls              List all open-source projects' },
        { kind: 'out', text: '  open <name>     Launch a project modal (e.g. open pulse)' },
        { kind: 'out', text: '  stats           Language distribution bar chart' },
        { kind: 'out', text: '  random          Launch a random project' },
        { kind: 'out', text: '  theme [l|d]     Toggle Light / Dark Apple theme' },
        { kind: 'out', text: '  lang [he|en]    Switch Hebrew / English' },
        { kind: 'out', text: '  clear           Clear terminal' },
      )
    } else if (name === 'neofetch' || name === 'whoami') {
      const topLangs = languageShare.slice(0, 4).map((l) => `${l.lang} ${(l.share * 100).toFixed(0)}%`).join(' · ')
      out.push(
        { kind: 'accent', text: '   ██████╗  ██████╗ ██████╗ ██████╗ ███████╗' },
        { kind: 'accent', text: '   ██╔══██╗██╔═══██╗██╔══██╗╚════██╗██╔════╝' },
        { kind: 'accent', text: '   ██║  ██║██║   ██║██████╔╝ █████╔╝███████╗' },
        { kind: 'out', text: `   User:       dor2500 (github.com/dor2500)` },
        { kind: 'out', text: `   Projects:   ${stats.repos} public apps · ${stats.releases} releases` },
        { kind: 'out', text: `   Targets:    ${platformCounts.length} platforms (TV, Android, Windows, Web)` },
        { kind: 'out', text: `   Languages:  ${topLangs}` },
        { kind: 'out', text: `   Theme:      Apple ${theme === 'light' ? 'Studio Light' : 'Pro Dark'} · Lang: ${lang.toUpperCase()}` },
      )
    } else if (name === 'ls' || name === 'projects') {
      const rows = repos.map((r) => `${r.name.padEnd(28)} ${(r.language ?? '—').padEnd(12)} ${r.release?.tag ?? ''}`)
      out.push({ kind: 'accent', text: `Total ${repos.length} projects (type "open <name>" to inspect):` })
      for (const row of rows.slice(0, 14)) out.push({ kind: 'out', text: `  ${row}` })
      if (rows.length > 14) out.push({ kind: 'out', text: `  … and ${rows.length - 14} more. Try "open antigravity-remote" or "open tiktok-webos-tv".` })
    } else if (name === 'stats') {
      out.push({ kind: 'accent', text: 'Codebase language share:' })
      for (const l of languageShare.slice(0, 7)) {
        const pct = Math.round(l.share * 100)
        const bars = '█'.repeat(Math.max(1, Math.round(pct / 3)))
        out.push({ kind: 'out', text: `  ${l.lang.padEnd(13)} ${bars.padEnd(24)} ${pct}% (${l.repos} repos)` })
      }
    } else if (name === 'theme') {
      const next = arg.startsWith('l') ? 'light' : arg.startsWith('d') ? 'dark' : theme === 'dark' ? 'light' : 'dark'
      setTheme(next)
      toast.show(next === 'light' ? '☀️' : '🌙', next === 'light' ? 'Apple Studio Light' : 'Apple Pro Dark')
      out.push({ kind: 'accent', text: `Switched theme to ${next}.` })
    } else if (name === 'lang') {
      const next = arg.startsWith('h') ? 'he' : arg.startsWith('e') ? 'en' : lang === 'he' ? 'en' : 'he'
      setLang(next)
      toast.show('🌐', next === 'he' ? 'עברית' : 'English')
      out.push({ kind: 'accent', text: `Switched language to ${next}.` })
    } else if (name === 'random') {
      const pick = repos[Math.floor(Math.random() * repos.length)]
      out.push({ kind: 'accent', text: `Launching ${pick.title}…` })
      push(out)
      toast.show('⚡', pick.title)
      setTimeout(() => { onClose(); onOpenRepo(pick) }, 220)
      return
    } else if (name === 'open') {
      if (!arg) {
        out.push({ kind: 'err', text: 'Usage: open <project-name>  (e.g. open antigravity-remote)' })
      } else {
        const match = repos.find((r) => r.name.toLowerCase().includes(arg) || r.title.toLowerCase().includes(arg))
        if (!match) {
          out.push({ kind: 'err', text: `No project matching "${arg}". Try "ls".` })
        } else {
          out.push({ kind: 'accent', text: `Opening ${match.title}…` })
          push(out)
          toast.show('🚀', match.title)
          setTimeout(() => { onClose(); onOpenRepo(match) }, 180)
          return
        }
      }
    } else {
      out.push({ kind: 'err', text: `Command not found: ${name}. Type "help" to see commands.` })
    }

    push(out)
  }

  return createPortal(
    <div dir="ltr">
      <motion.div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          role="dialog" aria-modal="true" aria-label="dor2500 Interactive Terminal"
          className="pointer-events-auto flex h-[min(540px,82dvh)] w-full max-w-[740px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b0c10]/95 text-[#e6edf3] shadow-[0_40px_120px_-20px_rgb(0_0_0/0.95)] backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {/* macOS-style titlebar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <button type="button" onClick={onClose} aria-label="Close terminal" className="size-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ms-2 font-mono text-xs text-white/60">dor2500@studio — zsh</span>
            <span className="ms-auto font-mono text-[10px] text-white/40">ESC to close</span>
          </div>

          {/* Quick-run command chips */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2">
            {QUICK_CMDS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => run(c)}
                className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-white/80 transition-colors hover:border-ember/60 hover:bg-ember/20 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Output stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
            {lines.map((l) => (
              <pre
                key={l.id}
                className={`whitespace-pre-wrap break-words ${
                  l.kind === 'cmd'
                    ? 'mt-2 text-[#6ccbff]'
                    : l.kind === 'accent'
                      ? 'text-[#ff8a5c]'
                      : l.kind === 'err'
                        ? 'text-[#ff5f57]'
                        : 'text-white/80'
                }`}
              >
                {l.text}
              </pre>
            ))}
          </div>

          {/* Input prompt */}
          <form
            onSubmit={(e) => { e.preventDefault(); run(input); setInput('') }}
            className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm"
          >
            <span className="text-[#6fd6b5]">➜</span>
            <span className="text-[#6ccbff]">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type "neofetch", "ls", "open pulse", "theme"…'
              className="min-w-0 flex-1 bg-transparent text-white placeholder:text-white/35 focus:outline-none"
            />
          </form>
        </motion.div>
      </div>
    </div>,
    document.body,
  )
}
