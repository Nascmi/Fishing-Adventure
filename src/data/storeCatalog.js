// Stable product IDs must match Google Play Console exactly. Only prepared products
// enter the live catalog; concepts remain hidden until their authored content exists.
export const storeProducts = [
  {
    id: 'cabin.workshop',
    name: 'Workshop Cabin',
    category: 'cabin',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 1.99,
    description: 'A practical cabin where five owned rods fill the rack and reels, lures, and tackle fit six dedicated cabinet displays.',
    entitlements: ['cabin:workshop-cabin'],
  },
  {
    id: 'cabin.lakeside_cottage',
    name: 'Lakeside Cottage',
    category: 'cabin',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 1.99,
    description: 'A complete bright cottage with authored spaces for earned paintings and travel memories.',
    entitlements: ['cabin:lakeside-cottage'],
  },
  {
    id: 'cabin.coastal_shack',
    name: 'Coastal Shack',
    category: 'cabin',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 1.99,
    description: 'A Gulf retreat with nautical shelves, five dockside hanging pegs, and a dedicated table for collectible model boats.',
    entitlements: ['cabin:coastal-shack'],
  },
  {
    id: 'cabin.trophy_room',
    name: 'Grand Trophy Room',
    category: 'cabin',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 2.99,
    description: 'A complete premium gallery with twelve mounts for your own preserved Great and Trophy catches.',
    entitlements: ['cabin:trophy-room'],
  },
  {
    id: 'supporter.campfire',
    name: 'Campfire Supporter',
    category: 'supporter',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 0.99,
    description: 'A small, optional thank-you purchase for anglers who want to help Fishing Adventure grow.',
    entitlements: ['supporter:community'],
  },
  {
    id: 'supporter.lakeside',
    name: 'Lakeside Supporter',
    category: 'supporter',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 2.99,
    description: 'The same permanent supporter recognition, at a middle contribution level.',
    entitlements: ['supporter:community'],
  },
  {
    id: 'supporter.expedition',
    name: 'Expedition Supporter',
    category: 'supporter',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 4.99,
    description: 'The same permanent supporter recognition, for anglers who simply wish to contribute more.',
    entitlements: ['supporter:community'],
  },
  {
    id: 'boat_style.great_lake_classics',
    name: 'Great Lake Hull Colors',
    category: 'boat-style',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 0.99,
    description: 'Midnight Blue and Heritage Red finishes for your earned Great Lake Skiff.',
    entitlements: ['boat-style:great-lake-classics'],
  },
  {
    id: 'boat_style.gulf_coast_colors',
    name: 'Gulf Coast Hull Colors',
    category: 'boat-style',
    productType: 'non-consumable',
    status: 'prepared',
    suggestedUsd: 0.99,
    description: 'Sunset Coral and Deep Ocean finishes for your earned Gulf Coast Bay Skiff.',
    entitlements: ['boat-style:gulf-coast-colors'],
  },
  {
    id: 'decor.workshop_details',
    name: 'Workshop Details',
    category: 'decor-pack',
    productType: 'non-consumable',
    status: 'concept',
    suggestedUsd: 0.99,
    description: 'Additional cosmetic tackle-box, task-lamp, and workbench treatments for compatible slots.',
    entitlements: ['decor-pack:workshop-details'],
  },
  {
    id: 'decor.cottage_comforts',
    name: 'Cottage Comforts',
    category: 'decor-pack',
    productType: 'non-consumable',
    status: 'concept',
    suggestedUsd: 0.99,
    description: 'Additional cosmetic textile, plant, and reading-corner treatments for compatible slots.',
    entitlements: ['decor-pack:cottage-comforts'],
  },
  {
    id: 'decor.coastal_memories',
    name: 'Coastal Memories',
    category: 'decor-pack',
    productType: 'non-consumable',
    status: 'concept',
    suggestedUsd: 0.99,
    description: 'Additional cosmetic lantern, ropework, and weathered-nautical treatments for compatible slots.',
    entitlements: ['decor-pack:coastal-memories'],
  },
  {
    id: 'decor.cabin_palette',
    name: 'Cabin Palette Collection',
    category: 'style-pack',
    productType: 'non-consumable',
    status: 'concept',
    suggestedUsd: 0.99,
    description: 'Additional authored rug, display-frame, and timber-finish choices for compatible cabins.',
    entitlements: ['style-pack:cabin-palette'],
  },
  {
    id: 'bundle.cabin_collection',
    name: 'Cabin Collection',
    category: 'bundle',
    productType: 'non-consumable',
    status: 'concept',
    suggestedUsd: 4.99,
    description: 'The three classic optional cabins in one permanent collection.',
    entitlements: ['cabin:workshop-cabin', 'cabin:lakeside-cottage', 'cabin:coastal-shack'],
  },
]

export const storePolicy = {
  live: true,
  showInApp: true,
  pricesAreTentative: true,
  requiresPlatformProducts: true,
  requiresPurchaseRestoration: true,
  consumablesAllowed: false,
  grantsGameplayPower: false,
  grantsEarnedCosmetics: false,
}

export const getStoreProduct = (id) => storeProducts.find((product) => product.id === id)

export const preparedStoreProducts = storeProducts.filter((product) => product.status === 'prepared')
export const storeProductIds = preparedStoreProducts.map((product) => product.id)
export const knownEntitlementIds = [...new Set(storeProducts.flatMap((product) => product.entitlements))]

export const getEntitlementsForProducts = (productIds = []) => [...new Set(productIds
  .map(getStoreProduct)
  .filter(Boolean)
  .flatMap((product) => product.entitlements))]

export const hasProductEntitlement = (entitlementIds, productId) => {
  const product = getStoreProduct(productId)
  return Boolean(product?.entitlements.some((entitlement) => entitlementIds.includes(entitlement)))
}
