export const RARITY = { common: 1, uncommon: 1.25, rare: 1.7, epic: 2.4, legendary: 4 }
const artwork = import.meta.glob('../assets/fish/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const journalEntries = {
  bluegill: {
    habitat: 'Warm shallows, lily pads, docks, and fallen timber',
    typicalSize: '0.25–1 lb',
    journal: 'Bluegill are curious fish that often gather around fallen trees and lily pads. Many anglers catch their very first fish on a Bluegill.',
  },
  sunfish: {
    habitat: 'Vegetated shallows, docks, and quiet shoreline cover',
    typicalSize: '0.2–0.75 lb',
    journal: 'Pumpkinseed patrol warm, weedy shorelines in search of insects and small crustaceans. Their orange breast and blue facial lines make even a modest catch memorable.',
  },
  crappie: {
    habitat: 'Brush piles, submerged branches, and shaded cover',
    typicalSize: '0.5–1.5 lb',
    journal: 'Black Crappie travel in loose schools and gather wherever a larger pond offers shelter. Finding one near submerged cover often means more are waiting nearby.',
  },
  perch: {
    habitat: 'Weed edges, open shallows, and firm lake bottoms',
    typicalSize: '0.3–1.5 lb',
    journal: 'Yellow Perch move together in lively schools. Their golden sides and dark bars disappear surprisingly well among reeds, shadows, and wavering sunlight.',
  },
  'rock-bass': {
    habitat: 'Rocky shorelines, reefs, docks, and shaded structure',
    typicalSize: '0.3–1.5 lb',
    journal: 'Rock Bass hold close to stone and shadow along the lake shore. Their red eyes and sturdy shape suit the broken rock where they wait for insects, crayfish, and small fish.',
  },
  'largemouth-bass': {
    habitat: 'Weed beds, logs, docks, and sheltered shoreline cover',
    typicalSize: '1–5 lb',
    journal: 'Largemouth Bass are patient ambush hunters. They wait beside cover, then strike with a sudden burst that has startled generations of anglers.',
  },
  'smallmouth-bass': {
    habitat: 'Clear water near rocks, gravel, and firm structure',
    typicalSize: '1–4 lb',
    journal: 'Smallmouth Bass favor clear water and rocky places. Pound for pound, few pond fish fight with more determination once they feel the line.',
  },
  walleye: {
    habitat: 'Rocky reefs, drop-offs, and dim open water',
    typicalSize: '1–8 lb',
    journal: 'Walleye use their light-sensitive eyes to hunt where daylight fades. Across the Great Lakes, their gold flanks and white-tipped tail are signs of one of the Midwest’s defining fisheries.',
  },
  'lake-trout': {
    habitat: 'Cold, deep, well-oxygenated offshore water',
    typicalSize: '4–20 lb',
    journal: 'Lake Trout are native predators of the Great Lakes’ deep cold water. Slow-growing and powerful, they move along reefs and steep underwater slopes far below the bright surface.',
  },
  catfish: {
    habitat: 'Deep holes, shaded banks, and quiet bottom structure',
    typicalSize: '2–12 lb',
    journal: 'Channel Catfish explore the bottom with sensitive barbels that help them find food in dim water. They become especially active as evening settles over the pond.',
  },
  carp: {
    habitat: 'Warm, slow water with soft bottoms and aquatic plants',
    typicalSize: '3–20 lb',
    journal: 'Common Carp are wary, powerful fish that learn the rhythms of their home water. A large one can turn a peaceful cast into a long and stubborn contest.',
  },
  'rainbow-trout': {
    habitat: 'Cool, clear, well-oxygenated water',
    typicalSize: '0.8–5 lb',
    journal: 'Rainbow Trout carry a soft rose-colored band along their sides. In clear water they seem to flash silver, green, and violet all at once.',
  },
  'mountain-whitefish': {
    habitat: 'Cold, clear rivers with gravel beds and steady current',
    typicalSize: '1–3 lb',
    journal: 'Mountain Whitefish gather near the riverbed where they feed on drifting insects. Their quiet silver shape is easy to overlook, but it belongs naturally among the cold currents of the Northwest.',
  },
  'coastal-cutthroat': {
    habitat: 'Cool forest streams, shaded pools, and woody cover',
    typicalSize: '0.5–3 lb',
    journal: 'Coastal Cutthroat Trout thrive in shaded streams beneath the forests of the Pacific Northwest. The bright slash beneath the jaw reveals a fish otherwise perfectly suited to disappearing among stones and reflections.',
  },
  steelhead: {
    habitat: 'Fast rivers connected to the Pacific Ocean',
    typicalSize: '6–12 lb',
    journal: 'Steelhead are Rainbow Trout shaped by an extraordinary journey to the ocean and home again. Their silver sides carry the strength of open water back into the river current.',
  },
  'chinook-salmon': {
    habitat: 'Large coastal rivers and deep, powerful runs',
    typicalSize: '10–30 lb',
    journal: 'Chinook Salmon return from the Pacific to the rivers where their lives began. Known as king salmon, they are the largest Pacific salmon and one of the Northwest’s most remarkable travelers.',
  },
  'northern-pike': {
    habitat: 'Vegetated shallows and weed edges near open water',
    typicalSize: '4–18 lb',
    journal: 'Northern Pike wait motionless among weeds before accelerating after their prey. Their long shape, pale spots, and watchful eyes belong to a true ambush predator.',
  },
  'great-lakes-muskellunge': {
    habitat: 'Large bays, connecting waters, reefs, and weed edges',
    typicalSize: '15–40 lb',
    journal: 'Great Lakes Muskellunge are immense, elusive predators built for short bursts of speed. An encounter with one is rare enough to become the story an angler tells for years.',
  },
  'atlantic-croaker': {
    habitat: 'Sandy bay bottoms, marsh edges, and oyster beds',
    typicalSize: '0.5–2 lb',
    journal: 'Atlantic Croaker search soft coastal bottoms with small chin barbels. Their name comes from the resonant sound they make by vibrating muscles against the swim bladder.',
  },
  'sand-seatrout': {
    habitat: 'Open bays, channels, and sandy or muddy bottoms',
    typicalSize: '0.5–2 lb',
    journal: 'Sand Seatrout, locally called White Trout, move through Mississippi Sound and Mobile Bay in loose schools. Unlike their spotted relatives, their silver sides carry no dark body spots.',
  },
  sheepshead: {
    habitat: 'Oyster reefs, pilings, jetties, and other hard structure',
    typicalSize: '1–8 lb',
    journal: 'Sheepshead use strong, humanlike front teeth and crushing molars to pry barnacles, crabs, and shellfish from pilings and oyster reefs. Their black bars make them unmistakable.',
  },
  'southern-flounder': {
    habitat: 'Sandy and muddy bay bottoms near channels and marsh drains',
    typicalSize: '1–5 lb',
    journal: 'Southern Flounder settle onto the bottom with both eyes on the upper side of the head. Their shifting mottled color hides an ambush hunter almost perfectly against sand and mud.',
  },
  'spotted-seatrout': {
    habitat: 'Seagrass, oyster reefs, tidal creeks, and open bays',
    typicalSize: '1–5 lb',
    journal: 'Spotted Seatrout—often called Speckled Trout along the Gulf—hunt shrimp and small fish across grass beds and oyster reefs. Dark spots continue onto their fins and tail.',
  },
  'black-drum': {
    habitat: 'Oyster reefs, bay channels, and unvegetated bottoms',
    typicalSize: '5–40 lb',
    journal: 'Black Drum root across the bay floor with sensitive chin barbels, feeding heavily on crabs and shellfish. The bold bars of young fish fade as adults grow broad, dark, and immensely powerful.',
  },
  'red-drum': {
    habitat: 'Marsh edges, grass flats, oyster reefs, and bay passes',
    typicalSize: '3–30 lb',
    journal: 'Red Drum are the copper-backed icons of the Gulf Coast. Young redfish patrol bays and marshes before mature fish move toward passes and nearshore water, carrying a black tail spot like a false eye.',
  },
  cobia: {
    habitat: 'Bay mouths, channels, buoys, and nearshore structure',
    typicalSize: '20–60 lb',
    journal: 'Cobia are powerful coastal travelers that appear around channel markers, rays, and nearshore structure as Gulf waters warm. Their long dark shape can turn a quiet cast into an unforgettable fight.',
  },
  'golden-trout': {
    habitat: 'Cold, clear high-country lakes and mountain streams',
    typicalSize: '0.5–3 lb',
    journal: 'Golden Trout are creatures of cold, clear mountain water. Finding one among alpine reflections is a rare encounter whose brilliant colors are not easily forgotten.',
  },
  'old-whiskers': {
    habitat: 'The deepest, oldest hollow beneath the willow roots',
    typicalSize: '20–70 lb',
    journal: 'Old Whiskers was already a pond legend when today’s oldest anglers were children. Some say the great catfish knows every root, stone, and forgotten hook in Backyard Pond.',
  },
}

export const fish = [
  ['bluegill','Bluegill','common',0.25,2,6,'A familiar pond fish found close to shore.'],
  ['sunfish','Pumpkinseed','common',0.2,1.5,7,'A bright Midwestern sunfish that favors warm shallows.'],
  ['crappie','Black Crappie','common',0.4,2.5,8,'A speckled schooling fish found around cover.'],
  ['perch','Yellow Perch','common',0.3,3,9,'A striped hunter with golden sides.'],
  ['rock-bass','Rock Bass','common',0.3,3,10,'A red-eyed shoreline fish at home among rocks.'],
  ['mountain-whitefish','Mountain Whitefish','common',0.5,5,11,'A silver river native that feeds beneath the current.'],
  ['largemouth-bass','Largemouth Bass','uncommon',1,12,13,'A powerful ambush predator of weedy water.'],
  ['smallmouth-bass','Smallmouth Bass','uncommon',1,8,15,'A spirited fighter that prefers clear water.'],
  ['walleye','Walleye','rare',1,18,26,'A gold-sided hunter adapted to dim lake water.'],
  ['lake-trout','Lake Trout','epic',4,40,48,'A powerful native of the Great Lakes’ cold depths.'],
  ['catfish','Channel Catfish','uncommon',2,25,11,'A whiskered bottom dweller most active at dusk.'],
  ['coastal-cutthroat','Coastal Cutthroat Trout','uncommon',0.5,6,18,'A forest-stream trout marked by a vivid red throat.'],
  ['carp','Common Carp','rare',3,35,10,'A wary, heavy fish with burnished scales.'],
  ['rainbow-trout','Rainbow Trout','rare',0.8,10,23,'A beautiful fish with a shimmering rose stripe.'],
  ['steelhead','Steelhead','epic',5,30,42,'A sea-run Rainbow Trout returning to its home river.'],
  ['chinook-salmon','Chinook Salmon','legendary',10,60,78,'The mighty king salmon of Pacific coastal rivers.'],
  ['northern-pike','Northern Pike','epic',4,30,28,'A swift predator with an unmistakable silhouette.'],
  ['great-lakes-muskellunge','Great Lakes Muskellunge','legendary',10,58,88,'The elusive apex predator of sprawling northern waters.'],
  ['atlantic-croaker','Atlantic Croaker','common',0.25,5,11,'A familiar bay fish named for its resonant call.'],
  ['sand-seatrout','Sand Seatrout','common',0.4,6,12,'The silvery White Trout of Gulf bays and channels.'],
  ['sheepshead','Sheepshead','uncommon',1,20,17,'A striped shellfish specialist of reefs and pilings.'],
  ['southern-flounder','Southern Flounder','uncommon',1,12,19,'A flat-bodied ambush hunter hidden on the bay floor.'],
  ['spotted-seatrout','Spotted Seatrout','rare',1,12,27,'A speckled Gulf gamefish of grass and oyster reef.'],
  ['black-drum','Black Drum','rare',5,80,33,'A heavy bay-bottom fish with sensitive chin barbels.'],
  ['red-drum','Red Drum','epic',3,50,52,'The copper-backed icon of Gulf Coast fishing.'],
  ['cobia','Cobia','legendary',20,100,92,'A mighty seasonal traveler of bays and nearshore water.'],
  ['golden-trout','Golden Trout','epic',0.5,6,55,'A radiant and exceptionally elusive trout.'],
  ['old-whiskers','Legendary Old Whiskers','legendary',20,70,90,'The ancient monarch of Backyard Pond.']
].map(([id,name,rarity,minWeight,maxWeight,baseValue,description]) => ({
  id,
  name,
  rarity,
  minWeight,
  maxWeight,
  baseValue,
  description,
  image: artwork[`../assets/fish/${id}.webp`],
  ...journalEntries[id],
}))

export const getFish = (id) => fish.find((item) => item.id === id)
