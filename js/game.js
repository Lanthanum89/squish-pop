const Game = (() => {
  let gameArea, scoreEl, comboEl, mascotEl;
  let score = 0;
  let comboCount = 0;
  let comboTimer = null;
  let spawnTimer = null;
  let spawnInterval = 1200;
  let currentMode = 'endless';
  let huntTotal = 15;
  let allHuntSpawned = false;
  let running = false;

  const COMBO_TEXTS = ['Daebak! ✨', 'Slay! 💅', 'On fire! 🔥', 'So cute! 🌸', 'Iconic! 💖'];
  const PASTEL_COLORS = ['#FFB6D9', '#FFD6E8', '#C9E8FF', '#A8D8FF', '#C8F0CC', '#FFF0B0', '#E8C8FF'];
  const SIZES = [60, 72, 84, 96];

  function init(mode) {
    currentMode = mode;
    score = 0;
    comboCount = 0;
    allHuntSpawned = false;
    running = true;

    gameArea = document.getElementById('game-area');
    scoreEl   = document.getElementById('score');
    comboEl   = document.getElementById('combo-display');
    mascotEl  = document.getElementById('mascot');

    gameArea.innerHTML = '';
    scoreEl.textContent = '0';
    document.getElementById('collect-reveal').classList.add('hidden');
    document.getElementById('round-end').classList.add('hidden');
    document.getElementById('hud-mode').textContent = mode === 'hunt' ? '🎁 Blind Box Hunt' : '♾ Endless Pop';

    const diff = Storage.get('difficulty', 'normal');
    spawnInterval = { easy: 1600, normal: 1200, hard: 750 }[diff];

    if (mode === 'endless') {
      scheduleNext();
    } else {
      spawnHunt();
    }
  }

  function scheduleNext() {
    if (!running) return;
    spawnTimer = setTimeout(() => {
      spawnBalloon(Math.random() < 0.15);
      spawnInterval = Math.max(380, spawnInterval * 0.985);
      scheduleNext();
    }, spawnInterval);
  }

  function spawnHunt() {
    const blindIdx = Math.floor(Math.random() * huntTotal);
    for (let i = 0; i < huntTotal; i++) {
      setTimeout(() => {
        if (!running) return;
        spawnBalloon(i === blindIdx);
        if (i === huntTotal - 1) {
          allHuntSpawned = true;
          checkHuntEnd();
        }
      }, i * 500);
    }
  }

  function spawnBalloon(isBlindBox) {
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const x = Math.random() * (window.innerWidth - size - 20) + 10;
    const floatMs = 5000 + Math.random() * 3000;

    const el = document.createElement('div');
    el.className = 'balloon' + (isBlindBox ? ' blind-box' : '');
    el.style.cssText = `
      width:${size}px;
      height:${Math.round(size * 1.25)}px;
      left:${x}px;
      background:${isBlindBox
        ? 'linear-gradient(135deg,#FFB6D9 0%,#C9E8FF 50%,#FFF0B0 100%)'
        : color};
      animation-duration:${floatMs}ms;
    `;
    el.innerHTML = isBlindBox
      ? '<span class="balloon-icon">🎁</span>'
      : '<span class="balloon-string"></span>';

    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      pop(el, isBlindBox);
    }, { once: true });

    gameArea.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        if (currentMode === 'hunt') checkHuntEnd();
      }
    }, floatMs + 100);
  }

  function pop(el, isBlindBox) {
    if (!el.parentNode || !running) return;
    const rect = el.getBoundingClientRect();
    el.parentNode.removeChild(el);

    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, isBlindBox);
    score++;
    scoreEl.textContent = score;

    if (isBlindBox) {
      Audio.blindBoxSound();
      showReveal();
    } else {
      Audio.popSound();
      handleCombo();
      if (currentMode === 'hunt') checkHuntEnd();
    }
  }

  function handleCombo() {
    comboCount++;
    clearTimeout(comboTimer);
    if (comboCount >= 3) {
      const text = COMBO_TEXTS[Math.floor(Math.random() * COMBO_TEXTS.length)];
      comboEl.textContent = `×${comboCount} ${text}`;
      comboEl.classList.add('active');
      mascotEl.classList.add('excited');
    }
    comboTimer = setTimeout(() => {
      comboCount = 0;
      comboEl.classList.remove('active');
      mascotEl.classList.remove('excited');
    }, 1500);
  }

  function burst(cx, cy, gold) {
    const palette = gold
      ? ['#FFD700', '#FFB6D9', '#C9E8FF', '#E8C8FF', '#FFF0B0']
      : ['#FFB6D9', '#C9E8FF', '#C8F0CC', '#FFF0B0', '#E8C8FF'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 45;
      p.style.cssText = `
        left:${cx}px;top:${cy}px;
        background:${palette[i % palette.length]};
        --dx:${(Math.cos(angle) * dist).toFixed(1)}px;
        --dy:${(Math.sin(angle) * dist).toFixed(1)}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  }

  function showReveal() {
    const c = rollCollectible();
    addToCollection(c.id);
    const RARITY_LABEL = { common: 'Common 🌸', rare: 'Rare ✨', ultra: 'Ultra Rare! 🌟' };
    document.getElementById('collect-emoji').textContent = c.emoji;
    document.getElementById('collect-name').textContent  = c.name;
    document.getElementById('collect-rarity').textContent = RARITY_LABEL[c.rarity];
    document.getElementById('collect-reveal').classList.remove('hidden');
    document.getElementById('btn-collect-ok').onclick = () => {
      document.getElementById('collect-reveal').classList.add('hidden');
      if (currentMode === 'hunt') checkHuntEnd();
    };
  }

  function checkHuntEnd() {
    if (currentMode !== 'hunt' || !running || !allHuntSpawned) return;
    const remaining = gameArea.querySelectorAll('.balloon').length;
    const revealOpen = !document.getElementById('collect-reveal').classList.contains('hidden');
    if (remaining === 0 && !revealOpen) endRound();
  }

  function endRound() {
    running = false;
    clearTimeout(spawnTimer);
    document.getElementById('round-score-text').textContent =
      `You popped ${score} balloon${score !== 1 ? 's' : ''}!`;
    document.getElementById('round-end').classList.remove('hidden');
  }

  function stop() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(comboTimer);
    if (gameArea) gameArea.innerHTML = '';
    document.getElementById('collect-reveal').classList.add('hidden');
    document.getElementById('round-end').classList.add('hidden');
    if (comboEl)  comboEl.classList.remove('active');
    if (mascotEl) mascotEl.classList.remove('excited');
  }

  function getMode() { return currentMode; }

  return { init, stop, getMode };
})();
