# Changelog

- Added optional offline Field Notes with a forgiving three-day backlog and three ordinary-fishing objectives, plus personal twelve-cast Fishing Derbies with transparent scoring, pause/resume behavior, consequence-free abandonment, and per-location personal bests. Neither system uses streaks, entry fees, online rankings, paid advantages, or exclusive rewards; save schema advanced to version 28.
- Made `View cabin` available from every fishing location as a non-travel collection interlude; leaving the cabin now returns to the exact active water instead of forcing the player back to Backyard Pond.
- Replaced the Workshop cabinet's colored text stand-ins with transparent, room-ready Brass Reel, Painted Bobber, and Weathered Tackle Tin artwork, and reduced rod-rack overlay scale for cleaner peg alignment.

- Settled the Coastal Shack boat halfway between its last two vertical positions and moved the five dockside decor hooks halfway back toward their original row for finer alignment with the table and painted pegs.
- Lifted the resized Coastal Shack boats onto the tabletop and shifted all five dockside decor hooks left by one peg interval to match the painted hardware.
- Reduced Coastal Shack model boats from the oversized first tabletop pass to a restrained 58% hook scale, preserving their raised placement while making them read as actual miniatures.
- Raised and rescaled all Coastal Shack model boats onto their intended tabletop in live and shared cabins, and switched legendary miniatures to contained rendering so Old Whiskers and other wide silhouettes are not cropped.
- Added a temporary, one-time 1,000,000-coin grant restricted to localhost browser saves for cabin and economy testing; deployed builds do not activate it.
- Realigned Grand Trophy Room fish within smaller centered hero and side-plaque safe areas, removed the mismatched Trophy oval, matched share-image scaling, and moved `Return to cabin` from the water artwork into the home-water setup header.
- Clarified included cabin-style compatibility in the visible preview: each group now says whether the active room supports it, and pieces without an authored slot are visibly muted instead of appearing universally usable.
- Moved the included cabin-style previews into the visible decor customizer, gave displays, frames, and finishes recognizable preview treatments, and strengthened timber finishes from 20% to 36% opacity in rooms and share images.
- Reduced Trophy-photograph fish artwork inside every cabin frame with a consistent 16% mat and matching contained scaling in generated cabin share images.
- Removed interchangeable cabin rugs, their Trading Post listings, authored floor hooks, included styles, rendering paths, and obsolete artwork; existing saves safely discard retired rug ownership and selections while preserving all unrelated progress.
- Added a branded public `/landing` page modeled on Bible Companion's separate marketing route, using real Fishing Adventure waters and cabin art, browser-play navigation, FAQ, fair-monetization promises, copyright, privacy, and contact links without initializing saves or commerce.
- Added a public and in-app Fishing Adventure privacy policy, named Nathan Miller and the privacy contact, documented local saves, user-directed sharing, Google Play purchase handling, retention/deletion, and created the matching Google Play Data Safety guide.
- Established the official Fishing Adventure heritage-outfitter identity, added `© 2026 Nathan Miller` attribution, and prepared Android launcher/adaptive/monochrome/splash resources plus Google Play icon and feature graphic masters.
- Added the Capacitor 8 Android shell for `com.nathanmiller.fishingadventure` and a compiling direct Google Play Billing 9.1.0 bridge with localized product queries, permanent purchase/restoration flow, pending and cancellation handling, acknowledgement, full ownership refresh, and app-resume reconciliation. Production remains gated on secure backend verification and refund/revocation handling.
- Made premium cabin descriptions literal: owned rods can fill Workshop rack pegs; an included lure board joins the reel, bobber, and tackle tin; the Coastal Shack gains included rope-and-float peg decor; and specialized compatibility tags prevent implausible cross-placement of rods, tackle, nautical pieces, and model boats.
- Added painting-compatible hooks to every cabin, including shared hearth and side-mount positions in the Starter Cabin and Angler's Lodge. Artwork and frame styles are now independently selectable and composited in live cabins and share images; save schema advanced to version 27.
- Added the $2.99-tentative Grand Trophy Room IAP cabin with twelve authored preserved-fish mounts, two painting/frame gallery hooks, responsive live and share-image layouts, permanent entitlement gating, and save schema version 26 migration.

## Current polish pass

- Activated a provider-independent Cabin Store for the three completed premium cabins with localized platform prices, clear permanent/cosmetic messaging, owned and pending states, restoration, safe failures, and a labeled development sandbox.
- Added three optional supporter contribution levels at tentative $0.99, $2.99, and $4.99 prices; every level grants the same modest Community Supporter recognition and no gameplay or status advantage.
- Made the storefront explicitly state that Fishing Adventure has no ads and that higher supporter amounts do not provide extra benefits.
- Migrated saves to version 24 with a bounded offline cache of verified cosmetic entitlements; older saves receive no automatic purchase grants, and premium cabins remain gated by platform-derived ownership.
- Added six commerce regressions covering storefront visibility, permanent restoration, hidden concept rejection, entitlement validation, and premium-cabin equipment rules.
- Added an Android IAP release checklist defining exact product IDs, native bridge behavior, Google Play testing, verification, acknowledgement, and remaining provider decisions.
- Replaced dormant premium-cabin capacity regions with 25 functional artwork-aligned customization hooks: 12 Workshop, 3 Lakeside Cottage, and 10 Coastal Shack anchors.
- Added three included display pieces so premium cabin customization works immediately without another purchase, plus automated hook-bound and compatibility coverage.
- Added three permanent earned-coin cabin models—a Freshwater Skiff, Bay Skiff, and offshore Charter Boat—with transparent handcrafted artwork and contained live/share rendering.
- Added two tentative $0.99 permanent hull-color packs with two finishes each, gated behind ownership of the corresponding coin-earned boat and carrying no gameplay benefit.
- Migrated saves to version 25 with validated per-boat cosmetic selections and safe fallback to each original included hull finish.
- Expanded the future-ideas parking lot with a meaningful catch-and-release system and researched marquee encounters for marlin, sharks, sturgeon, and similar exceptional fish.
- Preloaded alternate fishing viewpoints and added a brief scene crossfade so area changes feel intentional instead of flashing between large images; reduced-motion users receive an immediate swap.
- Added accessible selected-state announcements to area and lure controls, focus trapping and focus restoration to confirmation/settings dialogs, and background scroll locking while dialogs are open.
- Added a clear post-relocation status message, modern mobile viewport and safe-area spacing, and a short-landscape confirmation layout.
- Added a reusable tournament playtest worksheet plus an explicit device/offline smoke-test checklist without changing live balance values.

## Phase 4 — Authored water choices

- Added an explicit Open Gulf relocation confirmation that names the destination, makes clear that the Captain charges 250 coins for fuel, and offers `Stay here` or `Accept and relocate`.
- Added Open Gulf Blue Water, Working Rig, and Reef Edge charter positions with distinct authored stern viewpoints and habitat weighting.
- Added a transparent 250-coin fuel/time charge for every actual Open Gulf relocation, with same-position protection and exact insufficient-coin UI feedback.
- Migrated saves to version 23 with Blue Water as the safe Open Gulf default and expanded the full setup matrix across all charter positions.
- Documented the boat-suitability boundary: personal boats belong at Great Lake and Gulf Coast, not Pine River, the charter-based Open Gulf, or the current intimate Backyard Pond; sales and cosmetic slots may never drive location design.
- Added Gulf Coast Marsh Bank, Oyster Reef, and Tidal Channel areas with habitat-specific fish weighting and distinct authored viewpoints.
- Added the permanent 12,500-coin Bay Skiff, with a separate cosmetic-ready hull layer and ownership-gated coastal areas.
- Generalized boat purchasing, area access, presentation, and save validation so they are location-aware rather than Great Lake-specific.
- Migrated saves to version 22 with a safe Marsh Bank default and validation for both permanent boats.
- Marked reusable lure families complete after implementing all current-location catalogs, permanent ownership, presentation, migration, and full setup-matrix regression coverage.
- Fixed purchased target lures failing at the moment of hooking when paired with an authored fishing area, including the Pike Spoon at Great Lake's Weed Edge.
- Added matrix regression coverage for every valid location, lure, and fishing-area combination across all four day phases.
- Added a permanent Great Lake Skiff that opens the authored Weed Edge and Rocky Drop-off areas while Rocky Shore remains available to everyone.
- Added three reusable lure families with clear species strengths and no consumable bait inventory.
- Kept rod rarity odds authoritative; area and lure choices only redistribute species within the rolled rarity.
- Added version 20 save migration and validation for boat ownership and fishing setup.
- Added automated coverage for boat gating, reusable lure selection, setup weighting, and version 19 migration.
- Added a visible, cosmetic-ready Great Lake skiff to boat-access areas and distinct in-water markers for each selected lure family.
- Added distinct Rocky Shore, Weed Edge, and Rocky Drop-off viewpoints while keeping the skiff as an independent layer for future hull cosmetics.
- Mirrored the Weed Edge scenery and returned the skiff to the left, preserving open water around the strike indicator.
- Raised the Great Lake skiff above the overlapping fishing card, with extra desktop and mobile clearance so its full cosmetic-ready hull remains visible.
- Collapsed Great Lake setup choices behind a compact Change/Done summary on phones so players can see both the water and Cast Line during normal play.
- Added 3%–1.5% rod-based quiet casts, excluded them from escape statistics, and prevented consecutive quiet casts.
- Added permanent specialty lures for each location's legendary fish, priced from 10,000 to 35,000 coins with a transparent 20% relative target affinity.
- Added a location-aware Lure Shop, permanent ownership/equipment rules, version 21 migration, and expanded automated coverage.
- Added distinct in-water markers for all five legendary-target specialty lures.
- Added twelve researched, permanent target-tackle purchases priced from 100 to 250 coins, using curated species groups and a 5% relative affinity instead of one lure per fish.

Record player-facing changes under Unreleased, then archive them beneath a dated public version or clearly labeled internal milestone.

## Unreleased

- Rebuilt the Antique Fishing Creel, Hand-Carved Fish Decoy, and Hundred-Thousand Coin Club Plaque as complete transparent cutouts, and removed the generic framed backing from physical display objects.
- Unified decor fitting between all live cabin types and generated cabin share images so contained objects are no longer cropped.
- Moved the Master Catch seal to the upper-left of Fish Collection artwork so it no longer covers right-facing fish heads.
- Removed the blue-green inner panels from discovered Fish Collection artwork, added safer transparent spacing for varied silhouettes, and moved ten-catch recognition to the outer journal card.
- Added a comprehensive version 18-to-19 save regression fixture proving that equipment, active trips, keepsakes, mounted specimens, cabin ownership, and compatible decor survive together without touching player storage.
- Restored non-overlapping 12-pixel keepsakes on narrow phones and added quiet empty cabinet positions that fill as the player earns each of the 20 Angling Keepsakes, including in cabin share images.
- Simplified the cabin style picker to show only included, earned, or purchased cabins the player can currently use, removing locked cabin prices and unavailable choices from the cabin screen.
- Shifted the Angler's Lodge share-card keepsake grid five pixels right and restored a larger 14-pixel mobile medallion floor so cabinet rewards remain individually readable on the Galaxy S20 FE.
- Unified the live Angler's Lodge and generated share card around shared percentage-based anchor zones, enlarged fish and keepsakes on phones, and replaced rectangular share-card Trophy outlines with plaque-shaped rings.
- Corrected the Angler's Lodge keepsake cabinet from four-row sizing to five fitted rows, then shifted the overlay up and left so all 20 keepsakes remain centered and visible on Galaxy S20 FE-sized screens and cabin share images.
- Established a repository-wide requirement that every project change update the appropriate documentation during the same task.
- Realigned every live cabin customization hook to its painted frame or shelf, corrected decor fitting by hook type, and removed Starter Cabin overlays that conflicted with purchased-cabin displays.
- Removed the pale card background behind Angler's Lodge fish so preserved specimens sit naturally within their authored plaques.
- Consolidated rarity order, labels, value multipliers, and reeling difficulty into one validated catalog shared by fish selection, catch values, and gameplay tuning.
- Tightened the reeling safe zone and added recoverable high-tension line strain and stronger slack-line progress loss, making hold-and-release decisions meaningful for larger fish.
- Completed the Riverstone, Cedar Hideaway, and Captain's Retreat customization hooks with fixed authored placement and compatible-item filtering.
- Activated twelve permanent earned-coin decor purchases and added included and accomplishment-earned choices to compatible cabin hooks.
- Migrated saves to version 18 with validated per-cabin decor selections and added selected decor to cabin share images.
- Added individual Trading Post preview artwork for all twelve purchasable decor pieces.
- Gave decor previews a full square image stage and content-sized cards so merchandise and purchase controls are no longer cropped.

### Added

- Added a Vitest regression suite covering save migration and recovery, deterministic fishing and values, purchases, charters, cabin ownership, specimen preservation, keepsakes, and earned cabin cosmetics.

### Fixed

- Evaluated Angling Keepsakes immediately after charter booking, removing unreachable code that delayed the Gone Fishing unlock until a later game event.

## Phase 3 Complete — Five Waters & Cabin Life — 2026-07-20

### Fixed

- Moved cabin Share and Go Fishing actions into a full-width mobile row so they no longer collide with the floating settings button.
- Prevented wide fish illustrations from overflowing and being clipped inside mobile Fish Journal cards.

### Added

- Added an earned-coin Trading Post alongside the Rod Shop with three permanent cabin purchases and no gameplay power.
- Added the 25,000-coin Riverstone Cabin, 50,000-coin Cedar Hideaway, and 75,000-coin Captain's Retreat with original interiors and share-card support.
- Added authored customization-hook counts to every purchasable cabin listing, now two for Riverstone, three for Cedar Hideaway, and six for Captain's Retreat after retiring interchangeable floor-covering hooks.
- Restored twelve planned decor items to the Trading Post as clearly disabled previews until cabin placement controls are implemented.
- Migrated saves to version 17 with validated permanent Trading Post ownership and equipped-cabin recovery.
- Prepared a dormant eight-product cosmetic storefront catalog with stable IDs, tentative planning prices, permanent entitlements, and explicit no-gameplay-power policy.
- Added permanent earned location paintings for full Backyard Pond discovery and completed destination charters, plus gold Master Angler frames for Great-or-better catches of every local species.
- Added upgraded travel souvenirs for completed location journals, Trophy-catch photographs, legendary fish miniatures, full-equipment-family plaques, and nine included display, frame, and timber-finish options.
- Migrated saves to version 16 with bounded painting and Master Angler frame ownership, including retroactive unlocks from existing records.
- Added quiet collection-card recognition: a gold frame at ten catches and a Master Catch seal for Trophy-sized records.
- Added locally generated cabin share cards with native mobile sharing and an image-download fallback for the Starter Cabin and Angler's Lodge.
- Added unique symbolic designs and bronze, silver, enamel, gold, copper, and dark-legend materials for all 24 Angling Keepsakes in both the Collection and lodge cabinet.
- Prepared production artwork and dormant catalog definitions for the Workshop Cabin, Lakeside Cottage, and Coastal Shack without exposing unavailable purchases.
- Added the earned Angler's Lodge, permanently unlocked by catching legendary fish at four distinct locations.
- Added three preserved-specimen displays, an automatic Angling Keepsake cabinet, cabin switching, and purpose-built lodge artwork.
- Migrated saves to version 15 with bounded legendary-location progress, retroactive journal evidence, and validated lodge display choices.
- Added cabin specimen preservation for Great and Trophy catches, including remembered best candidates, a configurable 100-coin first mount, and free heavier upgrades.
- Migrated saves to version 14, preserving eligible catches still held in inventory while validating bounded specimen records.
- Added Passing Rain as a saved three-to-five-minute atmospheric event after roughly three to four in-game days of active fishing, with no gameplay effects or rewards.
- Added cool rain shading, fine rainfall, mist, water ripples, reduced-motion handling, optional procedural rain, and occasional distant thunder across current fishing locations.
- Migrated saves to version 13 with a bounded weather countdown and active-shower duration that pause outside the fishing screen.
- Added Open Gulf as the fifth playable location and the blue-water culmination of the current journey.
- Added Vermilion Snapper, Spanish Mackerel, Gray Triggerfish, Red Snapper, King Mackerel, Greater Amberjack, Mahi-Mahi, and Yellowfin Tuna.
- Added original Open Gulf environment art, eight naturalist fish illustrations, four offshore rods, and a deep-jig presentation.
- Added the hidden Gold on the Horizon keepsake for landing a morning Yellowfin Tuna.
- Migrated saves to version 11 so existing players receive the Worn Offshore Rod without losing progress.
- Added an optional Share button for Trophy catches that creates a polished local catch image and opens the native share sheet when supported.
- Added a private offline fallback that downloads the catch image when native file sharing is unavailable.
- Added Angling Keepsakes inside Collection with permanent milestones for first catches, exploration, complete journals, day phases, preferred-time fishing, full charters, exceptional specimens, and legendary encounters.
- Added five hidden story keepsakes tied to Old Whiskers, Chinook Salmon, Red Drum, Cobia, and Great Lakes Muskellunge.
- Migrated saves to version 10 with bounded achievement progress and retroactive unlocks wherever existing records provide evidence.
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
- Added weighted regular, good, great, and trophy specimen sizes.
- Added twelve species-specific hand-painted fish illustrations.
- Added four hand-painted rod illustrations with clear material progression.
- Added the finished Backyard Pond sunrise environment.

### Changed

- Removed the planned optional fishing-goals system because Angling Keepsakes and existing journal, specimen, trip, and personal-record systems already provide pressure-free long-term direction.
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
