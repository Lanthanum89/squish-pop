const Album = (() => {
  function render() {
    const grid = document.getElementById('album-grid');
    const progress = document.getElementById('album-progress');
    const col = getCollection();

    const owned = COLLECTIBLES.filter(c => col[c.id]).length;
    progress.textContent = `${owned} / ${COLLECTIBLES.length} collected`;

    grid.innerHTML = '';
    for (const c of COLLECTIBLES) {
      const count = col[c.id] || 0;
      const card = document.createElement('div');
      card.className = 'album-card' + (count ? '' : ' locked');
      card.innerHTML = `
        <div class="card-emoji">${count ? c.emoji : '❓'}</div>
        <div class="card-name">${count ? c.name : '???'}</div>
        <div class="card-rarity rarity-${c.rarity}">${c.rarity}</div>
        ${count > 1 ? `<div class="card-count">×${count}</div>` : ''}
      `;
      grid.appendChild(card);
    }
  }

  return { render };
})();
