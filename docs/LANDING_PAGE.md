# Public Landing Page

Fishing Adventure's public discovery page lives at `/landing`. It follows the same product architecture as Bible Companion: the marketing page remains separate from the installed game flow, uses honest product imagery and claims, links to the public privacy policy, and gives visitors a direct route into the browser build.

## Content

- Official fish-and-hook identity and sunrise feature artwork
- Direct Google Play testing call to action alongside browser play
- Three core feature pillars: fishing, collection, and cabin personalization
- All five current fishing destinations using real authored game scenery
- Angler's Lodge presentation using real cabin artwork
- Explicit no-ads, no-energy-timers, no-loot-boxes, and no-pay-to-win promise
- FAQ covering free-tier scope, monetization, advertising, and local saves
- Nathan Miller copyright and privacy/contact links

## Routing

`src/main.jsx` renders the landing page directly for `/landing` and `/landing/`. It does not mount `GameProvider`, load a save, or initialize Google Play commerce. Every other route continues into the normal game. Firebase's existing single-page rewrite serves the route after deployment.

## Google Play Testing

The header, hero, and closing call to action link to the official Fishing Adventure Google Play listing at `https://play.google.com/store/apps/details?id=com.nathanmiller.fishingadventure`. The page describes the Android build as being in testing and retains browser play as an equal fallback. Do not invent review scores, download counts, awards, or time-limited claims.

## Testing

- Load `/landing` directly and refresh it on Firebase Hosting.
- Confirm `/` still opens the game and `/privacy.html` opens the static policy.
- Check the header, hero, and closing Google Play links; browser-play links; header anchors; privacy; email; keyboard focus; phone layout; reduced motion; and real image loading.
- Confirm opening `/landing` does not touch the Fishing Adventure save or initialize commerce.
