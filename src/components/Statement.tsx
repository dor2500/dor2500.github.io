import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useI18n } from '../i18n'
import { stats } from '../data'

const ACCENT_WORDS = new Set([
  'screen,', 'open', 'source,', 'TV', 'phone', 'watch', 'computer',
  'מסך,', 'פתוח,', 'הטלוויזיה', 'הטלפון', 'השעון', 'והמחשב',
])

/** A large paragraph whose words light up one by one as it scrolls through the viewport. */
export function Statement() {
  const { lang } = useI18n()
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const text = lang === 'he'
    ? `${stats.repos} פרויקטים, הרגל אחד. אם זה רץ על מסך, אני רוצה שזה יעבוד בעברית ובאנגלית, שהקוד יהיה פתוח, ושזה ירוץ על כל מכשיר בבית: הטלוויזיה בסלון, הטלפון בכיס, השעון על היד והמחשב על השולחן.`
    : `${stats.repos} projects, one habit. If it runs on a screen, I want it in Hebrew and English, open source, and running on every device in the house: the TV in the living room, the phone in your pocket, the watch on your wrist and the computer on your desk.`
  const words = text.split(' ')

  return (
    <section aria-label={lang === 'he' ? 'על העבודה' : 'About the work'} className="relative isolate mx-auto max-w-[1040px] px-5 py-32 sm:px-8 md:py-48">
      <div aria-hidden className="aurora-orb pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[min(780px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-ember)_11%,transparent),color-mix(in_srgb,var(--color-tv)_6%,transparent)_55%,transparent)] blur-3xl" />
      <p ref={ref} className="text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-pretty">
        {words.map((w, i) => (
          <Word
            key={`${lang}-${i}`}
            progress={scrollYProgress}
            from={i / words.length}
            to={(i + 1) / words.length}
            still={!!reduce}
            accent={i === 0 || ACCENT_WORDS.has(w)}
          >
            {w}
          </Word>
        ))}
      </p>
    </section>
  )
}

function Word({ progress, from, to, still, accent, children }: { progress: MotionValue<number>; from: number; to: number; still: boolean; accent?: boolean; children: string }) {
  const opacity = useTransform(progress, [from, to], [0.16, 1])
  return (
    <>
      <motion.span
        style={{ opacity: still ? 1 : opacity }}
        className={accent ? 'text-ember-glow' : undefined}
      >
        {children}
      </motion.span>{' '}
    </>
  )
}
