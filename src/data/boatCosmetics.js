import greatLakeMidnight from '../assets/boats/great-lake-midnight.png'
import greatLakeHeritageRed from '../assets/boats/great-lake-heritage-red.png'
import gulfCoastSunsetCoral from '../assets/boats/gulf-coast-sunset-coral.png'
import gulfCoastDeepOcean from '../assets/boats/gulf-coast-deep-ocean.png'

export const boatCosmetics = [
  { id: 'great-lake-original', boatId: 'great-lake-skiff', name: 'Classic Green', included: true },
  { id: 'great-lake-midnight', boatId: 'great-lake-skiff', name: 'Midnight Blue', entitlementId: 'boat-style:great-lake-classics', image: greatLakeMidnight },
  { id: 'great-lake-heritage-red', boatId: 'great-lake-skiff', name: 'Heritage Red', entitlementId: 'boat-style:great-lake-classics', image: greatLakeHeritageRed },
  { id: 'gulf-coast-original', boatId: 'gulf-coast-bay-skiff', name: 'Coastal Teal', included: true },
  { id: 'gulf-coast-sunset-coral', boatId: 'gulf-coast-bay-skiff', name: 'Sunset Coral', entitlementId: 'boat-style:gulf-coast-colors', image: gulfCoastSunsetCoral },
  { id: 'gulf-coast-deep-ocean', boatId: 'gulf-coast-bay-skiff', name: 'Deep Ocean', entitlementId: 'boat-style:gulf-coast-colors', image: gulfCoastDeepOcean },
]

export const getBoatCosmetic = (id) => boatCosmetics.find((cosmetic) => cosmetic.id === id)
export const getBoatCosmetics = (boatId) => boatCosmetics.filter((cosmetic) => cosmetic.boatId === boatId)
export const getDefaultBoatCosmetic = (boatId) => getBoatCosmetics(boatId).find((cosmetic) => cosmetic.included)
export const isBoatCosmeticOwned = (state, cosmetic) => cosmetic.included || state.commerce?.entitlementIds.includes(cosmetic.entitlementId)
export const getEquippedBoatImage = (state, boat) => {
  const cosmetic = getBoatCosmetic(state.watercraft?.cosmeticByBoat?.[boat.id])
  return cosmetic?.boatId === boat.id && isBoatCosmeticOwned(state, cosmetic) && cosmetic.image ? cosmetic.image : boat.image
}
