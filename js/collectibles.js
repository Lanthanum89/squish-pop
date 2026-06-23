const COLLECTIBLES = [
  // Common — 60% total weight
  { id: 'kitten',           name: 'Kitten',           emoji: '🐱', rarity: 'common', weight: 9 },
  { id: 'puppy',            name: 'Puppy',            emoji: '🐶', rarity: 'common', weight: 9 },
  { id: 'bunny',            name: 'Bunny',            emoji: '🐰', rarity: 'common', weight: 9 },
  { id: 'duckling',         name: 'Duckling',         emoji: '🐥', rarity: 'common', weight: 9 },
  { id: 'fox',              name: 'Fox',              emoji: '🦊', rarity: 'common', weight: 8 },
  { id: 'frog',             name: 'Frog',             emoji: '🐸', rarity: 'common', weight: 8 },
  { id: 'penguin',          name: 'Penguin',          emoji: '🐧', rarity: 'common', weight: 8 },
  // Rare — 30% total weight
  { id: 'capybara',         name: 'Capybara',         emoji: '🦫', rarity: 'rare',   weight: 4 },
  { id: 'panda',            name: 'Panda',            emoji: '🐼', rarity: 'rare',   weight: 4 },
  { id: 'hamster',          name: 'Hamster',          emoji: '🐹', rarity: 'rare',   weight: 4 },
  { id: 'red_panda',        name: 'Red Panda',        emoji: '🔴🐼', rarity: 'rare',   weight: 3 },
  { id: 'axolotl',          name: 'Axolotl',          emoji: '🩷🐟', rarity: 'rare',   weight: 3 },
  { id: 'otter',            name: 'Otter',            emoji: '🦦', rarity: 'rare',   weight: 3 },
  { id: 'hedgehog',         name: 'Hedgehog',         emoji: '🦔', rarity: 'rare',   weight: 3 },
  // Ultra Rare — 10% total weight
  { id: 'sparkle_panda',    name: 'Sparkle Panda',    emoji: '✨🐼', rarity: 'ultra', weight: 2 },
  { id: 'rainbow_capybara', name: 'Rainbow Capybara', emoji: '🌈🦫', rarity: 'ultra', weight: 2 },
  { id: 'galaxy_kitten',    name: 'Galaxy Kitten',    emoji: '🌟🐱', rarity: 'ultra', weight: 2 },
  { id: 'crystal_axolotl',  name: 'Crystal Axolotl',  emoji: '💎🐟', rarity: 'ultra', weight: 1 },
  { id: 'star_fox',         name: 'Star Fox',         emoji: '⭐🦊', rarity: 'ultra', weight: 1 },
  { id: 'moon_bunny',       name: 'Moon Bunny',       emoji: '🌙🐰', rarity: 'ultra', weight: 1 },
  { id: 'blossom_duckling', name: 'Blossom Duckling', emoji: '🌸🐥', rarity: 'ultra', weight: 1 },
];

const TOTAL_WEIGHT = COLLECTIBLES.reduce((sum, c) => sum + c.weight, 0);

function rollCollectible() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const c of COLLECTIBLES) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return COLLECTIBLES[0];
}

function getCollection() {
  return Storage.get('collection', {});
}

function addToCollection(id) {
  const col = getCollection();
  col[id] = (col[id] || 0) + 1;
  Storage.set('collection', col);
}
