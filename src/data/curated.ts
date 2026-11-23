import type { L10n } from '../i18n'

export type Category = 'android' | 'windows' | 'desktop' | 'web' | 'games' | 'bots'
export type Platform =
  | 'android' | 'androidtv' | 'webos' | 'tizen' | 'wearos' | 'windows' | 'macos' | 'linux'
  | 'web' | 'stremio' | 'kodi' | 'homeassistant' | 'whatsapp' | 'telegram' | 'cli'

export type Mockup =
  | { kind: 'terminal'; title: string; lines: string[] }
  | { kind: 'chat'; app: 'whatsapp' | 'telegram'; title: string; msgs: { me?: boolean; text: L10n }[] }
  | { kind: 'phone-browser'; url: string }
  | { kind: 'phone-signal' }
  | { kind: 'dashboard'; title: string }
  | { kind: 'player'; title: string }

export type Curated = {
  category: Category
  tagline: L10n
  platforms: Platform[]
  stack: string[]
  /** Index of the screenshot to use on the card. */
  coverIndex?: number
  /** Screenshot indexes to hide (not product UI). */
  skip?: number[]
  wide?: boolean
  mockup?: Mockup
}

export const CATEGORIES: { id: Category | 'all'; label: L10n }[] = [
  { id: 'all', label: { en: 'All', he: 'הכל' } },
  { id: 'android', label: { en: 'Android', he: 'אנדרואיד' } },
  { id: 'windows', label: { en: 'Windows tools', he: 'כלים ל-Windows' } },
  { id: 'desktop', label: { en: 'Browsers & desktop', he: 'דפדפנים ודסקטופ' } },
  { id: 'web', label: { en: 'Web apps', he: 'אפליקציות רשת' } },
  { id: 'games', label: { en: 'Games', he: 'משחקים' } },
  { id: 'bots', label: { en: 'Bots & self-hosted', he: 'בוטים ואירוח עצמי' } },
]

export const PLATFORM_LABEL: Record<Platform, L10n> = {
  android: { en: 'Android', he: 'אנדרואיד' },
  androidtv: { en: 'Android TV', he: 'Android TV' },
  webos: { en: 'LG webOS', he: 'LG webOS' },
  tizen: { en: 'Samsung Tizen', he: 'סמסונג Tizen' },
  wearos: { en: 'Wear OS', he: 'Wear OS' },
  windows: { en: 'Windows', he: 'Windows' },
  macos: { en: 'macOS', he: 'macOS' },
  linux: { en: 'Linux', he: 'לינוקס' },
  web: { en: 'Web', he: 'דפדפן' },
  stremio: { en: 'Stremio', he: 'Stremio' },
  kodi: { en: 'Kodi', he: 'Kodi' },
  homeassistant: { en: 'Home Assistant', he: 'Home Assistant' },
  whatsapp: { en: 'WhatsApp', he: 'וואטסאפ' },
  telegram: { en: 'Telegram', he: 'טלגרם' },
  cli: { en: 'Command line', he: 'שורת פקודה' },
}

export const FLAGSHIPS = ['israel-tv-plus', 'pulse-speed'] as const

export const CURATED: Record<string, Curated> = {
  'israel-tv-plus': {
    category: 'web',
    tagline: { en: 'Live Israeli TV and radio on every screen, with live Hebrew dubbing', he: 'טלוויזיה ורדיו ישראליים בשידור חי בכל מסך, עם דיבוב חי לעברית' },
    platforms: ['webos', 'tizen', 'androidtv', 'android', 'wearos', 'windows', 'macos', 'linux', 'web', 'stremio', 'kodi', 'homeassistant'],
    stack: ['JavaScript', 'Kotlin', 'Jetpack Compose', 'Python', 'Cloudflare Workers', 'HLS'],
  },
  'pulse-speed': {
    category: 'android',
    tagline: { en: 'A Material You internet speed test with real network diagnostics', he: 'בדיקת מהירות אינטרנט ב-Material You עם כלי אבחון רשת אמיתיים' },
    platforms: ['android', 'androidtv', 'webos', 'tizen', 'windows', 'macos', 'linux', 'web', 'stremio', 'kodi', 'cli'],
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3 Expressive', 'Coroutines', 'Firebase'],
  },

  'antigravity-remote': {
    category: 'android', wide: true,
    tagline: { en: 'Control Antigravity IDE from your phone: live agent chats, command approvals, terminal and files', he: 'שליטה ב-Antigravity IDE מהטלפון: שיחות סוכן בשידור חי, אישור פקודות, טרמינל וקבצים' },
    platforms: ['android', 'windows'], stack: ['Kotlin', 'Jetpack Compose', 'TypeScript', 'Node.js', 'WebSockets'],
  },
  tafnit: {
    category: 'android', wide: true,
    tagline: { en: 'Israeli public transit, fast and without ads', he: 'תחבורה ציבורית בישראל, מהירה ובלי פרסומות' },
    platforms: ['android'], stack: ['Kotlin', 'Jetpack Compose', 'Material You', 'GTFS'],
  },
  'update-pulse': {
    category: 'android',
    tagline: { en: 'One feed for every app and service update you follow', he: 'פיד אחד לכל עדכוני האפליקציות והשירותים שאתם עוקבים אחריהם' },
    platforms: ['android'], stack: ['Kotlin', 'Jetpack Compose', 'Room', 'WorkManager'],
  },
  AdBlockVPN: {
    category: 'android', coverIndex: 1,
    tagline: { en: 'Blocks ads and trackers across the whole phone with a local DNS filter', he: 'חוסם פרסומות ומעקב בכל הטלפון דרך מסנן DNS מקומי' },
    platforms: ['android'], stack: ['Kotlin', 'Jetpack Compose', 'VpnService'],
  },
  NovaBrowser: {
    category: 'android',
    tagline: { en: 'An Android browser with ad blocking, reader mode and incognito built in', he: 'דפדפן לאנדרואיד עם חסימת פרסומות, מצב קריאה וגלישה בסתר מובנים' },
    platforms: ['android'], stack: ['Java', 'Android WebView'],
    mockup: { kind: 'phone-browser', url: 'nova://start' },
  },
  'SignalFinder-AR': {
    category: 'android',
    tagline: { en: 'Walks you to the spot with the best signal before a speed test', he: 'מוביל אתכם לנקודה עם הקליטה הכי טובה לפני בדיקת מהירות' },
    platforms: ['android'], stack: ['Kotlin', 'Jetpack Compose', 'Sensors'],
    mockup: { kind: 'phone-signal' },
  },

  'home-rms': {
    category: 'windows', wide: true,
    tagline: { en: 'Remote management for the computers on your home network, only with consent', he: 'ניהול מרחוק של המחשבים ברשת הביתית, רק באישור המשתמש' },
    platforms: ['windows'], stack: ['C#', '.NET 9', 'WPF', 'gRPC', 'Mutual TLS'],
  },
  'smart-tv-desktop-remote': {
    category: 'windows', wide: true,
    tagline: { en: 'Control LG, Samsung, Android TV, Roku, Vizio and Sony TVs from your PC', he: 'שליטה בטלוויזיות LG, סמסונג, Android TV, Roku, Vizio וסוני מהמחשב' },
    platforms: ['windows'], stack: ['JavaScript', 'Electron', 'WebSockets'],
  },
  Stratum: {
    category: 'windows',
    tagline: { en: 'An archive manager for Windows on WinUI 3 and the 7-Zip engine', he: 'מנהל ארכיונים ל-Windows ב-WinUI 3 על מנוע 7-Zip' },
    platforms: ['windows'], stack: ['C#', 'WinUI 3', '7-Zip'],
  },
  'exe-signer': {
    category: 'windows',
    tagline: { en: 'Inspects EXE files and signs them with a certificate it creates itself', he: 'בודק קובצי EXE וחותם עליהם בתעודה שהוא יוצר בעצמו' },
    platforms: ['windows'], stack: ['PowerShell', 'WPF', 'Authenticode'],
  },
  'ExeLat-PoC': {
    category: 'windows', coverIndex: 1,
    tagline: { en: 'Translates compiled Windows programs into right-to-left Hebrew', he: 'מתרגם תוכנות Windows מקומפלות לעברית מימין לשמאל' },
    platforms: ['windows'], stack: ['Python', 'PE resources', 'LLM'],
  },
  klidim: {
    category: 'desktop', wide: true, coverIndex: 1,
    tagline: { en: 'A Hebrew desktop piano: play from the keyboard, falling notes, recording and MIDI', he: 'פסנתר למחשב בעברית: נגינה מהמקלדת, תווים נופלים, הקלטה ומקלדת MIDI' },
    platforms: ['windows'], stack: ['TypeScript', 'Electron', 'React', 'Tone.js', 'Web MIDI'],
  },
  'usb-ai-technician': {
    category: 'windows',
    tagline: { en: 'A PC technician on a USB stick, guided by an offline local AI', he: 'טכנאי מחשבים על דיסק-און-קי, בהדרכת AI מקומי שעובד בלי אינטרנט' },
    platforms: ['windows'], stack: ['PowerShell', 'llama.cpp', 'gpt-oss-20b'],
    mockup: {
      kind: 'terminal', title: 'USB AI Technician',
      lines: ['> Start.cmd', '  Loading gpt-oss-20b on 127.0.0.1 ...  ready', '  Scanning installed programs: 84 found', '  AI flags 11 as bloatware. Keep any? [y/N]', '  Removing 11 programs ...  done', '  Windows Update (security only): 3 updates', '  All tasks finished. Safe to unplug.'],
    },
  },
  WinFlexSetupModern: {
    category: 'windows',
    tagline: { en: 'Scans a PC and applies gaming, privacy or debloat profiles, with one-click undo', he: 'סורק את המחשב ומחיל פרופילי גיימינג, פרטיות או ניקוי, עם ביטול בלחיצה' },
    platforms: ['windows'], stack: ['PowerShell'],
  },
  winFlexMenu: {
    category: 'windows', wide: true,
    tagline: { en: 'A control center for WinFlexOS with a fast WPF dashboard', he: 'מרכז בקרה ל-WinFlexOS עם לוח מחוונים מהיר ב-WPF' },
    platforms: ['windows'], stack: ['PowerShell', 'WPF'],
  },
  'WinFlexOS-Setup': {
    category: 'windows',
    tagline: { en: 'The setup menu that runs after a WinFlexOS install', he: 'תפריט ההגדרה שרץ אחרי התקנת WinFlexOS' },
    platforms: ['windows'], stack: ['PowerShell'],
  },

  'drift-browser': {
    category: 'desktop', wide: true,
    tagline: { en: 'A Chromium browser with vertical tabs, spaces, split view and Glance', he: 'דפדפן Chromium עם לשוניות אנכיות, מרחבים, מסך מפוצל ו-Glance' },
    platforms: ['windows', 'macos', 'linux', 'android'], stack: ['TypeScript', 'Electron', 'React'],
  },
  'nebula-ide': {
    category: 'desktop', wide: true,
    tagline: { en: 'An agent-first code editor on VSCodium, with Claude as the agent', he: 'עורך קוד שמתחיל מהסוכן, על VSCodium עם Claude' },
    platforms: ['windows'], stack: ['JavaScript', 'VSCodium', 'Claude'],
  },
  'vortex-browser': {
    category: 'desktop',
    tagline: { en: 'A Gecko browser with a floating canvas, spaces and hardened privacy', he: 'דפדפן על מנוע Gecko עם קנבס צף, מרחבים ופרטיות מוקשחת' },
    platforms: ['windows', 'macos', 'linux'], stack: ['CSS', 'Gecko', 'user.js'],
  },
  'ytm-desktop': {
    category: 'desktop',
    tagline: { en: 'A desktop YouTube Music client with a built-in ad blocker', he: 'נגן YouTube Music למחשב עם חוסם פרסומות מובנה' },
    platforms: ['windows'], stack: ['TypeScript', 'Electron', 'React'],
    mockup: { kind: 'player', title: 'YouTube Music' },
  },

  'tiktok-webos-tv': {
    category: 'web',
    tagline: { en: 'Phone-style 9:16 TikTok for LG Smart TVs, with a bundled webOS Node.js service and Magic Remote support', he: 'טיקטוק אנכי 9:16 בסגנון טלפון לטלוויזיות LG חכמות, עם שירות Node.js מובנה ותמיכה בשלט החכם' },
    platforms: ['webos'], stack: ['JavaScript', 'webOS SDK', 'Node.js', 'Luna Bus'],
  },
  'walkie-talkie': {
    category: 'web',
    tagline: { en: 'Push to talk in the browser, straight between devices, no sign-up', he: 'לוחצים ומדברים בדפדפן, ישירות בין המכשירים, בלי הרשמה' },
    platforms: ['web'], stack: ['HTML', 'WebRTC', 'PeerJS'],
  },
  'digital-recipe-book': {
    category: 'web', coverIndex: 1, wide: true,
    tagline: { en: 'A recipe book whose pages turn like a real leather-bound book', he: 'ספר מתכונים שהדפים שלו מתהפכים כמו בספר כרוך בעור' },
    platforms: ['web'], stack: ['TypeScript', 'Next.js', 'Supabase'],
  },
  'Command-Library-CMD-Terminal-': {
    category: 'web',
    tagline: { en: 'Offline-first library of CMD and terminal commands, in Hebrew and English', he: 'מאגר פקודות CMD וטרמינל שעובד גם בלי אינטרנט, בעברית ובאנגלית' },
    platforms: ['web'], stack: ['JavaScript', 'PWA'],
  },

  'minesweeper-ultra-4k': {
    category: 'games',
    tagline: { en: 'Minesweeper rebuilt in 4K vector graphics, with an AI solver and six themes', he: 'שולה המוקשים בגרפיקה וקטורית 4K, עם פותר AI ושש ערכות נושא' },
    platforms: ['windows', 'web'], stack: ['JavaScript', 'Canvas', 'Web Audio'],
  },
  'icy-tower-mario-he-4k': {
    category: 'games',
    tagline: { en: 'A Hebrew Super Mario edition of Icy Tower, up to 8K, playable in the browser', he: 'מהדורת סופר מריו של Icy Tower בעברית, עד 8K, גם בדפדפן' },
    platforms: ['windows', 'web'], stack: ['JavaScript', 'Ruffle'],
  },
  'sonic-flash-he': {
    category: 'games',
    tagline: { en: 'Ultimate Flash Sonic in Hebrew, upscaled for 4K and 8K screens', he: 'סוניק פלאש האולטימטיבי בעברית, מוגדל למסכי 4K ו-8K' },
    platforms: ['windows', 'web'], stack: ['Python', 'xBRZ'],
  },
  'ci3-hebrew-4k': {
    category: 'games', wide: true,
    tagline: { en: 'A Hebrew 4K launcher for Chicken Invaders 3 that runs the original game', he: 'משגר בעברית וב-4K לפולשי התרנגולות 3 שמריץ את המשחק המקורי' },
    platforms: ['windows'], stack: ['Go'],
  },
  'cs-remastered': {
    category: 'games', skip: [2],
    tagline: { en: 'A tactical shooter rebuilt with PBR materials and a modern UI in Godot', he: 'משחק יריות טקטי שנבנה מחדש עם חומרי PBR וממשק מודרני ב-Godot' },
    platforms: ['windows'], stack: ['GDScript', 'Godot'],
  },
  'webos-tv-games': {
    category: 'games',
    tagline: { en: 'Retro arcade games packaged for LG webOS TVs, with IPK installers', he: 'משחקי ארקייד רטרו לטלוויזיות LG webOS, עם קובצי IPK להתקנה' },
    platforms: ['webos'], stack: ['HTML', 'webOS SDK'],
  },

  'OmniBlock-DNS': {
    category: 'bots',
    tagline: { en: 'A self-hosted DNS ad blocker in the spirit of Pi-hole and AdGuard Home', he: 'חוסם פרסומות ב-DNS לאירוח עצמי, ברוח Pi-hole ו-AdGuard Home' },
    platforms: ['linux', 'windows'], stack: ['Node.js', 'React', 'Vite'],
    mockup: { kind: 'dashboard', title: 'OmniBlock DNS' },
  },
  botwave: {
    category: 'bots',
    tagline: { en: 'A Hebrew WhatsApp bot with personalities, reminders and a Windows manager', he: 'בוט וואטסאפ בעברית עם מצבי אישיות, תזכורות ותוכנת ניהול ל-Windows' },
    platforms: ['whatsapp', 'windows'], stack: ['Node.js', 'Baileys'],
    mockup: {
      kind: 'chat', app: 'whatsapp', title: 'BotWave',
      msgs: [
        { me: true, text: { en: 'Remind me to call Dana at 18:00', he: 'תזכיר לי להתקשר לדנה ב-18:00' } },
        { text: { en: 'Done. I will remind you at 18:00.', he: 'סגור. אזכיר לך ב-18:00.' } },
        { me: true, text: { en: '/mode pirate', he: '/מצב פיראט' } },
        { text: { en: 'Arr, pirate mode on, matey.', he: 'אהוי! מצב פיראט הופעל, חבר.' } },
      ],
    },
  },
  FixyBot: {
    category: 'bots',
    tagline: { en: 'A Telegram tech-support bot on Gemini that reads screenshots of errors', he: 'בוט תמיכה טכנית בטלגרם על Gemini שקורא צילומי מסך של תקלות' },
    platforms: ['telegram'], stack: ['Python', 'Gemini', 'Docker'],
    mockup: {
      kind: 'chat', app: 'telegram', title: 'FixyBot',
      msgs: [
        { me: true, text: { en: 'My Wi-Fi drops every few minutes', he: 'ה-Wi-Fi שלי מתנתק כל כמה דקות' } },
        { text: { en: 'Try turning off power saving for the network adapter. Steps: Device Manager, Network adapters, Properties, Power Management.', he: 'נסו לכבות חיסכון בחשמל לכרטיס הרשת: מנהל ההתקנים, מתאמי רשת, מאפיינים, ניהול צריכת חשמל.' } },
      ],
    },
  },
  'FixyBot-WhatsApp': {
    category: 'bots',
    tagline: { en: 'The same Gemini tech-support bot, on WhatsApp', he: 'אותו בוט תמיכה טכנית על Gemini, בוואטסאפ' },
    platforms: ['whatsapp'], stack: ['Python', 'Gemini'],
    mockup: {
      kind: 'chat', app: 'whatsapp', title: 'FixyBot',
      msgs: [
        { me: true, text: { en: 'Printer says offline', he: 'המדפסת מראה מנותקת' } },
        { text: { en: 'Restart the Print Spooler service, then remove and re-add the printer.', he: 'הפעילו מחדש את שירות Print Spooler, ואז הסירו והוסיפו את המדפסת מחדש.' } },
      ],
    },
  },
}
