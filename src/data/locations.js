const artwork = import.meta.glob('../assets/locations/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const locations = [
  {
    id: 'willow-pond',
    name: 'Willow Pond',
    description: 'An old Upper Midwest farm pond, quiet beneath the willows.',
    waterLabel: 'pond',
    fishingStyle: 'bobber',
    fishIds: ['bluegill', 'sunfish', 'crappie', 'largemouth-bass', 'catfish', 'old-whiskers'],
    image: artwork['../assets/locations/willow-pond.webp'],
  },
  {
    id: 'pine-river',
    name: 'Pine River',
    description: 'Cool current winds between mossy stones and tall pines.',
    waterLabel: 'river',
    fishingStyle: 'fly',
    fishIds: ['mountain-whitefish', 'coastal-cutthroat', 'rainbow-trout', 'steelhead', 'chinook-salmon'],
    image: artwork['../assets/locations/pine-river.webp'],
  },
  {
    id: 'great-lake',
    name: 'Great Lake',
    description: 'Cold blue water opens beyond a rocky Upper Midwest shore.',
    waterLabel: 'lake',
    fishingStyle: 'spinning',
    fishIds: ['perch', 'rock-bass', 'smallmouth-bass', 'walleye', 'lake-trout', 'northern-pike', 'great-lakes-muskellunge'],
    image: artwork['../assets/locations/great-lake.webp'],
  },
]

export const futureLocations = ['Coastal Bay', 'Deep Sea']
export const getLocation = (id) => locations.find((location) => location.id === id) || locations[0]
