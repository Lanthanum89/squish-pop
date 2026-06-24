const Album = (() => {
  const RARITY_STARS = { common: '⭐', rare: '⭐⭐', ultra: '⭐⭐⭐' };
  const RARITY_LABELS = { common: 'common', rare: 'rare', ultra: 'ultra rare' };

  function render() {
    const grid = document.getElementById('album-grid');
    const progress = document.getElementById('album-progress');
    const col = getCollection();

    const owned = COLLECTIBLES.filter(c => col[c.id]).length;
    const total = COLLECTIBLES.length;
    const pct = Math.round((owned / total) * 100);

    progress.innerHTML = `
      <div class="album-progress-text">🎈 ${owned} / ${total} Friends Found</div>
      <div class="album-progress-bar">
        <div class="album-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="album-progress-pct">${pct}%</div>
    `;

    grid.innerHTML = '';
    for (const c of COLLECTIBLES) {
      const count = col[c.id] || 0;
      const card = document.createElement('div');
      const rarityClass = count ? ` rarity-${c.rarity}` : '';
      card.className = 'album-card' + rarityClass + (count ? '' : ' locked');

      if (count) {
        card.innerHTML = `
          <div class="card-emoji">${c.emoji}</div>
          <div class="card-name">${c.name}</div>
          <div class="card-rarity card-rarity-${c.rarity}">${RARITY_LABELS[c.rarity]}</div>
          ${count > 1 ? `<div class="card-count">&times;${count}</div>` : ''}
        `;
      } else {
        card.innerHTML = `
          <div class="card-emoji">❓</div>
          <div class="card-name">???</div>
          <div class="card-rarity-hint">${RARITY_STARS[c.rarity]}</div>
        `;
      }

      grid.appendChild(card);
    }
  }

  function getStats() {
    const col = getCollection();
    const owned = COLLECTIBLES.filter(c => col[c.id]).length;
    return { owned, total: COLLECTIBLES.length };
  }

  return { render, getStats };
})();
