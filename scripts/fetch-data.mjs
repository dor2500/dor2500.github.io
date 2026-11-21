// Snapshot GitHub data + screenshots at build time so the site never hits the API at runtime.
// Usage: node scripts/fetch-data.mjs   (uses $GITHUB_TOKEN, or `gh auth token` if available)
import { execSync } from 'node:child_process'
import { mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const USER = 'dor2500'
const ROOT = path.resolve(import.meta.dirname, '..')
const SHOTS = path.join(ROOT, 'public', 'shots')
const OUT = path.join(ROOT, 'src', 'data', 'github.json')
const EXCLUDE = new Set(['DYModz-10-11'])

let token = process.env.GITHUB_TOKEN
if (!token) try { token = execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch {}
const headers = { 'User-Agent': 'portfolio-build', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }

async function api(p, raw = false) {
  const r = await fetch(`https://api.github.com/${p}`, { headers: raw ? { ...headers, Accept: 'application/vnd.github.raw' } : headers })
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`${p}: ${r.status}`)
  return raw ? r.text() : r.json()
}
const exists = (f) => access(f).then(() => true, () => false)

// Hand-picked media for the two flagships, in display order.
const FLAGSHIP_MEDIA = {
  'israel-tv-plus': [
    'docs/screenshots/tv_home.jpg', 'docs/screenshots/tv_focus.jpg', 'docs/screenshots/tv_guide.jpg',
    'docs/screenshots/tv_vod.jpg', 'docs/screenshots/tv_vod_series.jpg', 'docs/screenshots/tv_settings.jpg',
    'docs/screenshots/phone_home.jpg', 'docs/screenshots/phone_shelves.jpg', 'docs/screenshots/phone_channels.jpg',
    'docs/screenshots/phone_player.jpg', 'docs/screenshots/phone_settings.jpg',
    'docs/screenshots/watch_channels.png', 'docs/screenshots/watch_player.png',
    'assets/app/banner-1280x720.png', 'assets/app/icon-512.png',
  ],
  'pulse-speed': ['start', 'testing', 'result', 'history', 'tools', 'ping', 'dnsbench', 'servers', 'hebrew', 'details', 'status', 'scan']
    .map((s) => `docs/screenshots/${s}.png`).concat(['docs/play/feature-graphic.png', 'docs/play/icon-512.png']),
}
const FLAGSHIP_VIDEO = { 'israel-tv-plus': ['docs/media/demo-tv.mp4', 'docs/media/demo-phone.mp4'] }

function readmeImages(md, repo, branch) {
  const found = []
  for (const m of md.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)|<img[^>]+src=["']([^"']+)["']/gi)) found.push(m[1] || m[2])
  return [...new Set(found)]
    .filter((u) => /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(u) && !/shields\.io|badge|my\.home-assistant|icon|logo|avatar/i.test(u))
    .map((u) => {
      if (/^https?:/.test(u)) return u.replace(/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\//, 'raw.githubusercontent.com/$1/$2/')
      return `https://raw.githubusercontent.com/${USER}/${repo}/${branch}/${u.replace(/^\.?\//, '')}`
    })
}

function cleanMd(s) {
  return s.replace(/<[^>]+>/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]{1,3}/g, '').replace(/\s+/g, ' ').trim()
}

function readmeText(md) {
  const body = md.replace(/```[\s\S]*?```/g, '').replace(/^---[\s\S]*?---/, '').replace(/<!--[\s\S]*?-->/g, '')
  const lines = body.split('\n')
  const paras = body.split(/\n\s*\n/).map((p) => p.trim())
    .filter((p) => p && !/^(#|\||>|<p|<div|!\[|\[!\[|-|\*|\d+\.)/.test(p)).map(cleanMd).filter((p) => p.length > 60)
  let bullets = []
  const featIdx = lines.findIndex((l) => /^#{2,4}\s.*(feature|יכולות|תכונות|what (it|makes)|highlights|✨)/i.test(l))
  const scan = (from) => {
    const out = []
    for (let i = from; i < lines.length && out.length < 8; i++) {
      const l = lines[i]
      if (out.length && /^#{1,3}\s/.test(l)) break
      const m = l.match(/^\s{0,2}[-*]\s+(.+)/)
      if (m) { const t = cleanMd(m[1]); if (t.length > 12) out.push(t.length > 180 ? t.slice(0, 177) + '…' : t) }
    }
    return out
  }
  if (featIdx >= 0) bullets = scan(featIdx + 1)
  if (bullets.length < 3) bullets = scan(0)
  const s = paras[0] || ''
  return { summary: s.length > 420 ? s.slice(0, 417) + '…' : s, bullets }
}

async function saveImage(url, repo, i) {
  const dir = path.join(SHOTS, repo)
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, `${String(i).padStart(2, '0')}.webp`)
  if (!(await exists(file))) {
    const r = await fetch(url, { headers: { 'User-Agent': 'portfolio-build' } })
    if (!r.ok) return null
    const buf = Buffer.from(await r.arrayBuffer())
    try {
      await sharp(buf, { pages: 1 }).resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 }).toFile(file)
    } catch { return null }
  }
  const meta = await sharp(file).metadata()
  if (meta.width < 120) return null
  return { src: `/shots/${repo}/${path.basename(file)}`, w: meta.width, h: meta.height }
}

async function saveVideo(rel, repo) {
  const dir = path.join(SHOTS, repo)
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, path.basename(rel))
  if (!(await exists(file))) {
    const r = await fetch(`https://raw.githubusercontent.com/${USER}/${repo}/HEAD/${rel}`)
    if (!r.ok) return null
    await writeFile(file, Buffer.from(await r.arrayBuffer()))
    // The demos open on the Android launcher; cut that off if ffmpeg is available.
    try {
      execSync(`ffmpeg -v error -y -ss 2.6 -i "${file}" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart "${file}.tmp.mp4"`)
      execSync(process.platform === 'win32' ? `move /y "${file}.tmp.mp4" "${file}"` : `mv "${file}.tmp.mp4" "${file}"`, { shell: process.platform === 'win32' ? 'cmd.exe' : undefined })
    } catch {}
  }
  return `/shots/${repo}/${path.basename(rel)}`
}

const list = (await api(`users/${USER}/repos?per_page=100&type=owner`)).filter((r) => !r.fork && !EXCLUDE.has(r.name))
const profile = await api(`users/${USER}`)
const repos = []
for (const r of list) {
  process.stdout.write(`${r.name} `)
  const [languages, release, md] = await Promise.all([
    api(`repos/${USER}/${r.name}/languages`),
    api(`repos/${USER}/${r.name}/releases/latest`),
    api(`repos/${USER}/${r.name}/readme`, true),
  ])
  const urls = FLAGSHIP_MEDIA[r.name]
    ? FLAGSHIP_MEDIA[r.name].map((p) => `https://raw.githubusercontent.com/${USER}/${r.name}/${r.default_branch}/${p}`)
    : readmeImages(md || '', r.name, r.default_branch).slice(0, 6)
  const images = []
  for (const [i, u] of urls.entries()) { const img = await saveImage(u, r.name, i); if (img) images.push(img) }
  const videos = []
  for (const v of FLAGSHIP_VIDEO[r.name] || []) { const s = await saveVideo(v, r.name); if (s) videos.push(s) }
  repos.push({
    name: r.name, description: r.description, url: r.html_url, homepage: r.homepage || null,
    language: r.language, stars: r.stargazers_count, topics: r.topics, pushedAt: r.pushed_at, createdAt: r.created_at,
    languages: languages || {},
    release: release ? { tag: release.tag_name, name: release.name, date: release.published_at, url: release.html_url, assets: release.assets.length } : null,
    readme: md ? readmeText(md) : { summary: '', bullets: [] },
    images, videos,
  })
}
await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), profile: { login: profile.login, url: profile.html_url, avatar: profile.avatar_url, followers: profile.followers, since: profile.created_at }, repos }, null, 1))
console.log(`\nwrote ${repos.length} repos`)
