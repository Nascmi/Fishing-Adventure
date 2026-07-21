# Balance Notes

Use this file for measured playtest observations and decisions. Record the build, test conditions, relevant values, result, and next action.

## Metrics to Watch

- Time and catches required for each rod upgrade
- Average sale value per catch and per minute
- Catch frequency by rarity and equipped rod
- Bite success and escape rates
- Session length without external pressure
- Whether common fish remain satisfying
- How often players discover a new species
- Catch size distribution: 68% regular, 22% good, 8% great, 2% trophy

## Observation Template

```text
Date / build:
Test conditions:
Observation:
Variable changed:
Result:
Next action:
```

Change one variable at a time whenever practical. Do not rebalance from a single lucky or unlucky session.

## Recorded Decisions

### Quiet casts and specialty lures — Phase 4

- Quiet-cast baseline: 3%, 2.5%, 2%, and 1.5% across the four rod tiers. A quiet cast ends without a bite, does not increment escapes, and cannot occur immediately after another quiet cast.
- Probability handling: conditional rod rarity weights remain unchanged. Effective catch probability is reduced only by the rod's 97%–98.5% bite rate, after which time, area, and lure species weights choose the encounter.
- Specialty-lure effect: a permanent purchased lure multiplies its named target's relative encounter weight by 1.2. This is not a 20-percentage-point bonus or a guarantee.
- Legendary lure prices: Old Whiskers 10,000; Chinook Salmon 15,000; Great Lakes Muskellunge 20,000; Cobia 25,000; Yellowfin Tuna 35,000 coins.
- Next action: measure at least 200 casts across rod tiers for quiet-cast frequency and compare at least 500 matched/unmatched casts before changing the 1.2× affinity or prices.

### Affordable target tackle — Phase 4

- Catalog rule: two or three researched, permanent target-tackle purchases per location rather than one lure for every species.
- Price range: 100–250 coins, with broader early groups generally cheaper and focused trophy-predator tackle reaching 250.
- Affinity: every named target receives a 1.05× relative encounter weight. Only the equipped lure applies, so bonuses do not stack.
- Group examples: pond panfish; river whitefish and trout; Gulf bay shrimp feeders; offshore reef fish; offshore trolling predators.
- Next action: watch early shop comprehension and clutter, then compare target frequencies before expanding the catalog.

### Great Lake skiff and lure baseline — Phase 4

- Starting values: permanent skiff at 5,000 coins; authored Rocky Shore, Weed Edge, and Rocky Drop-off areas; three reusable lure families.
- Weighting rule: an area or lure strength applies a 1.5× species weight within its rarity, and a matching area-plus-lure applies 2.25×. Rod rarity odds are unchanged.
- Reasoning: add readable species targeting without guaranteeing high-rarity catches or invalidating the existing shore, rod, time, and reeling systems.
- Status: provisional until measured against Great Lake income, rod timing, and at least 25 casts per setup.
- Next action: watch whether 5,000 coins makes the skiff an interesting parallel goal rather than delaying the Graphite or Master Lake Rod too sharply.

### Informal household tournament — pre-Phase 4

- Test conditions: several family members played together for multiple hours in an informal at-home fishing tournament. Exact catch, income, upgrade, and session metrics were not recorded.
- Observation: players remained engaged, enjoyed comparing catches, and naturally tried to surpass one another's best fish. Progress and the shared fishing economy did not produce an obvious frustration or pacing complaint during the session.
- Variable changed: none.
- Result: positive qualitative evidence that catching, specimen comparison, and the current economy can sustain an extended group play session without additional competitive systems.
- Next action: keep current economy values unchanged entering Phase 4 and continue collecting measured charter earnings and upgrade timing when practical.

### Specimen weights — Phase 1 polish

- Test conditions: early Backyard Pond play, with crappie as the clearest example.
- Observation: uniformly generated weights made ordinary catches feel too close to unusually large real-world fish.
- Variable changed: split every species' weight range into regular, good, great, and trophy classes.
- Current baseline: 68% at 0–50% of maximum weight, 22% at 51–75%, 8% at 76–90%, and 2% at 91–100%.
- Next action: compare the observed distribution and sale income across longer sessions before changing it again.

### Reeling ergonomics — Phase 1 polish

- Test conditions: portrait mobile play during the transition from bite response to reeling.
- Observation: the active control shifted downward and required the player to reposition their thumb; placing feedback below the thumb also obscured it.
- Variable changed: anchored every fishing action to one control position and moved the tension display above the thumb as an overlay.
- Result: the player can cast, hook, and reel without changing grip.
- Next action: verify the placement on several phone heights and with system text scaling.

### Reeling tension risk — pre-Phase 4 tuning

- Test conditions: player feedback across the current one-button reeling interaction.
- Observation: holding the reel continuously could land many fish before tension reached the breaking point, especially with upgraded rods.
- Variable changed: lowered the safe-tension ceiling from 84% to 70%, added accumulating high-tension line strain weighted by fish difficulty, and increased progress loss while the line is slack.
- Intended result: brief entry into either danger zone remains recoverable, but continuous holding can break the line and prolonged slack can let the fish escape. Progress continues in the red zone at a reduced rate.
- Next action: playtest common and Trophy catches with every rod tier, then tune strain and recovery rates without widening the safe zone first.

### Pine River population — Phase 2 Pacific Northwest pass

- Population: Mountain Whitefish, Coastal Cutthroat Trout, Rainbow Trout, Steelhead, and Chinook Salmon.
- Purpose: give the cold forest river a recognizable Pacific Northwest identity and a complete rarity ladder from common through legendary.
- Habitat decision: removed Yellow Perch and Smallmouth Bass because they better suit lakes, reservoirs, or warmer large rivers; removed Northern Pike because it is an invasive species in the Pacific Northwest rather than part of the native river identity.
- Species note: Steelhead and Rainbow Trout are the same species with different life histories, but are separate catches because their size, appearance, journey, and angling experience are meaningfully distinct.
- Rarity handling: when a rod rolls a tier absent from Pine River, choose from the nearest lower available tier without leaving the river population.
- Next action: playtest the five-tier discovery pace and the sale values of Steelhead and Chinook before changing their rarity or weight ranges.

### Location-specific rods — Phase 2 baseline

- Progression: every location starts with its own free basic rod; Backyard Pond and Pine River currently share the 0, 250, 1,500, and 7,500 coin price curve.
- Shared progress: coins, inventory, collection records, and statistics carry between locations; rod ownership and equipped rods do not.
- Sequence rule: the preceding rod must be owned before the next upgrade can be purchased, even when the player can afford a later tier.
- Pine River family: Worn Fly Rod, Fiberglass Fly Rod, Graphite Fly Rod, and Master Fly Rod.
- Great Lake family: Worn Lake Rod, Fiberglass Lake Rod, Graphite Lake Rod, and Master Lake Rod.
- Gulf Coast family: Worn Inshore Rod, Fiberglass Inshore Rod, Graphite Inshore Rod, and Master Inshore Rod.
- Open Gulf family: Worn Offshore Rod, Fiberglass Offshore Rod, Graphite Offshore Rod, and Master Offshore Rod.
- Charter baseline: Open Gulf costs 4,000 coins for three complete days; compare its earnings and affordability against Gulf Coast before final release tuning.
- Next action: compare how quickly existing players and new players progress through Pine River before assigning location-specific prices.
