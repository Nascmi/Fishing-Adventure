# Save System

## Current Save Data

- Coin balance
- Inventory catches
- Discovered-fish records
- Owned and equipped rods
- Fishing and economy statistics

Player settings should join the saved data when settings are introduced.

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

The current implementation safely returns to a valid new-game state when data cannot be read. Backup, migration, and player-facing recovery messaging are Phase 1 polish work.
