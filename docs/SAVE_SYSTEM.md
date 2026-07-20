# Save System

The current save schema is version 16.

## Current Save Data

- Coin balance
- Inventory catches
- Discovered-fish records
- Owned and equipped rods for each fishing location
- Fishing and economy statistics
- Bite timing, sound-cue, pond-ambience, and device-haptic preferences
- Home-water day-cycle progress and the active charter's destination, elapsed time, and remaining time
- Angling Keepsake unlock dates and bounded progress records for locations, day phases, preferred-time catches, and completed trips
- One bounded Trophy or Amazing candidate per species, including its current preserved-mount snapshot
- The bounded set of locations where a legendary fish has been caught, cabin style, and three Angler's Lodge display choices
- Bounded ownership sets for earned location paintings, Master Angler frames, upgraded souvenirs, Amazing photographs, legendary miniatures, and equipment plaques

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
- Version 14 added preserved specimens and reconstructs eligible candidates from Trophy and Amazing catches still in inventory.
- Version 15 added permanent Angler's Lodge unlock progress, reconstructs provable locations from legendary journal entries, and validates three specimen display slots.
- Version 16 added permanent painting, Master Angler frame, upgraded souvenir, Amazing photograph, legendary miniature, and equipment-plaque ownership with retroactive reconstruction from existing records.

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

The current implementation validates and migrates readable saves. When stored data cannot be read, it preserves a recoverable backup when practical, returns to a valid new-game state, and tells the player what happened. Representative older and damaged saves still require release testing.
