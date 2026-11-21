import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useI18n, useFormat, type L10n } from '../i18n'
import { bySlug, type Repo } from '../data'
import { PhoneFrame, TvFrame, WatchFrame } from './Devices'
import { GithubIcon } from './Header'
import { CountUp, EASE, slide, TuneIn, useDirection } from './Motion'

type Copy = {
  lead: L10n
  figures: { n: string; label: L10n }[]
  features: L10n[]
  groups: { label: L10n; items: L10n[] }[]
}

const TV: Copy = {
  lead: {
    en: 'Live Israeli TV and radio for every screen in the house, plus world channels with live Hebrew dubbing. Every channel has a backup source and switches over by itself when one goes down.',
    he: 'טלוויזיה ורדיו ישראליים בשידור חי לכל מסך בבית, וגם ערוצים מכל העולם עם דיבוב חי לעברית. לכל ערוץ יש מקור גיבוי, והמעבר אליו קורה לבד כשהמקור הראשי נופל.',
  },
  figures: [
    { n: '434', label: { en: 'channels and stations', he: 'ערוצים ותחנות' } },
    { n: '136', label: { en: 'radio stations', he: 'תחנות רדיו' } },
    { n: '158', label: { en: 'series on demand', he: 'סדרות לפי דרישה' } },
  ],
  features: [
    { en: 'A TV interface in the style of Apple TV+, with the live channel playing behind the guide', he: 'ממשק טלוויזיה בסגנון Apple TV+, עם הערוץ החי ברקע של המדריך' },
    { en: 'A native Android app in Jetpack Compose with profiles, Material 3 Expressive and light or dark themes', he: 'אפליקציית אנדרואיד מקורית ב-Jetpack Compose עם פרופילים, Material 3 Expressive ומצב בהיר או כהה' },
    { en: 'Two sources per channel with automatic failover, and a Cloudflare relay for HTTP streams in the browser', he: 'שני מקורות לכל ערוץ עם מעבר אוטומטי, ושרת ממסר ב-Cloudflare לשידורי HTTP בדפדפן' },
    { en: 'A one-line Windows install that checks the SHA-256 of the download, and a HACS integration for Home Assistant', he: 'התקנה בשורה אחת ב-Windows שבודקת את ה-SHA-256 של ההורדה, ושילוב HACS ל-Home Assistant' },
  ],
  groups: [
    { label: { en: 'TVs', he: 'טלוויזיות' }, items: [{ en: 'LG webOS', he: 'LG webOS' }, { en: 'Samsung Tizen', he: 'סמסונג Tizen' }, { en: 'Android TV, Google TV, Fire TV', he: 'Android TV,‏ Google TV,‏ Fire TV' }] },
    { label: { en: 'Phones and watches', he: 'טלפונים ושעונים' }, items: [{ en: 'Android', he: 'אנדרואיד' }, { en: 'Wear OS', he: 'Wear OS' }, { en: 'iPhone, as a web app', he: 'אייפון, כאפליקציית רשת' }] },
    { label: { en: 'Computers', he: 'מחשבים' }, items: [{ en: 'Windows', he: 'Windows' }, { en: 'macOS', he: 'macOS' }, { en: 'Linux and Raspberry Pi', he: 'לינוקס ו-Raspberry Pi' }] },
    { label: { en: 'Media centers', he: 'מרכזי מדיה' }, items: [{ en: 'Stremio', he: 'Stremio' }, { en: 'Kodi', he: 'Kodi' }, { en: 'Home Assistant', he: 'Home Assistant' }, { en: 'Any IPTV player (M3U)', he: 'כל נגן IPTV ‏(M3U)' }] },
  ],
}

const PULSE: Copy = {
  lead: {
    en: 'An internet speed test for Android, built with Jetpack Compose and Material 3 Expressive. It measures ping, jitter, download, upload and bufferbloat against the network you pick, then keeps going with real diagnostics.',
    he: 'בדיקת מהירות אינטרנט לאנדרואיד, ב-Jetpack Compose וב-Material 3 Expressive. היא מודדת פינג, ג׳יטר, הורדה, העלאה ו-Bufferbloat מול רשת השרתים שבוחרים, וממשיכה משם לאבחון רשת אמיתי.',
  },
  figures: [
    { n: '5', label: { en: 'test networks', he: 'רשתות בדיקה' } },
    { n: '8', label: { en: 'network tools', he: 'כלי רשת' } },
    { n: '34', label: { en: 'services on the status board', he: 'שירותים בלוח הסטטוס' } },
  ],
  features: [
    { en: 'A gauge that morphs and spins faster with the live speed, then settles into a capsule with the result', he: 'מד שמשנה צורה ומסתובב מהר יותר עם המהירות החיה, ואז מתכנס לקפסולה עם התוצאה' },
    { en: 'Tests against Cloudflare, Ookla, FAST, LibreSpeed or M-Lab, with a server picker like Speedtest', he: 'בדיקה מול Cloudflare,‏ Ookla,‏ FAST,‏ LibreSpeed או M-Lab, עם בחירת שרת כמו ב-Speedtest' },
    { en: 'ICMP, TCP and DNS ping, a scan of every device on your Wi-Fi, traceroute and a DNS benchmark', he: 'פינג ICMP,‏ TCP ו-DNS, סריקה של כל המכשירים ב-Wi-Fi, ‏traceroute ומבחן השוואת DNS' },
    { en: 'History with trends, share links that keep the data inside the link, and full Hebrew with RTL', he: 'היסטוריה עם מגמות, קישורי שיתוף שהנתונים נשמרים בתוכם, ועברית מלאה מימין לשמאל' },
  ],
  groups: [
    { label: { en: 'Phones and TV boxes', he: 'טלפונים וסטרימרים' }, items: [{ en: 'Android', he: 'אנדרואיד' }, { en: 'Android TV, Fire TV', he: 'Android TV,‏ Fire TV' }] },
    { label: { en: 'Smart TVs', he: 'טלוויזיות חכמות' }, items: [{ en: 'LG webOS', he: 'LG webOS' }, { en: 'Samsung Tizen', he: 'סמסונג Tizen' }] },
    { label: { en: 'Computers', he: 'מחשבים' }, items: [{ en: 'Windows', he: 'Windows' }, { en: 'macOS', he: 'macOS' }, { en: 'Linux', he: 'לינוקס' }, { en: 'Command line', he: 'שורת פקודה' }] },
    { label: { en: 'Media and web', he: 'מדיה ורשת' }, items: [{ en: 'Stremio', he: 'Stremio' }, { en: 'Kodi', he: 'Kodi' }, { en: 'Any browser', he: 'כל דפדפן' }] },
  ],
}

const TV_SCREENS: L10n[] = [
  { en: 'Home', he: 'בית' }, { en: 'Channel preview', he: 'תצוגה מקדימה' }, { en: 'Guide', he: 'מדריך' },
  { en: 'Series', he: 'סדרות' }, { en: 'Episodes', he: 'פרקים' }, { en: 'Settings', he: 'הגדרות' },
]
const PULSE_SCREENS: [number, L10n][] = [
  [0, { en: 'Start', he: 'התחלה' }], [1, { en: 'Testing', he: 'בדיקה' }], [2, { en: 'Result', he: 'תוצאה' }],
  [3, { en: 'History', he: 'היסטוריה' }], [5, { en: 'Ping', he: 'פינג' }], [11, { en: 'Network scan', he: 'סריקת רשת' }],
  [6, { en: 'DNS benchmark', he: 'השוואת DNS' }], [10, { en: 'Service status', he: 'סטטוס שירותים' }], [8, { en: 'Hebrew', he: 'עברית' }],
]

export function Flagships() {
  const { t } = useI18n()
  return (
    <section id="flagships" aria-labelledby="flagships-title" className="relative isolate border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 md:pt-28">
        <TuneIn id="flagships-title" className="text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.035em]">{t('flagshipsTitle')}</TuneIn>
        <p className="mt-3 max-w-[56ch] text-lg text-muted">{t('flagshipsLead')}</p>
      </div>
      <TvIntro repo={bySlug['israel-tv-plus']} />
      <TvPlus repo={bySlug['israel-tv-plus']} />
      <Pulse repo={bySlug['pulse-speed']} />
    </section>
  )
}

/**
 * A pinned scene: the TV+ demo starts as a small rounded card under a big title,
 * and grows to fill the screen as you scroll, the way product pages open a reveal.
 */
function TvIntro({ repo }: { repo: Repo }) {
  const { pick } = useI18n()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scale = useTransform(p, [0, 0.6], [0.52, 1])
  const radius = useTransform(p, [0, 0.6], [44, 0])
  const shift = useTransform(p, [0, 0.6], ['16vh', '0vh'])
  const titleOpacity = useTransform(p, [0, 0.22], [1, 0])
  const titleY = useTransform(p, [0, 0.22], [0, -80])
  const capOpacity = useTransform(p, [0.62, 0.78], [0, 1])
  const capY = useTransform(p, [0.62, 0.78], [30, 0])
  const title = (
    <div className="px-5 text-center">
      <p className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.95] tracking-[-0.05em]">{repo.title}</p>
      <p className="mt-4 text-[clamp(1.25rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-muted">
        {pick({ en: 'Every channel. Every screen.', he: 'כל ערוץ. כל מסך.' })}
      </p>
    </div>
  )
  const caption = pick({
    en: '434 channels and stations, live on the TV, the phone and the watch.',
    he: '434 ערוצים ותחנות, בשידור חי בטלוויזיה, בטלפון ובשעון.',
  })
  const video = (
    <video className="size-full object-cover" src={repo.videos[0]} poster={repo.images[1].src} autoPlay={!reduce} muted loop playsInline
      aria-label={pick({ en: 'Israel TV+ demo', he: 'הדגמה של ישראל TV+' })} />
  )

  if (reduce) {
    return (
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        {title}
        <div className="mt-12 aspect-video overflow-hidden rounded-[28px]">{video}</div>
        <p className="mt-6 text-center text-lg text-muted">{caption}</p>
      </div>
    )
  }
  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute inset-x-0 top-[12vh] z-10">{title}</motion.div>
        <motion.div style={{ scale, borderRadius: radius, y: shift }} className="relative aspect-video w-[min(100vw,177.7dvh)] overflow-hidden bg-black will-change-transform">
          {video}
          <motion.div style={{ opacity: capOpacity }} className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
          <motion.p style={{ opacity: capOpacity, y: capY }} className="absolute inset-x-0 bottom-[8%] mx-auto max-w-[24ch] px-5 text-center text-[clamp(1.5rem,3.6vw,3rem)] font-bold leading-tight tracking-[-0.03em] text-balance">
            {caption}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

function Facts({ repo, copy, accent }: { repo: Repo; copy: Copy; accent: string }) {
  const { t, pick, lang } = useI18n()
  const rtl = lang === 'he'
  const f = useFormat()
  return (
    <>
      <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-muted text-pretty">{pick(copy.lead)}</p>
      <dl className="mt-8 grid grid-cols-3 gap-3">
        {copy.figures.map((x) => (
          <div key={x.n} className="rounded-2xl bg-s1 p-4">
            <dt className="sr-only">{pick(x.label)}</dt>
            <dd>
              <CountUp value={Number(x.n)} className="num block text-3xl font-bold tracking-tight" style={{ color: accent }} />
              <span className="mt-1 block text-sm leading-snug text-muted">{pick(x.label)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-7 space-y-3">
        {copy.features.map((x, i) => (
          <motion.li key={i} className="flex gap-3 text-[15px] leading-relaxed"
            initial={{ opacity: 0, x: rtl ? 18 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}>
            <motion.span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 origin-[var(--o)] [--o:left] rtl:[--o:right]" style={{ background: accent }}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.08 }} />
            {pick(x)}
          </motion.li>
        ))}
      </ul>
      <h4 className="mt-9 text-sm font-semibold">{t('platforms')}</h4>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {copy.groups.map((g) => (
          <div key={g.label.en}>
            <dt className="text-muted">{pick(g.label)}</dt>
            <dd className="mt-1 leading-relaxed">{g.items.map(pick).join(', ')}</dd>
          </div>
        ))}
      </dl>
      <h4 className="mt-8 text-sm font-semibold">{t('builtWith')}</h4>
      <ul className="mt-3 flex flex-wrap gap-2">
        {repo.stack.map((s) => (
          <li key={s} className="rounded-md border border-line px-2 py-1 text-[13px] text-muted">{s}</li>
        ))}
      </ul>
      {repo.release && (
        <p className="mt-8 text-sm text-muted">
          {t('latest')}{' '}
          <a href={repo.release.url} className="font-mono text-fg underline decoration-line-2 underline-offset-4 hover:decoration-fg">{repo.release.tag}</a>
          {', '}{f.date(repo.release.date)}{', '}{t('files', { n: repo.release.assets })}
        </p>
      )}
    </>
  )
}

function Ctas({ repo, live, liveLabel }: { repo: Repo; live: string; liveLabel: string }) {
  const { t } = useI18n()
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      <a href={`${repo.url}/releases/latest`} className="rounded-full bg-ember px-5 py-3 font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ember-2 active:scale-[0.97]">{t('download')}</a>
      <a href={live} className="rounded-full border border-line-2 px-5 py-3 font-medium transition-[background-color,transform] duration-150 hover:bg-s1 active:scale-[0.97]">{liveLabel}</a>
      <a href={repo.url} className="flex items-center gap-2 rounded-full px-4 py-3 font-medium text-muted transition-colors hover:text-fg"><GithubIcon /> {t('viewCode')}</a>
    </div>
  )
}

function Title({ repo, accent, id }: { repo: Repo; accent: string; id: string }) {
  const { pick } = useI18n()
  const icon = repo.images.at(-1)!
  return (
    <div className="flex items-center gap-4">
      <img src={icon.src} alt="" width={56} height={56} className="size-14 rounded-2xl" style={{ boxShadow: `0 0 0 1px ${accent}33, 0 10px 30px -10px ${accent}66` }} />
      <div>
        <h3 id={id} className="text-3xl font-bold tracking-[-0.025em]">{repo.title}</h3>
        <p className="mt-0.5 text-[15px] text-muted">{pick(repo.tagline)}</p>
      </div>
    </div>
  )
}

function TvPlus({ repo }: { repo: Repo }) {
  const { t, pick, lang } = useI18n()
  const reduce = useReducedMotion()
  const rtl = lang === 'he'
  const [screen, setScreen] = useState<number>(-1) // -1 = demo video
  const dir = useDirection(screen, rtl)
  const stage = useRef<HTMLDivElement>(null)
  const on = useInView(stage, { once: true, amount: 0.45 })
  const side = rtl ? -1 : 1
  // Phone and watch drift at different speeds than the TV as the page scrolls past.
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['14%', '-14%'])
  const watchY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['40%', '-40%'])
  const tvY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['3%', '-3%'])
  const [tvVideo, phoneVideo] = repo.videos
  const tvShots = repo.images.slice(0, 6)
  const phonePoster = repo.images[6]
  const watch = repo.images[11]

  return (
    <article aria-labelledby="tvplus-title" className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-5">
        <Title id="tvplus-title" repo={repo} accent="var(--color-tv)" />
        <Facts repo={repo} copy={TV} accent="var(--color-tv)" />
        <Ctas repo={repo} live={repo.homepage!} liveLabel={t('watchLive')} />
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div ref={stage} className="relative pb-[9%] pe-[7%] lg:sticky lg:top-24">
          <div aria-hidden className="pointer-events-none absolute inset-[-8%] -z-10 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-tv)_16%,transparent),transparent)]" />
          <motion.div style={{ y: tvY }}>
          <TvFrame>
            {/* Power-on: the picture opens from a bright line, like an old tube set warming up. */}
            <motion.div
              className="absolute inset-0 origin-center"
              initial={{ scaleX: 0, scaleY: 0.004 }}
              animate={on ? { scaleX: [0, 1, 1], scaleY: [0.004, 0.004, 1] } : undefined}
              transition={{ duration: 0.75, times: [0, 0.4, 1], ease: EASE }}
            >
            <AnimatePresence initial={false} custom={dir}>
              {screen === -1 ? (
                <motion.video
                  key="demo"
                  className="absolute inset-0 size-full object-cover"
                  src={tvVideo} poster={tvShots[1].src}
                  autoPlay={!reduce} muted loop playsInline aria-label={pick({ en: 'Israel TV+ on a TV, demo', he: 'ישראל TV+ בטלוויזיה, הדגמה' })}
                  custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}
                />
              ) : (
                <motion.img
                  key={screen}
                  src={tvShots[screen].src} alt={pick(TV_SCREENS[screen])}
                  className="absolute inset-0 size-full object-cover"
                  custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}
                />
              )}
            </AnimatePresence>
            </motion.div>
            <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-white mix-blend-overlay"
              initial={{ opacity: 0 }} animate={on ? { opacity: [0, 0, 0.55, 0] } : undefined}
              transition={{ duration: 1.1, times: [0, 0.35, 0.55, 1] }} />
          </TvFrame>
          </motion.div>
          <motion.div className="absolute bottom-0 end-0 z-10 w-[23%]" style={{ y: phoneY }}
            initial={{ opacity: 0, x: `${side * 30}%` }} animate={on ? { opacity: 1, x: '0%' } : undefined}
            transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}>
          <PhoneFrame>
            <video className="absolute inset-0 size-full object-cover" src={phoneVideo} poster={phonePoster.src} autoPlay={!reduce} muted loop playsInline aria-label={pick({ en: 'Israel TV+ on a phone, demo', he: 'ישראל TV+ בטלפון, הדגמה' })} />
          </PhoneFrame>
          </motion.div>
          <motion.div className="absolute bottom-[1%] start-[5%] z-10 w-[13%]" style={{ y: watchY }}
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={on ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}>
          <WatchFrame>
            <img src={watch.src} alt={pick({ en: 'Israel TV+ on Wear OS', he: 'ישראל TV+ ב-Wear OS' })} className="size-full object-cover" />
          </WatchFrame>
          </motion.div>
        </div>

        <div role="group" aria-label={pick({ en: 'TV screens', he: 'מסכי טלוויזיה' })} className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:mt-6">
          {[-1, ...tvShots.keys()].map((i) => {
            const label = i === -1 ? pick({ en: 'Demo video', he: 'סרטון הדגמה' }) : pick(TV_SCREENS[i])
            const on = screen === i
            return (
              <button
                key={i} type="button" onClick={() => setScreen(i)} aria-pressed={on}
                className={`shrink-0 rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 ${on ? 'border-tv/60 bg-tv/10 text-fg' : 'border-line text-muted hover:border-line-2 hover:text-fg'}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}

function Pulse({ repo }: { repo: Repo }) {
  const { t, pick } = useI18n()
  return (
    <>
    <article aria-labelledby="pulse-title" className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:order-2 lg:col-span-5 lg:col-start-8">
        <Title id="pulse-title" repo={repo} accent="var(--color-pulse)" />
        <Facts repo={repo} copy={PULSE} accent="var(--color-pulse)" />
        <Ctas repo={repo} live="https://dor2500.github.io/pulse-speed/app/" liveLabel={t('tryWeb')} />
      </div>

      <div className="min-w-0 lg:order-1 lg:col-span-7">
        <div className="relative grid place-items-center overflow-hidden rounded-[32px] bg-s1 px-6 py-14 sm:py-20 lg:sticky lg:top-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_45%,color-mix(in_srgb,var(--color-pulse)_16%,transparent),transparent)]" />
          <motion.div className="relative isolate w-[min(270px,64vw)] [perspective:1200px]"
            initial={{ opacity: 0, y: 60, rotateX: 28, rotateY: -14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ type: 'spring', bounce: 0, duration: 1.1 }}>
            {/* Signal rings pulsing out from behind the phone. */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[42%] -z-10 size-[160%] -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2].map((k) => <span key={k} className="pulse-ring" style={{ animationDelay: `${k * 1.1}s` }} />)}
            </div>
            <PhoneFrame className="relative">
              <img src={repo.images[2].src} alt={pick({ en: 'Pulse, test result screen', he: 'Pulse, מסך התוצאה' })} className="absolute inset-0 size-full object-cover object-top" />
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </article>
    <PulseGallery repo={repo} />
    </>
  )
}

/** Swipeable highlights: one card per screen, snapping to the middle, with arrows and dots. */
function PulseGallery({ repo }: { repo: Repo }) {
  const { pick } = useI18n()
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2
    let best = 0
    let dist = Infinity
    Array.from(el.children).forEach((c, i) => {
      const r = c.getBoundingClientRect()
      const d = Math.abs(r.left + r.width / 2 - mid)
      if (d < dist) { dist = d; best = i }
    })
    setActive(best)
  }
  const go = (i: number) => {
    const el = track.current
    const card = el?.children[Math.max(0, Math.min(PULSE_SCREENS.length - 1, i))] as HTMLElement | undefined
    if (!el || !card) return
    card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }
  const round = 'grid size-10 place-items-center rounded-full bg-s2 text-fg transition-[background-color,transform,opacity] duration-150 hover:bg-s3 active:scale-90 disabled:opacity-30'

  return (
    <section aria-labelledby="pulse-gallery-title" className="pb-20 md:pb-28">
      <h3 id="pulse-gallery-title" className="mx-auto max-w-[1200px] px-5 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold tracking-[-0.03em] sm:px-8">
        {pick({ en: 'Take a look around Pulse.', he: 'סיור במסכים של Pulse.' })}
      </h3>
      <div ref={track} onScroll={onScroll}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-1200px)/2+2rem))] pb-2">
        {PULSE_SCREENS.map(([shot, label], i) => (
          <motion.figure key={shot}
            className="w-[min(74vw,300px)] shrink-0 snap-center rounded-[28px] bg-s1 p-5"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.9, delay: Math.min(i, 4) * 0.06 }}>
            <figcaption className="text-lg font-semibold tracking-[-0.01em]">{pick(label)}</figcaption>
            <img src={repo.images[shot].src} alt="" loading="lazy" decoding="async" width={repo.images[shot].w} height={repo.images[shot].h}
              className="mt-4 w-full rounded-[20px] shadow-[0_0_0_1px_rgb(255_255_255/0.06)]" />
          </motion.figure>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" className={round} onClick={() => go(active - 1)} disabled={active === 0} aria-label={pick({ en: 'Previous screen', he: 'המסך הקודם' })}>
          <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="flex items-center gap-2 rounded-full bg-s1 px-4 py-3">
          {PULSE_SCREENS.map(([, label], i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={pick(label)} aria-current={i === active || undefined}
              className={`h-2 rounded-full transition-[width,background-color] duration-300 ${i === active ? 'w-6 bg-fg' : 'w-2 bg-line-2 hover:bg-muted'}`} />
          ))}
        </div>
        <button type="button" className={round} onClick={() => go(active + 1)} disabled={active === PULSE_SCREENS.length - 1} aria-label={pick({ en: 'Next screen', he: 'המסך הבא' })}>
          <svg aria-hidden viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  )
}
