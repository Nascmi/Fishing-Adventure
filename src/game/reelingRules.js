const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export function advanceReeling(state, { holding, difficulty, lineControl, delta, tuning }) {
  const next = { ...state, elapsed: state.elapsed + delta }
  const fishPull = 1 + Math.max(0, Math.sin(next.elapsed * (2.4 + difficulty))) * 0.22

  if (holding) {
    next.tension += tuning.tensionRisePerSecond * difficulty * fishPull * (1 - lineControl) * delta
    const controlBonus = 1 + lineControl * 0.35
    const usefulTension = next.tension >= tuning.safeTensionMin && next.tension <= tuning.safeTensionMax
    next.progress += tuning.progressPerSecond * controlBonus / difficulty * (usefulTension ? 1 : tuning.redZoneProgressMultiplier) * delta
  } else {
    next.tension -= tuning.tensionRecoveryPerSecond * (1 + lineControl) * delta
    if (next.elapsed > 1.2) {
      const slackPenalty = next.tension < tuning.safeTensionMin ? tuning.slackProgressLossMultiplier : 1
      next.progress -= tuning.progressLossPerSecond * difficulty * slackPenalty * delta
    }
  }

  if (next.tension > tuning.safeTensionMax) {
    const redDepth = (next.tension - tuning.safeTensionMax) / (100 - tuning.safeTensionMax)
    next.lineStrain += tuning.lineStrainPerSecond * difficulty * (0.65 + redDepth * 0.7) * delta
  } else {
    next.lineStrain -= tuning.lineStrainRecoveryPerSecond * (1 + lineControl) * delta
  }

  next.tension = clamp(next.tension)
  next.progress = clamp(next.progress)
  next.lineStrain = clamp(next.lineStrain)

  if (next.progress >= 100) return { state: next, outcome: 'caught' }
  if (next.tension >= 100 || next.lineStrain >= 100 || next.progress <= 0) return { state: next, outcome: 'escaped' }
  return { state: next, outcome: null }
}
