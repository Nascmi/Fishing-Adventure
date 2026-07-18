import Icon from './Icon'
import { getFish } from '../data/fish'

export default function FishArtwork({ fishId, name, hidden = false, className = '' }) {
  const fish = getFish(fishId)
  if (hidden) return <div className={`fish-artwork hidden-art ${className}`} aria-label="Undiscovered fish"><span>?</span></div>
  if (!fish?.image) return <div className={`fish-artwork ${className}`}><Icon name="fish" size={34}/></div>
  return <div className={`fish-artwork ${className}`}><img src={fish.image} alt={name || fish.name} draggable="false"/></div>
}
