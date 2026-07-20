// Permanent earned-coin goods sold by the in-game Trading Post.
export const coinStoreItems = [
  { id: 'trading-post.cabin-riverstone', name: 'Riverstone Cabin', category: 'cabin', price: 25000, tier: 'fine', cabinId: 'riverstone-cabin', description: 'A comfortable riverside cabin with a fieldstone hearth and handmade shelves.' },
  { id: 'trading-post.cabin-cedar-hideaway', name: 'Cedar Hideaway', category: 'cabin', price: 60000, tier: 'prestige', cabinId: 'cedar-hideaway', description: 'A warm cedar retreat surrounded by quiet pine woods.' },
  { id: 'trading-post.cabin-captains-retreat', name: "Captain's Retreat", category: 'cabin', price: 125000, tier: 'legacy', cabinId: 'captains-retreat', description: 'A mahogany-and-brass lake retreat for an angler with stories to spare.' },
]

// These items retain stable IDs and target prices, but stay out of the shop
// until their corresponding cabin customization slots are implemented.
export const plannedCoinStoreItems = [
  { id: 'trading-post.rug-cattail-weave', name: 'Cattail Weave Rug', category: 'rug', price: 2500, tier: 'standard' },
  { id: 'trading-post.rug-deep-water', name: 'Deep Water Rug', category: 'rug', price: 7500, tier: 'fine' },
  { id: 'trading-post.rug-captains-compass', name: "Captain's Compass Rug", category: 'rug', price: 20000, tier: 'prestige' },
  { id: 'trading-post.frame-river-birch', name: 'River Birch Frame', category: 'frame', price: 5000, tier: 'standard' },
  { id: 'trading-post.frame-hammered-copper', name: 'Hammered Copper Frame', category: 'frame', price: 15000, tier: 'fine' },
  { id: 'trading-post.frame-blackwater-gold', name: 'Blackwater Gold Frame', category: 'frame', price: 40000, tier: 'prestige' },
  { id: 'trading-post.finish-lakeside-whitewash', name: 'Lakeside Whitewash', category: 'finish', price: 10000, tier: 'standard' },
  { id: 'trading-post.finish-storm-oak', name: 'Storm Oak', category: 'finish', price: 30000, tier: 'fine' },
  { id: 'trading-post.finish-captains-mahogany', name: "Captain's Mahogany", category: 'finish', price: 75000, tier: 'prestige' },
  { id: 'trading-post.decor-antique-creel', name: 'Antique Fishing Creel', category: 'cabin-decor', price: 12500, tier: 'fine' },
  { id: 'trading-post.decor-hand-carved-decoy', name: 'Hand-Carved Fish Decoy', category: 'cabin-decor', price: 25000, tier: 'prestige' },
  { id: 'trading-post.plaque-100k-club', name: 'Hundred-Thousand Coin Club Plaque', category: 'prestige', price: 100000, tier: 'legacy' },
]

export const coinStorePolicy = {
  live: true,
  showInApp: true,
  currency: 'coins',
  purchasesArePermanent: true,
  stockRotationAllowed: false,
  duplicatePurchasesAllowed: false,
  grantsGameplayPower: false,
  grantsProgress: false,
  sellsRealMoneyCurrency: false,
  protectsIncludedAndEarnedRewards: true,
}

export const getCoinStoreItem = (id) => coinStoreItems.find((item) => item.id === id)
