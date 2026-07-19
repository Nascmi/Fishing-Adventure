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
- Catch size distribution: 68% regular, 22% good, 8% trophy, 2% amazing

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

### Specimen weights — Phase 1 polish

- Test conditions: early Willow Pond play, with crappie as the clearest example.
- Observation: uniformly generated weights made ordinary catches feel too close to unusually large real-world fish.
- Variable changed: split every species' weight range into regular, good, trophy, and amazing classes.
- Current baseline: 68% at 0–50% of maximum weight, 22% at 51–75%, 8% at 76–90%, and 2% at 91–100%.
- Next action: compare the observed distribution and sale income across longer sessions before changing it again.

### Reeling ergonomics — Phase 1 polish

- Test conditions: portrait mobile play during the transition from bite response to reeling.
- Observation: the active control shifted downward and required the player to reposition their thumb; placing feedback below the thumb also obscured it.
- Variable changed: anchored every fishing action to one control position and moved the tension display above the thumb as an overlay.
- Result: the player can cast, hook, and reel without changing grip.
- Next action: verify the placement on several phone heights and with system text scaling.

### Pine River population — Phase 2 Pacific Northwest pass

- Population: Mountain Whitefish, Coastal Cutthroat Trout, Rainbow Trout, Steelhead, and Chinook Salmon.
- Purpose: give the cold forest river a recognizable Pacific Northwest identity and a complete rarity ladder from common through legendary.
- Habitat decision: removed Yellow Perch and Smallmouth Bass because they better suit lakes, reservoirs, or warmer large rivers; removed Northern Pike because it is an invasive species in the Pacific Northwest rather than part of the native river identity.
- Species note: Steelhead and Rainbow Trout are the same species with different life histories, but are separate catches because their size, appearance, journey, and angling experience are meaningfully distinct.
- Rarity handling: when a rod rolls a tier absent from Pine River, choose from the nearest lower available tier without leaving the river population.
- Next action: playtest the five-tier discovery pace and the sale values of Steelhead and Chinook before changing their rarity or weight ranges.

### Location-specific rods — Phase 2 baseline

- Progression: every location starts with its own free basic rod; Willow Pond and Pine River currently share the 0, 250, 1,500, and 7,500 coin price curve.
- Shared progress: coins, inventory, collection records, and statistics carry between locations; rod ownership and equipped rods do not.
- Sequence rule: the preceding rod must be owned before the next upgrade can be purchased, even when the player can afford a later tier.
- Pine River family: Worn Fly Rod, Fiberglass Fly Rod, Graphite Fly Rod, and Master Fly Rod.
- Great Lake family: Worn Lake Rod, Fiberglass Lake Rod, Graphite Lake Rod, and Master Lake Rod.
- Next action: compare how quickly existing players and new players progress through Pine River before assigning location-specific prices.
