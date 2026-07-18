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
    habitat: 'Sunny shallows with weeds, reeds, and quiet cover',
    typicalSize: '0.2–0.75 lb',
    journal: 'Bright as a small piece of summer, Sunfish patrol warm shorelines in search of insects and tiny prey. Their bold colors make even a modest catch memorable.',
  },
  crappie: {
    habitat: 'Brush piles, submerged branches, and shaded cover',
    typicalSize: '0.5–1.5 lb',
    journal: 'Crappie travel in loose schools and gather wherever the pond offers shelter. Finding one near submerged cover often means more are waiting nearby.',
  },
  perch: {
    habitat: 'Weed edges, open shallows, and firm lake bottoms',
    typicalSize: '0.3–1.5 lb',
    journal: 'Yellow Perch move together in lively schools. Their golden sides and dark bars disappear surprisingly well among reeds, shadows, and wavering sunlight.',
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
  'northern-pike': {
    habitat: 'Vegetated shallows and weed edges near open water',
    typicalSize: '4–18 lb',
    journal: 'Northern Pike wait motionless among weeds before accelerating after their prey. Their long shape, pale spots, and watchful eyes belong to a true ambush predator.',
  },
  'golden-trout': {
    habitat: 'The coolest, clearest spring-fed reaches of Willow Pond',
    typicalSize: '0.5–3 lb',
    journal: 'Golden Trout are creatures of cold, clear mountain water, making this visitor to Willow Pond especially mysterious. Its brilliant colors are rarely forgotten.',
  },
  'old-whiskers': {
    habitat: 'The deepest, oldest hollow beneath the willow roots',
    typicalSize: '20–70 lb',
    journal: 'Old Whiskers was already a pond legend when today’s oldest anglers were children. Some say the great catfish knows every root, stone, and forgotten hook in Willow Pond.',
  },
}

export const fish = [
  ['bluegill','Bluegill','common',0.25,2,6,'A familiar pond fish found close to shore.'],
  ['sunfish','Sunfish','common',0.2,1.5,7,'A bright, lively fish that favors warm shallows.'],
  ['crappie','Crappie','common',0.4,2.5,8,'A speckled schooling fish found around cover.'],
  ['perch','Yellow Perch','common',0.3,3,9,'A striped hunter with golden sides.'],
  ['largemouth-bass','Largemouth Bass','uncommon',1,12,13,'A powerful ambush predator of weedy water.'],
  ['smallmouth-bass','Smallmouth Bass','uncommon',1,8,15,'A spirited fighter that prefers clear water.'],
  ['catfish','Channel Catfish','uncommon',2,25,11,'A whiskered bottom dweller most active at dusk.'],
  ['carp','Common Carp','rare',3,35,10,'A wary, heavy fish with burnished scales.'],
  ['rainbow-trout','Rainbow Trout','rare',0.8,10,23,'A beautiful fish with a shimmering rose stripe.'],
  ['northern-pike','Northern Pike','epic',4,30,28,'A swift predator with an unmistakable silhouette.'],
  ['golden-trout','Golden Trout','epic',0.5,6,55,'A radiant and exceptionally elusive trout.'],
  ['old-whiskers','Legendary Old Whiskers','legendary',20,70,90,'The ancient monarch of Willow Pond.']
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
