import { useI18n, useFormat } from '../i18n'
import { frameworks, repos } from '../data'

// Every project with a release, newest first: the crawl along the bottom of a news channel.
const ITEMS = repos.filter((r) => r.release).sort((a, b) => b.release!.date.localeCompare(a.release!.date)).slice(0, 14)
const TECHS = frameworks.slice(0, 18).map(([name]) => name)

export function Ticker() {
  const { t } = useI18n()
  const f = useFormat()
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((r) => (
        <li key={r.name} className="flex items-center">
          <a href={r.release!.url} tabIndex={hidden ? -1 : undefined} className="flex items-baseline gap-2 whitespace-nowrap px-5 py-2.5 transition-colors hover:text-ember">
            <span className="font-semibold">{r.title}</span>
            <span className="rounded-md bg-ember/15 px-1.5 py-0.5 font-mono text-[12px] text-ember" dir="ltr">{r.release!.tag}</span>
            <span className="text-xs text-muted">{f.ago(r.release!.date)}</span>
          </a>
          <span aria-hidden className="size-1.5 rotate-45 bg-line-2" />
        </li>
      ))}
    </ul>
  )
  const techRow = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-3 px-2 py-2" aria-hidden={hidden || undefined}>
      {TECHS.map((name) => (
        <li key={name} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--hairline)] bg-[var(--chip-bg)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-tv/80" />
          {name}
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label={t('tickerLabel')} className="ticker relative overflow-hidden border-y border-[var(--hairline)] bg-[var(--chip-bg)] backdrop-blur-xl">
      <div className="flex items-stretch">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-gradient-to-r from-ember to-ember-2 px-4 font-osd text-xl leading-none text-white shadow-[8px_0_24px_-6px_color-mix(in_srgb,var(--color-ember)_55%,transparent)]">
          <span className="size-2 animate-pulse rounded-full bg-white" />
          {t('tickerLabel')}
        </div>
        <div className="ticker-mask relative min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
      {/* Reverse-direction kinetic tech marquee */}
      <div className="ticker-mask border-t border-[var(--hairline)] opacity-85">
        <div className="ticker-track-rev flex w-max">
          {techRow(false)}
          {techRow(true)}
        </div>
      </div>
    </section>
  )
}
