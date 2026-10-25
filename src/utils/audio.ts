/**
 * Web Speech API Implementation for Little Hanuman ji.
 * Uses the 'hi-IN' locale with warm, child-friendly pitch and rate modulation
 * for natural, human-like Hinglish and Hindi pronunciation.
 */

import { forestMusic } from './forestMusic';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// -------------------------------------------------------------
// SOUND EFFECTS (Web Audio API)
// -------------------------------------------------------------

export const playSound = {
  click: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  correct: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  },

  wrong: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  },

  star: (index: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const baseFreqs = [784, 987, 1318];
    const freq = baseFreqs[Math.min(index, baseFreqs.length - 1)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  },

  victory: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const chords = [
      { time: 0, notes: [523.25, 659.25, 783.99] },
      { time: 0.18, notes: [587.33, 739.99, 880.0] },
      { time: 0.36, notes: [659.25, 830.61, 987.77] },
      { time: 0.54, notes: [1046.5, 1318.5, 1567.98] },
    ];
    chords.forEach(({ time, notes }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + time;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    });
  },

  gadaSpin: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },
};

// -------------------------------------------------------------
// HINGLISH TO HI-IN SPEECH MAP
// Maps Latin script Hinglish phrases to accurate Hindi phonetic text
// for the browser's hi-IN speech synthesizer.
// -------------------------------------------------------------

const HINGLISH_SPEECH_MAP: Record<string, string> = {
  'Ram Ram bacche! Chalo mere sath Math Magic Land ki yatra par!':
    'राम राम बच्चे! चलो मेरे साथ मैथ मैजिक लैंड की यात्रा पर!',
  'Shabaash! Bilkul sahi jawaab! Jai Bajrangbali!':
    'शाबाश! बिल्कुल सही जवाब! जय बजरंगबली!',
  'Waah! Kya kamaal kiya hai! Bahut badhiya!':
    'वाह! क्या कमाल किया है! बहुत बढ़िया!',
  'Mera pyara dost! Tumhara dimag to bijli jaisa tez hai!':
    'मेरे प्यारे दोस्त! तुम्हारा दिमाग तो बिजली जैसा तेज़ है!',
  'Mera pyara baccha! Tumhara dimag to bijli jaisa tez hai!':
    'मेरे प्यारे बच्चे! तुम्हारा दिमाग तो बिजली जैसा तेज़ है!',
  'Jai Jai Bajrangbali! Agle sawaal ke liye tayyar raho!':
    'जय जय बजरंगबली! अगले सवाल के लिए तैयार रहो!',
  'Koi baat nahi, ek baar aur koshish karo! Tum kar sakte ho!':
    'कोई बात नहीं, एक बार और कोशिश करो! तुम कर सकते हो!',
  'Galti se hi to hum seekhte hain! Himmat bilkul mat haarna!':
    'गलती से ही तो हम सीखते हैं! हिम्मत बिल्कुल मत हारना!',
  'Fikr mat karo dost! Thoda sa aur dhyan do, tum jeetoge!':
    'फिक्र मत करो दोस्त! थोड़ा सा और ध्यान दो, तुम जीतोगे!',
  'Socho socho! Dhyan se number dekho aur sahi option chun lo!':
    'सोचो सोचो! ध्यान से नंबर देखो और सही ऑप्शन चुन लो!',
  'Chalo naya sawaal solve karte hain! Dhyan se padho!':
    'चलो नया सवाल सॉल्व करते हैं! ध्यान से पढ़ो!',
  'Socho socho! Dekhte hain kaun pehle sahi jawaab deta hai!':
    'सोचो सोचो! देखते हैं कौन पहले सही जवाब देता है!',
  'Arey waah, yeh sawaal bohot mazedaar hai!':
    'अरे वाह! यह सवाल बहुत मज़ेदार है!',
  'Waah! Tumne bohot achha khela!':
    'वाह! तुमने बहुत अच्छा खेला!',
  'Waah! Tumne bohot achha khela! Tum to poore 3 Star Champion ho! Jai Bajrangbali!':
    'वाह! तुमने बहुत अच्छा खेला! तुम तो पूरे तीन स्टार चैंपियन हो! जय बजरंगबली!',
  'Waah! Tumne bohot achha khela! Shabash mere sher, aise hi aage badhte raho!':
    'वाह! तुमने बहुत अच्छा खेला! शाबाश मेरे शेर, ऐसे ही आगे बढ़ते रहो!',
  'Waah! Tumne bohot achha khela! Agli baar tum aur bhi zyada stars jeetoge!':
    'वाह! तुमने बहुत अच्छा खेला! अगली बार तुम और भी ज़्यादा स्टार्स जीतोगे!',
  'Pehle ones column ko dhyan se dekho, phir aage badho dost!':
    'पहले वन्स कॉलम को ध्यान से देखो, फिर आगे बढ़ो दोस्त!',
};

// -------------------------------------------------------------
// WEB SPEECH API: VOICE CACHE & hi-IN RESOLVER
// -------------------------------------------------------------

let cachedHiVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const available = window.speechSynthesis.getVoices();
    if (available.length > 0) {
      voicesLoaded = true;
      resolve(available);
      return;
    }

    // Wait for voiceschanged event
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      voicesLoaded = true;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Timeout fallback in 500ms
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

export async function getBestHindiVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedHiVoice) return cachedHiVoice;
  const voices = await loadVoices();

  // 1. Strictly look for hi-IN voice (Google हिन्दी, Microsoft Swara / Madhur / Kalpana / Hemant, Lekha)
  const hiInVoice = voices.find(
    (v) =>
      v.lang === 'hi-IN' ||
      v.lang === 'hi_IN' ||
      v.lang.toLowerCase() === 'hi-in' ||
      v.lang.toLowerCase().startsWith('hi')
  );
  if (hiInVoice) {
    cachedHiVoice = hiInVoice;
    return hiInVoice;
  }

  // 2. Look for name containing Hindi
  const hindiNamedVoice = voices.find((v) => v.name.toLowerCase().includes('hindi'));
  if (hindiNamedVoice) {
    cachedHiVoice = hindiNamedVoice;
    return hindiNamedVoice;
  }

  // 3. Indian English fallback (en-IN) which handles Indian accents gracefully
  const indianEnVoice = voices.find(
    (v) =>
      v.lang === 'en-IN' ||
      v.lang === 'en_IN' ||
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('neerja') ||
      v.name.toLowerCase().includes('prabhat')
  );
  if (indianEnVoice) {
    cachedHiVoice = indianEnVoice;
    return indianEnVoice;
  }

  // 4. Default first available voice
  if (voices.length > 0) {
    cachedHiVoice = voices[0];
    return voices[0];
  }

  return null;
}

// Preload voices immediately on module load
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
}

/**
 * Speaks text using the Web Speech API with the 'hi-IN' locale.
 * Uses child-friendly rate (0.92) and pitch (1.25) for a warm Little Hanuman persona.
 */
export async function speakDialogue(
  text: string,
  enabled = true,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const trimmedText = text.trim();
  if (!trimmedText) {
    if (onEnd) onEnd();
    return;
  }

  // Resolve best voice for hi-IN
  const voice = await getBestHindiVoice();

  // Pick Hindi pronunciation text if mapped, else speak the input
  const speechText = HINGLISH_SPEECH_MAP[trimmedText] || trimmedText;

  const utterance = new SpeechSynthesisUtterance(speechText);

  // Configure 'hi-IN' locale as explicitly mandated
  utterance.lang = 'hi-IN';

  if (voice) {
    utterance.voice = voice;
    // If the voice is specifically Indian English, use the original Hinglish script
    if (voice.lang.startsWith('en')) {
      utterance.text = trimmedText;
      utterance.lang = 'en-IN';
    }
  }

  // Warm, cheerful, and child-friendly speech parameters
  utterance.rate = 0.92; // Slightly relaxed, clear pace for Class 1-3 kids
  utterance.pitch = 1.25; // Youthful, playful, warm Bal Hanuman voice
  utterance.volume = 1.0;

  utterance.onstart = () => {
    forestMusic.duck(true);
    if (onStart) onStart();
  };

  utterance.onend = () => {
    forestMusic.duck(false);
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    forestMusic.duck(false);
    console.warn('Web Speech API utterance error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export { forestMusic } from './forestMusic';

/**
 * Returns diagnostic info about the active Web Speech API voice.
 */
export async function getVoiceInfo(): Promise<{ voiceName: string; lang: string }> {
  const voice = await getBestHindiVoice();
  if (voice) {
    return { voiceName: voice.name, lang: voice.lang };
  }
  return { voiceName: 'Default System Voice', lang: 'hi-IN' };
}
