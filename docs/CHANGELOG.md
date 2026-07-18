# Changelog

Record player-facing changes here under an unreleased section, then move them beneath a version and date when released.

## Unreleased

### Added

- Added Pine River as the second playable fishing location with original environment artwork and a compact location selector.
- Added a location-specific Pine River population featuring Yellow Perch, Smallmouth Bass, Rainbow Trout, and Northern Pike.
- Added optional, procedural Willow Pond ambience with very soft water and wind-through-reeds texture and no music.
- Added tappable collection cards and full species journal entries with large artwork, habitat, typical size, flavor text, and personal catch records.
- Added relaxed, standard, and quick bite-timing preferences.
- Added visible warnings for corrupted saves and unavailable browser storage.
- Added a one-button reeling mini-game with line tension and catch progress.
- Added fish difficulty based on rarity and weight.
- Added line-control benefits to rod upgrades.
- Added optional offline sound cues and device haptics.
- Added animated coin changes and personal-best catch feedback.
- Added weighted regular, good, trophy, and amazing specimen sizes.
- Added twelve species-specific hand-painted fish illustrations.
- Added four hand-painted rod illustrations with clear material progression.
- Added the finished Willow Pond sunrise environment.

### Changed

- Moved Rainbow Trout from Willow Pond to the planned Pine River population and Golden Trout to Mountain Lake.
- Made collection and species journal labels location-neutral in preparation for future waters.
- Replaced question marks on undiscovered collection entries with dark silhouettes of their hidden species.
- Moved the Willow Pond location identity into the top banner, removed the large scenery card, and warmed the primary Cast Line button.
- Made the relaxed bite window the accessible default.
- Replaced prototype text symbols with consistent lightweight interface icons.
- Replaced generic fish symbols across catches, inventory, and collection with species artwork.
- Replaced the prototype CSS rod shapes in the shop with production artwork.
- Replaced the prototype CSS landscape with optimized environment art while preserving live fishing overlays.
- Removed the online font request so essential presentation works offline.
- Improved dialog keyboard behavior, screen-reader status announcements, and touch targets.

### Fixed

- Kept rarity fallback selection inside the active location when that water has no fish in the rolled rarity tier.
- Reduced collection fish artwork scale on phones so fins and tails remain comfortably inside their image frames.
- Added explicit silhouette padding to collection and journal artwork so differently shaped fish cannot touch or clip against frame edges.

- Anchored the reeling control to the hook button position and moved its HUD above the thumb.
- Removed two detached fin-like artifacts from the Channel Catfish artwork.
- Removed neighboring sprite fragments from the Crappie, Rainbow Trout, and Golden Trout artwork.
- Restored the complete tail and silhouette of Legendary Old Whiskers.
- Fixed damaged punctuation and symbols caused by source-file encoding.
- Improved fishing timer cleanup and duplicate-action prevention.
- Added versioned save migration and stricter validation for catches, collection records, and statistics.
- Migrated saves to version 3 for persistent sound and haptic preferences.
- Migrated saves to version 4 to classify existing inventory catches by size.
- Migrated saves to version 5 for the separate pond-ambience preference, disabled by default.

Use concise categories when useful: Added, Changed, Fixed, and Removed. Internal implementation details belong in commit or pull-request history rather than this file.
