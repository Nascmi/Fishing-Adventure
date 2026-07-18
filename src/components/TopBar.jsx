import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
export default function TopBar(){const {game}=useGame();return <header className="topbar"><div><span className="eyebrow">Willow Pond</span><h1>Fishing Adventure</h1></div><div className="wallet"><strong>{game.coins.toLocaleString()}</strong><span>coins</span></div><div className="rod-chip">{getRod(game.equippedRod).name}</div></header>}
