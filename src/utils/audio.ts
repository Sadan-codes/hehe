// Real Romantic Audio Engine & UI Sound Effects
export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  badge: string;
  audioUrl: string;
  duration?: string;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentTrackIndex: number = 0;
  private isPlayingMusic: boolean = false;
  private volumeNode: GainNode | null = null;
  private currentVolume: number = 0.45;
  private audioElement: HTMLAudioElement | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbient: 'none' | 'rain' | 'fireplace' | 'waves' = 'none';
  private stateListeners: Set<(isPlaying: boolean, track: TrackInfo) => void> = new Set();
  private hasUserInteracted: boolean = false;

  // Curated, verified real romantic masterpieces (Classical Romantic Piano & Violin)
  public readonly tracks: TrackInfo[] = [
    {
      id: 'chopin-nocturne-op9-no2',
      title: 'Nocturne in E-flat Major, Op. 9 No. 2',
      artist: 'Frédéric Chopin (Frank Levy, Piano)',
      badge: 'Most Romantic ❤️',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3',
      duration: '4:31',
    },
    {
      id: 'mischa-elman-nocturne',
      title: 'Nocturne in E-flat Major (Violin Romance)',
      artist: 'Mischa Elman (Violin & Grand Piano)',
      badge: 'Violin & Piano 🎻',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Mischa_Elman_-_Nocturne_in_E_flat_major%2C_Op_9_No_2.mp3',
      duration: '4:18',
    },
    {
      id: 'chopin-nocturne-op9-no1',
      title: 'Nocturne in B-flat Minor, Op. 9 No. 1',
      artist: 'Frédéric Chopin (Romantic Solo Piano)',
      badge: 'Midnight Ballad 🌙',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/NocturneOp.9No.1InBFlatMinor.mp3',
      duration: '5:25',
    },
    {
      id: 'chopin-waltz-e-minor',
      title: 'Waltz in E Minor, B. 56',
      artist: 'Frédéric Chopin (Tender Piano Waltz)',
      badge: 'Slow Waltz 💃',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Chopin_-_Waltz_in_E_minor%2C_B_56.mp3',
      duration: '3:00',
    },
    {
      id: 'chopin-nocturne-op9-no3',
      title: 'Nocturne in B Major, Op. 9 No. 3',
      artist: 'Frédéric Chopin (Starlight Serenade)',
      badge: 'Starlight Piano ✨',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/NocturneOp.9No.3.mp3',
      duration: '6:40',
    },
    {
      id: 'beethoven-moonlight-sonata',
      title: 'Moonlight Sonata (Adagio Sostenuto)',
      artist: 'Ludwig van Beethoven (Poetic Romance)',
      badge: 'Timeless Classic 🎹',
      audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Moonlight_Sonata.ogg',
      duration: '5:06',
    },
  ];

  constructor() {
    this.setupAutoplayListener();
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioElement) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = this.currentVolume;

      audio.addEventListener('play', () => {
        this.isPlayingMusic = true;
        this.notifyListeners();
      });

      audio.addEventListener('pause', () => {
        this.isPlayingMusic = false;
        this.notifyListeners();
      });

      audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      audio.addEventListener('error', (e) => {
        console.warn('Audio playback issue encountered:', e);
      });

      this.audioElement = audio;
    }
    return this.audioElement;
  }

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

  // Automatic user gesture listener: starts playback on the user's first touch or interaction
  private setupAutoplayListener() {
    if (typeof window === 'undefined') return;

    const startAutoplay = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.initCtx();
        if (!this.isPlayingMusic) {
          this.startMusicBox();
        }
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', startAutoplay);
      window.removeEventListener('keydown', startAutoplay);
      window.removeEventListener('touchstart', startAutoplay);
      window.removeEventListener('click', startAutoplay);
    };

    window.addEventListener('pointerdown', startAutoplay, { once: true, passive: true });
    window.addEventListener('keydown', startAutoplay, { once: true, passive: true });
    window.addEventListener('touchstart', startAutoplay, { once: true, passive: true });
    window.addEventListener('click', startAutoplay, { once: true, passive: true });
  }

  // Notify UI subscribers
  private notifyListeners() {
    const currentTrack = this.tracks[this.currentTrackIndex];
    this.stateListeners.forEach((listener) => {
      try {
        listener(this.isPlayingMusic, currentTrack);
      } catch {}
    });
  }

  subscribe(listener: (isPlaying: boolean, track: TrackInfo) => void) {
    this.stateListeners.add(listener);
    listener(this.isPlayingMusic, this.tracks[this.currentTrackIndex]);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  // Real romantic music playback
  startMusicBox() {
    this.initCtx();
    const audio = this.getAudio();
    if (!audio) return;

    const track = this.tracks[this.currentTrackIndex];
    if (!audio.src || audio.src !== track.audioUrl) {
      audio.src = track.audioUrl;
    }
    audio.volume = this.currentVolume;

    audio.play().then(() => {
      this.isPlayingMusic = true;
      this.notifyListeners();
    }).catch((err) => {
      // Browser may block until click/touch
      console.log('Audio autoplay waiting for user interaction:', err);
    });
  }

  stopMusicBox() {
    this.isPlayingMusic = false;
    const audio = this.getAudio();
    if (audio) {
      audio.pause();
    }
    this.notifyListeners();
  }

  toggleMusicBox(onStateChange?: (isPlaying: boolean, trackTitle: string) => void) {
    this.initCtx();
    if (this.isPlayingMusic) {
      this.stopMusicBox();
      if (onStateChange) onStateChange(false, this.tracks[this.currentTrackIndex].title);
    } else {
      this.startMusicBox();
      if (onStateChange) onStateChange(true, this.tracks[this.currentTrackIndex].title);
    }
  }

  selectTrack(indexOrId: number | string) {
    let targetIndex = 0;
    if (typeof indexOrId === 'number') {
      targetIndex = (indexOrId + this.tracks.length) % this.tracks.length;
    } else {
      const idx = this.tracks.findIndex((t) => t.id === indexOrId);
      if (idx !== -1) targetIndex = idx;
    }

    this.currentTrackIndex = targetIndex;
    const track = this.tracks[this.currentTrackIndex];
    const audio = this.getAudio();

    if (audio) {
      audio.src = track.audioUrl;
      audio.currentTime = 0;
      audio.volume = this.currentVolume;
      if (this.isPlayingMusic) {
        audio.play().catch(() => {});
      }
    }
    this.notifyListeners();
    return track;
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    this.selectTrack(nextIdx);
    if (!this.isPlayingMusic) {
      this.startMusicBox();
    }
    return this.tracks[this.currentTrackIndex].title;
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.selectTrack(prevIdx);
    if (!this.isPlayingMusic) {
      this.startMusicBox();
    }
    return this.tracks[this.currentTrackIndex].title;
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  getCurrentTrackTitle() {
    return this.tracks[this.currentTrackIndex].title;
  }

  getIsPlaying() {
    return this.isPlayingMusic;
  }

  setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    const audio = this.getAudio();
    if (audio) {
      audio.volume = this.currentVolume;
    }
    if (this.volumeNode) {
      this.volumeNode.gain.value = this.currentVolume;
    }
  }

  getVolume() {
    return this.currentVolume;
  }

  // Clean note synthesizer used purely for UI sound effects (bells, sparkles, chimes)
  playNote(
    freq: number,
    duration: number = 0.8,
    volumeMultiplier: number = 1.0,
    timbre: 'piano' | 'musicbox' | 'acoustic' = 'musicbox'
  ) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      if (timbre === 'musicbox') {
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18 * volumeMultiplier, now + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      } else {
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.16 * volumeMultiplier, now + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      }

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.volumeNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {}
  }

  // Standard bell sound for UI feedback
  playBell(freq: number, duration: number = 1.0, volume: number = 0.15) {
    this.playNote(freq, duration, volume / 0.15, 'musicbox');
  }

  // Heartbeat sound
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
        const notes = [659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.6, 0.8, 'musicbox'), idx * 75);
        });
      } else if (type === 'open') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.8, 0.8, 'musicbox'), idx * 90);
        });
      } else if (type === 'pop') {
        this.playNote(880, 0.25, 0.9, 'musicbox');
      }
    } catch {}
  }

  // Play a realistic cute lipstick kiss "mwah" sound effect
  playKiss() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;
      const now = this.ctx.currentTime;

      // Soft lip-smack pitch glide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(1350, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.11);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.volumeNode);
      osc.start(now);
      osc.stop(now + 0.13);

      // Sweet romantic sparkle chime trailing the kiss
      setTimeout(() => {
        this.playNote(1046.5, 0.3, 0.45, 'musicbox');
      }, 40);
    } catch {}
  }

  // Romantic ambient soundscapes (Rain, Fireplace, Ocean Waves)
  setAmbientSound(type: 'none' | 'rain' | 'fireplace' | 'waves') {
    this.initCtx();
    if (!this.ctx) return;

    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch {}
      this.ambientSource = null;
    }

    this.currentAmbient = type;
    if (type === 'none') return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'rain') {
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.153852;
          data[i] = (b0 + b1 + b2) * 0.08;
        }
      } else if (type === 'fireplace') {
        for (let i = 0; i < bufferSize; i++) {
          const rumble = (Math.random() * 2 - 1) * 0.04;
          const crackle = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 0.45 : 0;
          data[i] = rumble + crackle;
        }
      } else if (type === 'waves') {
        for (let i = 0; i < bufferSize; i++) {
          const t = i / bufferSize;
          const swell = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
          const noise = (Math.random() * 2 - 1) * 0.05;
          data[i] = noise * swell;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 800 : type === 'fireplace' ? 600 : 500;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.2;

      source.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      source.start();
      this.ambientSource = source;
    } catch {}
  }

  getCurrentAmbient() {
    return this.currentAmbient;
  }
}

export const sound = new SoundEngine();
