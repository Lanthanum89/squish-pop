const Audio = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function popSound() {
    if (!Storage.get('sound', true)) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.setValueAtTime(700, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
      osc.start();
      osc.stop(ac.currentTime + 0.15);
    } catch {}
  }

  function blindBoxSound() {
    if (!Storage.get('sound', true)) return;
    try {
      const ac = getCtx();
      [0, 0.12, 0.24, 0.36].forEach((delay, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.setValueAtTime(400 + i * 150, ac.currentTime + delay);
        gain.gain.setValueAtTime(0.18, ac.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.18);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + 0.18);
      });
    } catch {}
  }

  return { popSound, blindBoxSound };
})();
