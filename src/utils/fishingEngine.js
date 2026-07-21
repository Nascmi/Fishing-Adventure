import { fish } from '../data/fish'
import { RARITY_ORDER } from '../data/rarities'
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
  'vermilion-snapper': ['morning', 'evening'], 'spanish-mackerel': ['morning', 'midday'], 'gray-triggerfish': ['midday'],
  'red-snapper': ['morning', 'evening'], 'king-mackerel': ['morning', 'midday'], 'greater-amberjack': ['midday', 'evening'],
  'mahi-mahi': ['midday'], 'yellowfin-tuna': ['morning', 'midday'],
}
export const randomDelay = (min,max) => Math.round(min + Math.random() * (max-min))
const weightedPick = (pool, weights, random) => {
  let roll = random() * weights.reduce((sum, weight) => sum + weight, 0)
  for (let index = 0; index < pool.length; index += 1) {
    roll -= weights[index]
    if (roll <= 0) return pool[index]
  }
  return pool[pool.length - 1]
}
export function selectFish(chances, allowedIds, phase = 'morning', random = Math.random, fishWeights = {}) {
  const eligible = fish.filter((item) => allowedIds.includes(item.id))
  const rarityWeights = Object.fromEntries(RARITY_ORDER.map((rarity) => [rarity, 0]))
  for (const [rarity, chance] of Object.entries(chances)) {
    let index = RARITY_ORDER.indexOf(rarity)
    while (index >= 0 && !eligible.some((item) => item.rarity === RARITY_ORDER[index])) index -= 1
    if (index >= 0) rarityWeights[RARITY_ORDER[index]] += chance
  }
  const rarityCounts = Object.fromEntries(RARITY_ORDER.map((rarity) => [rarity, eligible.filter((item) => item.rarity === rarity).length]))
  const weights = eligible.map((item) => {
    const baseline = rarityWeights[item.rarity] / Math.max(1, rarityCounts[item.rarity])
    return baseline * (preferredPhases[item.id]?.includes(phase) ? 2.25 : 1) * (fishWeights[item.id] || 1)
  })
  return weightedPick(eligible, weights, random) || fish[0]
}

export const getFishActivity = (fishId, phase) => preferredPhases[fishId]?.includes(phase) ? 'Peak' : 'Possible'
export const getPreferredPhases = (fishId) => preferredPhases[fishId] || ['morning', 'midday', 'evening', 'night']
