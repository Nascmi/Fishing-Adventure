# Public Landing Page

Fishing Adventure's public discovery page lives at `/landing`. It follows the same product architecture as Bible Companion: the marketing page remains separate from the installed game flow, uses honest product imagery and claims, links to the public privacy policy, and gives visitors a direct route into the browser build.

## Content

- Official fish-and-hook identity and sunrise feature artwork
- Browser-play call to action while Google Play remains in preparation
- Three core feature pillars: fishing, collection, and cabin personalization
- All five current fishing destinations using real authored game scenery
- Angler's Lodge presentation using real cabin artwork
- Explicit no-ads, no-energy-timers, no-loot-boxes, and no-pay-to-win promise
- FAQ covering free-tier scope, monetization, advertising, and local saves
- Nathan Miller copyright and privacy/contact links

## Routing

`src/main.jsx` renders the landing page directly for `/landing` and `/landing/`. It does not mount `GameProvider`, load a save, or initialize Google Play commerce. Every other route continues into the normal game. Firebase's existing single-page rewrite serves the route after deployment.

## Release Transition

The current landing page says that the Android release is in preparation. Once a real Play listing or testing URL exists, add a direct Google Play call to action without removing the browser-play option. Do not invent review scores, download counts, awards, or time-limited claims.

## Testing

- Load `/landing` directly and refresh it on Firebase Hosting.
- Confirm `/` still opens the game and `/privacy.html` opens the static policy.
- Check header anchors, browser-play links, privacy, email, keyboard focus, phone layout, reduced motion, and real image loading.
- Confirm opening `/landing` does not touch the Fishing Adventure save or initialize commerce.
