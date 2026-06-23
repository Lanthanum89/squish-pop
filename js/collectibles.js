const COLLECTIBLES = [
  // Common — 60% total weight (10 characters)
  { id: 'kitten',           name: 'Kitten',           emoji: '🐱', rarity: 'common', weight: 7 },
  { id: 'puppy',            name: 'Puppy',            emoji: '🐶', rarity: 'common', weight: 7 },
  { id: 'bunny',            name: 'Bunny',            emoji: '🐰', rarity: 'common', weight: 7 },
  { id: 'duckling',         name: 'Duckling',         emoji: '🐥', rarity: 'common', weight: 7 },
  { id: 'fox',              name: 'Fox',              emoji: '🦊', rarity: 'common', weight: 6 },
  { id: 'frog',             name: 'Frog',             emoji: '🐸', rarity: 'common', weight: 6 },
  { id: 'penguin',          name: 'Penguin',          emoji: '🐧', rarity: 'common', weight: 6 },
  { id: 'koala',            name: 'Koala',            emoji: '🐨', rarity: 'common', weight: 5 },
  { id: 'owl',              name: 'Owl',              emoji: '🦉', rarity: 'common', weight: 5 },
  { id: 'turtle',           name: 'Turtle',           emoji: '🐢', rarity: 'common', weight: 5 },
  // Rare — 30% total weight (11 characters)
  { id: 'capybara',         name: 'Capybara',         emoji: '🦫', rarity: 'rare',   weight: 3 },
  { id: 'panda',            name: 'Panda',            emoji: '🐼', rarity: 'rare',   weight: 3 },
  { id: 'hamster',          name: 'Hamster',          emoji: '🐹', rarity: 'rare',   weight: 3 },
  { id: 'red_panda',        name: 'Red Panda',        emoji: '🔴🐼', rarity: 'rare',   weight: 3 },
  { id: 'axolotl',          name: 'Axolotl',          emoji: '🩷🐟', rarity: 'rare',   weight: 3 },
  { id: 'otter',            name: 'Otter',            emoji: '🦦', rarity: 'rare',   weight: 3 },
  { id: 'hedgehog',         name: 'Hedgehog',         emoji: '🦔', rarity: 'rare',   weight: 3 },
  { id: 'flamingo',         name: 'Flamingo',         emoji: '🦩', rarity: 'rare',   weight: 2 },
  { id: 'dolphin',          name: 'Dolphin',          emoji: '🐬', rarity: 'rare',   weight: 2 },
  { id: 'sloth',            name: 'Sloth',            emoji: '🦥', rarity: 'rare',   weight: 2 },
  { id: 'raccoon',          name: 'Raccoon',          emoji: '🦝', rarity: 'rare',   weight: 2 },
  // Ultra Rare — 10% total weight (14 characters)
  { id: 'sparkle_panda',    name: 'Sparkle Panda',    emoji: '✨🐼', rarity: 'ultra', weight: 1.2 },
  { id: 'rainbow_capybara', name: 'Rainbow Capybara', emoji: '🌈🦫', rarity: 'ultra', weight: 1.2 },
  { id: 'galaxy_kitten',    name: 'Galaxy Kitten',    emoji: '🌟🐱', rarity: 'ultra', weight: 1.2 },
  { id: 'crystal_axolotl',  name: 'Crystal Axolotl',  emoji: '💎🐟', rarity: 'ultra', weight: 0.8 },
  { id: 'star_fox',         name: 'Star Fox',         emoji: '⭐🦊', rarity: 'ultra', weight: 0.8 },
  { id: 'moon_bunny',       name: 'Moon Bunny',       emoji: '🌙🐰', rarity: 'ultra', weight: 0.8 },
  { id: 'blossom_duckling', name: 'Blossom Duckling', emoji: '🌸🐥', rarity: 'ultra', weight: 0.8 },
  { id: 'aurora_otter',     name: 'Aurora Otter',     emoji: '🌌🦦', rarity: 'ultra', weight: 0.6 },
  { id: 'diamond_penguin',  name: 'Diamond Penguin',  emoji: '💠🐧', rarity: 'ultra', weight: 0.6 },
  { id: 'cosmic_hamster',   name: 'Cosmic Hamster',   emoji: '🪐🐹', rarity: 'ultra', weight: 0.6 },
  { id: 'cherry_flamingo',  name: 'Cherry Flamingo',  emoji: '🍒🦩', rarity: 'ultra', weight: 0.5 },
  { id: 'cloud_koala',      name: 'Cloud Koala',      emoji: '☁️🐨', rarity: 'ultra', weight: 0.5 },
  { id: 'honey_puppy',      name: 'Honey Puppy',      emoji: '🍯🐶', rarity: 'ultra', weight: 0.5 },
  { id: 'pearl_dolphin',    name: 'Pearl Dolphin',    emoji: '🫧🐬', rarity: 'ultra', weight: 0.4 },
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
  const isNew = !col[id];
  col[id] = (col[id] || 0) + 1;
  Storage.set('collection', col);
  return isNew;
}
