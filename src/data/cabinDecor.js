import { includedCabinCosmetics } from './cabinCatalog'
import { coinStoreItems } from './coinStoreCatalog'
import { fish } from './fish'
import { locations } from './locations'
import { locationPaintings } from './locationPaintings'

const included = Object.entries(includedCabinCosmetics).flatMap(([group, items]) => items.map((item) => ({
  ...item,
  source: 'included',
  hookType: group === 'rugs' ? 'rug' : group === 'frames' ? 'frame' : 'finish',
})))

const purchased = coinStoreItems.filter((item) => item.hookType).map((item) => ({ ...item, source: 'trading-post' }))

export const staticCabinDecor = [...included, ...purchased]

export const getCabinDecor = (state) => [
  ...staticCabinDecor,
  ...locations.filter((location) => state.achievementProgress.paintingsEarned.includes(location.id)).map((location) => ({ id: `earned.painting.${location.id}`, name: `${location.name} Painting`, hookType: 'frame', source: 'earned', artwork: locationPaintings.find((painting) => painting.locationId === location.id)?.artwork, colors: state.achievementProgress.masterFramesEarned.includes(location.id) ? ['#5b4217', '#edca59'] : ['#496d67', '#d5bd79'] })),
  ...locations.filter((location) => state.achievementProgress.upgradedSouvenirs.includes(location.id)).map((location) => ({ id: `earned.souvenir.${location.id}`, name: `${location.name} Souvenir`, hookType: 'display', source: 'earned', artwork: location.image, colors: ['#57756d', '#d4c18e'] })),
  ...locations.filter((location) => state.achievementProgress.equipmentPlaques.includes(location.id)).map((location) => ({ id: `earned.plaque.${location.id}`, name: `${location.name} Equipment Plaque`, hookType: 'display', source: 'earned', colors: ['#735633', '#d0ae5c'] })),
  ...fish.filter((item) => state.achievementProgress.amazingPhotos.includes(item.id)).map((item) => ({ id: `earned.photo.${item.id}`, name: `${item.name} Photograph`, hookType: 'frame', source: 'earned', artwork: item.image, colors: ['#335e60', '#e7d5a5'] })),
  ...fish.filter((item) => state.achievementProgress.legendaryMiniatures.includes(item.id)).map((item) => ({ id: `earned.miniature.${item.id}`, name: `${item.name} Miniature`, hookType: 'display', source: 'earned', artwork: item.image, colors: ['#284c4d', '#c4a450'] })),
]

export const isDecorOwned = (state, item) => item.source !== 'trading-post' || state.coinStore.ownedItemIds.includes(item.id)
export const getOwnedCabinDecor = (state) => getCabinDecor(state).filter((item) => isDecorOwned(state, item))
