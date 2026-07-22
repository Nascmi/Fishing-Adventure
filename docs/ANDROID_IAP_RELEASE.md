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

## Implemented Android Shell

The native shell now uses Capacitor 8 with the permanent application ID `com.nathanmiller.fishingadventure`, Android compile/target SDK 36, minimum SDK 24, and Google Play Billing Library 9.1.0. The Java plugin lives at `android/app/src/main/java/com/nathanmiller/fishingadventure/FishingAdventurePurchasesPlugin.java` and is registered by `MainActivity`.

The bridge queries localized one-time-product details, restores currently owned non-consumables, launches Google Play purchase UI, distinguishes cancellation and pending states, grants only `PURCHASED` products, acknowledges completed purchases, returns the complete owned-product set after purchase, and refreshes ownership when the app resumes.

```bash
npm run android:sync
npm run android:open
npm run android:run
```

Android Studio's bundled JDK is supported. Machine-specific JDK and Android SDK paths are not committed.

## Native Bridge Contract

The web app expects a Capacitor billing adapter at `globalThis.FishingAdventurePurchases` with three asynchronous methods:

- `initialize({ productIds })` returns `{ products: [{ id, price }], ownedProductIds }`.
- `purchase({ productId })` returns `{ status, ownedProductIds }`.
- `restore({ productIds })` returns `{ status, ownedProductIds }`.

The adapter must query current purchases on startup and resume, use Google Play's localized display price, support pending transactions, and return only currently owned catalog IDs. It must not report a product as owned until the purchase state is `PURCHASED`, verification succeeds, content delivery is recorded, and the transaction is acknowledged/finished. Cancellation is not an error and must never grant an entitlement.

The JavaScript layer maps verified product IDs to cosmetic entitlement IDs, caches those entitlements in save version 27 for offline use, and replaces the cache whenever a successful authoritative sync occurs. A failed or unavailable store connection does not erase the last verified offline cache.

## Provider Decision

The initial implementation uses direct Google Play Billing to avoid another paid service and keep the ownership contract under project control:

- **Selected:** Direct Google Play Billing provides the fewest external services but requires maintaining the local Capacitor plugin and adding server verification before production.
- RevenueCat provides maintained Capacitor support and server-backed entitlement reconciliation but adds an external account, SDK, privacy disclosure, and configuration.
- A maintained third-party Capacitor purchases plugin can expose direct tokens, but its license, Capacitor compatibility, Billing Library version, verification story, and update cadence must be reviewed before adoption.

Do not add an unmaintained billing dependency merely to reach a test build. Google recommends secure-backend verification; a client-only release must at minimum validate purchase state, query ownership again on startup/resume, and acknowledge non-consumables within Google's required window.

### Production security gate

The compiled client bridge is appropriate for Google Play Internal testing, not final production approval. Before public release, send each purchase token and product ID to a secure backend, verify it with the Google Play Developer API, store tokens uniquely, grant the entitlement server-side, acknowledge reliably, and process Real-time Developer Notifications plus voided/refunded purchases. Client-side `PURCHASED` checks and acknowledgement are only the first implementation stage.

## Play Console and Test Track

1. The final Android application ID is `com.nathanmiller.fishingadventure`; do not change it after the first Play upload.
2. Create and activate the three one-time products above with descriptions, regional pricing, and required tax information.
3. Upload a signed Android App Bundle to Internal testing; Play Billing cannot be fully tested from an ordinary sideloaded development APK.
4. Add license testers and install the Play-delivered internal build with a tester account.
5. Test successful, cancelled, failed, already-owned, offline, interrupted, and delayed/pending purchases.
6. Test Restore purchases after clearing app data and after installing on another device with the same Google account.
7. Confirm cabin purchases unlock exactly one cabin and supporter purchases grant only the shared Community Supporter recognition; all purchases must persist offline and remain cosmetic.
8. Confirm the earned-coin Trading Post, fishing balance, and save recovery work without store availability.
9. Complete Play Data safety, Families/target-audience, content rating, privacy-policy, billing, and support disclosures before production review.

Official Android launcher, splash, Play icon, and feature-graphic assets are prepared under `android/app/src/main/res/` and `branding/play-store/`. See `BRANDING.md` for ownership, palette, regeneration, and usage rules.

The public privacy policy is built from `public/privacy.html` and appears at `/privacy.html` on the deployed site. The in-app Journey & Settings panel links to it. Use that final HTTPS URL in Play Console and complete Data Safety using `GOOGLE_PLAY_DATA_SAFETY.md`; re-audit both documents whenever data handling or SDKs change.

## Local Development

Vite development builds use a clearly labeled no-money sandbox by default. Set `VITE_IAP_MOCK=false` to exercise the unavailable-store path. Sandbox ownership is stored separately from the fishing save and can be restored through the Cabin Store.
