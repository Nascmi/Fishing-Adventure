import { RARITY } from '../data/fish'
export function makeCatch(fish) {
  const weight = Math.round((fish.minWeight + Math.random()*(fish.maxWeight-fish.minWeight))*100)/100
  const sizeRatio = weight / fish.minWeight
  const value = Math.max(1, Math.round(fish.baseValue * (0.55 + sizeRatio*.45) * RARITY[fish.rarity]))
  return {catchId:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,fishId:fish.id,name:fish.name,rarity:fish.rarity,weight,value,caughtAt:new Date().toISOString()}
}
