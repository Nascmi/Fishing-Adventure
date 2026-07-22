import { locations } from '../data/locations'

export const FIELD_NOTE_TEMPLATES = [
  { id: 'steady-afternoon', title: 'A Steady Outing', description: 'Land any 3 fish.', target: 3, reward: 75 },
  { id: 'variety-basket', title: 'A Varied Basket', description: 'Land 2 different species.', target: 2, reward: 100 },
  { id: 'fine-specimen', title: 'A Fine Specimen', description: 'Land a Good-or-better fish.', target: 1, reward: 125 },
]

export const DERBY_CAST_LIMIT = 12
const locationIds = new Set(locations.map((location) => location.id))
const sizeBonuses = { regular: 0, good: 25, great: 75, trophy: 150 }

export const defaultActivities = () => ({
  fieldNotes: { entries: [], lastGeneratedDay: null },
  derbies: { active: null, personalBests: {} },
})

export const localDayKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dayNumber = (key) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key || '')) return null
  const [year, month, day] = key.split('-').map(Number)
  const value = Date.UTC(year, month - 1, day) / 86400000
  return Number.isFinite(value) ? value : null
}

const progressValue = (entry) => entry.templateId === 'variety-basket' ? entry.speciesIds.length : entry.progress

export const syncFieldNotes = (state, today = localDayKey()) => {
  const todayNumber = dayNumber(today)
  if (todayNumber === null) return state
  const current = state.activities?.fieldNotes || defaultActivities().fieldNotes
  const entries = current.entries.filter((entry) => {
    const created = dayNumber(entry.createdDay)
    return created !== null && todayNumber - created >= 0 && todayNumber - created < 3
  }).slice(-3)
  if (current.lastGeneratedDay && current.lastGeneratedDay >= today) {
    return entries.length === current.entries.length ? state : { ...state, activities: { ...state.activities, fieldNotes: { ...current, entries } } }
  }
  const template = FIELD_NOTE_TEMPLATES[((todayNumber % FIELD_NOTE_TEMPLATES.length) + FIELD_NOTE_TEMPLATES.length) % FIELD_NOTE_TEMPLATES.length]
  const nextEntry = { id: `${today}:${template.id}`, templateId: template.id, createdDay: today, progress: 0, speciesIds: [], completedAt: null }
  return {
    ...state,
    activities: {
      ...state.activities,
      fieldNotes: { entries: [...entries, nextEntry].slice(-3), lastGeneratedDay: today },
    },
  }
}

const updateFieldNotes = (state, item, now) => {
  let reward = 0
  const fieldNotes = state.activities.fieldNotes
  const entries = fieldNotes.entries.map((entry) => {
    if (entry.completedAt) return entry
    const template = FIELD_NOTE_TEMPLATES.find((candidate) => candidate.id === entry.templateId)
    if (!template) return entry
    let next = entry
    if (entry.templateId === 'steady-afternoon') next = { ...entry, progress: Math.min(template.target, entry.progress + 1) }
    if (entry.templateId === 'variety-basket') next = { ...entry, speciesIds: [...new Set([...entry.speciesIds, item.fishId])].slice(0, template.target) }
    if (entry.templateId === 'fine-specimen' && ['good', 'great', 'trophy'].includes(item.sizeTier)) next = { ...entry, progress: 1 }
    if (progressValue(next) < template.target) return next
    reward += template.reward
    return { ...next, completedAt: now }
  })
  return {
    ...state,
    coins: state.coins + reward,
    stats: { ...state.stats, totalCoinsEarned: state.stats.totalCoinsEarned + reward },
    activities: { ...state.activities, fieldNotes: { ...fieldNotes, entries } },
  }
}

export const startDerby = (state, locationId, now = Date.now()) => {
  if (state.activities.derbies.active || !locationIds.has(locationId)) return state
  return {
    ...state,
    activities: {
      ...state.activities,
      derbies: { ...state.activities.derbies, active: { locationId, startedAt: now, castLimit: DERBY_CAST_LIMIT, castsUsed: 0, outcomesRecorded: 0, score: 0, catches: [] } },
    },
  }
}

export const abandonDerby = (state) => state.activities.derbies.active
  ? { ...state, activities: { ...state.activities, derbies: { ...state.activities.derbies, active: null } } }
  : state

export const recordActivityCast = (state, locationId) => {
  const active = state.activities.derbies.active
  if (!active || active.locationId !== locationId || active.castsUsed >= active.castLimit) return state
  return { ...state, activities: { ...state.activities, derbies: { ...state.activities.derbies, active: { ...active, castsUsed: active.castsUsed + 1 } } } }
}

const finishDerbyIfComplete = (state, active, now) => {
  if (active.outcomesRecorded < active.castLimit) return { ...state, activities: { ...state.activities, derbies: { ...state.activities.derbies, active } } }
  const previous = state.activities.derbies.personalBests[active.locationId]
  const result = { score: active.score, catches: active.catches.length, completedAt: now }
  return {
    ...state,
    activities: {
      ...state.activities,
      derbies: {
        active: null,
        personalBests: { ...state.activities.derbies.personalBests, [active.locationId]: !previous || result.score > previous.score ? result : previous },
      },
    },
  }
}

export const recordActivityOutcome = (state, locationId, item = null, now = Date.now()) => {
  let next = item ? updateFieldNotes(state, item, now) : state
  const active = next.activities.derbies.active
  if (!active || active.locationId !== locationId || active.outcomesRecorded >= active.castsUsed) return next
  const firstSpecies = item && !active.catches.some((entry) => entry.fishId === item.fishId)
  const catchScore = item ? 100 + (firstSpecies ? 50 : 0) + (sizeBonuses[item.sizeTier] || 0) : 0
  const settled = {
    ...active,
    outcomesRecorded: active.outcomesRecorded + 1,
    score: active.score + catchScore,
    catches: item ? [...active.catches, { fishId: item.fishId, sizeTier: item.sizeTier, weight: item.weight, score: catchScore }].slice(-DERBY_CAST_LIMIT) : active.catches,
  }
  return finishDerbyIfComplete(next, settled, now)
}

export const validateActivities = (raw) => {
  const fallback = defaultActivities()
  const notes = raw?.fieldNotes
  const entries = Array.isArray(notes?.entries) ? notes.entries.filter((entry) => {
    return entry && FIELD_NOTE_TEMPLATES.some((template) => template.id === entry.templateId) && typeof entry.id === 'string' && dayNumber(entry.createdDay) !== null
  }).slice(-3).map((entry) => ({
    id: entry.id,
    templateId: entry.templateId,
    createdDay: entry.createdDay,
    progress: Math.max(0, Math.floor(Number(entry.progress) || 0)),
    speciesIds: Array.isArray(entry.speciesIds) ? [...new Set(entry.speciesIds.filter((id) => typeof id === 'string'))].slice(0, 2) : [],
    completedAt: Number.isFinite(entry.completedAt) && entry.completedAt > 0 ? entry.completedAt : null,
  })) : []
  const derbies = raw?.derbies
  const personalBests = Object.fromEntries(Object.entries(derbies?.personalBests && typeof derbies.personalBests === 'object' ? derbies.personalBests : {}).filter(([id, result]) => locationIds.has(id) && result && Number.isFinite(result.score) && result.score >= 0).map(([id, result]) => [id, { score: Math.floor(result.score), catches: Math.max(0, Math.min(DERBY_CAST_LIMIT, Math.floor(Number(result.catches) || 0))), completedAt: Number.isFinite(result.completedAt) ? result.completedAt : null }]))
  const candidate = derbies?.active
  const active = candidate && locationIds.has(candidate.locationId) && Number.isFinite(candidate.castsUsed) && Number.isFinite(candidate.outcomesRecorded)
    ? { locationId: candidate.locationId, startedAt: Number.isFinite(candidate.startedAt) ? candidate.startedAt : Date.now(), castLimit: DERBY_CAST_LIMIT, castsUsed: Math.max(0, Math.min(DERBY_CAST_LIMIT, Math.floor(candidate.castsUsed))), outcomesRecorded: Math.max(0, Math.min(Math.floor(candidate.castsUsed), Math.floor(candidate.outcomesRecorded))), score: Math.max(0, Math.floor(Number(candidate.score) || 0)), catches: Array.isArray(candidate.catches) ? candidate.catches.slice(-DERBY_CAST_LIMIT) : [] }
    : null
  return { fieldNotes: { entries, lastGeneratedDay: dayNumber(notes?.lastGeneratedDay) !== null ? notes.lastGeneratedDay : null }, derbies: { active, personalBests } }
}
