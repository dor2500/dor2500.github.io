import type { Mockup as M } from '../data/curated'
import { useI18n } from '../i18n'
import { PhoneFrame, WindowFrame } from './Devices'

/** Drawn previews for projects that have no screenshots yet. Purely illustrative. */
export function Mockup({ m, large }: { m: M; large?: boolean }) {
  const { t } = useI18n()
  return (
    <div role="img" aria-label={t('conceptPreview')} className="absolute inset-0 flex items-center justify-center p-[6%]">
      {render(m, large)}
    </div>
  )
}

function render(m: M, large?: boolean) {
  switch (m.kind) {
    case 'terminal':
      return (
        <WindowFrame title={m.title} className="h-full w-full max-w-[560px]">
          <pre dir="ltr" className={`h-full overflow-hidden p-3 font-mono leading-relaxed text-[#c9d1d9] ${large ? 'text-[13px]' : 'text-[10.5px]'}`}>
            {m.lines.map((l, i) => (
              <div key={i} className={l.startsWith('>') ? 'text-cyan' : i === m.lines.length - 1 ? 'text-pulse' : ''}>{l}</div>
            ))}
            <span className="inline-block h-3 w-1.5 translate-y-0.5 bg-fg/70 motion-safe:animate-pulse" />
          </pre>
        </WindowFrame>
      )
    case 'chat':
      return <Chat m={m} />
    case 'phone-browser':
      return (
        <PhoneFrame className="h-full w-auto">
          <div className="flex h-full flex-col bg-[#101318] p-[8%] pt-[14%]">
            <div className="mb-[10%] flex items-center gap-1 rounded-full bg-[#1c2129] px-2 py-1.5 text-[8px] text-muted" dir="ltr">
              <span className="size-1.5 rounded-full bg-pulse" /> {m.url}
            </div>
            <div className="mx-auto mb-[8%] size-8 rounded-full bg-gradient-to-br from-[#7b6cff] to-[#3ec5ff]" />
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-square rounded-md bg-[#1c2129]" />)}
            </div>
            <div className="mt-auto flex justify-between rounded-full bg-[#1c2129] px-3 py-1.5">
              {Array.from({ length: 4 }, (_, i) => <span key={i} className="size-1.5 rounded-full bg-muted/60" />)}
            </div>
          </div>
        </PhoneFrame>
      )
    case 'phone-signal':
      return (
        <PhoneFrame className="h-full w-auto">
          <div className="relative flex h-full flex-col items-center justify-center bg-[#0d1512]">
            {[1, 0.72, 0.46].map((s, i) => (
              <span key={i} className="absolute aspect-square rounded-full border border-pulse/30" style={{ width: `${s * 92}%` }} />
            ))}
            <span className="size-2.5 rounded-full bg-pulse shadow-[0_0_14px_var(--color-pulse)]" />
            <div className="absolute bottom-[10%] flex items-end gap-0.5" aria-hidden>
              {[3, 5, 7, 9].map((h) => <span key={h} className="w-1 rounded-sm bg-pulse" style={{ height: h * 1.4 }} />)}
              <span className="ms-1.5 font-mono text-[9px] text-pulse">-61 dBm</span>
            </div>
          </div>
        </PhoneFrame>
      )
    case 'dashboard':
      return (
        <WindowFrame title={m.title} className="h-full w-full max-w-[560px]">
          <div className="grid h-full grid-cols-3 gap-2 p-3" dir="ltr">
            {[['Queries', '48,211'], ['Blocked', '31.4%'], ['Lists', '12']].map(([k, v]) => (
              <div key={k} className="rounded-md border border-line bg-s1 p-2">
                <div className="text-[9px] text-muted">{k}</div>
                <div className="num text-sm font-semibold">{v}</div>
              </div>
            ))}
            <div className="col-span-3 flex items-end gap-[3%] rounded-md border border-line bg-s1 p-2">
              {[40, 62, 35, 80, 55, 90, 70, 48, 66, 84, 58, 74].map((h, i) => (
                <span key={i} className="flex-1 rounded-sm bg-cyan/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </WindowFrame>
      )
    case 'player':
      return (
        <WindowFrame title={m.title} className="h-full w-full max-w-[560px]">
          <div className="flex h-full gap-3 p-3" dir="ltr">
            <div className="aspect-square h-full max-h-28 rounded-md bg-gradient-to-br from-[#ff4e6a] via-[#a43cff] to-[#2a2f6b]" />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
              {[90, 70, 80, 60].map((w, i) => <span key={i} className={`h-1.5 rounded-full ${i ? 'bg-s3' : 'bg-fg/70'}`} style={{ width: `${w}%` }} />)}
              <div className="mt-2 h-1 rounded-full bg-s3"><div className="h-full w-2/5 rounded-full bg-ember" /></div>
            </div>
          </div>
        </WindowFrame>
      )
  }
}

function Chat({ m }: { m: Extract<M, { kind: 'chat' }> }) {
  const { pick } = useI18n()
  const wa = m.app === 'whatsapp'
  return (
    <PhoneFrame className="h-full w-auto">
      <div className={`flex h-full flex-col ${wa ? 'bg-[#0b141a]' : 'bg-[#0e1621]'}`}>
        <div className={`flex items-center gap-1.5 px-2.5 pb-1.5 pt-[16%] ${wa ? 'bg-[#1f2c34]' : 'bg-[#17212b]'}`}>
          <span className={`size-4 rounded-full ${wa ? 'bg-[#25d366]' : 'bg-[#2aabee]'}`} />
          <span className="text-[9px] font-semibold">{m.title}</span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-1.5 p-2" dir="auto">
          {m.msgs.map((x, i) => (
            <div key={i} dir="auto" className={`max-w-[85%] rounded-lg px-2 py-1 text-[8.5px] leading-snug ${x.me ? `self-end ${wa ? 'bg-[#005c4b]' : 'bg-[#2b5278]'}` : `self-start ${wa ? 'bg-[#202c33]' : 'bg-[#182533]'}`}`}>
              {pick(x.text)}
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}
