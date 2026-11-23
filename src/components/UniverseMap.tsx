import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../i18n'
import { LANG_COLOR, repos, type Repo } from '../data'
import { CATEGORIES, PLATFORM_LABEL, type Category } from '../data/curated'
import { useSound } from '../sound'
import { TuneIn } from './Motion'

const W = 1000
const H = 560

// 6 orbital cluster hubs arranged gracefully inside the 1000x560 stage
const HUBS: Record<Category, { x: number; y: number; color: string }> = {
  android: { x: 225, y: 175, color: '#6fd6b5' },
  windows: { x: 500, y: 155, color: '#4fb3ff' },
  desktop: { x: 780, y: 185, color: '#a97bff' },
  web: { x: 245, y: 405, color: '#ff6b35' },
  games: { x: 525, y: 410, color: '#f1e05a' },
  bots: { x: 785, y: 395, color: '#ff5f87' },
}

type Node = { repo: Repo; x: number; y: number; r: number; color: string; hub: { x: number; y: number } }

/**
 * Interactive Project Galaxy / Constellation Map:
 * Hover any project node to light up bezier links to every other project sharing its language or platform.
 * Click any node to open its full modal immediately.
 */
export function UniverseMap({ onOpen }: { onOpen: (r: Repo) => void }) {
  const { t, pick, lang } = useI18n()
  const sound = useSound()
  const [hovered, setHovered] = useState<string | null>(null)
  const [focusCat, setFocusCat] = useState<Category | null>(null)

  const nodes = useMemo<Node[]>(() => {
    const byCat = new Map<Category, Repo[]>()
    for (const r of repos) {
      const list = byCat.get(r.category) ?? []
      list.push(r)
      byCat.set(r.category, list)
    }
    const out: Node[] = []
    for (const [cat, list] of byCat.entries()) {
      const hub = HUBS[cat]
      list.forEach((repo, i) => {
        const ring = i < 6 ? 1 : 2
        const inRing = ring === 1 ? Math.min(list.length, 6) : list.length - 6
        const idxInRing = ring === 1 ? i : i - 6
        const angle = (idxInRing / Math.max(1, inRing)) * Math.PI * 2 - Math.PI / 2 + (ring === 2 ? 0.35 : 0)
        const radX = ring === 1 ? 82 : 132
        const radY = ring === 1 ? 66 : 104
        out.push({
          repo,
          x: hub.x + Math.cos(angle) * radX,
          y: hub.y + Math.sin(angle) * radY,
          r: repo.release ? 8.5 : 6,
          color: (repo.language && LANG_COLOR[repo.language]) || hub.color,
          hub,
        })
      })
    }
    return out
  }, [])

  const activeNode = useMemo(() => nodes.find((n) => n.repo.name === hovered) ?? null, [nodes, hovered])

  // Related nodes sharing the hovered project's language or primary platform
  const related = useMemo(() => {
    if (!activeNode) return new Set<string>()
    const set = new Set<string>()
    for (const n of nodes) {
      if (n.repo.name === activeNode.repo.name) continue
      const sameLang = activeNode.repo.language && n.repo.language === activeNode.repo.language
      const samePlat = n.repo.platforms.some((p) => activeNode.repo.platforms.includes(p))
      if (sameLang || samePlat) set.add(n.repo.name)
    }
    return set
  }, [activeNode, nodes])

  const catLabels = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

  return (
    <section aria-labelledby="universe-title" className="relative isolate border-t border-[var(--hairline)] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-tv">
              {lang === 'he' ? 'מפת פרויקטים אינטראקטיבית' : 'INTERACTIVE PROJECT GALAXY'}
            </p>
            <TuneIn id="universe-title" className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              {lang === 'he' ? 'היקום של כל 35 האפליקציות.' : 'Every app, connected.'}
            </TuneIn>
            <p className="mt-2 max-w-[54ch] text-base text-muted">
              {lang === 'he'
                ? 'רחפו מעל כל נקודה כדי לראות את הקשרים בין שפות ופלטפורמות — ולחצו כדי לפתוח את הפרויקט.'
                : 'Hover any star to illuminate shared languages and platforms — click any node to inspect the project.'}
            </p>
          </div>
          {focusCat && (
            <button
              type="button"
              onClick={() => setFocusCat(null)}
              className="bento-tile rounded-full px-3.5 py-1.5 text-xs font-medium text-muted hover:text-fg"
            >
              {lang === 'he' ? 'הצג את כל הגלקסיה' : 'Show full galaxy'}
            </button>
          )}
        </div>

        <div className="bento-card relative mt-10 overflow-hidden rounded-[32px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-[380px] w-full select-none sm:h-[480px] md:h-[540px]"
            role="img"
            aria-label={lang === 'he' ? 'מפת קונסטלציה של הפרויקטים' : 'Interactive project constellation map'}
          >
            {/* Subtle orbital rings around each category hub */}
            {(Object.entries(HUBS) as [Category, { x: number; y: number; color: string }][]).map(([cat, hub]) => {
              const dimmed = focusCat !== null && focusCat !== cat
              return (
                <g key={cat} opacity={dimmed ? 0.18 : 1} className="transition-opacity duration-300">
                  <ellipse cx={hub.x} cy={hub.y} rx={82} ry={66} fill="none" stroke={hub.color} strokeOpacity={0.14} strokeDasharray="3 5" />
                  <ellipse cx={hub.x} cy={hub.y} rx={132} ry={104} fill="none" stroke={hub.color} strokeOpacity={0.07} />
                  <circle cx={hub.x} cy={hub.y} r={34} fill={hub.color} fillOpacity={0.06} />
                  <g
                    onClick={() => { sound.play('tick'); setFocusCat(focusCat === cat ? null : cat) }}
                    className="cursor-pointer"
                  >
                    <circle cx={hub.x} cy={hub.y} r={22} fill={hub.color} fillOpacity={0.15} stroke={hub.color} strokeOpacity={0.5} />
                    <text
                      x={hub.x}
                      y={hub.y + 4}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-[11px] font-semibold"
                    >
                      {pick(catLabels[cat])}
                    </text>
                  </g>
                </g>
              )
            })}

            {/* Spoke lines connecting each node to its category hub */}
            {nodes.map((n) => {
              const dimmed = (focusCat !== null && n.repo.category !== focusCat) || (hovered !== null && hovered !== n.repo.name && !related.has(n.repo.name))
              return (
                <line
                  key={`spoke-${n.repo.name}`}
                  x1={n.hub.x}
                  y1={n.hub.y}
                  x2={n.x}
                  y2={n.y}
                  stroke={n.color}
                  strokeOpacity={dimmed ? 0.04 : 0.2}
                  strokeWidth={1}
                />
              )
            })}

            {/* Glowing curved bezier filaments between hovered node and related projects */}
            {activeNode && nodes
              .filter((n) => related.has(n.repo.name))
              .slice(0, 14)
              .map((n) => {
                const mx = (activeNode.x + n.x) / 2
                const my = (activeNode.y + n.y) / 2 - 28
                return (
                  <path
                    key={`rel-${n.repo.name}`}
                    d={`M ${activeNode.x} ${activeNode.y} Q ${mx} ${my} ${n.x} ${n.y}`}
                    fill="none"
                    stroke={activeNode.color}
                    strokeOpacity={0.55}
                    strokeWidth={1.6}
                  />
                )
              })}

            {/* Project star nodes */}
            {nodes.map((n) => {
              const isActive = hovered === n.repo.name
              const isRel = related.has(n.repo.name)
              const dimmed = (focusCat !== null && n.repo.category !== focusCat) || (hovered !== null && !isActive && !isRel)
              return (
                <g
                  key={n.repo.name}
                  onPointerEnter={() => { setHovered(n.repo.name); sound.play('tick') }}
                  onPointerLeave={() => setHovered(null)}
                  onClick={() => { sound.play('pop'); onOpen(n.repo) }}
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={dimmed ? 0.2 : 1}
                >
                  {isActive && (
                    <circle cx={n.x} cy={n.y} r={n.r + 10} fill={n.color} fillOpacity={0.22} />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isActive ? n.r + 3 : n.r}
                    fill={n.color}
                    stroke="var(--color-ink)"
                    strokeWidth={1.8}
                  />
                  {(isActive || n.repo.release) && (
                    <text
                      x={n.x}
                      y={n.y - n.r - 6}
                      textAnchor="middle"
                      fill="currentColor"
                      className={`pointer-events-none ${isActive ? 'text-[12px] font-bold' : 'text-[9.5px] opacity-65'}`}
                    >
                      {n.repo.title}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Floating Apple Glass Preview Pill for the hovered node */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                key={activeNode.repo.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.16 }}
                className="glass-panel pointer-events-none absolute bottom-4 start-4 end-4 mx-auto flex max-w-[460px] items-center gap-3.5 rounded-2xl p-3 sm:start-auto sm:end-5 sm:mx-0"
              >
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full"
                  style={{ background: activeNode.color, boxShadow: `0 0 12px ${activeNode.color}` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span dir="ltr" className="truncate text-sm font-bold">{activeNode.repo.title}</span>
                    {activeNode.repo.release && (
                      <span dir="ltr" className="rounded bg-[var(--chip-hover)] px-1.5 py-0.5 font-mono text-[10px] text-muted">{activeNode.repo.release.tag}</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">{pick(activeNode.repo.tagline)}</p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-[var(--chip-hover)] px-2.5 py-1 text-[11px] font-medium text-fg sm:inline">
                  {activeNode.repo.platforms.slice(0, 1).map((p) => pick(PLATFORM_LABEL[p]))} · {t('inspect')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
