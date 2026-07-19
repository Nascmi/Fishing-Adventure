import { fish } from '../data/fish'
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']
const preferredPhases = {
  bluegill: ['morning', 'evening'], sunfish: ['midday'], crappie: ['morning', 'evening'],
  'largemouth-bass': ['morning', 'evening'], catfish: ['evening', 'night'], 'old-whiskers': ['night'],
  'mountain-whitefish': ['morning'], 'coastal-cutthroat': ['morning', 'evening'], 'rainbow-trout': ['morning'],
  steelhead: ['morning', 'evening'], 'chinook-salmon': ['morning'], perch: ['morning', 'midday'],
  'rock-bass': ['evening'], 'smallmouth-bass': ['morning', 'evening'], walleye: ['evening', 'night'],
  'lake-trout': ['morning', 'night'], 'northern-pike': ['morning', 'midday'], 'great-lakes-muskellunge': ['evening'],
  'atlantic-croaker': ['evening', 'night'], 'sand-seatrout': ['evening', 'night'], sheepshead: ['midday'],
  'southern-flounder': ['evening', 'night'], 'spotted-seatrout': ['morning', 'evening'], 'black-drum': ['morning', 'evening'],
  'red-drum': ['morning', 'evening'], cobia: ['midday'],
}
export const randomDelay = (min,max) => Math.round(min + Math.random() * (max-min))
const weightedPick = (pool, weights) => {
  let roll = Math.random() * weights.reduce((sum, weight) => sum + weight, 0)
  for (let index = 0; index < pool.length; index += 1) {
    roll -= weights[index]
    if (roll <= 0) return pool[index]
  }
  return pool[pool.length - 1]
}
export function selectFish(chances, allowedIds, phase = 'morning') {
  const eligible = fish.filter((item) => allowedIds.includes(item.id))
  const rarityWeights = Object.fromEntries(rarityOrder.map((rarity) => [rarity, 0]))
  for (const [rarity, chance] of Object.entries(chances)) {
    let index = rarityOrder.indexOf(rarity)
    while (index >= 0 && !eligible.some((item) => item.rarity === rarityOrder[index])) index -= 1
    if (index >= 0) rarityWeights[rarityOrder[index]] += chance
  }
  const rarityCounts = Object.fromEntries(rarityOrder.map((rarity) => [rarity, eligible.filter((item) => item.rarity === rarity).length]))
  const weights = eligible.map((item) => {
    const baseline = rarityWeights[item.rarity] / Math.max(1, rarityCounts[item.rarity])
    return baseline * (preferredPhases[item.id]?.includes(phase) ? 2.25 : 1)
  })
  return weightedPick(eligible, weights) || fish[0]
}

export const getFishActivity = (fishId, phase) => preferredPhases[fishId]?.includes(phase) ? 'Peak' : 'Possible'
export const getPreferredPhases = (fishId) => preferredPhases[fishId] || ['morning', 'midday', 'evening', 'night']
