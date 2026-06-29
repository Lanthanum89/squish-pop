# Squish Pop! 🎈

A kawaii balloon-popping PWA built for Amelia. Pastel pink/blue palette, Kpop energy, blind box collectibles, and a collect-em-all album.

**Live:** https://lanthanum89.github.io/squish-pop/

## Game modes

- **Endless Pop** — balloons spawn faster over time, chase high scores and combos
- **Blind Box Hunt** — 15 balloons per round, 1 guaranteed blind box, collect them all

## Collectibles

35 characters across 3 rarity tiers:

| Rarity | Count | Examples | Drop rate |
|--------|-------|---------|-----------|
| Common | 10 | Kitten, Puppy, Bunny, Koala, Owl, Turtle | ~60% |
| Rare | 11 | Capybara, Panda, Axolotl, Flamingo, Sloth, Raccoon | ~30% |
| Ultra Rare | 14 | Sparkle Panda, Rainbow Capybara, Galaxy Kitten, Pearl Dolphin | ~10% |

## Features

- **Juicy feedback** — screen shake, star/heart particle bursts, score bump animations
- **Milestone celebrations** at 10, 25, 50, 100, 150, 200, 300, 500 pops
- **Combo system** — streak multiplier at 5+ with sparkly catchphrases
- **"NEW!" badge** on first-time collectible discoveries
- **Rarity-styled collection** — cards glow by rarity (blue = rare, purple = ultra rare)
- **Star hints** on locked cards so you know what rarity you're chasing
- **Progress tracking** — progress bar on collection screen, stats on home screen
- **Installable PWA** — works offline, installable on Android/iOS via browser
- **Accessibility** — all animations respect `prefers-reduced-motion`
- **Sound effects** — WebAudio-synthesised pop, blind box fanfare, and milestone sounds (toggleable)

## Stack

- Vanilla HTML / CSS / JS — no build step, no dependencies
- PWA: `manifest.json` + service worker (offline play, installable)
- `localStorage` for collection and settings
- GitHub Pages hosting

## Local dev

Clone and serve with any static server:

```bash
git clone https://github.com/Lanthanum89/squish-pop.git
cd squish-pop
npx serve .
```

Or open `index.html` directly in a browser (service worker requires HTTPS or localhost).

## TODO

- [ ] Replace emoji placeholders with proper chibi/kawaii character art
- [ ] Source royalty-free kpop-adjacent background music
- [ ] Confirm colour palette and character roster with Amelia
- [ ] Add collection rewards (achievements, unlockable backgrounds/balloon skins)

## License

[MIT](LICENSE)
