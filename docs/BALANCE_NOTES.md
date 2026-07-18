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

### Pine River population — Phase 2 baseline

- Population: Yellow Perch, Smallmouth Bass, Rainbow Trout, and Northern Pike.
- Purpose: create a compact, habitat-specific river population while making Rainbow Trout a meaningful location discovery.
- Rarity handling: when a rod rolls a tier absent from Pine River, choose from the nearest lower available tier without leaving the river population.
- Next action: compare catch variety and Rainbow Trout discovery timing against Willow Pond sessions before expanding the population.
