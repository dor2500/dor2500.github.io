import { Fragment } from 'react'
import { motion } from 'motion/react'
import { useI18n, useFormat } from '../i18n'
import { platformCounts, profile, stats, type Repo } from '../data'
import { PLATFORM_LABEL, type Platform } from '../data/curated'
import { GithubIcon } from './Header'
import { EASE } from './Motion'
import { ChannelTv } from './ChannelTv'
import { Ticker } from './Ticker'

export function SignalBars({ level, delay = 0, max = 5 }: { level: number; delay?: number; max?: number }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" dir="ltr" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <motion.span
          key={i}
          className="relative w-[5px] overflow-hidden rounded-[1.5px] bg-s3"
          style={{ height: `${(i + 1) * 20}%`, transformOrigin: 'bottom' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: EASE, delay: delay + i * 0.05 }}
        >
          {/* Each lit bar flickers on in turn, like a phone finding signal. */}
          {i < level && (
            <motion.span
              className="absolute inset-0 bg-ember"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 1, 0.35, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, times: [0, 0.3, 0.55, 1], delay: delay + 0.35 + i * 0.09 }}
            />
          )}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero({ onPlatform, onOpen }: { onPlatform: (p: Platform) => void; onOpen: (r: Repo) => void }) {
  const { t, pick } = useI18n()
  const f = useFormat()
  const top = platformCounts.slice(0, 10)
  const max = top[0][1]

  return (
    <section id="top" aria-labelledby="hero-title">
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:px-8 md:pt-20 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-5">
        <h1
          id="hero-title"
          key={t('heroTitle')}
          className="max-w-[14ch] text-[clamp(2.5rem,5.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-balance"
        >
          {/* Words rise out of a mask one after another, so the line reads itself in. */}
          {t('heroTitle').split(' ').map((w, i, all) => (
            <Fragment key={i}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.055 }}
              >
                {w}
              </motion.span>
            </span>
            {i < all.length - 1 && ' '}
            </Fragment>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}>
          <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-muted text-pretty">{t('heroBio')}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#flagships" className="rounded-full bg-ember px-5 py-3 font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ember-2 active:scale-[0.97]">
              {t('ctaFlagships')}
            </a>
            <a href="#projects" className="rounded-full border border-line-2 px-5 py-3 font-medium transition-[background-color,transform] duration-150 hover:bg-s1 active:scale-[0.97]">
              {t('ctaAll')}
            </a>
            <a href={profile.url} className="flex items-center gap-2 rounded-full px-4 py-3 font-medium text-muted transition-colors duration-150 hover:text-fg">
              <GithubIcon /> {t('ctaGithub')}
            </a>
          </div>
          <p className="mt-10 max-w-[60ch] text-sm text-muted">
            {t('statsLine', { repos: stats.repos, releases: stats.releases, ago: f.ago(stats.latestRelease) })}
          </p>
        </motion.div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <ChannelTv onOpen={onOpen} />
      </div>
    </div>

    <Ticker />

      <motion.aside
        aria-labelledby="reception-title"
        className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="reception-title" className="text-base font-semibold">{t('receptionTitle')}</h2>
          <p className="text-sm text-muted">{t('receptionHint')}</p>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
          {top.map(([p, n], i) => (
            <li key={p} className="border-b border-line">
              <button
                type="button"
                onClick={() => onPlatform(p)}
                className="group flex w-full items-center gap-3 py-3 text-start transition-colors duration-150 hover:text-ember-2"
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
