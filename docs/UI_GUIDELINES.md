# UI Guidelines

## Phase 4 Interaction Polish

- Preload alternate authored viewpoints and crossfade briefly between them; honor reduced-motion preferences with an immediate scene change.
- Selected fishing areas and lures must expose their state programmatically, not through color alone.
- Modal dialogs trap keyboard focus, close with Escape or an explicit cancel action, lock background scrolling, and restore focus to the control that opened them.
- Confirmation layouts must remain usable in narrow portrait and short landscape viewports, with bottom navigation respecting device safe areas.
- Paid relocations provide a concise success message after the Captain's fuel charge is applied.

The interface should become quiet enough for the player to focus on fishing.

## Layout

- Design for portrait phones first, then adapt gracefully to larger screens.
- Give each screen one obvious purpose and primary action.
- House Journey & Settings under the Inventory screen's `Angler profile` action. Do not float global utility controls over authored fishing or cabin artwork.
- Use consistent spacing, rounded surfaces, and restrained shadows.
- Keep essential status visible without filling every open area.
- Reflect the selected lure in the in-water strike marker, and show an owned boat with its equipped finish in boat-access scenes so equipment and cosmetics have a visible home.
- Use the same compact area/lure selector and one-time boat purchase language at Great Lake and Gulf Coast; locked areas name the location's required boat rather than using generic access copy.
- Label Open Gulf choices as charter positions. Show the 250-coin move cost within every unselected option, disable unaffordable moves with the exact shortfall, and never imply another boat purchase. Selecting an affordable destination opens a focused confirmation naming the destination and making clear that the Captain charges 250 coins for fuel; `Stay here` is the initial focus and no coins are spent until `Accept and relocate` is chosen.
- Give each authored fishing area a materially different viewpoint and structure silhouette; area selection should be visually apparent without rereading its label.
- On phones, collapse pre-cast area and lure choices into a single setup summary with an explicit Change/Done control. Normal fishing posture should show meaningful water and the cast control at the same time.
- Show specialty lures in a location-aware shop department with their named target, 20% relative affinity, permanent ownership, price, and equipped state visible before purchase.
- Show affordable target tackle in the same department with all targeted species, its 5% relative affinity, permanent price, and a marker silhouette distinct from included and legendary tackle.
- Size framed fish artwork intrinsically within explicit safe-area padding so fins and tails never touch or clip against the frame edge.
- Show the global included cabin collection directly in the decor customizer with recognizable display, frame, and timber previews. Mark which groups are usable in the active room and mute pieces that have no compatible authored slot; never imply every included piece fits every cabin.
- Present discovered Fish Collection artwork directly on the warm journal card without a colored inner panel. Preserve transparent breathing room around each silhouette; use the outer card for ten-catch recognition and retain a distinct muted frame only for undiscovered fish.
- Anchor the Master Catch seal at the upper-left of collection artwork so it reads as card recognition without covering the fish's head or mouth.

## Interaction

- Use touch targets of at least 44 by 44 CSS pixels.
- Provide clear pressed, disabled, loading, success, and error states.
- Never rely on color alone to communicate rarity or status.
- Keep bite feedback noticeable without making it startling.
- Respect reduced-motion preferences.
- Keep a primary touch target in the same position when its function changes during a sequence. Casting, hooking, and reeling must not make the player reposition their thumb.
- Place time-sensitive status and meters above the active thumb, even when that temporarily covers scenery. Never hide critical feedback beneath the player's hand.
- Prefer one-thumb interactions for the core fishing loop.
- Keep destination selection on the dedicated Fishing Trips page so the active fishing scene stays calm and focused.
- Keep Field Notes and personal Derby controls on Fishing Trips rather than the active water screen. Label both as optional, disclose Derby scoring before entry, show bounded progress without countdown urgency, and offer consequence-free Derby abandonment. While a Derby is active at the current water, the ready-state setup may show a quiet read-only cast-and-score summary so the player never has to remember the count.
- Keep the universal `View cabin` action in the setup header beside the other non-casting controls; it must not float over or obscure the authored fishing scene. Treat it as a paused look back home rather than travel: the cabin return action names and restores the active fishing location.
- Offer catch sharing only after a Trophy catch, never as a persistent fishing-screen control or social prompt.
- Use the cabin style picker only for owned and earned cabin choices. Keep locked-cabin prices and acquisition prompts in their appropriate progression or shop surfaces.

## Typography and Accessibility

- Use readable body text and strong contrast over scenery.
- Avoid placing important text directly on visually busy backgrounds.
- Support longer labels and system font scaling where practical.
- Bundle production fonts locally so the interface remains consistent offline.

## Motion

Use gentle animation to explain casting, waiting, biting, catching, selling, and progression. Avoid constant decorative motion that competes for attention.

Gameplay motion must not shift the primary control or cause layout reflow. Temporary fishing feedback should overlay the pond rather than push the control downward.
