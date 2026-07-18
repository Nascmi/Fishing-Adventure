# Save System

The current save schema is version 5.

## Current Save Data

- Coin balance
- Inventory catches
- Discovered-fish records
- Owned and equipped rods
- Fishing and economy statistics
- Bite timing, sound-cue, pond-ambience, and device-haptic preferences

Inventory catches include their generated specimen-size class. Older catches are classified from their saved weight during migration.

## Migration History

- Version 2 added the bite timing preference.
- Version 3 added sound and device-haptic preferences.
- Version 4 added the specimen-size class to saved catches and derives it from weight for older inventory.
- Version 5 added the separate pond-ambience preference, disabled by default.

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
