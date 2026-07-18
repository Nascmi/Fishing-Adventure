import { fish } from './fish'

const troutIds = new Set(['rainbow-trout', 'golden-trout'])

export const locations = [{
  id: 'willow-pond',
  name: 'Willow Pond',
  description: 'A quiet, reed-fringed pond beneath the willows.',
  fishIds: fish.filter((item) => !troutIds.has(item.id)).map((item) => item.id),
}]

export const futureLocations = ['Pine River', 'Mountain Lake', 'Coastal Bay', 'Deep Sea']

export const plannedLocationFish = {
  'pine-river': ['rainbow-trout'],
  'mountain-lake': ['golden-trout'],
}
