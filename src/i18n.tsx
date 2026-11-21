import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type Lang = 'en' | 'he'
export type L10n = { en: string; he: string }

const strings = {
  skip: { en: 'Skip to content', he: 'דלג לתוכן' },
  navFlagships: { en: 'Flagships', he: 'פרויקטי הדגל' },
  navProjects: { en: 'Projects', he: 'פרויקטים' },
  navStack: { en: 'Stack', he: 'טכנולוגיות' },
  switchLang: { en: 'עברית', he: 'English' },
  switchLangLabel: { en: 'Switch to Hebrew', he: 'Switch to English' },

  heroTitle: { en: 'I build apps that end up on every screen in the house.', he: 'אני בונה אפליקציות שמגיעות לכל מסך בבית.' },
  heroBio: {
    en: 'TV apps for LG and Samsung, native Android apps in Kotlin and Compose, Windows tools in C# and PowerShell, and classic games remastered for 4K. Almost everything ships in Hebrew and English, with real right-to-left support.',
    he: 'אפליקציות לטלוויזיות LG וסמסונג, אפליקציות אנדרואיד ב-Kotlin ו-Compose, כלים ל-Windows ב-C# וב-PowerShell, ומשחקים קלאסיים בגרסת 4K. כמעט הכל יוצא בעברית ובאנגלית, עם תמיכה אמיתית בימין לשמאל.',
  },
  ctaFlagships: { en: 'See the flagship projects', he: 'לפרויקטי הדגל' },
  ctaAll: { en: 'Browse all projects', he: 'לכל הפרויקטים' },
  ctaGithub: { en: 'GitHub profile', he: 'הפרופיל ב-GitHub' },
  statsLine: {
    en: '{repos} open-source projects, {releases} with downloadable releases. Latest release {ago}.',
    he: '{repos} פרויקטים בקוד פתוח, {releases} מהם עם גרסאות להורדה. הגרסה האחרונה יצאה {ago}.',
  },
  receptionTitle: { en: 'Where my apps run', he: 'איפה האפליקציות רצות' },
  receptionHint: { en: 'Number of projects per platform. Pick one to filter the project list.', he: 'מספר הפרויקטים בכל פלטפורמה. בחרו אחת כדי לסנן את רשימת הפרויקטים.' },

  flagshipsTitle: { en: 'Flagship projects', he: 'פרויקטי הדגל' },
  flagshipsLead: { en: 'The two apps I keep coming back to. Both ship to TVs, phones and desktops from one codebase each.', he: 'שתי האפליקציות שאני חוזר אליהן כל הזמן. כל אחת יוצאת לטלוויזיות, לטלפונים ולמחשבים מבסיס קוד אחד.' },
  latest: { en: 'Latest release', he: 'גרסה אחרונה' },
  files: { en: '{n} files', he: '{n} קבצים' },
  platforms: { en: 'Platforms', he: 'פלטפורמות' },
  builtWith: { en: 'Built with', he: 'נבנה עם' },
  download: { en: 'Download', he: 'הורדה' },
  viewCode: { en: 'View on GitHub', he: 'צפייה ב-GitHub' },
  watchLive: { en: 'Watch in the browser', he: 'צפייה בדפדפן' },
  tryWeb: { en: 'Try it in the browser', he: 'לנסות בדפדפן' },
  screenOf: { en: 'Show screen: {s}', he: 'הצגת מסך: {s}' },
  device: { en: 'Device', he: 'מכשיר' },

  projectsTitle: { en: 'All projects', he: 'כל הפרויקטים' },
  projectsLead: { en: 'Everything else on my GitHub, from Android apps to self-hosted bots.', he: 'כל השאר ב-GitHub שלי, מאפליקציות אנדרואיד ועד בוטים לאירוח עצמי.' },
  search: { en: 'Search projects', he: 'חיפוש פרויקטים' },
  searchPh: { en: 'Search by name, language or topic', he: 'חיפוש לפי שם, שפה או נושא' },
  showing: { en: '{n} projects', he: '{n} פרויקטים' },
  onPlatform: { en: 'Platform: {p}', he: 'פלטפורמה: {p}' },
  clearPlatform: { en: 'Clear platform filter', he: 'ניקוי סינון פלטפורמה' },
  empty: { en: 'No project matches "{q}". Try a language like Kotlin, or clear the search.', he: 'אין פרויקט שמתאים ל-"{q}". נסו שפה כמו Kotlin, או נקו את החיפוש.' },
  clearSearch: { en: 'Clear search', he: 'ניקוי החיפוש' },
  open: { en: 'Open details for {n}', he: 'פתיחת פרטים על {n}' },
  live: { en: 'Live', he: 'באוויר' },
  close: { en: 'Close', he: 'סגירה' },
  fromReadme: { en: 'From the README', he: 'מתוך ה-README' },
  screenshots: { en: 'Screenshots', he: 'צילומי מסך' },
  noRelease: { en: 'Source only, no release yet', he: 'קוד מקור בלבד, עדיין בלי גרסה' },
  updated: { en: 'Updated {d}', he: 'עודכן {d}' },
  openSite: { en: 'Open the live site', he: 'לאתר החי' },
  releases: { en: 'Releases', he: 'גרסאות' },
  prev: { en: 'Previous screenshot', he: 'צילום מסך קודם' },
  next: { en: 'Next screenshot', he: 'צילום מסך הבא' },
  conceptPreview: { en: 'Illustration: this project has no screenshots yet', he: 'איור: לפרויקט הזה עדיין אין צילומי מסך' },

  stackTitle: { en: 'What I build with', he: 'עם מה אני בונה' },
  stackLead: { en: 'Share of code across all public repositories, by language, measured in bytes by GitHub.', he: 'חלק הקוד בכל המאגרים הציבוריים לפי שפה, כפי ש-GitHub מודד בבתים.' },
  frameworks: { en: 'Frameworks and engines', he: 'פריימוורקים ומנועים' },
  targets: { en: 'Targets', he: 'יעדים' },
  usedIn: { en: 'in {n} projects', he: 'ב-{n} פרויקטים' },

  footerLine: { en: 'Most of what I make is open source. If something here is useful to you, the code is on GitHub.', he: 'רוב מה שאני בונה הוא קוד פתוח. אם משהו כאן שימושי לכם, הקוד נמצא ב-GitHub.' },
  dataAsOf: { en: 'Project data from the GitHub API, {d}.', he: 'נתוני הפרויקטים מה-API של GitHub, {d}.' },
} satisfies Record<string, L10n>

export type StrKey = keyof typeof strings

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: StrKey, vars?: Record<string, string | number>) => string; pick: (v: L10n) => string }
const I18nCtx = createContext<Ctx>(null!)

function initialLang(): Lang {
  try {
    const s = localStorage.getItem('lang')
    if (s === 'he' || s === 'en') return s
  } catch {}
  return navigator.language?.startsWith('he') ? 'he' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  // Layout effect, so lang/dir are on <html> before the view transition takes its "after" picture.
  useLayoutEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.title = lang === 'he' ? 'dor2500: אפליקציות לכל מסך' : 'dor2500: apps for every screen'
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])
  const t = useCallback((k: StrKey, vars?: Record<string, string | number>) => {
    let s: string = strings[k][lang]
    if (vars) for (const [n, v] of Object.entries(vars)) s = s.replaceAll(`{${n}}`, String(v))
    return s
  }, [lang])
  const pick = useCallback((v: L10n) => v[lang], [lang])
  const setLang = useCallback((l: Lang) => {
    const go = () => flushSync(() => setLangState(l))
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(go)
    else go()
  }, [])
  return <I18nCtx.Provider value={{ lang, setLang, t, pick }}>{children}</I18nCtx.Provider>
}

export const useI18n = () => useContext(I18nCtx)

export function useFormat() {
  const { lang } = useI18n()
  const locale = lang === 'he' ? 'he-IL' : 'en-GB'
  return {
    date: (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    ago: (iso: string) => {
      const days = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000)
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      if (Math.abs(days) < 30) return rtf.format(days, 'day')
      if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), 'month')
      return rtf.format(Math.round(days / 365), 'year')
    },
    num: (n: number) => n.toLocaleString(locale),
  }
}
