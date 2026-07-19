const artwork = import.meta.glob('../assets/rods/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const progression = [
  { price: 0, lineControl: 0, chances: { common: 75, uncommon: 20, rare: 4, epic: .9, legendary: .1 } },
  { price: 250, lineControl: .1, chances: { common: 65, uncommon: 25, rare: 8, epic: 1.8, legendary: .2 } },
  { price: 1500, lineControl: .2, chances: { common: 52, uncommon: 29, rare: 14, epic: 4.4, legendary: .6 } },
  { price: 7500, lineControl: .3, chances: { common: 38, uncommon: 31, rare: 21, epic: 8.5, legendary: 1.5 } },
]

const rodFamilies = {
  'willow-pond': [
    ['old', 'Old Fishing Rod', 'Worn, dependable, and ready for the pond.'],
    ['fiberglass', 'Fiberglass Rod', 'A forgiving rod with a little more reach.'],
    ['carbon', 'Carbon Rod', 'Light and sensitive for elusive catches.'],
    ['master', 'Master Angler Rod', 'Superb balance for the finest fish in the pond.'],
  ],
  'pine-river': [
    ['worn-fly', 'Worn Fly Rod', 'A weathered river companion with an honest cast.'],
    ['fiberglass-fly', 'Fiberglass Fly Rod', 'A forgiving fly rod that loads smoothly in the current.'],
    ['graphite-fly', 'Graphite Fly Rod', 'Light and responsive for delicate river presentations.'],
    ['master-fly', 'Master Fly Rod', 'Heirloom craftsmanship with exceptional line control.'],
  ],
  'great-lake': [
    ['lake-starter', 'Worn Lake Rod', 'Weathered spinning tackle built for an open shore.'],
    ['lake-fiberglass', 'Fiberglass Lake Rod', 'Sturdy glass with the backbone to work rocky water.'],
    ['lake-graphite', 'Graphite Lake Rod', 'Light, precise tackle for deep and distant strikes.'],
    ['lake-master', 'Master Lake Rod', 'Heirloom lake tackle with power held in reserve.'],
  ],
  'gulf-coast': [
    ['inshore-starter', 'Worn Inshore Rod', 'Salt-worn tackle ready for the marsh edge.'],
    ['inshore-fiberglass', 'Fiberglass Inshore Rod', 'Sturdy glass for oyster reefs and tidal current.'],
    ['inshore-graphite', 'Graphite Inshore Rod', 'Light, sealed tackle for precise coastal casts.'],
    ['inshore-master', 'Master Inshore Rod', 'Exceptional saltwater tackle with quiet reserve.'],
  ],
}

export const rods = Object.entries(rodFamilies).flatMap(([locationId, family]) =>
  family.map(([id, name, description], index) => ({
    id,
    name,
    description,
    locationId,
    previousId: index ? family[index - 1][0] : null,
    ...progression[index],
    image: artwork[`../assets/rods/${id}.webp`],
  })),
)

export const rodLocationIds = Object.keys(rodFamilies)
export const getRodsForLocation = (locationId) => rods.filter((rod) => rod.locationId === locationId)
export const getStarterRod = (locationId) => getRodsForLocation(locationId)[0]
export const getRod = (id, locationId = 'willow-pond') =>
  rods.find((rod) => rod.id === id) || getStarterRod(locationId) || rods[0]
