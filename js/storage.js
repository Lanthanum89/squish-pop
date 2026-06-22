const Storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem('ppb_' + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('ppb_' + key, JSON.stringify(value));
    } catch {}
  }
};
