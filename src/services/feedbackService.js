let audioContext

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
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext || !soundPatterns[type]) return
  audioContext ||= new AudioContext()
  if (audioContext.state === 'suspended') audioContext.resume()

  let start = audioContext.currentTime
  soundPatterns[type].forEach(([frequency, duration, volume]) => {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.01)
    start += duration * 0.7
  })
}

export function giveFeedback(type, settings) {
  if (settings?.soundEnabled) playSound(type)
  if (settings?.hapticsEnabled && vibrationPatterns[type] && navigator.vibrate) {
    navigator.vibrate(vibrationPatterns[type])
  }
}
