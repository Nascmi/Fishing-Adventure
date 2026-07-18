export const RARITY = { common: 1, uncommon: 1.25, rare: 1.7, epic: 2.4, legendary: 4 }
const artwork = import.meta.glob('../assets/fish/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

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
}))

export const getFish = (id) => fish.find((item) => item.id === id)
