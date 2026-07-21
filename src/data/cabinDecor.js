import { includedCabinCosmetics } from './cabinCatalog'
import { coinStoreItems } from './coinStoreCatalog'
import { fish } from './fish'
import { locations } from './locations'
import { locationPaintings } from './locationPaintings'
import { rods } from './rods'
import workshopLureBoard from '../assets/decor/workshop-lure-board.png'
import dockRopeFloat from '../assets/decor/dock-rope-float.png'

const displayTagsById = {
  'display-brass-reel': ['tackle'], 'display-painted-bobber': ['tackle'], 'display-weathered-tackle-tin': ['tackle'],
  'trading-post.decor-antique-creel': ['tackle', 'nautical'], 'trading-post.decor-hand-carved-decoy': ['nautical'],
  'trading-post.model-freshwater-skiff': ['model-boat'], 'trading-post.model-bay-skiff': ['model-boat'], 'trading-post.model-charter-boat': ['model-boat'],
  'trading-post.plaque-100k-club': ['plaque'],
}

const included = Object.entries(includedCabinCosmetics).flatMap(([group, items]) => items.map((item) => ({
  ...item,
  source: 'included',
  hookType: group === 'displays' ? 'display' : group === 'rugs' ? 'rug' : group === 'frames' ? 'frame' : 'finish',
  frameRole: group === 'frames' ? 'treatment' : undefined,
  displayTags: displayTagsById[item.id] || [],
})))

const purchased = coinStoreItems.filter((item) => item.hookType).map((item) => ({ ...item, source: 'trading-post', frameRole: item.hookType === 'frame' ? 'treatment' : undefined, displayTags: displayTagsById[item.id] || [] }))

const authoredDisplays = [
  { id: 'included.workshop-lure-board', name: 'Classic Lure Board', hookType: 'display', source: 'included', artwork: workshopLureBoard, fit: 'contain', colors: ['#49301f', '#bc9552'], displayTags: ['tackle'] },
  { id: 'included.dock-rope-float', name: 'Dockside Rope & Float', hookType: 'display', source: 'included', artwork: dockRopeFloat, fit: 'contain', colors: ['#ab895e', '#5d8d7d'], displayTags: ['nautical', 'nautical-peg'] },
]

export const staticCabinDecor = [...included, ...purchased, ...authoredDisplays]

export const getCabinDecor = (state) => [
  ...staticCabinDecor,
  ...rods.filter((rod) => state.gearByLocation[rod.locationId]?.ownedRods.includes(rod.id)).map((rod) => ({ id: `equipment.rod.${rod.id}`, name: rod.name, hookType: 'display', source: 'equipment', artwork: rod.image, fit: 'contain', colors: ['#59422d', '#c7a45c'], displayTags: ['rod'] })),
  ...locations.filter((location) => state.achievementProgress.paintingsEarned.includes(location.id)).map((location) => ({ id: `earned.painting.${location.id}`, name: `${location.name} Painting`, hookType: 'frame', frameRole: 'artwork', source: 'earned', artwork: locationPaintings.find((painting) => painting.locationId === location.id)?.artwork, colors: state.achievementProgress.masterFramesEarned.includes(location.id) ? ['#5b4217', '#edca59'] : ['#496d67', '#d5bd79'] })),
  ...locations.filter((location) => state.achievementProgress.upgradedSouvenirs.includes(location.id)).map((location) => ({ id: `earned.souvenir.${location.id}`, name: `${location.name} Souvenir`, hookType: 'display', source: 'earned', artwork: location.image, colors: ['#57756d', '#d4c18e'], displayTags: ['souvenir', 'nautical'] })),
  ...locations.filter((location) => state.achievementProgress.equipmentPlaques.includes(location.id)).map((location) => ({ id: `earned.plaque.${location.id}`, name: `${location.name} Equipment Plaque`, hookType: 'display', source: 'earned', colors: ['#735633', '#d0ae5c'], displayTags: ['plaque'] })),
  ...fish.filter((item) => state.achievementProgress.amazingPhotos.includes(item.id)).map((item) => ({ id: `earned.photo.${item.id}`, name: `${item.name} Photograph`, hookType: 'frame', frameRole: 'artwork', source: 'earned', artwork: item.image, colors: ['#335e60', '#e7d5a5'] })),
  ...fish.filter((item) => state.achievementProgress.legendaryMiniatures.includes(item.id)).map((item) => ({ id: `earned.miniature.${item.id}`, name: `${item.name} Miniature`, hookType: 'display', source: 'earned', artwork: item.image, colors: ['#284c4d', '#c4a450'], displayTags: ['miniature', 'nautical'] })),
]

export const isDecorOwned = (state, item) => item.source !== 'trading-post' || state.coinStore.ownedItemIds.includes(item.id)
export const getOwnedCabinDecor = (state) => getCabinDecor(state).filter((item) => isDecorOwned(state, item))
export const isDecorCompatible = (hook, item) => Boolean(hook && item && item.hookType === hook.type && (!hook.accepts?.length || hook.accepts.some((tag) => item.displayTags?.includes(tag))))
