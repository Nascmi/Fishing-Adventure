const artwork = import.meta.glob([
  '../assets/locations/*.{webp,png}',
  '!../assets/locations/workshop-cabin.png',
  '!../assets/locations/lakeside-cottage.png',
  '!../assets/locations/coastal-shack.png',
], {
  eager: true,
  query: '?url',
  import: 'default',
})

export const locations = [
  {
    id: 'willow-pond',
    name: 'Backyard Pond',
    description: 'An old Upper Midwest farm pond, quiet beneath the willows.',
    waterLabel: 'pond',
    fishingStyle: 'bobber',
    tripCost: 0,
    fishIds: ['bluegill', 'sunfish', 'crappie', 'largemouth-bass', 'catfish', 'old-whiskers'],
    image: artwork['../assets/locations/willow-pond.webp'],
  },
  {
    id: 'pine-river',
    name: 'Pine River',
    description: 'Cool current winds between mossy stones and tall pines.',
    waterLabel: 'river',
    fishingStyle: 'fly',
    tripCost: 300,
    fishIds: ['mountain-whitefish', 'coastal-cutthroat', 'rainbow-trout', 'steelhead', 'chinook-salmon'],
    image: artwork['../assets/locations/pine-river.webp'],
  },
  {
    id: 'great-lake',
    name: 'Great Lake',
    description: 'Cold blue water opens beyond a rocky Upper Midwest shore.',
    waterLabel: 'lake',
    fishingStyle: 'spinning',
    tripCost: 800,
    fishIds: ['perch', 'rock-bass', 'smallmouth-bass', 'walleye', 'lake-trout', 'northern-pike', 'great-lakes-muskellunge'],
    image: artwork['../assets/locations/great-lake.webp'],
  },
  {
    id: 'gulf-coast',
    name: 'Gulf Coast',
    description: 'Warm tide moves through an Alabama–Mississippi coastal marsh.',
    waterLabel: 'bay',
    fishingStyle: 'cork',
    tripCost: 1600,
    fishIds: ['atlantic-croaker', 'sand-seatrout', 'sheepshead', 'southern-flounder', 'spotted-seatrout', 'black-drum', 'red-drum', 'cobia'],
    image: artwork['../assets/locations/gulf-coast-deep.png'],
  },
  {
    id: 'open-gulf',
    name: 'Open Gulf',
    description: 'A blue-water charter beyond the coast, where reefs, rigs, and powerful fish wait.',
    waterLabel: 'Gulf',
    fishingStyle: 'jig',
    tripCost: 4000,
    fishIds: ['vermilion-snapper', 'spanish-mackerel', 'gray-triggerfish', 'red-snapper', 'king-mackerel', 'greater-amberjack', 'mahi-mahi', 'yellowfin-tuna'],
    image: artwork['../assets/locations/open-gulf.png'],
  },
]

export const futureLocations = []
export const getLocation = (id) => locations.find((location) => location.id === id) || locations[0]
