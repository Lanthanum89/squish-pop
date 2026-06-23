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
      osc.frequency.setValueAtTime(800, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.13);
      osc.start();
      osc.stop(ac.currentTime + 0.13);

      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.type = 'sine';
      osc2.connect(gain2);
      gain2.connect(ac.destination);
      osc2.frequency.setValueAtTime(1200, ac.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.12, ac.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc2.start();
      osc2.stop(ac.currentTime + 0.08);
    } catch {}
  }

  function blindBoxSound() {
    if (!Storage.get('sound', true)) return;
    try {
      const ac = getCtx();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const delay = i * 0.1;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ac.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.2);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + 0.2);
      });
    } catch {}
  }

  function milestoneSound() {
    if (!Storage.get('sound', true)) return;
    try {
      const ac = getCtx();
      const notes = [523, 659, 784, 1047, 1319];
      notes.forEach((freq, i) => {
        const delay = i * 0.08;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
        gain.gain.setValueAtTime(0.22, ac.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.25);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + 0.25);
      });
    } catch {}
  }

  return { popSound, blindBoxSound, milestoneSound };
})();
