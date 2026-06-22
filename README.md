# Pop Pop Bloom 🎈

Kawaii balloon-popping PWA for Amelia. Pastel pink/blue, Kpop energy, blind box collectibles.

**Live:** https://lanthanum89.github.io/squish-pop/

## Game modes
- **Endless Pop** — balloons spawn faster over time, score attack
- **Blind Box Hunt** — 15 balloons per round, 1 guaranteed blind box, collect-em-all goal

## Collectibles
| Rarity | Characters | Drop rate |
|--------|-----------|-----------|
| Common | Kitten, Puppy, Bunny | 60% |
| Rare | Capybara, Panda, Hamster | 30% |
| Ultra Rare | Sparkle Panda, Rainbow Capybara, Galaxy Kitten | 10% |

## Stack
- Vanilla HTML / CSS / JS — no build step
- PWA: `manifest.json` + service worker (offline play, installable)
- `localStorage` for collection and settings (no account needed)
- GitHub Pages hosting

## Local dev
Clone and open `index.html` directly in a browser, or serve with any static server.
No dependencies, no build step.

## TODO
- [ ] Replace emoji placeholders with proper chibi/kawaii character art
- [ ] Source royalty-free kpop-adjacent background music
- [ ] Test install on Amelia's Android tablet via Chrome
- [ ] Get Amelia's feedback on collectible roster and visual style
