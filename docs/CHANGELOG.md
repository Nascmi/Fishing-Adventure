# Changelog

Record player-facing changes here under an unreleased section, then move them beneath a version and date when released.

## Unreleased

### Added

- Added relaxed, standard, and quick bite-timing preferences.
- Added visible warnings for corrupted saves and unavailable browser storage.
- Added a one-button reeling mini-game with line tension and catch progress.
- Added fish difficulty based on rarity and weight.
- Added line-control benefits to rod upgrades.
- Added optional offline sound cues and device haptics.
- Added animated coin changes and personal-best catch feedback.
- Added weighted regular, good, trophy, and amazing specimen sizes.
- Added twelve species-specific hand-painted Willow Pond fish illustrations.
- Added four hand-painted rod illustrations with clear material progression.
- Added the finished Willow Pond sunrise environment.

### Changed

- Made the relaxed bite window the accessible default.
- Replaced prototype text symbols with consistent lightweight interface icons.
- Replaced generic fish symbols across catches, inventory, and collection with species artwork.
- Replaced the prototype CSS rod shapes in the shop with production artwork.
- Replaced the prototype CSS landscape with optimized environment art while preserving live fishing overlays.
- Removed the online font request so essential presentation works offline.
- Improved dialog keyboard behavior, screen-reader status announcements, and touch targets.

### Fixed

- Anchored the reeling control to the hook button position and moved its HUD above the thumb.
- Removed two detached fin-like artifacts from the Channel Catfish artwork.
- Removed neighboring sprite fragments from the Crappie, Rainbow Trout, and Golden Trout artwork.
- Restored the complete tail and silhouette of Legendary Old Whiskers.
- Fixed damaged punctuation and symbols caused by source-file encoding.
- Improved fishing timer cleanup and duplicate-action prevention.
- Added versioned save migration and stricter validation for catches, collection records, and statistics.
- Migrated saves to version 3 for persistent sound and haptic preferences.
- Migrated saves to version 4 to classify existing inventory catches by size.

Use concise categories when useful: Added, Changed, Fixed, and Removed. Internal implementation details belong in commit or pull-request history rather than this file.
