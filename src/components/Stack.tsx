import { useI18n, useFormat } from '../i18n'
import { frameworks, generatedAt, languageShare, LANG_COLOR, profile } from '../data'
import { GithubIcon, SignalMark } from './Header'

export function Stack() {
  const { t } = useI18n()
  const top = languageShare.slice(0, 8)
  const rest = languageShare.slice(8).reduce((a, b) => a + b.share, 0)
  const bars = rest > 0 ? [...top, { lang: 'Other', share: rest, repos: 0 }] : top

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="stack-title" className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-[-0.03em]">{t('stackTitle')}</h2>
          <p className="mt-3 max-w-[40ch] text-lg text-muted">{t('stackLead')}</p>
        </div>

        <div className="lg:col-span-8">
          <div className="flex h-3 overflow-hidden rounded-full" role="img"
            aria-label={bars.map((b) => `${b.lang} ${(b.share * 100).toFixed(0)}%`).join(', ')}>
            {bars.map((b) => (
              <span key={b.lang} style={{ width: `${b.share * 100}%`, background: LANG_COLOR[b.lang] ?? 'var(--color-line-2)' }} className="h-full border-e-2 border-ink last:border-e-0" />
            ))}
          </div>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {top.map((l) => (
              <li key={l.lang} className="flex items-center gap-3 border-b border-line py-3">
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: LANG_COLOR[l.lang] ?? '#888' }} />
                <span className="font-medium">{l.lang}</span>
                <span className="text-sm text-muted">{t('usedIn', { n: l.repos })}</span>
                <span className="num ms-auto text-sm">{(l.share * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-14 text-base font-semibold">{t('frameworks')}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {frameworks.map(([name, n]) => (
              <li key={name} className="flex items-center gap-2 rounded-md border border-line bg-s1 px-2.5 py-1.5 text-sm">
                {name}
                {n > 1 && <span className="num text-muted">{n}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useI18n()
  const f = useFormat()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[46ch]">
          <SignalMark className="size-7" />
          <p className="mt-5 text-xl leading-snug text-pretty">{t('footerLine')}</p>
          <a href={profile.url} className="mt-6 inline-flex items-center gap-3 rounded-lg border border-line-2 py-2 pe-4 ps-2 transition-colors hover:bg-s1">
            <img src={`${profile.avatar}&s=64`} alt="" width={32} height={32} className="size-8 rounded-md" />
            <span className="font-medium">github.com/{profile.login}</span>
            <GithubIcon className="size-4 text-muted" />
          </a>
        </div>
        <p className="text-sm text-muted">{t('dataAsOf', { d: f.date(generatedAt) })}</p>
      </div>
    </footer>
  )
}
