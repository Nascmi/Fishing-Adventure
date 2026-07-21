# UI Guidelines

The interface should become quiet enough for the player to focus on fishing.

## Layout

- Design for portrait phones first, then adapt gracefully to larger screens.
- Give each screen one obvious purpose and primary action.
- Use consistent spacing, rounded surfaces, and restrained shadows.
- Keep essential status visible without filling every open area.
- Size framed fish artwork intrinsically within explicit safe-area padding so fins and tails never touch or clip against the frame edge.

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
- Offer catch sharing only after a Trophy catch, never as a persistent fishing-screen control or social prompt.

## Typography and Accessibility

- Use readable body text and strong contrast over scenery.
- Avoid placing important text directly on visually busy backgrounds.
- Support longer labels and system font scaling where practical.
- Bundle production fonts locally so the interface remains consistent offline.

## Motion

Use gentle animation to explain casting, waiting, biting, catching, selling, and progression. Avoid constant decorative motion that competes for attention.

Gameplay motion must not shift the primary control or cause layout reflow. Temporary fishing feedback should overlay the pond rather than push the control downward.
