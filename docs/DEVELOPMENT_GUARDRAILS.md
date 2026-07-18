# Development Guardrails

These rules protect Fishing Adventure from feature creep, manipulation, and unnecessary complexity.

## Product Rules

1. **Protect the core loop.** Cast, wait, react, catch or miss, keep or sell, improve equipment, and discover more fish.
2. **Polish before expanding.** One satisfying mechanic is worth more than several unfinished systems.
3. **Respect the player's time.** Progress should be meaningful, and repetition should never exist merely to inflate playtime.
4. **Avoid artificial frustration.** No energy systems, paid inventory relief, forced waits sold as skips, manipulative scarcity, or punishment for taking a break.
5. **No advertisements.** The calm atmosphere is part of the product.
6. **Stay offline-first.** Accounts, authentication, cloud services, and backends require a specifically approved need.
7. **Keep interfaces quiet.** Each screen needs one clear purpose. Add controls and counters only when they help the player.
8. **Use calm feedback.** Animation, sound, and haptics should communicate events without creating constant noise.

## Engineering Rules

1. Choose the simplest maintainable solution.
2. Prefer configuration for balance, timing, prices, probabilities, and availability.
3. Keep components and utilities focused, but do not invent abstractions solely to reduce line counts.
4. Preserve working systems and save compatibility.
5. Validate stored data and add migrations when its shape changes.
6. Keep ordinary and older phones in mind: minimize rendering work, bundle sizes, and oversized assets.
7. Build extension points for likely growth, not speculative systems.
8. Run the production build and re-test affected gameplay before considering a change complete.

## Feature Approval Test

Before implementing a substantial feature, answer:

- Which vision pillar does it strengthen?
- Can a player understand it in one or two sentences?
- Does it preserve the calm, offline-first experience?
- Does it introduce pressure, clutter, or artificial frustration?
- Is there a simpler version?
- Does it belong in the current roadmap, or only in `FUTURE_IDEAS.md`?

If those answers are unclear, do not build the feature yet.
