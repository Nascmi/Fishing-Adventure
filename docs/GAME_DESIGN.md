# Game Design

## Core Loop

1. Cast the line.
2. Watch and wait for a bite.
3. Respond to the bite.
4. Hold and release the reel to manage line tension.
5. Catch or lose the fish.
6. Keep or sell the catch.
7. Improve equipment.
8. Discover new fish and locations.
9. Repeat at the player's own pace.

Fishing remains the center of the experience. Supporting systems should enrich this loop rather than compete with it.

## Design Priorities

- Relaxation over intensity
- Discovery over grinding
- Progress over raw power
- Collection over competition
- Clarity over complexity

## Player Experience

Players should understand the basic loop within a few minutes. Common catches must remain useful, rare catches should feel memorable, and upgrades should create noticeable but measured improvement.

The bite response adds attention without turning fishing into a reflex test. Its timing should be generous, adjustable for accessibility, and paired with clear visual, audio, and haptic feedback where available.

The reeling interaction uses one control: hold to gain catch progress and release to reduce line tension. Common fish should be landed quickly, while larger and rarer fish require a little more care. Better rods improve line control as well as rarity odds. The interaction should remain forgiving, readable, and short enough that ordinary catches never become chores.

The fishing control stays in one fixed thumb position throughout casting, hooking, and reeling. During reeling, tension and progress appear above the control over the pond so the player's hand does not hide critical feedback.

## Specimen Size

Fish size is separate from species rarity. The generator selects a size class before choosing a weight within that class:

- Regular: up to 50% of the species maximum weight
- Good: 51–75%
- Trophy: 76–90%
- Amazing: 91–100%

The target distribution is 68% regular, 22% good, 8% trophy, and 2% amazing. Large specimens should feel notable even when the species itself is common.

## Fishing Journal

Discovered species open into full journal entries with large artwork, concise natural-history flavor, habitat, typical size, and the player's largest and total catches. The journal should make discovery feel personal and deepen appreciation for familiar fish without becoming an encyclopedia.

## Audio Direction

Fishing Adventure does not use looping background music. Quiet is an intentional part of waiting beside the water. Backyard Pond offers optional procedural ambience built from very soft water movement and wind through reeds. It is disabled by default, avoids downloaded audio loops, plays only at the fishing location, and has a separate player control.

Short gameplay sound cues and haptics remain optional feedback rather than part of the ambient soundscape.

## Location Identity

Fish populations should reinforce each location's habitat and give exploration a meaningful purpose. Backyard Pond is an established farm pond larger than five acres in the rural Upper Midwest. Its balanced fishery centers on Bluegill, Pumpkinseed, Largemouth Bass, and stocked Channel Catfish. Black Crappie are plausible because the pond is large and established. Smallmouth Bass and Yellow Perch belong to Great Lake, while Common Carp remain collectible elsewhere; none appear at Backyard Pond. Backyard Pond does not contain trout. This population follows [Iowa DNR pond guidance](https://www.iowadnr.gov/things-do/fishing/ponds/stocking-management), which recommends Bluegill, Largemouth Bass, and Channel Catfish and allows Black Crappie in established ponds larger than five acres. It is also consistent with documented Minnesota pond populations such as [McColl Pond](https://www.dnr.state.mn.us/fishing/fin/kidsponds/mccoll.html), where state surveys record Bluegill, Black Crappie, Pumpkinseed, Largemouth Bass, and Channel Catfish together.

Pine River represents a cold Pacific Northwest river and features Mountain Whitefish, Coastal Cutthroat Trout, Rainbow Trout, Steelhead, and Chinook Salmon. Steelhead is presented as the migratory form of Rainbow Trout rather than a separate biological species.

Great Lake represents a fictional Upper Midwestern coastal bay connected to the Great Lakes system. Yellow Perch and Rock Bass occupy the common shoreline tier; Smallmouth Bass favor rocky structure; Walleye and Lake Trout represent iconic shallow-to-deep lake fisheries; Northern Pike and Great Lakes Muskellunge provide the large-predator progression. This combination is consistent with [Michigan DNR Great Lakes surveys](https://www.michigan.gov/dnr/about/newsroom/releases/2026/03/10/great-lakes-fisheries-survey-highlights) and its documented [Muskegon Lake fishery](https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan). Lake Sturgeon are excluded while every catch can be kept and sold because their conservation status and tightly controlled harvest deserve a future release-only interaction. Golden Trout remain reserved for a better-matched future alpine water. Existing journal records remain part of the player's collection when populations change.

Gulf Coast represents the Alabama–Mississippi inshore coast: salt marsh, oyster reef, protected bay, Mississippi Sound, and a nearshore channel. Atlantic Croaker and Sand Seatrout form the everyday bay catch; Sheepshead and Southern Flounder occupy hard structure and bottom habitat; Spotted Seatrout and Black Drum anchor the established fishery; Red Drum is the iconic trophy; and seasonal Cobia provides the legendary nearshore encounter. The population follows [Alabama coastal monitoring](https://www.outdooralabama.com/mrd-fisheries-section/gillnet-sampling), [Alabama inshore reef guidance](https://www.outdooralabama.com/artificial-reefs/inshore-reef-zones), and [Mississippi recreational fisheries records](https://dmr.ms.gov/recreational-catch-limits/). Tarpon and sharks are excluded while the game lacks release-only fishing, and offshore snapper and grouper remain reserved for Deep Sea.

Locations are immediately understandable. Backyard Pond is the player's permanent home water and is always free. Pine River, Great Lake, and Gulf Coast are booked as three-day charter trips with a shared coin cost. Each day moves through morning, midday, evening, and night in four fifteen-minute play-time phases. Players may skip forward, paid trip time persists between sessions, and real-world interruptions never consume a trip while the game is closed. If a location lacks the rarity selected by a rod, selection falls back to a lower available rarity within that same location.

Fishing Trips is a dedicated main-navigation destination immediately after Collection. It owns location selection, new bookings, active-trip status, and returning home so the fishing scene remains focused on the water and current interaction.

Species have preferred activity periods that improve their relative chance within a selected rarity tier without ever making them unavailable. This makes time useful knowledge rather than a pressure mechanic. Discovered journal entries reveal each species' most active periods.

Rod progression is local to each fishing location while coins remain shared across the full journey. Every new water provides an appropriate starter rod and its own equipment family. Upgrades must be purchased in sequence, preventing a large saved coin balance from skipping the equipment path entirely while still rewarding earlier play. Backyard Pond uses conventional fishing rods and a bobber; Pine River uses fly rods and a drifting dry fly; Great Lake uses spinning rods and a retrieved lure; Gulf Coast uses saltwater inshore rods and a popping cork. Location-specific presentation and language preserve the same one-touch core interaction.

## Growth

New locations, weather, sound, boats, lures, aquariums, cabins, photography, and legendary quests are possible extensions. They are not approved merely because they appear here; each must pass the feature approval test and enter the roadmap before implementation.
