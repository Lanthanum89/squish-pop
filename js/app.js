let currentGameMode = 'endless';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Menu buttons
document.getElementById('btn-endless').addEventListener('click', () => {
  currentGameMode = 'endless';
  showScreen('screen-game');
  Game.init('endless');
});

document.getElementById('btn-hunt').addEventListener('click', () => {
  currentGameMode = 'hunt';
  showScreen('screen-game');
  Game.init('hunt');
});

document.getElementById('btn-album').addEventListener('click', () => {
  showScreen('screen-album');
  Album.render();
});

document.getElementById('btn-settings').addEventListener('click', () => {
  showScreen('screen-settings');
});

// Back buttons
document.getElementById('btn-back-game').addEventListener('click', () => {
  Game.stop();
  showScreen('screen-menu');
});
document.getElementById('btn-back-album').addEventListener('click', () => showScreen('screen-menu'));
document.getElementById('btn-back-settings').addEventListener('click', () => showScreen('screen-menu'));

// Round end
document.getElementById('btn-play-again').addEventListener('click', () => {
  Game.init(currentGameMode);
});
document.getElementById('btn-to-menu').addEventListener('click', () => {
  Game.stop();
  showScreen('screen-menu');
});

// Settings persistence
const soundToggle = document.getElementById('toggle-sound');
soundToggle.checked = Storage.get('sound', true);
soundToggle.addEventListener('change', () => Storage.set('sound', soundToggle.checked));

const diffSelect = document.getElementById('select-difficulty');
diffSelect.value = Storage.get('difficulty', 'normal');
diffSelect.addEventListener('change', () => Storage.set('difficulty', diffSelect.value));

// PWA service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
