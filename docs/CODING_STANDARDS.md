# Coding Standards

- Prefer readability over cleverness.
- Keep files and components focused on one clear responsibility.
- Store gameplay balance and timing in data or configuration modules.
- Keep UI, game rules, economy calculations, and persistence separate.
- Avoid speculative abstraction and unnecessary dependencies.
- Validate external and stored data at its boundary.
- Preserve save compatibility; add migrations for schema changes.
- Clean up timers, listeners, and asynchronous work.
- Test affected behavior and run a production build before completion.
- Never knowingly commit a broken build.
- Update documentation in `docs/` after every project change. At minimum, record player-facing work in `CHANGELOG.md`, and update every affected design, system, roadmap, testing, balance, or workflow document in the same task.
- Treat documentation drift as an incomplete change; do not postpone it to a later truth pass.

Follow the style already established in the codebase unless there is a concrete reason to improve it.
