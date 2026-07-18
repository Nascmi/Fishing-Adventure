let audioContext
let pondAmbience

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  audioContext ||= new AudioContext()
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {})
  return audioContext
}

const soundPatterns = {
  cast: [[260, 0.05, 0.025], [330, 0.08, 0.025]],
  bite: [[520, 0.08, 0.04], [690, 0.1, 0.04]],
  hook: [[360, 0.07, 0.03]],
  catch: [[392, 0.08, 0.035], [523, 0.1, 0.035], [659, 0.15, 0.03]],
  escape: [[310, 0.08, 0.025], [230, 0.14, 0.02]],
  coins: [[660, 0.06, 0.025], [880, 0.09, 0.02]],
  purchase: [[330, 0.07, 0.025], [440, 0.11, 0.025]],
}

const vibrationPatterns = {
  bite: [35, 35, 55],
  hook: [25],
  catch: [30, 35, 70],
  escape: [45],
  coins: [20],
  purchase: [25, 25, 35],
}

function playSound(type) {
  const context = getAudioContext()
  if (!context || !soundPatterns[type]) return

  let start = context.currentTime
  soundPatterns[type].forEach(([frequency, duration, volume]) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.01)
    start += duration * 0.7
  })
}

function createNoiseBuffer(context, seconds = 18) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const samples = buffer.getChannelData(0)
  let previous = 0
  for (let index = 0; index < samples.length; index += 1) {
    const white = Math.random() * 2 - 1
    previous = previous * 0.965 + white * 0.035
    samples[index] = previous
  }
  return buffer
}

function stopPondAmbience() {
  if (!pondAmbience) return
  const session = pondAmbience
  pondAmbience = null
  const now = session.context.currentTime
  session.master.gain.cancelScheduledValues(now)
  session.master.gain.setValueAtTime(Math.max(session.master.gain.value, 0.0001), now)
  session.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
  setTimeout(() => {
    session.removeUnlockListeners()
    session.sources.forEach((source) => {
      try { source.stop() } catch { /* Already stopped. */ }
    })
    session.nodes.forEach((node) => node.disconnect())
  }, 500)
}

function startPondAmbience() {
  if (pondAmbience) return
  const context = getAudioContext()
  if (!context) return

  const unlockAudio = () => {
    context.resume().catch(() => {})
    window.removeEventListener('pointerdown', unlockAudio)
    window.removeEventListener('keydown', unlockAudio)
  }
  const removeUnlockListeners = () => {
    window.removeEventListener('pointerdown', unlockAudio)
    window.removeEventListener('keydown', unlockAudio)
  }
  if (context.state === 'suspended') {
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })
  }

  const buffer = createNoiseBuffer(context)
  const master = context.createGain()
  const windSource = context.createBufferSource()
  const waterSource = context.createBufferSource()
  const windFilter = context.createBiquadFilter()
  const waterFilter = context.createBiquadFilter()
  const windGain = context.createGain()
  const waterGain = context.createGain()
  const windMotion = context.createOscillator()
  const waterMotion = context.createOscillator()
  const windDepth = context.createGain()
  const waterDepth = context.createGain()

  windSource.buffer = buffer
  windSource.loop = true
  waterSource.buffer = buffer
  waterSource.loop = true
  waterSource.playbackRate.value = 0.83
  windFilter.type = 'lowpass'
  windFilter.frequency.value = 1050
  waterFilter.type = 'bandpass'
  waterFilter.frequency.value = 230
  waterFilter.Q.value = 0.7
  windGain.gain.value = 0.58
  waterGain.gain.value = 0.28
  windMotion.frequency.value = 0.071
  waterMotion.frequency.value = 0.043
  windDepth.gain.value = 0.12
  waterDepth.gain.value = 0.08

  windSource.connect(windFilter).connect(windGain).connect(master)
  waterSource.connect(waterFilter).connect(waterGain).connect(master)
  windMotion.connect(windDepth).connect(windGain.gain)
  waterMotion.connect(waterDepth).connect(waterGain.gain)
  master.connect(context.destination)

  const now = context.currentTime
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.016, now + 1.8)
  windSource.start(now, Math.random() * 8)
  waterSource.start(now, Math.random() * 8)
  windMotion.start(now)
  waterMotion.start(now)

  pondAmbience = {
    context,
    master,
    removeUnlockListeners,
    sources: [windSource, waterSource, windMotion, waterMotion],
    nodes: [windSource, waterSource, windFilter, waterFilter, windGain, waterGain, windMotion, waterMotion, windDepth, waterDepth, master],
  }
}

export function setPondAmbienceEnabled(enabled) {
  if (enabled) startPondAmbience()
  else stopPondAmbience()
}

export function giveFeedback(type, settings) {
  if (settings?.soundEnabled) playSound(type)
  if (settings?.hapticsEnabled && vibrationPatterns[type] && navigator.vibrate) {
    navigator.vibrate(vibrationPatterns[type])
  }
}
