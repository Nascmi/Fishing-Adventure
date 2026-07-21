import { locations } from './locations'

const hasFish = (state, fishId) => Boolean(state.collection[fishId]?.count)
const hasLocationCollection = (state, location) => location.fishIds.every((id) => hasFish(state, id))
const allPhases = ['morning', 'midday', 'evening', 'night']

export const achievements = [
  { id: 'first-cast', name: 'First Cast', description: 'Cast a line for the first time.', flavor: 'Every angling story begins with a single cast.', test: (s) => s.stats.totalCasts >= 1 },
  { id: 'first-story', name: 'First Story', description: 'Catch your first fish.', flavor: 'The first fish is never just another fish.', test: (s) => s.stats.totalCaught >= 1 },
  { id: 'fine-specimen', name: 'A Fine Specimen', description: 'Catch a Great or Trophy specimen.', flavor: 'Some catches deserve a longer look.', test: (s) => ['great', 'trophy'].includes(s.stats.largestFish?.sizeTier) || s.inventory.some((item) => ['great', 'trophy'].includes(item.sizeTier)) },
  { id: 'familiar-waters', name: 'Familiar Waters', description: 'Discover every species in Backyard Pond.', flavor: 'You know every quiet corner of the home water.', test: (s) => hasLocationCollection(s, locations[0]) },
  { id: 'gone-fishing', name: 'Gone Fishing', description: 'Book your first destination trip.', flavor: 'Home will be waiting when the road brings you back.', test: (s) => s.achievementProgress.locationsFished.some((id) => id !== 'willow-pond') },
  { id: 'four-waters', name: 'All Waters', description: 'Fish at every current location.', flavor: 'Five different waters, each with its own rhythm.', test: (s) => locations.every((location) => s.achievementProgress.locationsFished.includes(location.id)) },
  { id: 'three-days', name: 'Three Days on the Water', description: 'Complete an entire charter trip.', flavor: 'You stayed from the first morning through the final night.', test: (s) => s.achievementProgress.completedTrips.length > 0 },
  { id: 'well-traveled', name: 'Well Traveled', description: 'Catch a fish at every current location.', flavor: 'Your journal carries a little of every shoreline.', test: (s) => locations.every((location) => s.achievementProgress.locationsCaught.includes(location.id)) },
  { id: 'around-clock', name: 'Around the Clock', description: 'Catch a fish during all four parts of the day.', flavor: 'The water is never quite the same twice.', test: (s) => allPhases.every((phase) => s.achievementProgress.phasesCaught.includes(phase)) },
  { id: 'early-riser', name: 'Early Riser', description: 'Catch a morning-active species during morning.', flavor: 'Cool air, still water, and the first cast of the day.', test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.phase === 'morning') },
  { id: 'evening-rise', name: 'Evening Rise', description: 'Catch an evening-active species during evening.', flavor: 'The last light brought the water to life.', test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.phase === 'evening') },
  { id: 'under-stars', name: 'Under the Stars', description: 'Land a fish at night.', flavor: 'A quiet catch beneath a dark sky.', test: (s) => s.achievementProgress.phasesCaught.includes('night') },
  { id: 'right-time', name: 'Right Time, Right Place', description: 'Catch four species during their preferred periods.', flavor: 'Patience becomes knowledge, and knowledge becomes instinct.', test: (s) => new Set(s.achievementProgress.peakMoments.map((entry) => entry.fishId)).size >= 4 },
  { id: 'field-notes', name: 'Field Notes', description: 'Discover ten species.', flavor: 'A journal begins to resemble a life around water.', test: (s) => Object.keys(s.collection).length >= 10 },
  { id: 'local-naturalist', name: 'Local Naturalist', description: 'Discover every species at one location.', flavor: 'Familiar names now live behind every ripple.', test: (s) => locations.some((location) => hasLocationCollection(s, location)) },
  { id: 'traveling-naturalist', name: 'Traveling Naturalist', description: 'Discover every species at every current location.', flavor: 'A remarkable record of the waters you have known.', test: (s) => locations.every((location) => hasLocationCollection(s, location)) },
  { id: 'legendary-encounter', name: 'Legendary Encounter', description: 'Catch any legendary species.', flavor: 'This is the story that will be told for years.', test: (s) => s.stats.rarestFish?.rarity === 'legendary' },
  { id: 'one-for-stories', name: 'One for the Stories', description: 'Catch a Trophy legendary specimen.', flavor: 'For once, the old fishing story needs no exaggeration.', test: (s) => s.achievementProgress.amazingLegendaryCaught },
  { id: 'old-pond-knows', name: 'The Old Pond Knows', description: 'A hidden keepsake.', unlockedDescription: 'Catch Old Whiskers at night.', flavor: 'Some legends wait until the pond is dark and still.', hidden: true, test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.fishId === 'old-whiskers' && entry.phase === 'night') },
  { id: 'king-river', name: 'King of the River', description: 'A hidden keepsake.', unlockedDescription: 'Catch a Chinook Salmon during morning.', flavor: 'The king returned with the morning current.', hidden: true, test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.fishId === 'chinook-salmon' && entry.phase === 'morning') },
  { id: 'copper-sunset', name: 'Copper at Sunset', description: 'A hidden keepsake.', unlockedDescription: 'Catch a Red Drum during evening.', flavor: 'Copper scales held the last light of day.', hidden: true, test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.fishId === 'red-drum' && entry.phase === 'evening') },
  { id: 'shadow-channel', name: 'Shadow in the Channel', description: 'A hidden keepsake.', unlockedDescription: 'Catch a Cobia during midday.', flavor: 'A long shadow rose from the bright coastal water.', hidden: true, test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.fishId === 'cobia' && entry.phase === 'midday') },
  { id: 'gold-horizon', name: 'Gold on the Horizon', description: 'A hidden keepsake.', unlockedDescription: 'Catch a Yellowfin Tuna during morning.', flavor: 'The open Gulf gave up a flash of gold at first light.', hidden: true, test: (s) => s.achievementProgress.peakMoments.some((entry) => entry.fishId === 'yellowfin-tuna' && entry.phase === 'morning') },
  { id: 'ten-thousand-casts', name: 'The Fish of Ten Thousand Casts', description: 'A hidden keepsake.', unlockedDescription: 'Catch a Great Lakes Muskellunge.', flavor: 'The name is a story, not a requirement. One cast was enough.', hidden: true, test: (s) => hasFish(s, 'great-lakes-muskellunge') },
]

export const unlockAchievements = (state, now = Date.now()) => {
  const unlocked = { ...state.achievements }
  const newlyUnlocked = []
  achievements.forEach((achievement) => {
    if (!unlocked[achievement.id] && achievement.test(state)) {
      unlocked[achievement.id] = { unlockedAt: now }
      newlyUnlocked.push(achievement)
    }
  })
  return { state: { ...state, achievements: unlocked }, newlyUnlocked }
}
