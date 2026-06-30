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
  let paused = false;
  let running = false;
  let revealTimer = null;
  let totalPops = 0;
  let lastMilestone = 0;
  let livesRemaining = 0;
  let maxLives = 3;

  const COMBO_TEXTS = [
    'Daebak! ✨', 'Slay! 💅', 'On fire! 🔥', 'So cute! 🌸', 'Iconic! 💖',
    'Kawaii! 🎀', 'Omo! 💜', 'Yaaas! 🌟', 'Purrfect! 🐾', 'Sparkle! 💫',
    'Uwu! 🩷', 'Bam! 💥', 'Vibe check! ✅', 'No cap! 🧢',
  ];
  const PASTEL_COLORS = ['#FFB6D9', '#FFD6E8', '#C9E8FF', '#A8D8FF', '#C8F0CC', '#FFF0B0', '#E8C8FF', '#FFCBA4', '#B5EAD7', '#FFDAC1'];
  const SIZES = [60, 72, 84, 96];
  const MILESTONES = [10, 25, 50, 100, 150, 200, 300, 500];
  const MILESTONE_TEXTS = ['Nice! 🎉', 'Amazing! 🌟', 'On a roll! 🔥', 'Legendary! 👑', 'Unstoppable! 💎', 'Queen! 👸', 'Mythic! 🦄', 'GOAT! 🏆'];
  const PARTICLE_SHAPES = ['circle', 'star', 'heart'];
  const REVEAL_AUTO_CLOSE_MS = 1400;

  function init(mode) {
    currentMode = mode;
    score = 0;
    comboCount = 0;
    totalPops = 0;
    lastMilestone = 0;
    allHuntSpawned = false;
    paused = false;
    running = true;

    gameArea = document.getElementById('game-area');
    scoreEl   = document.getElementById('score');
    comboEl   = document.getElementById('combo-display');
    mascotEl  = document.getElementById('mascot');

    gameArea.innerHTML = '';
    gameArea.classList.remove('paused');
    scoreEl.textContent = '0';
    clearTimeout(revealTimer);
    revealTimer = null;
    document.getElementById('collect-reveal').classList.add('hidden');
    document.getElementById('round-end').classList.add('hidden');
    document.getElementById('hud-mode').textContent =
      mode === 'hunt'  ? '🎁 Blind Box Hunt' :
      mode === 'lives' ? '💔 Pop or Drop!' :
      '♾ Endless Pop';

    const diff = Storage.get('difficulty', 'normal');
    spawnInterval = { easy: 1600, normal: 1200, hard: 750 }[diff];

    const livesEl = document.getElementById('lives-display');
    if (mode === 'lives') {
      maxLives = { easy: 5, normal: 3, hard: 1 }[diff];
      livesRemaining = maxLives;
      if (livesEl) livesEl.classList.remove('hidden');
      updateLivesDisplay();
    } else {
      if (livesEl) livesEl.classList.add('hidden');
    }

    if (mode === 'endless' || mode === 'lives') {
      scheduleNext();
    } else {
      spawnHunt();
    }
  }

  function scheduleNext() {
    if (!running || paused) return;
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
    const floatMs = 4500 + Math.random() * 3500;
    const wobble = (Math.random() * 15 + 8).toFixed(0);

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
      --wobble:${wobble}px;
    `;
    el.innerHTML = isBlindBox
      ? '<span class="balloon-icon">🎁</span>'
      : '<span class="balloon-string"></span>';

    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      pop(el, isBlindBox);
    });

    gameArea.appendChild(el);

    el.addEventListener('animationend', () => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        if (currentMode === 'hunt') checkHuntEnd();
        if (currentMode === 'lives' && !isBlindBox) handleMiss();
      }
    }, { once: true });
  }

  function pop(el, isBlindBox) {
    if (!el.parentNode || !running || paused) return;
    const rect = el.getBoundingClientRect();
    el.parentNode.removeChild(el);

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    burst(cx, cy, isBlindBox);
    screenShake();

    score++;
    totalPops++;
    scoreEl.textContent = score;
    scoreEl.classList.remove('score-bump');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('score-bump');

    checkMilestone();

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
      const multiplier = Math.min(comboCount, 10);
      comboEl.textContent = `×${comboCount} ${text}`;
      comboEl.classList.add('active');
      mascotEl.classList.add('excited');
      if (comboCount >= 5) {
        score += multiplier - 1;
        scoreEl.textContent = score;
      }
    }
    comboTimer = setTimeout(() => {
      comboCount = 0;
      comboEl.classList.remove('active');
      mascotEl.classList.remove('excited');
    }, 1800);
  }

  function checkMilestone() {
    for (let i = 0; i < MILESTONES.length; i++) {
      if (totalPops >= MILESTONES[i] && lastMilestone < MILESTONES[i]) {
        lastMilestone = MILESTONES[i];
        showMilestone(MILESTONE_TEXTS[i] || 'Incredible! 🏆', MILESTONES[i]);
        celebrationBurst();
        Audio.milestoneSound();
        break;
      }
    }
  }

  function showMilestone(text, count) {
    const el = document.createElement('div');
    el.className = 'milestone-toast';
    el.innerHTML = `<span class="milestone-count">${count} pops!</span><span class="milestone-text">${text}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function celebrationBurst() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const palette = ['#FFD700', '#FF69B4', '#00BFFF', '#FFB6D9', '#E8C8FF', '#C8F0CC', '#FFF0B0'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      const shape = PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)];
      p.className = 'particle particle-' + shape;
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      const size = 6 + Math.random() * 12;
      p.style.cssText = `
        left:${cx + (Math.random() - 0.5) * 200}px;
        top:${cy + (Math.random() - 0.5) * 200}px;
        width:${size}px;height:${size}px;
        background:${palette[Math.floor(Math.random() * palette.length)]};
        --dx:${(Math.cos(angle) * dist).toFixed(1)}px;
        --dy:${(Math.sin(angle) * dist).toFixed(1)}px;
        animation-duration:${0.8 + Math.random() * 0.6}s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  function screenShake() {
    if (!gameArea) return;
    gameArea.classList.remove('shake');
    void gameArea.offsetWidth;
    gameArea.classList.add('shake');
    setTimeout(() => gameArea.classList.remove('shake'), 200);
  }

  function burst(cx, cy, gold) {
    const palette = gold
      ? ['#FFD700', '#FFB6D9', '#C9E8FF', '#E8C8FF', '#FFF0B0']
      : ['#FFB6D9', '#C9E8FF', '#C8F0CC', '#FFF0B0', '#E8C8FF'];
    const count = gold ? 20 : 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const shape = PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)];
      p.className = 'particle particle-' + shape;
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = (gold ? 50 : 40) + Math.random() * (gold ? 70 : 50);
      const size = 6 + Math.random() * 8;
      p.style.cssText = `
        left:${cx}px;top:${cy}px;
        width:${size}px;height:${size}px;
        background:${palette[i % palette.length]};
        --dx:${(Math.cos(angle) * dist).toFixed(1)}px;
        --dy:${(Math.sin(angle) * dist).toFixed(1)}px;
        animation-duration:${0.5 + Math.random() * 0.3}s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  function showReveal() {
    const c = rollCollectible();
    const isNew = addToCollection(c.id);
    const RARITY_LABEL = { common: 'Common 🌸', rare: 'Rare ✨', ultra: 'Ultra Rare! 🌟' };
    document.getElementById('collect-emoji').textContent = c.emoji;
    document.getElementById('collect-name').textContent  = c.name;
    document.getElementById('collect-rarity').textContent = RARITY_LABEL[c.rarity];

    const newBadge = document.getElementById('collect-new');
    if (newBadge) newBadge.style.display = isNew ? 'block' : 'none';

    const modal = document.getElementById('collect-reveal');
    paused = true;
    if (gameArea) gameArea.classList.add('paused');
    clearTimeout(spawnTimer);
    modal.classList.remove('hidden');

    if (c.rarity === 'ultra') {
      celebrationBurst();
    }

    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => {
      modal.classList.add('hidden');
      paused = false;
      if (gameArea) gameArea.classList.remove('paused');
      revealTimer = null;
      if ((currentMode === 'endless' || currentMode === 'lives') && running) scheduleNext();
      if (currentMode === 'hunt') checkHuntEnd();
    }, REVEAL_AUTO_CLOSE_MS);
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
    document.getElementById('round-end-emoji').textContent = '🎉';
    document.getElementById('round-end-title').textContent = 'Round over!';
    document.getElementById('round-score-text').textContent =
      `You popped ${score} balloon${score !== 1 ? 's' : ''}!`;
    document.getElementById('round-end').classList.remove('hidden');
    celebrationBurst();
  }

  function handleMiss() {
    if (!running || paused) return;
    livesRemaining = Math.max(0, livesRemaining - 1);
    Audio.missSound();
    updateLivesDisplay();

    const flash = document.createElement('div');
    flash.className = 'miss-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 420);

    if (livesRemaining <= 0) endLivesGame();
  }

  function updateLivesDisplay() {
    const el = document.getElementById('lives-display');
    if (!el) return;
    let html = '';
    for (let i = 0; i < maxLives; i++) {
      html += `<span class="heart${i >= livesRemaining ? ' heart-lost' : ''}">❤️</span>`;
    }
    el.innerHTML = html;
  }

  function endLivesGame() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(comboTimer);
    if (comboEl) comboEl.classList.remove('active');
    if (mascotEl) mascotEl.classList.remove('excited');
    document.getElementById('round-end-emoji').textContent = '💔';
    document.getElementById('round-end-title').textContent = 'Game Over!';
    document.getElementById('round-score-text').textContent =
      `You popped ${score} balloon${score !== 1 ? 's' : ''} before running out of lives!`;
    document.getElementById('round-end').classList.remove('hidden');
  }

  function stop() {
    running = false;
    paused = false;
    livesRemaining = 0;
    clearTimeout(spawnTimer);
    clearTimeout(comboTimer);
    clearTimeout(revealTimer);
    revealTimer = null;
    if (gameArea) gameArea.innerHTML = '';
    if (gameArea) gameArea.classList.remove('paused');
    const livesEl = document.getElementById('lives-display');
    if (livesEl) livesEl.classList.add('hidden');
    document.getElementById('collect-reveal').classList.add('hidden');
    document.getElementById('round-end').classList.add('hidden');
    if (comboEl)  comboEl.classList.remove('active');
    if (mascotEl) mascotEl.classList.remove('excited');
  }

  function getMode() { return currentMode; }

  return { init, stop, getMode };
})();
