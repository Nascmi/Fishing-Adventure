const hook = (id, name, type, bounds) => ({ id, name, type, bounds })

// Bounds are percentages of each authored cabin scene. They intentionally belong
// to the room, not the decor item, so every compatible choice sits naturally.
export const cabinCatalog = [
  {
    id: 'starter', name: 'Starter Cabin', artworkKey: 'cabin.webp',
    description: 'A humble home for one preserved catch and one travel memory.',
    acquisition: { type: 'included' },
    slots: [{ id: 'featured-specimen', type: 'specimen', capacity: 1 }, { id: 'travel-souvenir', type: 'souvenir', capacity: 1 }],
  },
  {
    id: 'angler-lodge', name: "Angler's Lodge", artworkKey: 'angler-lodge.png',
    description: 'An earned lodge for legendary journeys and lasting accomplishments.',
    acquisition: { type: 'earned', requirementId: 'legendary-locations-4' },
    slots: [{ id: 'specimen-mounts', type: 'specimen', capacity: 3 }, { id: 'keepsake-cabinet', type: 'keepsake', capacity: 20, automatic: true }],
  },
  {
    id: 'riverstone-cabin', name: 'Riverstone Cabin', artworkKey: 'riverstone-cabin.jpg',
    description: 'A comfortable riverside cabin with a fieldstone hearth and handmade shelves.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-riverstone' },
    customizationHooks: [
      hook('hearth-frame', 'Hearth frame', 'frame', { x: 45, y: 14, width: 13, height: 18 }),
      hook('river-shelf', 'River shelf', 'display', { x: 68, y: 24, width: 15, height: 12 }),
      hook('braided-rug', 'Hearth rug', 'rug', { x: 32, y: 75, width: 38, height: 17 }),
    ],
    slots: [{ id: 'featured-specimen', type: 'specimen', capacity: 1 }, { id: 'travel-souvenir', type: 'souvenir', capacity: 1 }],
  },
  {
    id: 'cedar-hideaway', name: 'Cedar Hideaway', artworkKey: 'cedar-hideaway.jpg',
    description: 'A warm cedar retreat surrounded by quiet pine woods.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-cedar-hideaway' },
    customizationHooks: [
      hook('left-gallery-frame', 'Left gallery frame', 'frame', { x: 25, y: 17, width: 11, height: 17 }),
      hook('hearth-gallery-frame', 'Hearth gallery frame', 'frame', { x: 46, y: 14, width: 12, height: 18 }),
      hook('right-gallery-frame', 'Right gallery frame', 'frame', { x: 70, y: 18, width: 11, height: 16 }),
      hook('forest-rug', 'Forest rug', 'rug', { x: 29, y: 76, width: 43, height: 17 }),
    ],
    slots: [{ id: 'featured-specimen', type: 'specimen', capacity: 1 }, { id: 'travel-souvenir', type: 'souvenir', capacity: 1 }],
  },
  {
    id: 'captains-retreat', name: "Captain's Retreat", artworkKey: 'captains-retreat.jpg',
    description: 'A mahogany-and-brass lake retreat for an angler with stories to spare.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-captains-retreat' },
    customizationHooks: [
      hook('captains-frame', "Captain's frame", 'frame', { x: 45, y: 13, width: 13, height: 19 }),
      hook('left-upper-shelf', 'Left upper shelf', 'display', { x: 17, y: 18, width: 13, height: 10 }),
      hook('left-lower-shelf', 'Left lower shelf', 'display', { x: 18, y: 34, width: 14, height: 10 }),
      hook('right-upper-shelf', 'Right upper shelf', 'display', { x: 69, y: 18, width: 13, height: 10 }),
      hook('right-lower-shelf', 'Right lower shelf', 'display', { x: 69, y: 34, width: 14, height: 10 }),
      hook('navy-rug', 'Navy rug', 'rug', { x: 30, y: 77, width: 42, height: 16 }),
      hook('mahogany-finish', 'Timber finish', 'finish', { x: 3, y: 4, width: 94, height: 92 }),
    ],
    slots: [{ id: 'featured-specimen', type: 'specimen', capacity: 1 }, { id: 'travel-souvenir', type: 'souvenir', capacity: 1 }],
  },
  {
    id: 'workshop-cabin', name: 'Workshop Cabin', artworkKey: 'workshop-cabin.png',
    description: 'A practical retreat for favorite rods, reels, lures, and tackle.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.workshop' },
    slots: [
      { id: 'rod-rack', type: 'equipment', capacity: 5, bounds: { x: 26.5, y: 8.5, width: 42.5, height: 17 } },
      { id: 'tackle-bench', type: 'tackle', capacity: 4, bounds: { x: 31, y: 34, width: 34, height: 23 } },
      { id: 'tackle-cabinet', type: 'tackle', capacity: 6, bounds: { x: 71, y: 17.5, width: 22, height: 26 } },
    ],
  },
  {
    id: 'lakeside-cottage', name: 'Lakeside Cottage', artworkKey: 'lakeside-cottage.png',
    description: 'A bright cottage for travel paintings and quiet domestic details.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.lakeside_cottage' },
    slots: [
      { id: 'location-paintings', type: 'location-painting', capacity: 2, bounds: { x: 47.3, y: 13.5, width: 20.8, height: 20 } },
      { id: 'rug', type: 'rug', capacity: 1, bounds: { x: 29, y: 72, width: 42, height: 26 } },
      { id: 'travel-display', type: 'souvenir', capacity: 1, bounds: { x: 75, y: 47, width: 16, height: 25 } },
    ],
  },
  {
    id: 'coastal-shack', name: 'Coastal Shack', artworkKey: 'coastal-shack.png',
    description: 'A weathered Gulf hideaway for nautical memories and boat stories.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.coastal_shack' },
    slots: [
      { id: 'gulf-shelf', type: 'souvenir', capacity: 5, bounds: { x: 36, y: 14, width: 31, height: 19 } },
      { id: 'nautical-shadowbox', type: 'nautical', capacity: 1, bounds: { x: 40, y: 38, width: 23, height: 21 } },
      { id: 'model-boat-table', type: 'boat-model', capacity: 1, bounds: { x: 33, y: 62, width: 40, height: 17 } },
      { id: 'dock-keepsakes', type: 'nautical', capacity: 5, bounds: { x: 66, y: 36, width: 16, height: 14 } },
    ],
  },
]

export const getCabinDefinition = (id) => cabinCatalog.find((cabin) => cabin.id === id)

export const includedCabinCosmetics = {
  rugs: [
    { id: 'rug-braided-earth', name: 'Braided Earth', colors: ['#765238', '#b58a5b', '#4d6a57'] },
    { id: 'rug-river-blue', name: 'River Blue', colors: ['#496d76', '#9bb5ae', '#d8c99d'] },
    { id: 'rug-pine-needle', name: 'Pine Needle', colors: ['#355847', '#74866a', '#bd9b63'] },
  ],
  frames: [
    { id: 'frame-walnut', name: 'Dark Walnut', colors: ['#4a2f20', '#8b6040'] },
    { id: 'frame-aged-brass', name: 'Aged Brass', colors: ['#806327', '#d1af59'] },
    { id: 'frame-weathered-pine', name: 'Weathered Pine', colors: ['#8b7354', '#c4aa7a'] },
  ],
  finishes: [
    { id: 'finish-natural', name: 'Natural Timber', colors: ['#765438', '#a98159'] },
    { id: 'finish-honey', name: 'Honey Pine', colors: ['#9b6c32', '#d0a15a'] },
    { id: 'finish-smoke', name: 'Smoked Oak', colors: ['#3f3932', '#75695c'] },
  ],
}
