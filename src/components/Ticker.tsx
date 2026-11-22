import { useI18n, useFormat } from '../i18n'
import { repos } from '../data'

// Every project with a release, newest first: the crawl along the bottom of a news channel.
const ITEMS = repos.filter((r) => r.release).sort((a, b) => b.release!.date.localeCompare(a.release!.date)).slice(0, 14)

export function Ticker() {
  const { t } = useI18n()
  const f = useFormat()
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((r) => (
        <li key={r.name} className="flex items-center">
          <a href={r.release!.url} tabIndex={hidden ? -1 : undefined} className="flex items-baseline gap-2 whitespace-nowrap px-5 py-3 transition-colors hover:text-ember-2">
            <span className="font-semibold">{r.title}</span>
            <span className="font-mono text-[13px] text-ember-2" dir="ltr">{r.release!.tag}</span>
            <span className="text-sm text-muted">{f.ago(r.release!.date)}</span>
          </a>
          <span aria-hidden className="size-1.5 rotate-45 bg-line-2" />
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label={t('tickerLabel')} className="ticker relative flex items-stretch overflow-hidden border-y border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">
      <div className="z-10 flex shrink-0 items-center gap-2 bg-gradient-to-r from-ember to-ember-2 px-4 font-osd text-xl leading-none text-ink shadow-[8px_0_24px_-6px_color-mix(in_srgb,var(--color-ember)_55%,transparent)]">
        <span className="size-2 animate-pulse rounded-full bg-ink" />
        {t('tickerLabel')}
      </div>
      <div className="ticker-mask relative min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  )
}
