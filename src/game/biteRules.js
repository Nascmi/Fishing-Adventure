export const getQuietCastChance = (rod) => Math.min(3, Math.max(1.5, Number(rod?.quietCastChance) || 3))

export const isQuietCast = (rod, previousWasQuiet, random = Math.random) =>
  !previousWasQuiet && random() < getQuietCastChance(rod) / 100
