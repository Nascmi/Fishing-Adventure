import { getEntitlementsForProducts, preparedStoreProducts, storeProductIds } from '../data/storeCatalog'

const MOCK_KEY = 'fishing-adventure-iap-mock-v1'
const nativeBridge = () => globalThis.FishingAdventurePurchases
const useMock = () => import.meta.env.DEV && import.meta.env.VITE_IAP_MOCK !== 'false'

const normalizeProducts = (products = []) => preparedStoreProducts.map((catalogProduct) => {
  const platformProduct = products.find((product) => product.id === catalogProduct.id)
  return {
    ...catalogProduct,
    available: Boolean(platformProduct),
    price: platformProduct?.price || null,
  }
})

const readMockOwnership = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(MOCK_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => storeProductIds.includes(id)) : []
  } catch {
    return []
  }
}

const mockProducts = () => preparedStoreProducts.map((product) => ({
  id: product.id,
  price: `$${product.suggestedUsd.toFixed(2)}`,
}))

export const initializeCommerce = async () => {
  if (useMock()) {
    const ownedProductIds = readMockOwnership()
    return { provider: 'mock', available: true, products: normalizeProducts(mockProducts()), ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
  }
  const bridge = nativeBridge()
  if (!bridge) return { provider: 'unavailable', available: false, products: normalizeProducts(), ownedProductIds: [], entitlementIds: [] }
  const result = await bridge.initialize({ productIds: storeProductIds })
  const ownedProductIds = (result.ownedProductIds || []).filter((id) => storeProductIds.includes(id))
  return { provider: 'google-play', available: true, products: normalizeProducts(result.products), ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
}

export const purchaseStoreProduct = async (productId) => {
  if (!storeProductIds.includes(productId)) throw new Error('This product is not available for purchase.')
  if (useMock()) {
    const ownedProductIds = [...new Set([...readMockOwnership(), productId])]
    localStorage.setItem(MOCK_KEY, JSON.stringify(ownedProductIds))
    return { status: 'purchased', ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
  }
  const bridge = nativeBridge()
  if (!bridge) throw new Error('Google Play purchases are available in the Android app.')
  const result = await bridge.purchase({ productId })
  const ownedProductIds = (result.ownedProductIds || []).filter((id) => storeProductIds.includes(id))
  return { ...result, ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
}

export const restoreStorePurchases = async () => {
  if (useMock()) {
    const ownedProductIds = readMockOwnership()
    return { status: 'restored', ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
  }
  const bridge = nativeBridge()
  if (!bridge) throw new Error('Purchase restoration is available in the Android app.')
  const result = await bridge.restore({ productIds: storeProductIds })
  const ownedProductIds = (result.ownedProductIds || []).filter((id) => storeProductIds.includes(id))
  return { ...result, ownedProductIds, entitlementIds: getEntitlementsForProducts(ownedProductIds) }
}
