# Automated Testing

The Android brand check covers the launcher icon under square, circle, rounded-square, and themed monochrome masks. Portrait and landscape splash screens must retain safe margins, keep `© 2026 Nathan Miller` legible, and never delay startup.

The privacy check confirms `/privacy.html` is present in the production build, publicly reachable without authentication after deployment, and linked from Journey & Settings. Compare its claims against the final manifest, dependencies, billing implementation, and Data Safety answers before every store submission.

The landing-page check loads and refreshes `/landing` independently, verifies its feature/water/cabin imagery and all navigation links, confirms responsive and reduced-motion behavior, and ensures the landing route does not mount `GameProvider`, read or write the fishing save, or initialize Google Play commerce.

The Grand Trophy Room regression confirms its permanent entitlement gate, twelve unique mount selectors, two painting/frame hooks, persistence across reloads, and safe removal of invalid or unpreserved fish IDs during save validation.

Fishing Adventure uses Vitest for deterministic rule and persistence tests. The suite runs in a Node environment through Vite's normal module pipeline; browser emulation is not required for the current rules layer.

The current local browser test profile receives a one-time 1,000,000-coin grant on `localhost` or `127.0.0.1`. A separate local marker prevents repeat grants on reload, and deployed hosts never receive it. Remove the localhost grant and its marker key after the cabin/economy testing pass.

## Commands

```bash
npm test
npm run test:run
npm run build
```

`npm test` watches affected files during development. `npm run test:run` executes the complete suite once and is the required verification command before a handoff or commit that changes game behavior.

## Covered Systems

- Save migrations from representative legacy versions through the current schema
- A complete version 18 journey migrated in one fixture with coins, equipment, an active trip, keepsakes, a mounted specimen, cabin ownership, and compatible decor preserved together
- Version 20 tackle, version 21 Gulf-area, and version 22 Open Gulf-position migration through version 27, including both permanent boat entitlements, purchased-lure ownership validation, and rejection of unowned equipment
- Version 24 commerce migration, known-entitlement validation, premium-cabin gating, and no automatic purchase grants to older saves
- Development-store catalog visibility, permanent ownership restoration, entitlement mapping, and rejection of hidden concept products
- Equal Community Supporter entitlement mapping across every contribution level, with no tier-specific gameplay or status reward
- Premium-cabin hook counts, unique identifiers, supported decor types, artwork bounds, included display compatibility, and rejection of mismatched decor
- Boat-cosmetic entitlement plus earned-boat gating, cross-boat rejection, included-finish restoration, and version 27 save validation
- Every cabin exposes a painting-compatible frame hook; artwork and frame treatment can be selected independently and render together in both the live cabin and share image.
- Workshop rod pegs reject non-rod decor, Workshop cabinet cells reject non-tackle decor, the Coastal model table accepts only model boats, and Coastal dock pegs accept only hanging nautical pieces. Owned rods appear without a second purchase.
- Workshop's Brass Reel, Painted Bobber, and Weathered Tackle Tin use transparent object artwork rather than fallback color labels; all five equipped rods remain individually readable inside the wooden rack.
- Contained model-boat rendering and permanent 7,500/15,000/30,000-coin Trading Post ownership
- Quiet-cast probability caps, high-end rod reduction, and prevention of consecutive quiet casts
- Full playable setup matrix across every location, lure, and authored area, including valid positive weights and successful hook selection in every day phase
- Open Gulf relocation charges, same-position protection, insufficient-coin rejection, and safe Blue Water arrival
- Manual keyboard and touch verification of the Open Gulf relocation confirmation, including initial safe focus, Escape/backdrop cancellation, and acceptance-only coin spending
- Missing, malformed, and unreadable save recovery
- Location-bounded rarity fallback and preferred day phases
- Specimen-size boundaries, deterministic catch generation, and catch values
- Rod prerequisites, equipment ownership, and exact coin deductions
- Charter booking, completion, paintings, and keepsake evaluation
- Trading Post ownership, duplicate rejection, cabin eligibility, and compatible per-cabin decor selections
- Retired rug ownership and selections are removed during validation without changing cabin ownership or unrelated progress
- The localhost-only million-coin grant is additive, persists immediately, and cannot repeat after its separate marker is written
- Specimen preservation costs and free heavier upgrades
- Angler's Lodge specimen and keepsake anchor-zone capacity and artwork bounds
- Keepsakes, location paintings, Master Angler frames, photographs, miniatures, and equipment plaques

## Test Design Rules

- Test game rules as pure state transitions whenever practical.
- Use literal legacy-save fixtures rather than current defaults when verifying migrations.
- Inject deterministic random functions and timestamps instead of relying on lucky rolls or the system clock.
- Assert rejected actions return the original state without partial deductions or ownership changes.
- Add a regression test with every bug fix that changes a testable rule.
- Keep production builds as a separate required check; passing unit tests does not prove the application bundles successfully.

Browser-level navigation, touch interaction, visual regression, and device storage behavior remain manual release checks until a dedicated browser suite is approved.

Google Play Billing requires an Internal testing build installed through Play. Follow `ANDROID_IAP_RELEASE.md` for success, cancellation, failure, pending-payment, interruption, offline-cache, reinstall, cross-device restoration, and already-owned cases.

## Device and Offline Smoke Test

The Android shell must pass `:app:compileDebugJavaWithJavac` or an Android Studio build after every native billing change. Google Play Billing must be exercised from a Play-delivered Internal testing build; an ordinary sideload cannot validate the full product and purchase lifecycle. Test localized products, successful purchase, cancellation, pending completion, already-owned restoration, app-resume refresh, reinstall restoration, acknowledgement retry, offline cached access, and ownership removal after a refund/revocation backend is added.

Before a release, load the game once while connected, make one catch, then reload and confirm the save survives. Disable the connection without clearing site data and confirm the already-loaded session can continue using bundled art and rules; reconnect before expecting a fresh Firebase-hosted page load because the project does not currently install a service worker. Also verify portrait and short-landscape layouts, bottom safe-area clearance, scene transitions, and both confirmation/settings dialogs.

Use `PLAYTEST_WORKSHEET.md` for tournament feedback. It intentionally separates memorable observations from probability claims so a small lucky or unlucky sample does not trigger premature balance changes.
## Cabin Decoration Visual Checks

- Equip the Antique Fishing Creel, Hand-Carved Fish Decoy, model boats, and Coin Club plaque in every compatible display hook. Confirm the complete object remains visible and no generic frame or colored backing appears behind artwork.
- Equip each model boat on the Coastal Shack table and confirm the full miniature's keel rests directly on the tabletop rather than overlapping the apron or floating above it. Fill all five dock pegs and confirm each hanging piece begins at its corresponding painted hook. Equip every legendary miniature in upper-shelf hooks and confirm no tail, fin, head, or whisker is cropped, with special attention to Old Whiskers.
- In every cabin customizer, confirm the included display/frame/finish preview groups say `Available here` only when the active room has a compatible authored hook; unsupported items remain visible but muted.
- Equip all three included and all three purchased frame treatments with both a landscape painting and a Trophy photograph. Confirm photographs retain a 16% mat while paintings continue to fill their intended frame opening.
- Equip all three included and all three purchased timber finishes in Captain's Retreat. Confirm each produces a readable 36%-opacity room treatment without hiding the underlying painted detail.
- Fill all twelve Grand Trophy Room plaques. Confirm the four hero fish remain centered within 82% by 60% safe areas, the eight supporting fish remain centered within 76% by 56%, and Trophy fish receive only the restrained gold shadow—not a drawn oval.
- At Backyard Pond and every charter location, confirm `View cabin` appears in the setup header and never overlays the water artwork. Verify it remains usable beside `Change` on a portrait phone. From each location, open the cabin and confirm the return button names that water, restores it with the same selected area/lure/boat, does not end the trip, and does not consume trip time while the cabin is open.
- Generate cabin share images for physical objects, framed Trophy photographs, timber finishes, and a full Trophy Room; confirm each matches the live scene's scaling and presentation.
