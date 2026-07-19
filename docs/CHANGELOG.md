# Changelog

- Added Gulf Coast as the fourth playable location, grounded in Alabama and Mississippi salt marshes, bays, oyster reefs, and nearshore water.
- Added Atlantic Croaker, Sand Seatrout, Sheepshead, Southern Flounder, Spotted Seatrout, Black Drum, Red Drum, and Cobia as its fisheries-backed population.
- Added original Gulf Coast environment art, eight naturalist fish illustrations, four saltwater inshore rods, and a popping-cork presentation.
- Migrated saves to version 8 so existing players receive the Worn Inshore Rod without losing gear or catches.
- Made the location selector horizontally scrollable on narrow screens as the playable journey expands to four waters.
- Added Great Lake as the third playable location, replacing the planned Mountain Lake with a fictional Great Lakes-connected Upper Midwestern coastal bay.
- Added Yellow Perch, Rock Bass, Smallmouth Bass, Walleye, Lake Trout, Northern Pike, and Great Lakes Muskellunge as its fisheries-backed population.
- Added original Great Lake environment art, four new fish illustrations, a four-step spinning-rod family, and a retrieved-lure presentation.
- Migrated saves to version 7 so existing players receive Great Lake's starter rod without losing gear or catches.
- Established Backyard Pond as a rural Upper Midwestern farm pond and aligned its core population with official pond-management guidance: Bluegill, Pumpkinseed, Black Crappie, Largemouth Bass, and Channel Catfish.
- Removed Yellow Perch, Smallmouth Bass, and Common Carp from Backyard Pond while preserving them as collectible species for better-matched future waters.

Record player-facing changes here under an unreleased section, then move them beneath a version and date when released.

## Unreleased

### Added

- Added a living four-phase day cycle with morning, midday, evening, and night periods lasting fifteen minutes each.
- Added species activity periods that gently improve catch opportunities and appear in discovered journal entries.
- Added persistent three-day fishing charters for Pine River, Great Lake, and Gulf Coast while keeping Backyard Pond free.
- Added the dedicated Fishing Trips navigation page for booking, continuing, and ending destination charters.
- Added time-of-day atmosphere treatments and an improved deep-water Gulf Coast background.
- Renamed the home location from Willow Pond to Backyard Pond while preserving its save-compatible internal identifier.
- Added Pine River as the second playable fishing location with original environment artwork and a compact location selector.
- Added a location-specific Pine River population featuring Mountain Whitefish, Coastal Cutthroat Trout, Rainbow Trout, Steelhead, and Chinook Salmon.
- Added four naturalist fish illustrations and complete journal entries for Pine River's new species.
- Added a four-step Pine River fly-rod family with original transparent equipment artwork.
- Added a dry-fly strike indicator, subtle leader presentation, river-specific status language, and fly-fishing location icon.
- Added optional, procedural Backyard Pond ambience with very soft water and wind-through-reeds texture and no music.
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
- Added the finished Backyard Pond sunrise environment.

### Changed

- Reworked Pine River around native and iconic Pacific Northwest river fish; Yellow Perch, Smallmouth Bass, and invasive Northern Pike remain collectible elsewhere but no longer appear there.
- Made rod ownership, equipment, and shop inventory location-specific while keeping coins and all other progress shared.
- Required rod upgrades to be purchased in sequence within each location.
- Moved Rainbow Trout from Backyard Pond to the planned Pine River population and Golden Trout to Mountain Lake.
- Made collection and species journal labels location-neutral in preparation for future waters.
- Replaced question marks on undiscovered collection entries with dark silhouettes of their hidden species.
- Moved the Backyard Pond location identity into the top banner, removed the large scenery card, and warmed the primary Cast Line button.
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
- Migrated saves to version 6 for location-specific rod ownership while preserving existing Backyard Pond equipment.

Use concise categories when useful: Added, Changed, Fixed, and Removed. Internal implementation details belong in commit or pull-request history rather than this file.
