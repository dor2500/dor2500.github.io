import type { ReactNode } from 'react'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export function TvFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('relative', className)}>
      <div className="rounded-[14px] bg-[#05070a] p-[0.55%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_var(--color-line-2)]">
        <div className="scanlines relative aspect-video overflow-hidden rounded-[8px] bg-black">{children}</div>
      </div>
      {/* stand */}
      <div aria-hidden className="mx-auto h-3 w-[14%] bg-gradient-to-b from-[#1a1f26] to-[#0d1014]" />
      <div aria-hidden className="mx-auto h-1.5 w-[34%] rounded-full bg-[#1a1f26]" />
    </div>
  )
}

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-[2.1rem] bg-[#05070a] p-[3.2%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.85),0_0_0_1px_var(--color-line-2)]', className)}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.7rem] bg-black">
        {children}
        <div aria-hidden className="absolute left-1/2 top-[1.6%] size-[3.4%] min-h-2 min-w-2 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
      </div>
    </div>
  )
}

export function WatchFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('aspect-square rounded-full bg-[#05070a] p-[6%] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.9),0_0_0_1px_var(--color-line-2)]', className)}>
      <div className="size-full overflow-hidden rounded-full bg-black">{children}</div>
    </div>
  )
}

export function WindowFrame({ children, title, className }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <div className={cx('flex flex-col overflow-hidden rounded-lg border border-line-2 bg-[#0c0f13]', className)}>
      <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-line px-2.5" dir="ltr">
        <span className="size-2 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2 rounded-full bg-[#febc2e]/80" />
        <span className="size-2 rounded-full bg-[#28c840]/80" />
        {title && <span className="ms-2 truncate font-mono text-[10px] text-muted">{title}</span>}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}
