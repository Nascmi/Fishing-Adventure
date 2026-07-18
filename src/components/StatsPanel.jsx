import { useGame } from '../hooks/useGame'

export default function StatsPanel() {
  const { game } = useGame()
  const stats = game.stats
  return <section className="panel stats" aria-label="Fishing statistics"><div><b>{stats.totalCaught}</b><span>Fish caught</span></div><div><b>{stats.totalCasts}</b><span>Total casts</span></div><div><b>{stats.escaped}</b><span>Escaped</span></div><div><b>{stats.totalCoinsEarned}</b><span>Coins earned</span></div><div><b>{stats.largestFish ? `${stats.largestFish.weight} lb` : '—'}</b><span>Largest catch</span></div><div><b>{stats.rarestFish?.name || '—'}</b><span>Rarest catch</span></div></section>
}
