# Phase 4 — On the Water

## Player Promise

Phase 4 adds meaningful choices about where and how to cast without adding steering, fuel, consumable bait, or extra actions during a catch. The calm cast, wait, hook, and reel loop remains unchanged.

## Boat Suitability Decision

Boats are authored world features, not a catalog template. A location receives a purchasable boat only when access to meaningfully different water is believable, visually readable, and useful without making the original fishing position obsolete. A cosmetic opportunity is never sufficient reason to add one.

- **Great Lake:** personal skiff approved; moving from rocky shore to weed edge and drop-off water is natural.
- **Gulf Coast:** personal Bay Skiff approved; shallow marsh, oyster reef, and tidal-channel access fit an inshore skiff.
- **Pine River:** no boat. The location's identity is fly fishing and wading; a boat conflicts with that presentation.
- **Open Gulf:** no purchasable personal boat. The player is already aboard a charter boat. Future area choices may represent the captain moving between Blue Water, a Working Rig, and a reef edge, but they are charter destinations rather than boat ownership.
- **Backyard Pond:** no boat for the current pond. Its intimate bank-fishing scale does not justify separate water areas, and a rowboat would crowd the scene. A rowboat may be reconsidered only for a future, genuinely larger pond or small-lake destination.

## First Playable Slice: Great Lake

Great Lake is the proving ground because its existing spinning presentation and population already support readable habitat choices.

- **Rocky Shore:** always available and remains a dependable home for perch, rock bass, and smallmouth bass.
- **Weed Edge:** reached by skiff and favors smallmouth bass, northern pike, and Great Lakes Muskellunge.
- **Rocky Drop-off:** reached by skiff and favors walleye and lake trout.
- **Great Lake Skiff:** a permanent 5,000-coin unlock. It selects authored water; it is not directly driven and has no fuel or maintenance.
- **Included tackle:** every location has at least one permanent general-purpose presentation; Great Lake includes the Casting Spoon, Flash Spinner, and Deep Jig.
- **Affordable target tackle:** each location offers a curated two- or three-item catalog priced from 100 to 250 coins. Each permanent purchase applies a 1.05× relative affinity to one believable species or fish group, such as pond panfish, river trout, Gulf bay fish, or offshore reef fish.
- **Specialty lures:** each location sells one expensive, permanent lure with a 20% relative affinity for its legendary fish. It never guarantees that fish and never expires.

## Second Playable Slice: Gulf Coast

- **Marsh Bank:** included with every Gulf Coast trip and favors Atlantic Croaker, Sand Seatrout, and Spotted Seatrout.
- **Oyster Reef:** reached by Bay Skiff and favors Sheepshead, Black Drum, and Red Drum around shell and pilings.
- **Tidal Channel:** reached by Bay Skiff and favors Southern Flounder, Red Drum, and cruising Cobia in deeper moving water.
- **Bay Skiff:** a permanent 12,500-coin unlock with no fuel, upkeep, steering, or performance advantage. Its separate deep-teal hull layer is reserved for future cosmetic finishes.

## Charter Positions: Open Gulf

- **Blue Water:** the free arrival/default position and a broad-water home for Spanish Mackerel, King Mackerel, Mahi-Mahi, and Yellowfin Tuna.
- **Working Rig:** a close structural position favoring Red Snapper and Greater Amberjack around deep platform pilings.
- **Reef Edge:** a submerged current seam favoring Vermilion Snapper, Gray Triggerfish, Red Snapper, and Greater Amberjack.
- **Relocation fee:** changing to any different position costs 250 coins each time, including returning to Blue Water. Remaining at the current position is free. This represents charter fuel and captain time, not personal boat ownership.

Each authored area uses a distinct viewpoint. Great Lake moves from granite shoreline to sheltered weeds and deep rock structure; Gulf Coast moves from a marsh bank to exposed oyster shell and a broader tidal channel. Each skiff is visibly composited into boat-access scenery rather than baked into it. Broad hull panels provide stable future cosmetic slots, and cosmetics must not change fishing performance. The cast marker also changes silhouette and color with the equipped lure so setup choices remain visible during the fishing loop.

The equipped rod establishes the dominant rarity-weight profile. Area strengths and lure affinities then modify individual species weights in the complete encounter pool. This means a specialty lure can modestly improve the real encounter chance for a location's sole legendary fish, but the 1.2× relative modifier is far smaller than the rod progression and never guarantees a catch. Matching an included lure to a Great Lake area gives the clearest broad habitat preference; mismatched setups remain valid and can still catch every local species.

Specialty lure prices are 10,000 coins for Old Whiskers Stinkbait, 15,000 for the King Salmon Egg Pattern, 20,000 for the Muskie Bucktail, 25,000 for the Cobia Eel, and 35,000 for the Yellowfin Cedar Plug. These are late-game targeting goals and require measured economy validation.

Affordable target tackle is deliberately curated rather than exhaustive. Panfish Bites cover Bluegill, Pumpkinseed, and Black Crappie; the Trout Nymph covers Whitefish, Cutthroat, and Rainbow Trout; a Shrimp Imitation covers five compatible Gulf bay species; Reef Bait Rig and Trolling Plug divide offshore structure fish from moving open-water predators. Focused bass, catfish, Steelhead, Smallmouth, Walleye, Pike, and shellfish-feeder tackle fills recognizable gaps without creating one shop item for every species.

Every cast also has a small chance to end quietly without a bite. The four rod tiers reduce this from 3% to 2.5%, 2%, and finally 1.5%. Quiet casts never occur twice consecutively, do not count as escaped fish, and leave the conditional fish rarity table unchanged; the effective probability of each catch outcome is its encounter probability multiplied by the rod's 97%–98.5% bite rate.

Setup choices are made only while ready to cast. Once the line is out, the existing one-touch interaction owns the screen.

On narrow screens, the setup panel is collapsed during normal play to a one-line area-and-lure summary. A deliberate Change action expands the full choices temporarily; Done restores the water-first casting view. Desktop retains the always-visible three-column choices.

## Balance Guardrails

- Shore fishing and the Casting Spoon must remain useful after buying the skiff.
- No area guarantees a rare, epic, or legendary fish.
- No specialty lure adds 20 percentage points; its target receives a 1.2× relative encounter weight.
- Quiet casts remain capped at 3%, cannot repeat back-to-back, and improve with rod quality.
- The skiff price is provisional until measured against actual Great Lake trip earnings and rod-upgrade timing.
- New areas should change the character of a session, not create a single mathematically mandatory setup.
- Never add a boat merely to create a purchase or cosmetic slot; location fantasy and meaningful water access come first.
- Open Gulf relocation must remain a modest deliberate cost, clearly shown before selection, and must never silently charge the currently selected position.
- Later locations adopt this system only after the Great Lake slice is comfortable on phones and understandable without a tutorial wall.

## Next Validation

- Reusable lure families are implementation-complete across all current locations; continue observing affinity and shop breadth during ordinary play rather than treating them as unfinished feature work.
- Confirm Gulf Coast area switching, Bay Skiff placement, and the expanded selector on the Samsung Galaxy S20 FE.
- Record time-to-Bay-Skiff against Gulf Coast trip earnings and inshore rod upgrades before changing the provisional 12,500-coin price.
- Observe whether the 250-coin Open Gulf relocation fee encourages deliberate positioning without discouraging experimentation during a 4,000-coin charter.
- Confirm the selector is comfortable on the Samsung Galaxy S20 FE and does not push the cast control below a natural thumb position.
- Compare species counts across at least 25 casts per area/lure combination.
- Record time-to-skiff alongside time-to-Graphite and Master Lake Rod.
- Verify a version 19 save loads at Rocky Shore with the Casting Spoon and no lost progress.
