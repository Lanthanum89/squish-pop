const COLLECTIBLES = [
  // Common — 60% total weight
  { id: 'kitten',           name: 'Kitten',           emoji: '🐱', rarity: 'common', weight: 20 },
  { id: 'puppy',            name: 'Puppy',            emoji: '🐶', rarity: 'common', weight: 20 },
  { id: 'bunny',            name: 'Bunny',            emoji: '🐰', rarity: 'common', weight: 20 },
  // Rare — 30% total weight
  { id: 'capybara',         name: 'Capybara',         emoji: '🦫', rarity: 'rare',   weight: 10 },
  { id: 'panda',            name: 'Panda',            emoji: '🐼', rarity: 'rare',   weight: 10 },
  { id: 'hamster',          name: 'Hamster',          emoji: '🐹', rarity: 'rare',   weight: 10 },
  // Ultra Rare — 10% total weight
  { id: 'sparkle_panda',    name: 'Sparkle Panda',    emoji: '🌸🐼', rarity: 'ultra', weight: 4 },
  { id: 'rainbow_capybara', name: 'Rainbow Capybara', emoji: '🌈🦫', rarity: 'ultra', weight: 3 },
  { id: 'galaxy_kitten',    name: 'Galaxy Kitten',    emoji: '🌟🐱', rarity: 'ultra', weight: 3 },
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
