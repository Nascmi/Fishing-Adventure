import { locations } from './locations'
import { fish } from './fish'
import { getRodsForLocation } from './rods'

export const locationPaintings = locations.map((location) => ({
  id: `painting-${location.id}`,
  locationId: location.id,
  name: `${location.name} Painting`,
  description: location.id === 'willow-pond'
    ? 'Earned by discovering every species in Backyard Pond.'
    : `Earned by completing a full three-day charter at ${location.name}.`,
  artwork: location.image,
}))

const hasFullCollection = (state, location) => location.fishIds.every((fishId) => state.collection[fishId]?.count)
const hasMasteredSpecies = (state, location) => location.fishIds.every((fishId) => state.cabin.specimens[fishId])

export const unlockLocationCosmetics = (state) => {
  const earnedPaintings = new Set(state.achievementProgress.paintingsEarned)
  const earnedFrames = new Set(state.achievementProgress.masterFramesEarned)
  const earnedSouvenirs = new Set(state.achievementProgress.upgradedSouvenirs)
  const earnedPlaques = new Set(state.achievementProgress.equipmentPlaques)
  const earnedPhotos = new Set(state.achievementProgress.amazingPhotos)
  const earnedMiniatures = new Set(state.achievementProgress.legendaryMiniatures)

  locations.forEach((location) => {
    const paintingEarned = location.id === 'willow-pond'
      ? hasFullCollection(state, location)
      : state.achievementProgress.completedTrips.includes(location.id)
    if (paintingEarned) earnedPaintings.add(location.id)
    if (hasMasteredSpecies(state, location)) earnedFrames.add(location.id)
    if (hasFullCollection(state, location)) earnedSouvenirs.add(location.id)
    const ownedRods = state.gearByLocation[location.id]?.ownedRods || []
    if (getRodsForLocation(location.id).every((rod) => ownedRods.includes(rod.id))) earnedPlaques.add(location.id)
  })

  fish.forEach((fishItem) => {
    if (state.cabin.specimens[fishItem.id]?.sizeTier === 'amazing') earnedPhotos.add(fishItem.id)
    if (fishItem.rarity === 'legendary' && state.collection[fishItem.id]?.count) earnedMiniatures.add(fishItem.id)
  })

  return {
    ...state,
    achievementProgress: {
      ...state.achievementProgress,
      paintingsEarned: [...earnedPaintings],
      masterFramesEarned: [...earnedFrames],
      upgradedSouvenirs: [...earnedSouvenirs],
      equipmentPlaques: [...earnedPlaques],
      amazingPhotos: [...earnedPhotos],
      legendaryMiniatures: [...earnedMiniatures],
    },
  }
}
