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

## Trophy Preservation

Trophy and Amazing specimens can become permanent cabin displays. The game automatically retains the best eligible candidate for each species independently of inventory, including its weight, tier, location, day phase, and catch time. Players may later preserve a candidate for a configurable starting fee of 100 coins, avoiding an immediate pay-or-lose decision after a catch. A heavier eligible specimen of the same species may replace an existing mount for free. Amazing specimens use a distinct, more prestigious display treatment while remaining records of play rather than sources of power.

## Cabin Progression

Cabins are specialized authored spaces rather than linear room upgrades. The humble starter cabin supports one preserved fish and one travel souvenir. Other painted details remain fixed so the room looks cohesive and complete.

The Angler's Lodge is the central earned cabin unlock. Catching a legendary fish at four distinct locations opens its multiple fish displays and Angling Keepsake cabinet. The requirement represents mastery of most current waters while leaving the player one location of choice. A bounded set of legendary-catch location IDs preserves this progress regardless of inventory or sales.

Future Workshop, Lakeside Cottage, and Coastal Shack styles may specialize in equipment, domestic customization and location paintings, or nautical and boat décor. These cabins expand expression without replacing the Angler's Lodge as the earned culmination of the current journey. A Master Angler's Lodge remains only a future possibility if the game grows to roughly ten or more locations.

## Passing Rain

A saved weather schedule introduces a gentle three-to-five-minute shower after roughly three to four in-game days of active fishing. Passing Rain darkens and cools the existing location art, adds restrained rainfall, mist, and ripples, and can play optional procedural rain with occasional distant thunder. It has no forecast, reward, exclusive catch, achievement, or effect on any gameplay calculation. The countdown advances only on the fishing screen, pauses while away, ignores manual phase skipping, and retains a static reduced-motion treatment when animation is disabled.

## Angling Keepsakes

Angling Keepsakes share the Collection screen with the Fish Journal and commemorate meaningful stories from ordinary play. They are permanent, offline, non-expiring, and award no coins or gameplay power. Visible keepsakes clearly explain their requirements; a small number of hidden keepsakes preserve legendary discoveries. Unlock feedback is calm and never interrupts casting or reeling. Progress records remain bounded to unique locations, phases, species, and completed-trip destinations rather than accumulating endless counters.

Fishing Adventure does not use a separate tutorial quest or optional-goals system. Keepsakes provide broad lifetime milestones, while journal completion, preferred activity periods, personal records, Amazing specimens, legendary encounters, and destination trips create natural player-directed reasons to return. A dedicated goals layer would duplicate those systems, add interface pressure, and risk turning peaceful fishing into a checklist. If future playtesting reveals a genuine need for more direction, consider only a simple player-chosen journal pin with no reward, deadline, or generated task.

## Catch Sharing

Amazing specimens offer an optional Share action after the catch is complete. The game creates a polished catch card locally with the species artwork, weight, location, day phase, rarity, and personal-best status. Supported devices receive the image through the native share sheet; other browsers download the image for the player. Sharing never interrupts ordinary catches, uploads data, awards progress, or pressures the player to use social media.

## Audio Direction

Fishing Adventure does not use looping background music. Quiet is an intentional part of waiting beside the water. Backyard Pond offers optional procedural ambience built from very soft water movement and wind through reeds. It is disabled by default, avoids downloaded audio loops, plays only at the fishing location, and has a separate player control.

Short gameplay sound cues and haptics remain optional feedback rather than part of the ambient soundscape.

## Location Identity

Fish populations should reinforce each location's habitat and give exploration a meaningful purpose. Backyard Pond is an established farm pond larger than five acres in the rural Upper Midwest. Its balanced fishery centers on Bluegill, Pumpkinseed, Largemouth Bass, and stocked Channel Catfish. Black Crappie are plausible because the pond is large and established. Smallmouth Bass and Yellow Perch belong to Great Lake, while Common Carp remain collectible elsewhere; none appear at Backyard Pond. Backyard Pond does not contain trout. This population follows [Iowa DNR pond guidance](https://www.iowadnr.gov/things-do/fishing/ponds/stocking-management), which recommends Bluegill, Largemouth Bass, and Channel Catfish and allows Black Crappie in established ponds larger than five acres. It is also consistent with documented Minnesota pond populations such as [McColl Pond](https://www.dnr.state.mn.us/fishing/fin/kidsponds/mccoll.html), where state surveys record Bluegill, Black Crappie, Pumpkinseed, Largemouth Bass, and Channel Catfish together.

Pine River represents a cold Pacific Northwest river and features Mountain Whitefish, Coastal Cutthroat Trout, Rainbow Trout, Steelhead, and Chinook Salmon. Steelhead is presented as the migratory form of Rainbow Trout rather than a separate biological species.

Great Lake represents a fictional Upper Midwestern coastal bay connected to the Great Lakes system. Yellow Perch and Rock Bass occupy the common shoreline tier; Smallmouth Bass favor rocky structure; Walleye and Lake Trout represent iconic shallow-to-deep lake fisheries; Northern Pike and Great Lakes Muskellunge provide the large-predator progression. This combination is consistent with [Michigan DNR Great Lakes surveys](https://www.michigan.gov/dnr/about/newsroom/releases/2026/03/10/great-lakes-fisheries-survey-highlights) and its documented [Muskegon Lake fishery](https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan). Lake Sturgeon are excluded while every catch can be kept and sold because their conservation status and tightly controlled harvest deserve a future release-only interaction. Golden Trout remain reserved for a better-matched future alpine water. Existing journal records remain part of the player's collection when populations change.

Gulf Coast represents the Alabama–Mississippi inshore coast: salt marsh, oyster reef, protected bay, Mississippi Sound, and a nearshore channel. Atlantic Croaker and Sand Seatrout form the everyday bay catch; Sheepshead and Southern Flounder occupy hard structure and bottom habitat; Spotted Seatrout and Black Drum anchor the established fishery; Red Drum is the iconic trophy; and seasonal Cobia provides the legendary nearshore encounter. The population follows [Alabama coastal monitoring](https://www.outdooralabama.com/mrd-fisheries-section/gillnet-sampling), [Alabama inshore reef guidance](https://www.outdooralabama.com/artificial-reefs/inshore-reef-zones), and [Mississippi recreational fisheries records](https://dmr.ms.gov/recreational-catch-limits/). Tarpon and sharks are excluded while the game lacks release-only fishing.

Open Gulf moves beyond the coast to northern Gulf reefs, rigs, current lines, and blue water. Vermilion Snapper and Spanish Mackerel establish the everyday offshore catch; Gray Triggerfish, Red Snapper, and King Mackerel broaden the reef and open-water tiers; Greater Amberjack and Mahi-Mahi provide powerful epic encounters; and Yellowfin Tuna is the legendary culmination. The population is grounded in [Alabama's reef-fish program](https://outdooralabama.com/saltwater-fishing/saltwater-reef-fish-endorsement), [Mississippi's offshore landing program](https://dmr.ms.gov/rolp/), [Mississippi saltwater records](https://dmr.ms.gov/state-saltwater-records/conventional/), and [NOAA's Gulf King Mackerel fishery](https://www.fisheries.noaa.gov/species/king-mackerel). Sharks and billfish remain excluded until the game can support responsible release-only encounters.

Locations are immediately understandable. Backyard Pond is the player's permanent home water and is always free. Pine River, Great Lake, Gulf Coast, and Open Gulf are booked as three-day charter trips with a shared coin cost. Open Gulf is the blue-water culmination of the current journey, progressing from reef species to Yellowfin Tuna. Each day moves through morning, midday, evening, and night in four fifteen-minute play-time phases. Players may skip forward, paid trip time persists between sessions, and real-world interruptions never consume a trip while the game is closed. If a location lacks the rarity selected by a rod, selection falls back to a lower available rarity within that same location.

Fishing Trips is a dedicated main-navigation destination immediately after Collection. It owns location selection, new bookings, active-trip status, and returning home so the fishing scene remains focused on the water and current interaction.

Species have preferred activity periods that improve their relative chance within a selected rarity tier without ever making them unavailable. This makes time useful knowledge rather than a pressure mechanic. Discovered journal entries reveal each species' most active periods.

Rod progression is local to each fishing location while coins remain shared across the full journey. Every new water provides an appropriate starter rod and its own equipment family. Upgrades must be purchased in sequence, preventing a large saved coin balance from skipping the equipment path entirely while still rewarding earlier play. Backyard Pond uses conventional fishing rods and a bobber; Pine River uses fly rods and a drifting dry fly; Great Lake uses spinning rods and a retrieved lure; Gulf Coast uses saltwater inshore rods and a popping cork; Open Gulf uses heavy offshore rods and a deep jig. Location-specific presentation and language preserve the same one-touch core interaction.

## Growth

New locations, weather, sound, boats, lures, aquariums, cabins, photography, and legendary quests are possible extensions. They are not approved merely because they appear here; each must pass the feature approval test and enter the roadmap before implementation.
