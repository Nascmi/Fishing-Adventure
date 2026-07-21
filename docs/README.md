# Fishing Adventure Documentation

Fishing Adventure is a mobile-first fishing game about relaxation, discovery, collection, and steady progression. It should feel like spending a quiet morning at the lake: welcoming, unhurried, and rewarding without manipulation.

## Start Here

Read these documents before making a significant change:

1. `GAME_VISION.md` — what the game is and how success is defined
2. `DEVELOPMENT_GUARDRAILS.md` — rules for deciding what belongs
3. `GAME_DESIGN.md` — the core loop and gameplay pillars
4. `ROADMAP.md` — what is approved now and what comes later

Use the remaining documents as focused references:

- `THE_SOUL_OF_THE_GAME.md` — the emotional north star
- `ART_DIRECTION.md` and `UI_GUIDELINES.md` — presentation
- `ECONOMY.md` and `BALANCE_NOTES.md` — progression tuning
- `SAVE_SYSTEM.md` — persistence and compatibility
- `TESTING.md` — automated rule, migration, and regression coverage
- `CODING_STANDARDS.md` and `CODING_WITH_CODEX.md` — development workflow
- `FUTURE_IDEAS.md` — ideas that are not yet approved
- `CHANGELOG.md` and `RELEASE_HISTORY.md` — project history

When documents conflict, follow them in the order above and update the outdated document.

## Technology

- React, Vite, JavaScript, and CSS
- `localStorage` for current saves
- Capacitor for future Android and iOS packaging
- No backend for the core offline experience

## Current Development Status

The current development build has completed Phases 1 through 3. Five playable waters—Backyard Pond, Pine River, Great Lake, Gulf Coast, and Open Gulf—now form a complete fishing journey with location-specific species, equipment, presentation, day cycles, and three-day destination charters. The game also includes Angling Keepsakes, specimen preservation, passing rain, earned and coin-purchased cabins, cabin sharing, and the earned-coin Trading Post.

Phase 4 has begun with authored Great Lake areas, a permanent skiff, reusable included tackle, permanent specialty lures for legendary targets, and rare rod-dependent quiet casts. Accessibility, balance, save-migration, device, and economy testing remain ongoing quality priorities. See `PHASE_4_DESIGN.md` for the design contract, `CHANGELOG.md` for current work, and `ROADMAP.md` for approved direction.

## Running the Project

```bash
npm install
npm run dev
npm run test:run
npm run build
```

## Working Principle

Before adding a feature, ask:

> Does this make Fishing Adventure more enjoyable without making it needlessly complicated?

Polish the fishing experience before expanding its scope.
