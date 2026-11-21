import { motion } from 'motion/react'
import { useI18n, useFormat } from '../i18n'
import { platformCounts, profile, stats } from '../data'
import { PLATFORM_LABEL, type Platform } from '../data/curated'
import { GithubIcon } from './Header'

const EASE = [0.22, 1, 0.36, 1] as const

export function SignalBars({ level, delay = 0, max = 5 }: { level: number; delay?: number; max?: number }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" dir="ltr" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <motion.span
          key={i}
          className={`w-[5px] rounded-[1.5px] ${i < level ? 'bg-ember' : 'bg-s3'}`}
          style={{ height: `${(i + 1) * 20}%`, transformOrigin: 'bottom' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.35, ease: EASE, delay: delay + i * 0.05 }}
        />
      ))}
    </span>
  )
}

export function Hero({ onPlatform }: { onPlatform: (p: Platform) => void }) {
  const { t, pick } = useI18n()
  const f = useFormat()
  const top = platformCounts.slice(0, 10)
  const max = top[0][1]

  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto grid max-w-[1200px] gap-14 px-5 pb-24 pt-16 sm:px-8 md:pt-24 lg:grid-cols-12 lg:gap-8 lg:pb-32">
      <div className="lg:col-span-7">
        <motion.h1
          id="hero-title"
          className="max-w-[14ch] text-[clamp(2.6rem,6.4vw,5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-balance"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {t('heroTitle')}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-muted text-pretty">{t('heroBio')}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#flagships" className="rounded-lg bg-ember px-5 py-3 font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ember-2 active:scale-[0.97]">
              {t('ctaFlagships')}
            </a>
            <a href="#projects" className="rounded-lg border border-line-2 px-5 py-3 font-medium transition-[background-color,transform] duration-150 hover:bg-s1 active:scale-[0.97]">
              {t('ctaAll')}
            </a>
            <a href={profile.url} className="flex items-center gap-2 rounded-lg px-4 py-3 font-medium text-muted transition-colors duration-150 hover:text-fg">
              <GithubIcon /> {t('ctaGithub')}
            </a>
          </div>
          <p className="mt-10 max-w-[60ch] text-sm text-muted">
            {t('statsLine', { repos: stats.repos, releases: stats.releases, ago: f.ago(stats.latestRelease) })}
          </p>
        </motion.div>
      </div>

      <motion.aside
        aria-labelledby="reception-title"
        className="self-end rounded-2xl border border-line bg-s1 p-6 lg:col-span-5 lg:ms-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
      >
        <h2 id="reception-title" className="text-base font-semibold">{t('receptionTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('receptionHint')}</p>
        <ul className="mt-5 divide-y divide-line">
          {top.map(([p, n], i) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPlatform(p)}
                className="group flex w-full items-center gap-3 py-2.5 text-start transition-colors duration-150 hover:text-ember-2"
              >
                <span className="flex-1 text-[15px]">{pick(PLATFORM_LABEL[p])}</span>
                <SignalBars level={Math.ceil(Math.sqrt(n / max) * 5)} delay={0.45 + i * 0.06} />
                <span className="num w-6 text-end text-sm text-muted group-hover:text-ember-2">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.aside>
    </section>
  )
}
