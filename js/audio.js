export class AudioManager {
  constructor() {
    this.enabled = false;
    this.sounds = new Map();
  }

  register(name, src, options = {}) {
    const audio = new Audio(src);
    audio.preload = options.preload ?? "auto";
    audio.loop = Boolean(options.loop);
    audio.volume = options.volume ?? 1;

    this.sounds.set(name, audio);
    return audio;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);

    if (!this.enabled) {
      for (const audio of this.sounds.values()) {
        audio.pause();
      }
    }
  }

  async play(name, { restart = false } = {}) {
    if (!this.enabled) return;

    const audio = this.sounds.get(name);
    if (!audio) return;

    if (restart) {
      audio.currentTime = 0;
    }

    try {
      await audio.play();
    } catch {
      // El juego debe seguir funcionando incluso si el navegador bloquea audio.
    }
  }

  stop(name) {
    const audio = this.sounds.get(name);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }
}
