# Fishing Adventure Brand Guide

Fishing Adventure uses a calm heritage-outfitter identity: welcoming, outdoorsy, and premium without tournament aggression or freemium spectacle.

## Identity

- **Primary mark:** a freshwater game fish rising through quiet ripples beneath a curved fishing line and brass hook.
- **Wordmark:** `Fishing Adventure` in a sturdy heritage serif.
- **Ownership line:** `© 2026 Nathan Miller. All rights reserved.`
- **Small-size rule:** use the emblem without the wordmark for launcher icons and other compact placements.
- **Tone:** peaceful exploration, believable fishing, handcrafted quality, and lasting collections.

## Core Palette

| Role | Color |
| --- | --- |
| Deep lake green | `#123930` |
| Pine green | `#315343` |
| Warm ivory | `#F5EBD5` |
| Weathered brass | `#C69B45` |
| River blue | `#4E82A5` |

## Source and Delivery Assets

- Editable raster masters live in `branding/masters/`.
- Play Console uploads live in `branding/play-store/`.
- `app-icon-512.png` is the 512×512 high-resolution Play Store icon.
- `feature-graphic-1024x500.png` is the opaque Play Store feature graphic.
- Android density-specific launcher, adaptive, round, monochrome, portrait-splash, and landscape-splash resources live under `android/app/src/main/res/`.
- Run `python scripts/generate_brand_assets.py` after changing a master to rebuild the derivative assets.

The feature graphic keeps its title and emblem away from the outer crop zones. Store screenshots must show real gameplay and should use the same palette without obscuring the interface or implying features that are not present.

The approved Play Console copy, graphic alt text, and truthful screenshot capture plan live in `GOOGLE_PLAY_LISTING.md`.

The public `/landing` page is the primary web expression of this identity. It uses the official Play icon and feature master from `public/brand/`, then pairs them with real authored water and cabin artwork from the game.

## Usage Rules

- Do not recolor the fish into neon or highly saturated arcade colors.
- Do not add price, ranking, download, award, or “free” claims to the icon or feature graphic.
- Do not stretch the emblem or place the full wordmark inside small launcher icons.
- Keep the copyright line on the launch identity and in the in-app Journey & Settings panel.
- Preserve generous clear space around the emblem and wordmark.
