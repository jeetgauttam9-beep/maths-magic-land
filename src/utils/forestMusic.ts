/**
 * Procedural Web Audio API Background Music Generator
 * Theme: Light, cheerful, enchanted forest melody for Little Hanuman's Math Magic Land.
 * Uses soft wooden kalimba, bamboo flute, and gentle chime synthesis.
 */

let musicCtx: AudioContext | null = null;
let musicMasterGain: GainNode | null = null;
let duckingGain: GainNode | null = null;
let isPlaying = false;
let currentStep = 0;
let loopTimer: number | null = null;
let userVolume = 0.4; // 0 to 1 scale

function getMusicContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!musicCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      musicCtx = new AudioContextClass();
    }
  }
  if (musicCtx && musicCtx.state === 'suspended') {
    musicCtx.resume();
  }
  return musicCtx;
}

// Pentatonic frequencies (Hz) for light cheerful forest feel
const NOTE = {
  C3: 130.81,
  G3: 196.0,
  A3: 220.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
};

// 16-step cheerful forest melody pattern
interface NoteEvent {
  flute?: number;
  kalimba?: number;
  bass?: number;
  bell?: number;
}

const MELODY_PATTERN: NoteEvent[] = [
  // Measure 1
  { flute: NOTE.G4, bass: NOTE.C3, kalimba: NOTE.C4 },
  { kalimba: NOTE.E4 },
  { kalimba: NOTE.G4 },
  { flute: NOTE.C5, kalimba: NOTE.E4 },
  // Measure 2
  { kalimba: NOTE.A4, bass: NOTE.G3 },
  { flute: NOTE.G4, kalimba: NOTE.E4 },
  { kalimba: NOTE.D4 },
  { flute: NOTE.E4, bell: NOTE.E5 },
  // Measure 3
  { flute: NOTE.A4, bass: NOTE.A3, kalimba: NOTE.C4 },
  { kalimba: NOTE.E4 },
  { flute: NOTE.C5, kalimba: NOTE.A4 },
  { flute: NOTE.D5, kalimba: NOTE.C5 },
  // Measure 4
  { flute: NOTE.E5, bass: NOTE.G3, kalimba: NOTE.G4 },
  { flute: NOTE.D5, kalimba: NOTE.E4 },
  { kalimba: NOTE.D4 },
  { flute: NOTE.C5, bell: NOTE.C5, bass: NOTE.C3 },
];

/**
 * Play a warm wooden kalimba/marimba note
 */
function playKalimba(ctx: AudioContext, dest: AudioNode, freq: number, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  // Quick plucked attack, warm organic decay
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + 0.36);
}

/**
 * Play a soft bamboo flute note with gentle breathy vibrato
 */
function playFlute(ctx: AudioContext, dest: AudioNode, freq: number, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);

  // Soft attack and lingering sustain
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + 0.52);
}

/**
 * Play a light forest chime / bell
 */
function playBell(ctx: AudioContext, dest: AudioNode, freq: number, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.09, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + 0.82);
}

/**
 * Play a gentle acoustic bass pluck
 */
function playBass(ctx: AudioContext, dest: AudioNode, freq: number, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.15, time + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + 0.62);
}

function scheduleNextStep() {
  if (!isPlaying) return;
  const ctx = getMusicContext();
  if (!ctx || !duckingGain) return;

  const now = ctx.currentTime;
  const stepData = MELODY_PATTERN[currentStep];

  if (stepData.kalimba) {
    playKalimba(ctx, duckingGain, stepData.kalimba, now);
  }
  if (stepData.flute) {
    playFlute(ctx, duckingGain, stepData.flute, now);
  }
  if (stepData.bell) {
    playBell(ctx, duckingGain, stepData.bell, now);
  }
  if (stepData.bass) {
    playBass(ctx, duckingGain, stepData.bass, now);
  }

  currentStep = (currentStep + 1) % MELODY_PATTERN.length;

  // Step duration in ms (108 BPM eighth notes = ~277ms)
  const stepDurationMs = 280;
  loopTimer = window.setTimeout(scheduleNextStep, stepDurationMs);
}

export const forestMusic = {
  start: () => {
    if (isPlaying) return;
    const ctx = getMusicContext();
    if (!ctx) return;

    if (!musicMasterGain) {
      musicMasterGain = ctx.createGain();
      musicMasterGain.gain.setValueAtTime(userVolume * 0.5, ctx.currentTime);
      musicMasterGain.connect(ctx.destination);
    }

    if (!duckingGain) {
      duckingGain = ctx.createGain();
      duckingGain.gain.setValueAtTime(1.0, ctx.currentTime);
      duckingGain.connect(musicMasterGain);
    }

    isPlaying = true;
    currentStep = 0;
    scheduleNextStep();
  },

  stop: () => {
    isPlaying = false;
    if (loopTimer !== null) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
  },

  toggle: (force?: boolean): boolean => {
    const nextState = force !== undefined ? force : !isPlaying;
    if (nextState) {
      forestMusic.start();
    } else {
      forestMusic.stop();
    }
    return isPlaying;
  },

  setVolume: (volume: number) => {
    userVolume = Math.max(0, Math.min(1, volume));
    if (musicMasterGain && musicCtx) {
      musicMasterGain.gain.linearRampToValueAtTime(
        userVolume * 0.5,
        musicCtx.currentTime + 0.05
      );
    }
  },

  getVolume: (): number => userVolume,

  isPlaying: (): boolean => isPlaying,

  // Duck music volume when dialogue or sound effect plays
  duck: (ducked = true) => {
    if (!duckingGain || !musicCtx) return;
    const target = ducked ? 0.25 : 1.0;
    duckingGain.gain.cancelScheduledValues(musicCtx.currentTime);
    duckingGain.gain.linearRampToValueAtTime(target, musicCtx.currentTime + 0.15);
  },
};
