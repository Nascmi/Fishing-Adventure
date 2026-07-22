# Save System

The current save schema is version 27.

## Current Save Data

- Coin balance
- Inventory catches
- Discovered-fish records
- Owned and equipped rods for each fishing location
- Fishing and economy statistics
- Bite timing, sound-cue, pond-ambience, and device-haptic preferences
- Home-water day-cycle progress and the active charter's destination, elapsed time, and remaining time
- Angling Keepsake unlock dates and bounded progress records for locations, day phases, preferred-time catches, and completed trips
- One bounded Great or Trophy candidate per species, including its current preserved-mount snapshot
- The bounded set of locations where a legendary fish has been caught, cabin style, and three Angler's Lodge display choices
- Bounded ownership sets for earned location paintings, Master Angler frames, upgraded souvenirs, Trophy photographs, legendary miniatures, and equipment plaques
- Validated permanent ownership of earned-coin Trading Post purchases, including the equipped coin-purchased cabin style and decor
- Independent, validated decor selections for every authored hook in each customizable cabin
- A validated offline cache of platform-confirmed cosmetic entitlement IDs; the platform storefront remains authoritative and refreshes this cache after successful synchronization
- Resetting fishing progress preserves verified purchase entitlements; it does not turn a permanent platform purchase into lost progress
- A validated equipped hull finish for each earnable personal boat; unknown, unentitled, cross-boat, or unearned-boat selections return to the included finish

Inventory catches include their generated specimen-size class. Older catches are classified from their saved weight during migration.

## Migration History

- Version 2 added the bite timing preference.
- Version 3 added sound and device-haptic preferences.
- Version 4 added the specimen-size class to saved catches and derives it from weight for older inventory.
- Version 5 added the separate pond-ambience preference, disabled by default.
- Version 6 moved global rod ownership into location-specific gear records while preserving every existing Backyard Pond rod and adding Pine River's starter fly rod.
- Version 7 added Great Lake's starter spinning rod without altering existing location gear.
- Version 8 added Gulf Coast's starter inshore rod without altering existing location gear.
- Version 9 added the living day cycle and persistent destination charters.
- Version 10 added permanent Angling Keepsakes and reconstructs provable milestones from existing statistics, catches, and journal records.
- Version 11 added Open Gulf's starter offshore rod without altering existing gear, catches, trips, or keepsakes.
- Version 12 added starter-cabin display choices.
- Version 13 added the bounded Passing Rain schedule.
- Version 14 added preserved specimens and reconstructs eligible candidates from Great and Trophy catches still in inventory.
- Version 15 added permanent Angler's Lodge unlock progress, reconstructs provable locations from legendary journal entries, and validates three specimen display slots.
- Version 16 added permanent painting, Master Angler frame, upgraded souvenir, Trophy photograph, legendary miniature, and equipment-plaque ownership with retroactive reconstruction from existing records.
- Version 17 added permanent Trading Post ownership and validates that a coin-purchased cabin can be equipped only while its catalog item is owned.
- Version 18 added per-cabin hook selections and validates decor ownership and hook compatibility.
- Versions 19 through 23 added authored-water setup, permanent boats and reusable tackle, Gulf Coast defaults, and Open Gulf charter positions.
- Version 24 added a bounded cache for verified cosmetic commerce entitlements without granting any purchase during migration.
- Version 25 added validated per-boat cosmetic selections and gives older saves each boat's included original finish.
- Version 26 adds twelve validated Grand Trophy Room display selections. Older saves receive twelve empty mounts, while invalid or unpreserved fish references are removed safely.
- Version 27 separates frame-hook artwork from frame treatments. Legacy painting or frame selections are classified into the correct field, allowing earned artwork and purchased frames to be displayed together.

Retired rug product IDs and rug-hook selections are no longer part of the valid catalog. Save validation removes those obsolete identifiers while preserving coins, cabin ownership, and every unrelated decor choice; this catalog cleanup does not require a schema-version increment.

## Rules

- Keep persistence behind a dedicated service.
- Validate types, ranges, identifiers, and required defaults before using saved data.
- Preserve backward compatibility whenever practical.
- Increment the save version and add a migration when the data shape changes.
- Never casually rename or remove stored fields.
- Prevent partial or corrupted data from breaking startup.
- Keep a recoverable copy of unreadable data when practical.
- If recovery requires a new game, explain what happened instead of silently discarding progress.
- Test loading an older save before releasing a schema change.

The current version 27 implementation validates and migrates readable saves. Phase 4 stores permanent location-aware boat ownership, all permanent purchased-tackle ownership, each location's equipped area or charter position and reusable lure, a bounded offline cache of platform-confirmed cosmetic entitlements, validated equipped hull finishes, the Grand Trophy Room's twelve display selections, and independently selected artwork and treatments for every frame hook. Versions 19 through 26 receive their safe defaults without changing coins or prior progress. Automated fixtures cover representative legacy saves, current water setup, commerce entitlement validation, boat-cosmetic gating, trophy-room displays, cabin artwork/frame composition, malformed, partial, and unreadable saves through the current schema. When stored data cannot be read, the game preserves a recoverable backup when practical, returns to a valid new-game state, and tells the player what happened. Real-device storage failures and Google Play restoration remain release-testing responsibilities.

The temporary localhost testing grant uses the separate `fishing-adventure-localhost-million-v1` marker. On `localhost` or `127.0.0.1`, the first load adds exactly 1,000,000 coins to the current validated save, immediately persists it, and records the marker so reloads cannot repeat the grant. It never activates on a deployed hostname and is not part of the version 27 save schema.
