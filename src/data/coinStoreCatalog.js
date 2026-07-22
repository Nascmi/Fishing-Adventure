// Permanent earned-coin goods sold by the in-game Trading Post.
export const coinStoreItems = [
  { id: 'trading-post.cabin-riverstone', name: 'Riverstone Cabin', category: 'cabin', price: 25000, tier: 'fine', cabinId: 'riverstone-cabin', description: 'A comfortable riverside cabin with a fieldstone hearth and handmade shelves.' },
  { id: 'trading-post.cabin-cedar-hideaway', name: 'Cedar Hideaway', category: 'cabin', price: 50000, tier: 'prestige', cabinId: 'cedar-hideaway', description: 'A warm cedar retreat surrounded by quiet pine woods.' },
  { id: 'trading-post.cabin-captains-retreat', name: "Captain's Retreat", category: 'cabin', price: 75000, tier: 'prestige', cabinId: 'captains-retreat', description: 'A mahogany-and-brass lake retreat for an angler with stories to spare.' },
  { id: 'trading-post.rug-cattail-weave', name: 'Cattail Weave Rug', category: 'rug', hookType: 'rug', price: 2500, tier: 'standard', artwork: cattailWeave, fit: 'fill', colors: ['#776044', '#b69a68'] },
  { id: 'trading-post.rug-deep-water', name: 'Deep Water Rug', category: 'rug', hookType: 'rug', price: 7500, tier: 'fine', artwork: deepWater, fit: 'fill', colors: ['#294d59', '#7ea1a2'] },
  { id: 'trading-post.rug-captains-compass', name: "Captain's Compass Rug", category: 'rug', hookType: 'rug', price: 20000, tier: 'prestige', artwork: captainsCompass, fit: 'fill', colors: ['#172e43', '#c5a651'] },
  { id: 'trading-post.frame-river-birch', name: 'River Birch Frame', category: 'frame', hookType: 'frame', price: 5000, tier: 'standard', artwork: riverBirch, colors: ['#d8c29a', '#8b7048'] },
  { id: 'trading-post.frame-hammered-copper', name: 'Hammered Copper Frame', category: 'frame', hookType: 'frame', price: 15000, tier: 'fine', artwork: hammeredCopper, colors: ['#a85f35', '#e0a46d'] },
  { id: 'trading-post.frame-blackwater-gold', name: 'Blackwater Gold Frame', category: 'frame', hookType: 'frame', price: 40000, tier: 'prestige', artwork: blackwaterGold, colors: ['#1c2525', '#d0aa43'] },
  { id: 'trading-post.finish-lakeside-whitewash', name: 'Lakeside Whitewash', category: 'finish', hookType: 'finish', price: 10000, tier: 'standard', artwork: lakesideWhitewash, colors: ['#d8d4c3', '#8e9b91'] },
  { id: 'trading-post.finish-storm-oak', name: 'Storm Oak', category: 'finish', hookType: 'finish', price: 30000, tier: 'fine', artwork: stormOak, colors: ['#3d4544', '#7a7165'] },
  { id: 'trading-post.finish-captains-mahogany', name: "Captain's Mahogany", category: 'finish', hookType: 'finish', price: 75000, tier: 'prestige', artwork: captainsMahogany, colors: ['#351b16', '#824c34'] },
  { id: 'trading-post.decor-antique-creel', name: 'Antique Fishing Creel', category: 'cabin-decor', hookType: 'display', price: 12500, tier: 'fine', artwork: antiqueCreel, fit: 'contain', presentation: 'object', colors: ['#76502e', '#c5a36a'] },
  { id: 'trading-post.decor-hand-carved-decoy', name: 'Hand-Carved Fish Decoy', category: 'cabin-decor', hookType: 'display', price: 25000, tier: 'prestige', artwork: handCarvedDecoy, fit: 'contain', presentation: 'object', colors: ['#315d58', '#bb7445'] },
  { id: 'trading-post.model-freshwater-skiff', name: 'Freshwater Skiff Model', category: 'cabin-decor', hookType: 'display', price: 7500, tier: 'standard', artwork: modelFreshwaterSkiff, fit: 'contain', colors: ['#315d47', '#c6a96b'], description: 'A handcrafted miniature of a familiar freshwater fishing skiff.' },
  { id: 'trading-post.model-bay-skiff', name: 'Bay Skiff Model', category: 'cabin-decor', hookType: 'display', price: 15000, tier: 'fine', artwork: modelBaySkiff, fit: 'contain', colors: ['#d8cfb0', '#5f9489'], description: 'A weathered center-console miniature inspired by quiet coastal water.' },
  { id: 'trading-post.model-charter-boat', name: 'Charter Boat Model', category: 'cabin-decor', hookType: 'display', price: 30000, tier: 'prestige', artwork: modelCharterBoat, fit: 'contain', colors: ['#efe3bd', '#183b5c'], description: 'A detailed offshore charter miniature with flybridge and outriggers.' },
  { id: 'trading-post.plaque-100k-club', name: 'Hundred-Thousand Coin Club Plaque', category: 'prestige', hookType: 'display', price: 100000, tier: 'legacy', artwork: coinClubPlaque, fit: 'contain', presentation: 'plaque', colors: ['#342814', '#e0bd57'] },
]

export const plannedCoinStoreItems = []

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
import cattailWeave from '../assets/decor/cattail-weave-cutout.webp'
import deepWater from '../assets/decor/deep-water-cutout.webp'
import captainsCompass from '../assets/decor/captains-compass-cutout.webp'
import riverBirch from '../assets/decor/river-birch.jpg'
import hammeredCopper from '../assets/decor/hammered-copper.jpg'
import blackwaterGold from '../assets/decor/blackwater-gold.jpg'
import lakesideWhitewash from '../assets/decor/lakeside-whitewash.jpg'
import stormOak from '../assets/decor/storm-oak.jpg'
import captainsMahogany from '../assets/decor/captains-mahogany.jpg'
import antiqueCreel from '../assets/decor/antique-creel-cutout.webp'
import handCarvedDecoy from '../assets/decor/hand-carved-decoy-cutout.webp'
import coinClubPlaque from '../assets/decor/coin-club-plaque-cutout.webp'
import modelFreshwaterSkiff from '../assets/decor/model-freshwater-skiff.png'
import modelBaySkiff from '../assets/decor/model-bay-skiff.png'
import modelCharterBoat from '../assets/decor/model-charter-boat.png'
