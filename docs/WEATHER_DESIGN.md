# Weather Design

## Purpose

Weather makes familiar waters feel alive without creating strategy, pressure, or exclusive opportunities. A player may notice and enjoy a weather event, miss it entirely, or disable its sound without changing progression.

## Passing Rain

Passing Rain is the first approved weather event.

- It occurs after a randomized interval equal to roughly three to four in-game days of active fishing time.
- It lasts between three and five minutes and never exceeds five minutes.
- Its saved countdown advances only while the fishing screen is active. Closing the game or visiting menus pauses it.
- Skipping a day phase does not advance the weather countdown, so weather cannot become something players search for through time controls.
- After rain ends, the next interval is randomized and saved.
- There is no forecast, countdown, announcement, reward, exclusive fish, or achievement.

Passing Rain has no effect on fish selection, rarity, bite timing, reeling, specimen size, values, charter duration, or any other gameplay system.

## Presentation

Rain changes the mood of the existing location artwork rather than replacing it:

- a cooler and slightly darker atmospheric treatment;
- fine rain streaks;
- gentle water ripples;
- a small amount of distant mist; and
- gradual visual arrival and departure.

There are no lightning flashes. Reduced-motion mode keeps the darker atmosphere and restrained static rain texture while removing falling-rain and ripple animation.

The same system appears at all current fishing locations. Future art passes may tune mist, surface texture, and color separately for each water without changing the shared schedule or gameplay rules.

## Sound

Procedural rain and occasional distant thunder use the existing Nature Ambience preference. Rain remains quiet enough that bite, hook, catch, and escape cues stay distinct. Thunder is low, rolling, infrequent, and never paired with a flash or sudden gameplay event.

Weather remains visible when ambience is disabled. Sound and visual accessibility are independent.

## Save and Configuration

Save version 13 stores only the time until the next shower and the remaining duration of an active shower. Both values are validated and bounded. No unbounded weather history is retained.

Minimum and maximum interval and duration values live in game configuration so playtesting can tune frequency without changing weather logic.

## Future Boundary

Passing Rain establishes a reusable weather foundation, not a commitment to a simulation system. More weather types require deliberate approval. Weather must remain atmospheric and must never create fear of missing out, paid advantages, exclusive catches, or punishment for being away.
