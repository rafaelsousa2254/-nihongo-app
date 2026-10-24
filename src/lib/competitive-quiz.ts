export interface Competitor {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  lastActive: string
}

const BOT_NAMES = [
  'たなか', 'さとう', ' Suzuki', ' Yamamoto', ' Watanabe',
  'Itou', 'Saitou', 'Kobayashi', 'Yoshida', 'Yamada',
  'Sato', 'Tanaka', 'Watanabe', 'Ito', 'Nakamura',
  'Kobayashi', 'Kato', 'Yoshida', 'Yamashita', 'Sasaki',
]

const BOT_AVATARS = [' samurai', '🌸', '🎌', '🗾', '⛩️', '🏯', '🐉', '🎋', '🎑', '🏮']

export function generateCompetitors(count: number): Competitor[] {
  const competitors: Competitor[] = []
  const usedNames = new Set<string>()

  for (let i = 0; i < count; i++) {
    let name: string
    do {
      name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]
    } while (usedNames.has(name))
    usedNames.add(name)

    competitors.push({
      id: `bot-${i}`,
      name,
      avatar: BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)],
      xp: Math.floor(Math.random() * 5000) + 500,
      level: Math.floor(Math.random() * 15) + 1,
      streak: Math.floor(Math.random() * 30),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    })
  }

  return competitors.sort((a, b) => b.xp - a.xp)
}

export function getLeaderboardWithUser(
  userXp: number,
  userLevel: number,
  userStreak: number,
  userName: string
): Competitor[] {
  const bots = generateCompetitors(9)
  const user: Competitor = {
    id: 'user',
    name: userName || 'Você',
    avatar: '🎌',
    xp: userXp,
    level: userLevel,
    streak: userStreak,
    lastActive: new Date().toISOString(),
  }

  return [...bots, user].sort((a, b) => b.xp - a.xp)
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}
