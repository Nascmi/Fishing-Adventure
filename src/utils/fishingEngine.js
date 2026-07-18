import { fish } from '../data/fish'
export const randomDelay = (min,max) => Math.round(min + Math.random() * (max-min))
export function selectFish(chances, allowedIds) {
  let roll = Math.random()*100, rarity = 'common'
  for (const [level, chance] of Object.entries(chances)) { roll -= chance; if (roll <= 0) { rarity=level; break } }
  const pool = fish.filter(item => item.rarity===rarity && allowedIds.includes(item.id))
  return pool[Math.floor(Math.random()*pool.length)] || fish[0]
}
