# Coding With Codex

## Before Work

1. Read the relevant documentation.
2. Inspect the existing implementation and repository state.
3. Identify the smallest safe change that satisfies the request.
4. Protect working systems and existing save data.

## During Work

- Extend the current architecture before replacing it.
- Keep gameplay values configurable.
- Avoid unrelated cleanup unless it is necessary for the requested change.
- Explain important assumptions and tradeoffs.
- Update the appropriate files in `docs/` after every project change, during the same task. Record player-facing changes in `CHANGELOG.md` and keep all affected design, system, roadmap, testing, balance, and workflow documents synchronized with the implementation.
- Never defer documentation maintenance to a later truth pass.

## Before Handoff

1. Test the affected behavior in proportion to its risk.
2. Run the production build and fix implementation-related errors.
3. Confirm the documentation describes the completed behavior accurately.
4. Summarize the outcome and important files.
5. Identify remaining placeholders or limitations.
6. Do not create a Git commit unless the user explicitly requests one.
