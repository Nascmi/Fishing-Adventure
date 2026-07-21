const hook = (id, name, type, bounds) => ({ id, name, type, bounds })

// Bounds are percentages of each authored cabin scene. They intentionally belong
// to the room, not the decor item, so every compatible choice sits naturally.
export const cabinCatalog = [
  {
    id: 'starter', name: 'Starter Cabin', artworkKey: 'cabin.webp',
    description: 'A humble home for one preserved catch and one travel memory.',
    acquisition: { type: 'included' },
    slots: [{ id: 'featured-specimen', type: 'specimen', capacity: 1 }, { id: 'travel-souvenir', type: 'souvenir', capacity: 1 }],
    customizationHooks: [hook('hearth-gallery', 'Hearth gallery', 'frame', { x: 44.2, y: 12.7, width: 16.5, height: 22.5 })],
  },
  {
    id: 'angler-lodge', name: "Angler's Lodge", artworkKey: 'angler-lodge.png',
    description: 'An earned lodge for legendary journeys and lasting accomplishments.',
    acquisition: { type: 'earned', requirementId: 'legendary-locations-4' },
    slots: [{ id: 'specimen-mounts', type: 'specimen', capacity: 3 }, { id: 'keepsake-cabinet', type: 'keepsake', capacity: 20, automatic: true }],
    customizationHooks: [
      hook('left-gallery-frame', 'Left gallery', 'frame', { x: 26.2, y: 20.2, width: 10.2, height: 19.8 }),
      hook('right-gallery-frame', 'Right gallery', 'frame', { x: 64.1, y: 20.5, width: 9.1, height: 20.5 }),
    ],
  },
  {
    id: 'riverstone-cabin', name: 'Riverstone Cabin', artworkKey: 'riverstone-cabin.jpg',
    description: 'A comfortable riverside cabin with a fieldstone hearth and handmade shelves.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-riverstone' },
    customizationHooks: [
      hook('hearth-frame', 'Hearth frame', 'frame', { x: 38.7, y: 17.2, width: 18.2, height: 20.2 }),
      hook('river-shelf', 'River shelf', 'display', { x: 63.2, y: 24.2, width: 19, height: 11.2 }),
      hook('braided-rug', 'Hearth rug', 'rug', { x: 20.8, y: 76, width: 53.5, height: 21.5 }),
    ],
  },
  {
    id: 'cedar-hideaway', name: 'Cedar Hideaway', artworkKey: 'cedar-hideaway.jpg',
    description: 'A warm cedar retreat surrounded by quiet pine woods.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-cedar-hideaway' },
    customizationHooks: [
      hook('left-gallery-frame', 'Left gallery frame', 'frame', { x: 18.4, y: 39.6, width: 17, height: 18 }),
      hook('hearth-gallery-frame', 'Hearth gallery frame', 'frame', { x: 39.4, y: 9.2, width: 21.2, height: 27.5 }),
      hook('right-gallery-frame', 'Right gallery frame', 'frame', { x: 64.6, y: 39.4, width: 15.5, height: 19.5 }),
      hook('forest-rug', 'Forest rug', 'rug', { x: 13.2, y: 74.8, width: 73, height: 24.5 }),
    ],
  },
  {
    id: 'captains-retreat', name: "Captain's Retreat", artworkKey: 'captains-retreat.jpg',
    description: 'A mahogany-and-brass lake retreat for an angler with stories to spare.',
    acquisition: { type: 'coin-store', productId: 'trading-post.cabin-captains-retreat' },
    customizationHooks: [
      hook('captains-frame', "Captain's frame", 'frame', { x: 43.3, y: 10.8, width: 20.2, height: 29.5 }),
      hook('left-upper-shelf', 'Left upper shelf', 'display', { x: 23, y: 17.5, width: 15, height: 10 }),
      hook('left-lower-shelf', 'Left lower shelf', 'display', { x: 23, y: 34, width: 15, height: 10 }),
      hook('right-upper-shelf', 'Right upper shelf', 'display', { x: 69.8, y: 17.5, width: 14.5, height: 10 }),
      hook('right-lower-shelf', 'Right lower shelf', 'display', { x: 69.8, y: 34, width: 14.5, height: 10 }),
      hook('navy-rug', 'Navy rug', 'rug', { x: 8, y: 74.8, width: 86.3, height: 23.5 }),
      hook('mahogany-finish', 'Timber finish', 'finish', { x: 3, y: 4, width: 94, height: 92 }),
    ],
  },
  {
    id: 'workshop-cabin', name: 'Workshop Cabin', artworkKey: 'workshop-cabin.png',
    description: 'A practical retreat for favorite rods, reels, lures, and tackle.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.workshop' },
    customizationHooks: [
      { ...hook('rod-peg-1', 'Rod rack peg 1', 'display', { x: 28.4, y: 10.8, width: 6.4, height: 11.5 }), accepts: ['rod'] },
      { ...hook('rod-peg-2', 'Rod rack peg 2', 'display', { x: 36.4, y: 10.8, width: 6.4, height: 11.5 }), accepts: ['rod'] },
      { ...hook('rod-peg-3', 'Rod rack peg 3', 'display', { x: 44.4, y: 10.8, width: 6.4, height: 11.5 }), accepts: ['rod'] },
      { ...hook('rod-peg-4', 'Rod rack peg 4', 'display', { x: 52.4, y: 10.8, width: 6.4, height: 11.5 }), accepts: ['rod'] },
      { ...hook('rod-peg-5', 'Rod rack peg 5', 'display', { x: 60.4, y: 10.8, width: 6.4, height: 11.5 }), accepts: ['rod'] },
      hook('workbench-frame', 'Workbench display', 'frame', { x: 31.1, y: 33.4, width: 34.4, height: 24.2 }),
      { ...hook('cabinet-upper-left', 'Cabinet upper left', 'display', { x: 72.8, y: 19.1, width: 8, height: 6.3 }), accepts: ['tackle'] },
      { ...hook('cabinet-upper-right', 'Cabinet upper right', 'display', { x: 82.5, y: 19.1, width: 8, height: 6.3 }), accepts: ['tackle'] },
      { ...hook('cabinet-middle-left', 'Cabinet middle left', 'display', { x: 72.8, y: 27.4, width: 8, height: 6.3 }), accepts: ['tackle'] },
      { ...hook('cabinet-middle-right', 'Cabinet middle right', 'display', { x: 82.5, y: 27.4, width: 8, height: 6.3 }), accepts: ['tackle'] },
      { ...hook('cabinet-lower-left', 'Cabinet lower left', 'display', { x: 72.8, y: 35.7, width: 8, height: 6.3 }), accepts: ['tackle'] },
      { ...hook('cabinet-lower-right', 'Cabinet lower right', 'display', { x: 82.5, y: 35.7, width: 8, height: 6.3 }), accepts: ['tackle'] },
    ],
  },
  {
    id: 'lakeside-cottage', name: 'Lakeside Cottage', artworkKey: 'lakeside-cottage.png',
    description: 'A bright cottage for travel paintings and quiet domestic details.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.lakeside_cottage' },
    customizationHooks: [
      hook('left-gallery-frame', 'Left gallery frame', 'frame', { x: 47.4, y: 13.5, width: 9.8, height: 20.1 }),
      hook('right-gallery-frame', 'Right gallery frame', 'frame', { x: 58.8, y: 13.5, width: 9.8, height: 20.1 }),
      hook('cottage-rug', 'Cottage rug', 'rug', { x: 18.3, y: 72, width: 57.5, height: 27.2 }),
      hook('sideboard-display', 'Sideboard display', 'display', { x: 75.5, y: 46.7, width: 15.7, height: 15.5 }),
    ],
  },
  {
    id: 'coastal-shack', name: 'Coastal Shack', artworkKey: 'coastal-shack.png',
    description: 'A weathered Gulf hideaway for nautical memories and boat stories.',
    acquisition: { type: 'store', availability: 'deferred', productId: 'cabin.coastal_shack' },
    customizationHooks: [
      { ...hook('upper-shelf-left', 'Upper shelf left', 'display', { x: 37.1, y: 15.2, width: 8.4, height: 15.8 }), accepts: ['nautical', 'souvenir', 'miniature'] },
      { ...hook('upper-shelf-center', 'Upper shelf center', 'display', { x: 47.3, y: 15.2, width: 8.4, height: 15.8 }), accepts: ['nautical', 'souvenir', 'miniature'] },
      { ...hook('upper-shelf-right', 'Upper shelf right', 'display', { x: 57.5, y: 15.2, width: 8.4, height: 15.8 }), accepts: ['nautical', 'souvenir', 'miniature'] },
      hook('nautical-shadowbox', 'Nautical shadowbox', 'frame', { x: 40.2, y: 37.2, width: 24.6, height: 20.6 }),
      { ...hook('model-boat-table', 'Model boat table', 'display', { x: 36, y: 61.7, width: 36, height: 13.8 }), accepts: ['model-boat'] },
      { ...hook('dock-peg-1', 'Dock peg 1', 'display', { x: 67, y: 36.1, width: 3, height: 10.2 }), accepts: ['nautical-peg'] },
      { ...hook('dock-peg-2', 'Dock peg 2', 'display', { x: 70.7, y: 36.1, width: 3, height: 10.2 }), accepts: ['nautical-peg'] },
      { ...hook('dock-peg-3', 'Dock peg 3', 'display', { x: 74.4, y: 36.1, width: 3, height: 10.2 }), accepts: ['nautical-peg'] },
      { ...hook('dock-peg-4', 'Dock peg 4', 'display', { x: 78.1, y: 36.1, width: 3, height: 10.2 }), accepts: ['nautical-peg'] },
      { ...hook('dock-peg-5', 'Dock peg 5', 'display', { x: 81.8, y: 36.1, width: 3, height: 10.2 }), accepts: ['nautical-peg'] },
    ],
  },
  {
    id: 'trophy-room', name: 'Grand Trophy Room', artworkKey: 'trophy-room.png',
    description: 'A warm gallery with twelve mounts for the preserved catches you are proudest of.',
    acquisition: { type: 'store', availability: 'prepared', productId: 'cabin.trophy_room' },
    slots: [{ id: 'trophy-gallery', type: 'specimen', capacity: 12 }],
    customizationHooks: [
      hook('left-gallery-painting', 'Left gallery painting', 'frame', { x: 7.8, y: 70.8, width: 20.5, height: 15.8 }),
      hook('right-gallery-painting', 'Right gallery painting', 'frame', { x: 71.7, y: 70.8, width: 20.5, height: 15.8 }),
    ],
  },
]

export const getCabinDefinition = (id) => cabinCatalog.find((cabin) => cabin.id === id)

export const includedCabinCosmetics = {
  displays: [
    { id: 'display-brass-reel', name: 'Brass Reel', colors: ['#75522d', '#d8b665'] },
    { id: 'display-painted-bobber', name: 'Painted Bobber', colors: ['#315f59', '#d87855'] },
    { id: 'display-weathered-tackle-tin', name: 'Weathered Tackle Tin', colors: ['#405d57', '#a99169'] },
  ],
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
