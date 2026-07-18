import { fish } from '../data/fish'
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']
export const randomDelay = (min,max) => Math.round(min + Math.random() * (max-min))
export function selectFish(chances, allowedIds) {
  let roll = Math.random()*100, rarity = 'common'
  for (const [level, chance] of Object.entries(chances)) { roll -= chance; if (roll <= 0) { rarity=level; break } }
  const eligible = fish.filter((item) => allowedIds.includes(item.id))
  let pool = eligible.filter((item) => item.rarity === rarity)
  for (let index = rarityOrder.indexOf(rarity) - 1; !pool.length && index >= 0; index -= 1) {
    pool = eligible.filter((item) => item.rarity === rarityOrder[index])
  }
  if (!pool.length) pool = eligible
  return pool[Math.floor(Math.random() * pool.length)] || fish[0]
}
