export const WALLET_HOLD_MS = 4000
export const WALLET_TAP_WINDOW_MS = 5000

export const armWalletGesture = (now) => ({ armedUntil: now + WALLET_TAP_WINDOW_MS, taps: 0 })

export const advanceWalletGesture = (state, now) => {
  if (!state || now > state.armedUntil) return { state: null, completed: false }
  const taps = state.taps + 1
  if (taps < 3) return { state: { ...state, taps }, completed: false }
  return { state: null, completed: true }
}
