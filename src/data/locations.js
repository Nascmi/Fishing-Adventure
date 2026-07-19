const artwork = import.meta.glob('../assets/locations/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const locations = [
  {
    id: 'willow-pond',
    name: 'Willow Pond',
    description: 'A quiet, reed-fringed pond beneath the willows.',
    waterLabel: 'pond',
    fishingStyle: 'bobber',
    fishIds: ['bluegill', 'sunfish', 'crappie', 'perch', 'largemouth-bass', 'smallmouth-bass', 'catfish', 'carp', 'northern-pike', 'old-whiskers'],
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
]

export const futureLocations = ['Mountain Lake', 'Coastal Bay', 'Deep Sea']
export const getLocation = (id) => locations.find((location) => location.id === id) || locations[0]
