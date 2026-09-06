// Sound effects engine for UI feedback (chimes, sparkles, kisses, heartbeat)
// Background music has been completely removed per user request.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volumeNode: GainNode | null = null;
  private currentVolume: number = 0.6;
  private isMuted: boolean = false;

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.value = this.currentVolume;
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Tactile tone generator for UI buttons
  playNote(
    freq: number,
    duration: number = 0.3,
    volumeMultiplier: number = 1.0,
    timbre: 'piano' | 'musicbox' = 'musicbox'
  ) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = timbre === 'musicbox' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 * volumeMultiplier, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.volumeNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  // Standard bell sound for UI feedback
  playBell(freq: number = 440, duration: number = 0.5, volume: number = 0.15) {
    this.playNote(freq, duration, volume / 0.15, 'musicbox');
  }

  // Heartbeat sound for the Heartbeat modal
  playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;

      const now = this.ctx.currentTime;
      const playThump = (timeOffset: number, freq: number, dur: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(35, now + timeOffset + dur);

        gain.gain.setValueAtTime(0.001, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.35, now + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + dur);

        osc.connect(gain);
        gain.connect(this.volumeNode!);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + dur);
      };

      playThump(0, 95, 0.12);
      playThump(0.14, 85, 0.15);
    } catch {}
  }

  // Cute chimes for opening letters or buttons
  playChime(type: 'sparkle' | 'open' | 'pop' = 'sparkle') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (type === 'sparkle') {
        const notes = [659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.4, 0.6, 'musicbox'), idx * 70);
        });
      } else if (type === 'open') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.5, 0.6, 'musicbox'), idx * 80);
        });
      } else if (type === 'pop') {
        this.playNote(880, 0.1, 0.35, 'musicbox');
      }
    } catch {}
  }

  // Realistic kiss sound effect
  playKissSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.0, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.14);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.volumeNode);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  playKiss() {
    this.playKissSound();
  }

  // Safe no-ops for any legacy calls
  startMusicBox() {}
  stopMusicBox() {}
  toggleMusicBox() {}
  getIsPlaying() {
    return false;
  }
  getCurrentTrack() {
    return { id: 'voice-note', title: 'Voice Note', artist: 'AISHHPAGLUU' };
  }
  subscribe(_listener: any) {
    return () => {};
  }
  setAmbientSound(_type: string) {}
  getCurrentAmbient() {
    return 'none';
  }
  setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.volumeNode) {
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }
  getVolume() {
    return this.currentVolume;
  }
}

export const sound = new SoundEngine();
