import { Fragment } from 'react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n'
import { platformCounts, profile, stats, type Repo } from '../data'
import { PLATFORM_LABEL, type Platform } from '../data/curated'
import { GithubIcon } from './Header'
import { CountUp, EASE } from './Motion'
import { ChannelTv } from './ChannelTv'
import { Ticker } from './Ticker'

export function SignalBars({ level, delay = 0, max = 5 }: { level: number; delay?: number; max?: number }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" dir="ltr" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <motion.span
          key={i}
          className="sig-bar relative w-[5px] overflow-hidden rounded-[1.5px] bg-s3"
          style={{ height: `${(i + 1) * 20}%`, transformOrigin: 'bottom', '--d': `${i * 55}ms` } as React.CSSProperties}
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
  const top = platformCounts.slice(0, 10)
  const max = top[0][1]
  const titleWords = t('heroTitle').split(' ')
  const accentStart = Math.max(0, titleWords.length - 3)

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }

  return (
    <section id="top" aria-labelledby="hero-title" onPointerMove={onPointerMove} className="relative isolate">
      {/* Living ambient backdrop: faint dot grid + pointer aura + two slowly breathing aurora orbs. */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[820px] [mask-image:radial-gradient(ellipse_78%_64%_at_50%_22%,#000,transparent)]" />
      <div aria-hidden className="cursor-aura pointer-events-none absolute inset-x-0 top-0 -z-15 h-[820px] transition-opacity duration-500" />
      <div aria-hidden className="aurora-orb pointer-events-none absolute -top-24 start-[6%] -z-10 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-ember)_16%,transparent),transparent)] blur-3xl" />
      <div aria-hidden className="aurora-orb-2 pointer-events-none absolute top-24 end-[4%] -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-tv)_14%,transparent),transparent)] blur-3xl" />

    <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-10 sm:px-8 md:pt-16 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-5">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-fg/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] backdrop-blur-xl"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-phosphor opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-phosphor" />
          </span>
          {t('heroStatus')}
        </motion.div>
        <h1
          id="hero-title"
          key={t('heroTitle')}
          className="max-w-[14ch] text-[clamp(2.6rem,5.6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-balance"
        >
          {/* Words rise out of a mask one after another, so the line reads itself in. */}
          {titleWords.map((w, i, all) => (
            <Fragment key={i}>
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
              <motion.span
                className={`inline-block ${i >= accentStart ? 'text-ember-glow' : 'text-metallic'}`}
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
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#flagships" className="sheen rounded-full bg-ember px-5 py-3 font-semibold text-ink shadow-[0_8px_32px_-6px_color-mix(in_srgb,var(--color-ember)_75%,transparent)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-ember-2 hover:shadow-[0_14px_40px_-4px_color-mix(in_srgb,var(--color-ember)_85%,transparent)] active:scale-[0.97]">
              {t('ctaFlagships')}
            </a>
            <a href="#projects" className="bento-tile rounded-full px-5 py-3 font-medium transition-[background-color,border-color,transform] duration-150 hover:border-white/25 hover:bg-white/[0.08] active:scale-[0.97]">
              {t('ctaAll')}
            </a>
            <a href={profile.url} className="flex items-center gap-2 rounded-full px-4 py-3 font-medium text-muted transition-colors duration-150 hover:text-fg">
              <GithubIcon /> {t('ctaGithub')}
            </a>
          </div>
          {/* Glass bento telemetry strip */}
          <dl className="mt-9 grid max-w-[460px] grid-cols-3 gap-2.5">
            {[
              { n: stats.repos, label: t('statProjects'), color: 'var(--color-ember-2)' },
              { n: stats.releases, label: t('statReleases'), color: 'var(--color-tv)' },
              { n: platformCounts.length, label: t('statPlatforms'), color: 'var(--color-pulse)' },
            ].map((m) => (
              <div key={m.label} className="bento-tile rounded-2xl px-3.5 py-3">
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <CountUp value={m.n} className="num block text-2xl font-bold tracking-tight" style={{ color: m.color }} />
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>
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
        <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {top.map(([p, n], i) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPlatform(p)}
                className="bento-tile group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-0.5 hover:border-ember/40 hover:bg-white/[0.06] hover:text-ember-2"
              >
                <span className="flex-1 truncate text-[14px] font-medium">{pick(PLATFORM_LABEL[p])}</span>
                <SignalBars level={Math.ceil(Math.sqrt(n / max) * 5)} delay={0.35 + i * 0.05} />
                <span className="num w-5 text-end text-sm text-muted group-hover:text-ember-2">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.aside>
    </section>
  )
}
