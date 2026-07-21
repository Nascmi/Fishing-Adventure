import { describe, expect, it } from 'vitest'
import { advanceWalletGesture, armWalletGesture, WALLET_TAP_WINDOW_MS } from './walletGesture'

describe('wallet gesture', () => {
  it('requires three taps after being armed', () => {
    let result = advanceWalletGesture(armWalletGesture(100), 101)
    expect(result.completed).toBe(false)
    result = advanceWalletGesture(result.state, 102)
    expect(result.completed).toBe(false)
    result = advanceWalletGesture(result.state, 103)
    expect(result).toEqual({ state: null, completed: true })
  })

  it('expires without completing and cannot continue unarmed', () => {
    const expired = advanceWalletGesture(armWalletGesture(100), 100 + WALLET_TAP_WINDOW_MS + 1)
    expect(expired).toEqual({ state: null, completed: false })
    expect(advanceWalletGesture(null, 102).completed).toBe(false)
  })
})
