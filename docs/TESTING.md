# Automated Testing

Fishing Adventure uses Vitest for deterministic rule and persistence tests. The suite runs in a Node environment through Vite's normal module pipeline; browser emulation is not required for the current rules layer.

## Commands

```bash
npm test
npm run test:run
npm run build
```

`npm test` watches affected files during development. `npm run test:run` executes the complete suite once and is the required verification command before a handoff or commit that changes game behavior.

## Covered Systems

- Save migrations from representative legacy versions through the current schema
- Missing, malformed, and unreadable save recovery
- Location-bounded rarity fallback and preferred day phases
- Specimen-size boundaries, deterministic catch generation, and catch values
- Rod prerequisites, equipment ownership, and exact coin deductions
- Charter booking, completion, paintings, and keepsake evaluation
- Trading Post ownership, duplicate rejection, and cabin eligibility
- Trophy preservation costs and free heavier upgrades
- Keepsakes, location paintings, Master Angler frames, photographs, miniatures, and equipment plaques

## Test Design Rules

- Test game rules as pure state transitions whenever practical.
- Use literal legacy-save fixtures rather than current defaults when verifying migrations.
- Inject deterministic random functions and timestamps instead of relying on lucky rolls or the system clock.
- Assert rejected actions return the original state without partial deductions or ownership changes.
- Add a regression test with every bug fix that changes a testable rule.
- Keep production builds as a separate required check; passing unit tests does not prove the application bundles successfully.

Browser-level navigation, touch interaction, visual regression, and device storage behavior remain manual release checks until a dedicated browser suite is approved.
