import greatLakeSkiffImage from '../assets/locations/great-lake-skiff.webp'
import greatLakeWeedEdgeImage from '../assets/locations/great-lake-weed-edge.webp'
import greatLakeDropOffImage from '../assets/locations/great-lake-drop-off.webp'
import gulfCoastBaySkiffImage from '../assets/locations/gulf-coast-bay-skiff.webp'
import gulfCoastOysterReefImage from '../assets/locations/gulf-coast-oyster-reef.png'
import gulfCoastTidalChannelImage from '../assets/locations/gulf-coast-tidal-channel.png'
import openGulfWorkingRigImage from '../assets/locations/open-gulf-working-rig.png'
import openGulfReefEdgeImage from '../assets/locations/open-gulf-reef-edge.png'

export const greatLakeBoat = {
  id: 'great-lake-skiff',
  locationId: 'great-lake',
  name: 'Great Lake Skiff',
  price: 5000,
  description: 'A permanent, quiet ride to the lake’s authored offshore water.',
  image: greatLakeSkiffImage,
  cosmeticSlot: 'hull',
}

export const gulfCoastBoat = {
  id: 'gulf-coast-bay-skiff',
  locationId: 'gulf-coast',
  name: 'Bay Skiff',
  price: 12500,
  description: 'A permanent shallow-draft skiff for oyster reefs and tidal channels.',
  image: gulfCoastBaySkiffImage,
  cosmeticSlot: 'hull',
}

export const boats = [greatLakeBoat, gulfCoastBoat]

export const fishingAreas = [
  {
    id: 'great-lake-shore',
    locationId: 'great-lake',
    name: 'Rocky Shore',
    description: 'Familiar water where perch, rock bass, and smallmouth remain dependable.',
    boatRequired: false,
    fishStrengths: ['perch', 'rock-bass', 'smallmouth-bass'],
  },
  {
    id: 'great-lake-weed-edge',
    locationId: 'great-lake',
    name: 'Weed Edge',
    description: 'A sheltered boat stop favored by ambush hunters.',
    boatRequired: true,
    boatPosition: 'weed-edge',
    image: greatLakeWeedEdgeImage,
    fishStrengths: ['smallmouth-bass', 'northern-pike', 'great-lakes-muskellunge'],
  },
  {
    id: 'great-lake-drop-off',
    locationId: 'great-lake',
    name: 'Rocky Drop-off',
    description: 'Cool, deep structure for walleye and lake trout.',
    boatRequired: true,
    boatPosition: 'drop-off',
    image: greatLakeDropOffImage,
    fishStrengths: ['walleye', 'lake-trout'],
  },
  {
    id: 'gulf-coast-marsh-bank',
    locationId: 'gulf-coast',
    name: 'Marsh Bank',
    description: 'Sheltered shoreline for croaker and seatrout moving through the grass.',
    boatRequired: false,
    fishStrengths: ['atlantic-croaker', 'sand-seatrout', 'spotted-seatrout'],
  },
  {
    id: 'gulf-coast-oyster-reef',
    locationId: 'gulf-coast',
    name: 'Oyster Reef',
    description: 'Hard shell and weathered pilings draw powerful structure feeders.',
    boatRequired: true,
    boatPosition: 'oyster-reef',
    image: gulfCoastOysterReefImage,
    fishStrengths: ['sheepshead', 'black-drum', 'red-drum'],
  },
  {
    id: 'gulf-coast-tidal-channel',
    locationId: 'gulf-coast',
    name: 'Tidal Channel',
    description: 'Deeper moving water for flounder, Red Drum, and cruising Cobia.',
    boatRequired: true,
    boatPosition: 'tidal-channel',
    image: gulfCoastTidalChannelImage,
    fishStrengths: ['southern-flounder', 'red-drum', 'cobia'],
  },
  {
    id: 'open-gulf-blue-water',
    locationId: 'open-gulf',
    name: 'Blue Water',
    description: 'The charter arrival point for fast-moving pelagic fish.',
    boatRequired: false,
    relocationCost: 250,
    fishStrengths: ['spanish-mackerel', 'king-mackerel', 'mahi-mahi', 'yellowfin-tuna'],
  },
  {
    id: 'open-gulf-working-rig',
    locationId: 'open-gulf',
    name: 'Working Rig',
    description: 'The captain holds near deep pilings where powerful fish gather.',
    boatRequired: false,
    relocationCost: 250,
    image: openGulfWorkingRigImage,
    fishStrengths: ['red-snapper', 'greater-amberjack'],
  },
  {
    id: 'open-gulf-reef-edge',
    locationId: 'open-gulf',
    name: 'Reef Edge',
    description: 'A current seam above submerged structure and reef fish below.',
    boatRequired: false,
    relocationCost: 250,
    image: openGulfReefEdgeImage,
    fishStrengths: ['vermilion-snapper', 'gray-triggerfish', 'red-snapper', 'greater-amberjack'],
  },
]

export const lureFamilies = [
  { id: 'worm-and-float', locationId: 'willow-pond', name: 'Garden Worm', description: 'A dependable pond presentation for whatever is feeding.', included: true },
  { id: 'panfish-bites', locationId: 'willow-pond', name: 'Panfish Bites', description: 'Small reusable morsels sized for familiar pond panfish.', price: 100, affinity: 1.05, targetFishIds: ['bluegill', 'sunfish', 'crappie'] },
  { id: 'bass-jig', locationId: 'willow-pond', name: 'Bass Jig', description: 'A compact skirted jig made for Largemouth Bass around cover.', price: 150, affinity: 1.05, targetFishIds: ['largemouth-bass'] },
  { id: 'bottom-bait', locationId: 'willow-pond', name: 'Bottom Bait', description: 'A reusable scent bait for Channel Catfish near the pond floor.', price: 150, affinity: 1.05, targetFishIds: ['catfish'] },
  { id: 'whiskers-stinkbait', locationId: 'willow-pond', name: 'Old Whiskers Stinkbait', description: 'A pungent bottom bait blended for the pond legend.', price: 10000, affinity: 1.2, targetFishIds: ['old-whiskers'] },
  { id: 'dry-fly', locationId: 'pine-river', name: 'Dry Fly', description: 'A light river fly for a natural surface drift.', included: true },
  { id: 'trout-nymph', locationId: 'pine-river', name: 'Trout Nymph', description: 'A small subsurface fly for whitefish and resident trout.', price: 100, affinity: 1.05, targetFishIds: ['mountain-whitefish', 'coastal-cutthroat', 'rainbow-trout'] },
  { id: 'steelhead-spinner', locationId: 'pine-river', name: 'Steelhead Spinner', description: 'A bright swinging spinner made for powerful river Steelhead.', price: 250, affinity: 1.05, targetFishIds: ['steelhead'] },
  { id: 'chinook-egg-pattern', locationId: 'pine-river', name: 'King Salmon Egg Pattern', description: 'A durable specialty pattern tied for returning Chinook.', price: 15000, affinity: 1.2, targetFishIds: ['chinook-salmon'] },
  {
    id: 'spoon',
    locationId: 'great-lake',
    name: 'Casting Spoon',
    description: 'Versatile metal for open water and familiar lake fish.',
    fishStrengths: ['perch', 'smallmouth-bass', 'lake-trout'],
    included: true,
  },
  {
    id: 'spinner',
    locationId: 'great-lake',
    name: 'Flash Spinner',
    description: 'Bright vibration for fish holding near weeds.',
    fishStrengths: ['rock-bass', 'northern-pike', 'great-lakes-muskellunge'],
    included: true,
  },
  {
    id: 'deep-jig',
    locationId: 'great-lake',
    name: 'Deep Jig',
    description: 'A controlled presentation for rocky, deeper water.',
    fishStrengths: ['walleye', 'lake-trout'],
    included: true,
  },
  { id: 'smallmouth-tube', locationId: 'great-lake', name: 'Smallmouth Tube', description: 'A compact soft-plastic profile for rocky Smallmouth water.', price: 150, affinity: 1.05, targetFishIds: ['smallmouth-bass'] },
  { id: 'walleye-harness', locationId: 'great-lake', name: 'Walleye Harness', description: 'A slow-turning blade and crawler profile for Walleye.', price: 200, affinity: 1.05, targetFishIds: ['walleye'] },
  { id: 'pike-spoon', locationId: 'great-lake', name: 'Pike Spoon', description: 'A broad flashing spoon for Northern Pike along weed edges.', price: 250, affinity: 1.05, targetFishIds: ['northern-pike'] },
  { id: 'muskie-bucktail', locationId: 'great-lake', name: 'Muskie Bucktail', description: 'A large, pulsing bucktail built for Great Lakes Muskellunge.', price: 20000, affinity: 1.2, targetFishIds: ['great-lakes-muskellunge'] },
  { id: 'popping-shrimp', locationId: 'gulf-coast', name: 'Popping Shrimp', description: 'A reusable shrimp imitation for working Gulf structure.', included: true },
  { id: 'bay-shrimp-imitation', locationId: 'gulf-coast', name: 'Shrimp Imitation', description: 'A lifelike bay presentation with broad inshore appeal.', price: 150, affinity: 1.05, targetFishIds: ['atlantic-croaker', 'sand-seatrout', 'southern-flounder', 'spotted-seatrout', 'red-drum'] },
  { id: 'shellfish-rig', locationId: 'gulf-coast', name: 'Shellfish Rig', description: 'A durable crab-and-shell profile for hard-structure feeders.', price: 200, affinity: 1.05, targetFishIds: ['sheepshead', 'black-drum'] },
  { id: 'cobia-eel', locationId: 'gulf-coast', name: 'Cobia Eel', description: 'A durable swimming lure made for cruising Cobia.', price: 25000, affinity: 1.2, targetFishIds: ['cobia'] },
  { id: 'metal-jig', locationId: 'open-gulf', name: 'Offshore Metal Jig', description: 'A reusable deep-water jig for the open Gulf.', included: true },
  { id: 'reef-bait-rig', locationId: 'open-gulf', name: 'Reef Bait Rig', description: 'A sturdy bottom rig for snapper, triggerfish, and amberjack.', price: 200, affinity: 1.05, targetFishIds: ['vermilion-snapper', 'gray-triggerfish', 'red-snapper', 'greater-amberjack'] },
  { id: 'trolling-plug', locationId: 'open-gulf', name: 'Trolling Plug', description: 'A fast open-water plug for mackerel and Mahi-Mahi.', price: 250, affinity: 1.05, targetFishIds: ['spanish-mackerel', 'king-mackerel', 'mahi-mahi'] },
  { id: 'yellowfin-cedar-plug', locationId: 'open-gulf', name: 'Yellowfin Cedar Plug', description: 'A heavy offshore plug tuned for Yellowfin Tuna.', price: 35000, affinity: 1.2, targetFishIds: ['yellowfin-tuna'] },
]

export const getAreasForLocation = (locationId) => fishingAreas.filter((area) => area.locationId === locationId)
export const getFishingArea = (id) => fishingAreas.find((area) => area.id === id)
export const getBoat = (id) => boats.find((boat) => boat.id === id)
export const getBoatForLocation = (locationId) => boats.find((boat) => boat.locationId === locationId)
export const getLureFamily = (id) => lureFamilies.find((lure) => lure.id === id)
export const getLuresForLocation = (locationId) => lureFamilies.filter((lure) => lure.locationId === locationId)
export const getDefaultLure = (locationId) => getLuresForLocation(locationId).find((lure) => lure.included)

export const getPhaseFourFishWeights = (areaId, lureId) => {
  const area = getFishingArea(areaId)
  const lure = getLureFamily(lureId)
  const weights = Object.fromEntries([...new Set([...(area?.fishStrengths || []), ...(lure?.fishStrengths || [])])].map((fishId) => {
    const areaMatch = area?.fishStrengths.includes(fishId)
    const lureMatch = lure?.fishStrengths?.includes(fishId)
    return [fishId, areaMatch && lureMatch ? 2.25 : 1.5]
  }))
  for (const fishId of lure?.targetFishIds || []) weights[fishId] = (weights[fishId] || 1) * (lure.affinity || 1.05)
  return weights
}
