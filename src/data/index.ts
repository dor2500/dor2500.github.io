import json from './github.json'
import { CURATED, FLAGSHIPS, type Curated, type Platform } from './curated'

export type Img = { src: string; w: number; h: number }
type RawRepo = {
  name: string; description: string | null; url: string; homepage: string | null; language: string | null
  stars: number; topics: string[]; pushedAt: string; createdAt: string; languages: Record<string, number>
  release: { tag: string; name: string | null; date: string; url: string; assets: number } | null
  readme: { summary: string; bullets: string[] }; images: Img[]; videos: string[]
}
const raw = json as unknown as { generatedAt: string; profile: { login: string; url: string; avatar: string; followers: number; since: string }; repos: RawRepo[] }
export type Repo = RawRepo & Omit<Curated, 'coverIndex'> & { shots: Img[]; cover: Img | null; title: string }

const TITLES: Record<string, string> = {
  'israel-tv-plus': 'Israel TV+', 'pulse-speed': 'Pulse', 'Command-Library-CMD-Terminal-': 'Command Library',
  'ytm-desktop': 'Aria', 'ExeLat-PoC': 'ExeLat', 'SignalFinder-AR': 'SignalFinder AR',
  'smart-tv-desktop-remote': 'Smart TV Desktop Remote', 'usb-ai-technician': 'USB AI Technician',
  'icy-tower-mario-he-4k': 'Icy Tower: Mario Edition', 'sonic-flash-he': 'Sonic Flash in Hebrew',
  'ci3-hebrew-4k': 'Chicken Invaders 3 in Hebrew', 'minesweeper-ultra-4k': 'Minesweeper Ultra 4K',
  'digital-recipe-book': 'Digital Recipe Book', 'walkie-talkie': 'Walkie-Talkie', 'home-rms': 'Home RMS',
  'exe-signer': 'Exe Signer', 'drift-browser': 'Drift', 'vortex-browser': 'Vortex', 'nebula-ide': 'Nebula IDE',
  'update-pulse': 'UpdatePulse', tafnit: 'Tafnit', botwave: 'BotWave', 'cs-remastered': 'CS Remastered',
  'webos-tv-games': 'webOS TV Arcade', AdBlockVPN: 'AdBlock VPN', NovaBrowser: 'Nova Browser',
  'antigravity-remote': 'Antigravity Remote', 'tiktok-webos-tv': 'TikTok for LG webOS',
}

export const repos: Repo[] = raw.repos
  .filter((r) => CURATED[r.name])
  .map((r) => {
    const c = CURATED[r.name]
    const shots = r.images.filter((_, i) => !c.skip?.includes(i))
    const cover = c.mockup ? null : shots[c.coverIndex ?? 0] ?? null
    return { ...r, ...c, images: r.images, shots, cover, title: TITLES[r.name] ?? r.name }
  })

export const bySlug = Object.fromEntries(repos.map((r) => [r.name, r]))
export const flagships = FLAGSHIPS.map((n) => bySlug[n])
const UPDATED = (r: Repo) => r.release?.date ?? r.pushedAt
export const others = repos.filter((r) => !FLAGSHIPS.includes(r.name as never)).sort((a, b) => UPDATED(b).localeCompare(UPDATED(a)))

export const generatedAt = raw.generatedAt
export const profile = raw.profile

export const stats = {
  repos: repos.length,
  releases: repos.filter((r) => r.release).length,
  latestRelease: repos.map((r) => r.release?.date).filter(Boolean).sort().at(-1)!,
}

export const platformCounts = (() => {
  const m = new Map<Platform, number>()
  for (const r of repos) for (const p of r.platforms) m.set(p, (m.get(p) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
})()

export const languageShare = (() => {
  const m = new Map<string, number>()
  for (const r of repos) for (const [l, b] of Object.entries(r.languages)) m.set(l, (m.get(l) ?? 0) + b)
  const total = [...m.values()].reduce((a, b) => a + b, 0)
  const counts = new Map<string, number>()
  for (const r of repos) for (const l of Object.keys(r.languages)) counts.set(l, (counts.get(l) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([lang, bytes]) => ({ lang, share: bytes / total, repos: counts.get(lang)! }))
})()

const NOT_FRAMEWORK = new Set(['JavaScript', 'TypeScript', 'Kotlin', 'Java', 'Python', 'C#', 'PowerShell', 'HTML', 'CSS', 'Go', 'GDScript'])
export const frameworks = (() => {
  const m = new Map<string, number>()
  for (const r of repos) for (const s of r.stack) if (!NOT_FRAMEWORK.has(s)) m.set(s, (m.get(s) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})()

export const LANG_COLOR: Record<string, string> = {
  JavaScript: '#f1e05a', Kotlin: '#a97bff', Python: '#3572a5', TypeScript: '#3178c6', 'C#': '#178600',
  PowerShell: '#5391fe', CSS: '#663399', HTML: '#e34c26', Java: '#b07219', Go: '#00add8', GDScript: '#478cbf',
}
