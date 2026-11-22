import { useState } from 'react'
import { useI18n, useFormat } from '../i18n'
import { frameworks, generatedAt, languageShare, LANG_COLOR, profile } from '../data'
import { motion } from 'motion/react'
import { GithubIcon, SignalMark } from './Header'
import { CountUp, EASE, Sweep, TuneIn } from './Motion'

export function Stack() {
  const { t } = useI18n()
  const [hovered, setHovered] = useState<string | null>(null)
  const top = languageShare.slice(0, 8)
  const rest = languageShare.slice(8).reduce((a, b) => a + b.share, 0)
  const bars = rest > 0 ? [...top, { lang: 'Other', share: rest, repos: 0 }] : top

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative isolate border-t border-line">
      <Sweep color="var(--color-pulse)" />
      <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <TuneIn id="stack-title" className="text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.035em]">{t('stackTitle')}</TuneIn>
          <p className="mt-3 max-w-[40ch] text-lg text-muted">{t('stackLead')}</p>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <div className="bento-card rounded-[28px] border border-white/[0.07] p-6 sm:p-7">
            <div className="flex h-3.5 overflow-hidden rounded-full bg-white/[0.05]" role="img"
              aria-label={bars.map((b) => `${b.lang} ${(b.share * 100).toFixed(0)}%`).join(', ')}>
              {/* Segments fill in one after another from the reading edge and glow on hover. */}
              {bars.map((b, i) => {
                const dim = hovered !== null && hovered !== b.lang
                return (
                  <motion.span key={b.lang}
                    onPointerEnter={() => setHovered(b.lang)}
                    onPointerLeave={() => setHovered(null)}
                    style={{ width: `${b.share * 100}%`, background: LANG_COLOR[b.lang] ?? 'var(--color-line-2)', transformOrigin: 'var(--origin)', opacity: dim ? 0.35 : 1 }}
                    className="h-full cursor-pointer border-e-2 border-ink transition-opacity duration-200 [--origin:left] last:border-e-0 rtl:[--origin:right]"
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }} />
                )
              })}
            </div>
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {top.map((l, i) => {
                const on = hovered === l.lang
                return (
                  <motion.li key={l.lang}
                    onPointerEnter={() => setHovered(l.lang)}
                    onPointerLeave={() => setHovered(null)}
                    className={`flex items-center gap-3 border-b border-white/[0.06] py-3 transition-colors duration-200 ${on ? 'text-white' : ''}`}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.45, ease: EASE, delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.05 }}>
                    <span aria-hidden className="size-2.5 rounded-full transition-transform duration-200" style={{ background: LANG_COLOR[l.lang] ?? '#888', transform: on ? 'scale(1.45)' : undefined, boxShadow: on ? `0 0 12px ${LANG_COLOR[l.lang] ?? '#888'}` : undefined }} />
                    <span className="font-medium">{l.lang}</span>
                    <span className="text-sm text-muted">{t('usedIn', { n: l.repos })}</span>
                    <CountUp value={+(l.share * 100).toFixed(1)} decimals={1} suffix="%" className="num ms-auto text-sm" />
                  </motion.li>
                )
              })}
            </ul>
          </div>

          <div className="bento-card rounded-[28px] border border-white/[0.07] p-6 sm:p-7">
            <h3 className="text-base font-semibold">{t('frameworks')}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {frameworks.map(([name, n], i) => (
                <motion.li key={name} className="bento-tile flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                  initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.35, delay: i * 0.025 }}>
                  {name}
                  {n > 1 && <span className="num text-muted">{n}</span>}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useI18n()
  const f = useFormat()
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.08]">
      {/* Soft radial horizon glow rising from the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_100%,color-mix(in_srgb,var(--color-ember)_14%,transparent),transparent)]" />
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[46ch]">
          <SignalMark className="size-7" />
          <p className="mt-5 text-xl leading-snug text-pretty">{t('footerLine')}</p>
          <a href={profile.url} className="bento-tile mt-6 inline-flex items-center gap-3 rounded-full py-2 pe-4 ps-2 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]">
            <img src={`${profile.avatar}&s=64`} alt="" width={32} height={32} className="size-8 rounded-full" />
            <span className="font-medium">github.com/{profile.login}</span>
            <GithubIcon className="size-4 text-muted" />
          </a>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <a href="#top" className="bento-tile inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-white/20 hover:text-fg">
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 13V3m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {t('backToTop')}
          </a>
          <p className="text-sm text-muted">{t('dataAsOf', { d: f.date(generatedAt) })}</p>
        </div>
      </div>
      <div aria-hidden className="smpte-bar h-[3px] w-full opacity-80" />
    </footer>
  )
}
