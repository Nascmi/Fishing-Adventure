# Cabin Design

## Purpose

Cabins are quiet, authored spaces where the player's fishing stories come home. They strengthen collection, progression, and emotional ownership without becoming a management game or interrupting the fishing loop.

Cabins specialize instead of forming a simple ladder where every new room is larger and objectively better. Each style is designed around a small set of displays that belong naturally in its artwork. This protects visual quality, keeps mobile controls simple, and gives every cabin a distinct identity.

The cabin style picker lists only cabins the player currently owns or has earned. Locked cabins, unlock progress, and purchase prices are not repeated there; earned requirements remain in progression surfaces, while coin-purchased cabins are discovered and purchased through the Trading Post. This keeps the cabin screen focused on switching and decorating available rooms.

## Design Principles

- A cabin must look complete before the player customizes it.
- Customization uses deliberate fixed slots rather than free furniture placement.
- A display is offered only when the cabin artwork was designed to support it.
- Fishing earns stories and accomplishments; cabins determine how those stories are presented.
- Gameplay-earned cabins preserve the journey's central progression. Optional purchases expand visual expression without selling fishing power.
- Cosmetic purchases use clear prices, permanent ownership, and no loot boxes, expiring offers, or fear of missing out.

## Starter Cabin

The included cabin is humble, lived-in, and intentionally focused. It represents the beginning of the player's journey and should never feel unfinished or deliberately deficient.

Its customizable displays are:

- one preserved Great or Trophy specimen above the fireplace; and
- one travel souvenir from a visited location.

The painted rod rack, furniture, floor coverings, lighting, and other room details remain part of the background. Interchangeable rods, keepsakes, and furniture are excluded because overlays cannot reliably match this cabin's painted perspective. They belong in future cabin styles with purpose-built display areas.

Current travel souvenirs are physical shelf objects rather than floating labels:

- Backyard Pond: a willow-painted skipping stone;
- Pine River: a weathered fly box;
- Great Lake: a miniature lighthouse;
- Gulf Coast: an oyster-shell display; and
- Open Gulf: a brass mariner's compass.

## Specimen Preservation

Specimen preservation turns exceptional catches into permanent stories and provides a gentle coin sink.

- Great specimens (76–90% of species maximum weight) and Trophy specimens (91–100%) become eligible preservation candidates.
- The game automatically remembers the best eligible candidate for each species, even if the inventory fish is later sold.
- A player may preserve an eligible candidate from the cabin for a starting fee of 100 coins. The price remains configurable and must be tuned through playtesting.
- Preserving is never an immediate catch-screen demand. A player can decide later without losing the candidate.
- If a heavier eligible specimen of the same species is caught, it becomes available as a free replacement for the mounted specimen.
- Trophy specimens receive a distinct, more prestigious presentation, such as a larger backing or pedestal and restrained gold craftsmanship.
- A larger Great specimen may improve an existing Great display; a Trophy may replace a Great specimen when heavier. Display treatment always reflects the mounted specimen's actual tier.

The best candidate record must remain bounded to one specimen per species and preserve:

- species and fish ID;
- weight and size tier;
- catch location;
- day phase;
- catch date or timestamp; and
- preservation status.

This record is separate from inventory so selling a fish never erases its story.

## Angler's Lodge

The Angler's Lodge is the second cabin and the ultimate earned cabin path for the current five-location game.

Unlock requirement:

> Catch a legendary fish at four distinct locations.

The requirement asks the player to experience most of the fishing journey while preserving freedom to choose four of the five current waters. The game must permanently track the bounded set of locations where a legendary fish has been caught; inventory and sales must not affect this progress.

The Angler's Lodge specializes in accomplishments:

- multiple mounted-fish displays;
- purpose-built Great and Trophy presentations; and
- an Angling Keepsake cabinet.

The keepsake cabinet presents its 20-medallion capacity as four columns by five fitted rows. Unearned positions appear as quiet empty outlines, then fill with the player's actual keepsakes so progress is visible directly in the room. Its authored overlay must remain fully inside the painted cabinet at portrait-phone sizes; medallions may not overlap and no row may overflow or be clipped. The three specimen mounts and cabinet use shared percentage-based anchor zones for both the live cabin and generated share card. Responsive styling may scale the contents within those zones, but the anchors remain tied to the artwork. The share-card cabinet applies a five-pixel optical correction to the right because its fixed export treatment centers differently from the live icon grid.

It is earned through play and must not be purchasable as a shortcut. This keeps the game's central story and most meaningful cabin unlock independent of cosmetic spending.

## Prepared Cabin Catalog

Three optional cabins have production-ready environment art, stable catalog IDs, and authored display contracts. They remain unavailable in the playable interface until a real platform storefront and purchase-restoration flow exist.

- **Workshop Cabin (`cabin.workshop`):** twelve functional hooks across five individual rod-rack pegs, one workbench frame, and six glass-front cabinet cells. Rod pegs offer only rods the player actually owns and render at a restrained rack-safe scale. Cabinet cells accept only tackle-class pieces, including room-ready transparent artwork for the included brass reel, painted bobber, tackle tin, and Classic Lure Board.
- **Lakeside Cottage (`cabin.lakeside_cottage`):** three functional hooks for two individual location-painting frames and one sideboard display.
- **Coastal Shack (`cabin.coastal_shack`):** ten functional hooks across three nautical upper-shelf displays, one nautical shadowbox, one model-boat-only tabletop, and five nautical-peg-only dock hooks. The included Dockside Rope & Float populates the pegs, while the earned-coin freshwater, bay, and charter models populate the table.

Specialized display hooks use compatibility tags rather than the broad `display` type alone. This prevents rods, tackle, model boats, shelf keepsakes, and hanging dock decor from appearing in physically implausible positions.
- **Grand Trophy Room (`cabin.trophy_room`):** twelve fixed specimen anchors—four large central hero mounts and eight supporting side-wall mounts—plus two large lower gallery hooks compatible with earned paintings, earned trophy photographs, included frames, and purchased frame treatments. Hero fish use 82% by 60% plaque-safe areas; supporting fish use 76% by 56%. Live and shared-room rendering use those same centered bounds, and Trophy status uses a restrained gold shadow rather than an artificial oval over the carved plaque. It displays only Great or Trophy specimens the player has already preserved, prevents duplicate selections, and adds no fishing power or catches.

Premium cabins use the same validated `customizationHooks` contract as earned-coin cabins; inactive multi-item capacity regions are not accepted. Brass Reel, Painted Bobber, and Weathered Tackle Tin are included display choices so every purchased cabin can be customized immediately without an additional purchase.

Three transparent handcrafted model boats are available as earned-coin display decor. The Coastal Shack's dedicated table hook raises their square transparent canvases by 62.5% of the rendered model height and presents them at a restrained 58% hook scale, with matching placement in generated share images. Long hulls and outriggers remain complete while the boats read as tabletop miniatures rather than full-size vessels. Its five dockside hanging hooks begin at 65.15% and advance in 3.7% intervals so each rope-and-float piece sits on the corresponding painted peg. Earned legendary-fish miniatures use contained 88% live-room scaling so tails, fins, and whiskers remain intact.

These identifiers are preparatory only. No price, ownership entitlement, purchase button, or store availability should be shown until the app has a supported storefront. Platform-specific product configuration may map to these stable IDs later.

## Earned-Coin Cabins

The Trading Post offers three permanent cabin styles purchased only with coins earned through fishing. They provide no fishing power, do not replace the earned Angler's Lodge, and remain available after purchase. Their prices form a readable late-game progression while leaving the planned 100,000 Coin Club plaque as the first six-figure prestige purchase.

- **Riverstone Cabin — 25,000 coins:** two authored hooks for the hearth frame and river shelf.
- **Cedar Hideaway — 50,000 coins:** three authored hooks for its three visible gallery frames.
- **Captain's Retreat — 75,000 coins:** six authored hooks for the central frame, four trophy shelves, and mahogany finish.

The shop discloses each cabin's hook count before purchase. Each hook has a fixed authored position and accepts only compatible items. Selections are saved independently per cabin, appear in cabin share images, and can always be returned to the room default.

Twelve permanent earned-coin decor purchases comprise three frames, three timber finishes, two small cabin objects, three model boats, and the 100,000 Coin Club plaque. Included displays, frames, and finishes and accomplishment-earned paintings, photographs, souvenirs, miniatures, and plaques appear beside purchased choices wherever a compatible hook exists.

Room-facing decoration artwork is distinct from Trading Post catalog photography. Physical shelf objects and plaques use transparent, fully visible cutouts with contained scaling and no generic picture-frame backing. The live cabin and generated share image follow the same presentation rules.

Location paintings are earned records of exploration or completion. Cabin styles may provide different frames and wall arrangements, but purchasing a cabin must not purchase the underlying exploration accomplishment.

Every cabin now provides at least one authored frame hook. Each frame hook stores artwork and frame treatment independently, so an earned location painting or Trophy photograph can be shown inside an included or Trading Post frame. The Starter Cabin shares its hearth display between a specimen and wall art; the Angler's Lodge shares its two side mounts with wall art. Selecting artwork temporarily covers the fish in that shared position without deleting either selection. The always-visible painting grid is collapsed into the Cabin Collection so displayed artwork belongs visually to the room.

Trophy photographs use contained artwork with a 16% internal mat in every cabin frame and in generated share images. This keeps the fish comfortably scaled inside large authored frames without shrinking landscape paintings.

Backyard Pond's painting is earned by discovering every local species. Each destination painting is earned by completing a full three-day charter there. Catching a Great or Trophy specimen of every species in a location permanently upgrades that location's painting to a gold **Master Angler frame**. Later population changes never revoke an earned painting or frame.

The broader Cabin Collection recognizes existing play without adding currencies or generated tasks:

- completing a location's full species journal earns its upgraded travel souvenir;
- every recorded Trophy specimen earns a local catch photograph;
- discovering a legendary species earns its handcrafted miniature;
- owning a location's complete rod family earns its equipment plaque; and
- three small displays, three display-frame treatments, and three timber finishes are included for compatible authored slots.

All earned artifacts remain permanent. Included style options provide variety without making any cabin look deliberately unfinished.

Included displays, frame treatments, and timber finishes are previewed directly above the authored cabin controls rather than hidden inside the broader collection. Their preview tiles use distinct object, framed-art, and wood-grain silhouettes, label groups that are available in the active room, and mute items for which that room has no compatible authored slot. The collection is globally included, but individual pieces are not universal: the Starter Cabin supports frames only; display objects require a display hook; and timber treatments require a finish hook. Timber-finish overlays render at 36% opacity in both the live cabin and generated share image so changing a finish produces a readable but still restrained room-wide effect.

A **Master Angler's Lodge** is a reserved future possibility if the game expands to roughly ten or more locations. Its name, requirements, and features are not approved until the expanded game has enough meaningful legendary encounters to support it.

## Why Specialization

An early attempt to place interchangeable rod artwork over the starter cabin's painted rack required repeated size, angle, and perspective adjustments and still looked detached from the scene. Furniture color overlays created the same problem because they could not follow painted contours.

That experiment established the governing decision: customization slots must be authored into each cabin's composition. Specialization improves visual cohesion, reduces fragile per-item positioning, creates stronger cabin identities, and provides a sustainable foundation for earned and premium cabin styles.
