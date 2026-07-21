import { beforeEach, describe, expect, it } from 'vitest'
import { initializeCommerce, purchaseStoreProduct, restoreStorePurchases } from './commerceService'

const values = new Map()

beforeEach(() => {
  values.clear()
  globalThis.localStorage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
})

describe('development commerce adapter', () => {
  it('publishes only completed products with display prices', async () => {
    const store = await initializeCommerce()
    expect(store.provider).toBe('mock')
    expect(store.products.map((product) => product.id)).toEqual([
      'cabin.workshop',
      'cabin.lakeside_cottage',
      'cabin.coastal_shack',
      'cabin.trophy_room',
      'supporter.campfire',
      'supporter.lakeside',
      'supporter.expedition',
      'boat_style.great_lake_classics',
      'boat_style.gulf_coast_colors',
    ])
    expect(store.products.every((product) => product.available && product.price)).toBe(true)
  })

  it('restores permanent ownership and maps it to cosmetic entitlements', async () => {
    await purchaseStoreProduct('cabin.workshop')
    const restored = await restoreStorePurchases()
    expect(restored.ownedProductIds).toEqual(['cabin.workshop'])
    expect(restored.entitlementIds).toEqual(['cabin:workshop-cabin'])
  })

  it('rejects hidden concept products', async () => {
    await expect(purchaseStoreProduct('bundle.cabin_collection')).rejects.toThrow(/not available/i)
  })

  it('gives every contribution level the same supporter recognition', async () => {
    const campfire = await purchaseStoreProduct('supporter.campfire')
    const expedition = await purchaseStoreProduct('supporter.expedition')
    expect(campfire.entitlementIds).toContain('supporter:community')
    expect(expedition.entitlementIds.filter((id) => id === 'supporter:community')).toHaveLength(1)
  })
})
