import { motion } from 'motion/react'
import { useI18n } from '../i18n'
import { platformCounts, profile, stats, type Repo } from '../data'
import { PLATFORM_LABEL, type Platform } from '../data/curated'
import { GithubIcon } from './Header'
import { CountUp, EASE, Magnetic } from './Motion'
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
  const { t, pick, lang } = useI18n()
  const top = platformCounts.slice(0, 10)
  const max = top[0][1]

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }

  return (
    <section id="top" aria-labelledby="hero-title" onPointerMove={onPointerMove} className="relative isolate">
      {/* Clean Apple-style studio stage light + subtle cursor aura */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] opacity-70 [mask-image:radial-gradient(ellipse_70%_58%_at_50%_18%,#000,transparent)]" />
      <div aria-hidden className="cursor-aura pointer-events-none absolute inset-x-0 top-0 -z-15 h-[760px]" />
      <div aria-hidden className="aurora-orb pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[min(920px,95vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-ember)_15%,transparent),color-mix(in_srgb,var(--color-tv)_10%,transparent)_55%,transparent)] blur-3xl" />

      {/* Centered monumental Apple product-launch Hero */}
      <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-10 text-center sm:px-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="bento-tile mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-fg/85 backdrop-blur-xl"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-pulse" />
          </span>
          {t('heroStatus')}
        </motion.div>

        <motion.h1
          id="hero-title"
          key={lang}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="mx-auto max-w-[18ch] text-[clamp(2.8rem,7vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-balance"
        >
          {lang === 'he' ? (
            <>
              <span className="text-metallic">אפליקציות שמגיעות </span>
              <span className="text-ember-glow">לכל מסך בבית.</span>
            </>
          ) : (
            <>
              <span className="text-metallic">Apps built for </span>
              <span className="text-ember-glow">every screen in the house.</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.14 }}
          className="mx-auto mt-6 max-w-[60ch] text-lg leading-relaxed text-muted text-pretty sm:text-xl"
        >
          {t('heroBio')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.24 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <a href="#flagships" className="sheen inline-block rounded-full bg-ember px-6 py-3 font-semibold text-white shadow-[0_10px_34px_-6px_color-mix(in_srgb,var(--color-ember)_75%,transparent)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-ember-2 active:scale-[0.97]">
              {t('ctaFlagships')}
            </a>
          </Magnetic>
          <Magnetic strength={0.18}>
            <a href="#projects" className="bento-tile inline-block rounded-full px-6 py-3 font-medium transition-[background-color,border-color,transform] duration-150 hover:border-[var(--hairline-strong)] hover:bg-[var(--chip-hover)] active:scale-[0.97]">
              {t('ctaAll')}
            </a>
          </Magnetic>
          <a href={profile.url} className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-medium text-muted transition-colors duration-150 hover:text-fg">
            <GithubIcon /> {t('ctaGithub')}
          </a>
        </motion.div>

        {/* Centered Bento Telemetry Bar */}
        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.32 }}
          className="mx-auto mt-10 grid max-w-[540px] grid-cols-3 gap-3"
        >
          {[
            { n: stats.repos, label: t('statProjects'), color: 'var(--color-ember-2)' },
            { n: stats.releases, label: t('statReleases'), color: 'var(--color-tv)' },
            { n: platformCounts.length, label: t('statPlatforms'), color: 'var(--color-pulse)' },
          ].map((m) => (
            <div key={m.label} className="bento-tile rounded-2xl px-4 py-3.5 text-center">
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <CountUp value={m.n} className="num block text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: m.color }} />
                <span className="mt-0.5 block text-xs text-muted">{m.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Full-width Cinematic Centered OLED TV Centerpiece */}
        <div className="mx-auto mt-12 max-w-[980px] text-start md:mt-16">
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
                className="bento-tile group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-0.5 hover:border-ember/40 hover:bg-[var(--chip-hover)] hover:text-ember"
              >
                <span className="flex-1 truncate text-[14px] font-medium">{pick(PLATFORM_LABEL[p])}</span>
                <SignalBars level={Math.ceil(Math.sqrt(n / max) * 5)} delay={0.35 + i * 0.05} />
                <span className="num w-5 text-end text-sm text-muted group-hover:text-ember">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.aside>
    </section>
  )
}
