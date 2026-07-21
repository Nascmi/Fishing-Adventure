import { GAME_CONFIG } from '../data/config'
import { fish as fishData } from '../data/fish'
import { RARITY_VALUE_MULTIPLIERS } from '../data/rarities'

function selectWeightTier(random) {
  let roll = random() * 100
  for (const tier of GAME_CONFIG.catchWeights) {
    roll -= tier.chance
    if (roll <= 0) return tier
  }
  return GAME_CONFIG.catchWeights[0]
}

export function classifyWeight(fish, weight) {
  const percentOfMaximum = weight / fish.maxWeight
  return [...GAME_CONFIG.catchWeights]
    .reverse()
    .find((tier) => percentOfMaximum >= tier.minPercent)?.id || 'ordinary'
}

export function getWeightTier(tierId) {
  return GAME_CONFIG.catchWeights.find((tier) => tier.id === tierId) || GAME_CONFIG.catchWeights[0]
}

export function makeCatch(fish, random = Math.random, now = Date.now()) {
  const tier = selectWeightTier(random)
  const lowerBound = Math.max(fish.minWeight, fish.maxWeight * tier.minPercent)
  const upperBound = Math.max(lowerBound, fish.maxWeight * tier.maxPercent)
  const weight = Math.round((lowerBound + random() * (upperBound - lowerBound)) * 100) / 100
  const sizeRatio = weight / fish.minWeight
  const value = Math.max(
    1,
    Math.round(fish.baseValue * (0.55 + sizeRatio * 0.45) * RARITY_VALUE_MULTIPLIERS[fish.rarity]),
  )

  return {
    catchId: `${now}-${random().toString(36).slice(2, 8)}`,
    fishId: fish.id,
    name: fish.name,
    rarity: fish.rarity,
    weight,
    sizeTier: tier.id,
    value,
    caughtAt: new Date(now).toISOString(),
  }
}

export function classifyStoredCatch(catchItem) {
  const fish = fishData.find((item) => item.id === catchItem.fishId)
  return fish ? classifyWeight(fish, catchItem.weight) : 'ordinary'
}
