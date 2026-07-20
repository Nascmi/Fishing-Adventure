# Roadmap

The roadmap records approved direction, not a promise of fixed dates. Polish and playtesting may change the order.

## Phase 1 — Playable Foundation

- Fishing loop at Backyard Pond
- Inventory and fish selling
- Rod shop and equipment progression
- Fish collection
- Player statistics
- Local save system
- Mobile-first responsive interface

## Phase 1 Polish

### Completed

- Added relaxed, standard, and quick bite timing options.
- Added the short, one-touch tension reeling interaction and rod line-control progression.
- Added optional synthesized sound cues and device haptics.
- Added specimen-size tiers and a distribution weighted toward ordinary catches.
- Replaced placeholder fish, rod, and Backyard Pond visuals with cohesive production artwork.
- Bundled essential fonts and artwork for reliable offline play.
- Added versioned save migrations, validation, corrupt-save backup, and player-facing recovery messaging.
- Stabilized the mobile fishing control so casting, hooking, and reeling keep the same thumb position.
- Added full species journal entries with natural-history flavor, habitat, typical size, and personal catch records.
- Added optional, location-specific Backyard Pond nature ambience without background music or downloaded audio loops.

### Ongoing

These quality practices continue throughout development rather than ending with Phase 1:

- Continue outside playtesting of bite timing, reeling difficulty, catch rates, values, and rod progression.
- Tune from measured sessions recorded in `BALANCE_NOTES.md`.
- Complete the accessibility pass, including reduced-motion, screen-reader, contrast, and system text-size checks.
- Test save migration and recovery with representative older and damaged saves before release.
- Complete device and browser testing across common portrait phone sizes.

## Phase 2 — A Wider World

### Completed

- Added Pine River as the second playable fishing location.
- Added location switching and location-specific fish populations.
- Introduced Rainbow Trout at Pine River.
- Refined Pine River into a Pacific Northwest fishery with Mountain Whitefish, Coastal Cutthroat Trout, Steelhead, and Chinook Salmon.
- Added location-specific rod progression, Pine River fly rods, and a dry-fly fishing presentation while keeping coins shared.
- Replaced the planned Mountain Lake with Great Lake, an Upper Midwestern Great Lakes fishery.
- Added Great Lake scenery, spinning-rod progression, retrieved-lure presentation, and a location-specific population culminating in Great Lakes Muskellunge.
- Added Gulf Coast as the fourth playable location, grounded in Alabama and Mississippi inshore fisheries.
- Added salt-marsh scenery, popping-cork presentation, inshore rod progression, and eight Gulf species culminating in Cobia.
- Added Open Gulf as the fifth playable location and the culmination of the current fishing journey.
- Added blue-water scenery, offshore jig presentation, offshore rod progression, and eight Gulf species culminating in Yellowfin Tuna.
- Added a four-phase living day cycle with gentle species activity shifts.
- Established Backyard Pond as the free home water and three-day paid charters for destination fishing.
- Added Fishing Trips as a dedicated navigation destination for booking and continuing charters.
- Added permanent Angling Keepsakes for discovery, exploration, collection, and memorable catches without currency or power rewards.
- Added optional native image sharing for Amazing catches with an offline download fallback.

## Phase 3 — Deeper Atmosphere & Personalization

Phase 3 deepens atmosphere and gives players a peaceful sense of ownership through optional self-expression. These systems should create lasting reasons to return and provide a foundation for clearly priced cosmetic purchases, while earned accomplishments remain meaningful and spending never affects fishing power or progression.

### Completed

- Added the humble starter cabin foundation with one featured-fish display and one location-specific travel souvenir.
- Added Passing Rain after roughly three to four in-game days of active fishing, lasting three to five minutes with no gameplay effects, forecasts, or rewards.
- Added a cool rain treatment, fine rainfall, mist, water ripples, reduced-motion handling, optional procedural rain, and occasional distant thunder.
- Migrated saves to version 13 with a bounded, persistent weather schedule that pauses outside active fishing.
- Added trophy preservation that remembers the best eligible specimen per species, charges 100 coins for a first mount, and offers heavier upgrades for free.
- Added the gameplay-earned Angler's Lodge with three preserved-fish displays and an automatic Angling Keepsake cabinet.
- Prepared authored artwork, fixed-slot contracts, and deferred storefront IDs for the Workshop Cabin, Lakeside Cottage, and Coastal Shack.
- Added five earned location paintings and permanent Master Angler frames for Trophy-or-better mastery of every species in a location.
- Added upgraded souvenirs, Amazing photographs, legendary miniatures, equipment plaques, and included authored-slot palettes.
- Prepared a dormant non-consumable store catalog with stable product IDs, tentative prices, restoration requirements, and no live storefront integration.
- Added an earned-coin Trading Post with three complete permanent cabins as a late-game economy sink, while presenting twelve decor concepts as disabled previews until their display slots are implemented.

### Phase Status

Phase 3 is complete. Future real-money commerce work is platform integration rather than additional Phase 3 game design: configure platform products, implement authoritative ownership and restoration, connect prepared purchases to compatible slots, and complete platform review. The earned-coin Trading Post is live; its prices and catalog breadth should continue to be tuned from playtest income.

## Phase 4 — On the Water

Phase 4 expands the fishing itself through deliberate choices about where and how to cast. New systems must preserve the one-touch core interaction, use clear tradeoffs instead of hidden optimization, and make existing locations worth seeing from a fresh perspective.

### Planned

- Boats that open authored fishing areas within suitable existing locations rather than adding a driving or fuel-management game
- Reusable lure families with readable strengths tied to water, structure, or fish behavior; no consumable-bait grind or crowded inventory
- Location-specific boat and lure presentation that retains the calm cast, wait, hook, and reel rhythm
- A progression model that adds new opportunities without making shore fishing, starter tackle, or familiar species obsolete

## Version 1.0

A polished, accessible, offline-friendly fishing game ready for public Android and iOS release.

Unapproved concepts remain in `FUTURE_IDEAS.md` until deliberately promoted here.
