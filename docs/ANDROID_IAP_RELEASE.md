# Android In-App Purchase Release Checklist

The app now contains a provider-independent Cabin Store, a development sandbox, permanent cosmetic entitlement rules, purchase restoration, and safe unavailable/error states. Google Play remains the authority for production ownership.

## Initial Google Play Products

Create these as one-time, non-consumable products in Play Console. IDs must match exactly; the app displays the localized price returned by Google Play rather than a hard-coded dollar amount.

| Product ID | Product | Planning price |
| --- | --- | ---: |
| `cabin.workshop` | Workshop Cabin | $1.99 USD |
| `cabin.lakeside_cottage` | Lakeside Cottage | $1.99 USD |
| `cabin.coastal_shack` | Coastal Shack | $1.99 USD |
| `cabin.trophy_room` | Grand Trophy Room | $2.99 USD |
| `supporter.campfire` | Campfire Supporter | $0.99 USD |
| `supporter.lakeside` | Lakeside Supporter | $2.99 USD |
| `supporter.expedition` | Expedition Supporter | $4.99 USD |
| `boat_style.great_lake_classics` | Great Lake Hull Colors | $0.99 USD |
| `boat_style.gulf_coast_colors` | Gulf Coast Hull Colors | $0.99 USD |

All three supporter products grant the same `supporter:community` recognition. The higher contribution levels grant no additional status, content, currency, or gameplay benefit. Do not create or expose the dormant decor packs or Cabin Collection bundle until their complete authored content and bundle-ownership rules are approved.

Boat-style products grant appearance choices only. Great Lake Hull Colors adds Midnight Blue and Heritage Red; Gulf Coast Hull Colors adds Sunset Coral and Deep Ocean. The player must first earn the corresponding boat with fishing coins before the pack can be purchased or equipped, and the original included hull finish always remains available.

## Native Bridge Contract

The web app expects a Capacitor billing adapter at `globalThis.FishingAdventurePurchases` with three asynchronous methods:

- `initialize({ productIds })` returns `{ products: [{ id, price }], ownedProductIds }`.
- `purchase({ productId })` returns `{ status, ownedProductIds }`.
- `restore({ productIds })` returns `{ status, ownedProductIds }`.

The adapter must query current purchases on startup and resume, use Google Play's localized display price, support pending transactions, and return only currently owned catalog IDs. It must not report a product as owned until the purchase state is `PURCHASED`, verification succeeds, content delivery is recorded, and the transaction is acknowledged/finished. Cancellation is not an error and must never grant an entitlement.

The JavaScript layer maps verified product IDs to cosmetic entitlement IDs, caches those entitlements in save version 27 for offline use, and replaces the cache whenever a successful authoritative sync occurs. A failed or unavailable store connection does not erase the last verified offline cache.

## Provider Decision

Choose the native provider when creating the Capacitor Android shell:

- Direct Google Play Billing provides the fewest external services but requires a maintained custom Capacitor plugin and preferably server verification.
- RevenueCat provides maintained Capacitor support and server-backed entitlement reconciliation but adds an external account, SDK, privacy disclosure, and configuration.
- A maintained third-party Capacitor purchases plugin can expose direct tokens, but its license, Capacitor compatibility, Billing Library version, verification story, and update cadence must be reviewed before adoption.

Do not add an unmaintained billing dependency merely to reach a test build. Google recommends secure-backend verification; a client-only release must at minimum validate purchase state, query ownership again on startup/resume, and acknowledge non-consumables within Google's required window.

## Play Console and Test Track

1. Establish the final Android application ID before creating products.
2. Create and activate the three one-time products above with descriptions, regional pricing, and required tax information.
3. Upload a signed Android App Bundle to Internal testing; Play Billing cannot be fully tested from an ordinary sideloaded development APK.
4. Add license testers and install the Play-delivered internal build with a tester account.
5. Test successful, cancelled, failed, already-owned, offline, interrupted, and delayed/pending purchases.
6. Test Restore purchases after clearing app data and after installing on another device with the same Google account.
7. Confirm cabin purchases unlock exactly one cabin and supporter purchases grant only the shared Community Supporter recognition; all purchases must persist offline and remain cosmetic.
8. Confirm the earned-coin Trading Post, fishing balance, and save recovery work without store availability.
9. Complete Play Data safety, Families/target-audience, content rating, privacy-policy, billing, and support disclosures before production review.

## Local Development

Vite development builds use a clearly labeled no-money sandbox by default. Set `VITE_IAP_MOCK=false` to exercise the unavailable-store path. Sandbox ownership is stored separately from the fishing save and can be restored through the Cabin Store.
