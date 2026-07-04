/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Safe browser Web Audio API synthesizer for cinematic AAA detective atmosphere
let audioCtx: AudioContext | null = null;
let rainNode: AudioNode | null = null;
let rainGain: GainNode | null = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate procedurally synthesized rain sound
export function startAmbientRain() {
  try {
    const ctx = getContext();
    if (rainNode) return; // Already running

    // 1. Create a White Noise Buffer
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // 2. Create Noise Source
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // 3. Create Bandpass Filter to mold noise into rain patter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    // 4. Create Lowpass Filter for soft deep thunderous background feel
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, ctx.currentTime);

    // 5. Modulation Node for wind/rain gusts
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);

    // Connect nodes
    whiteNoise.connect(filter);
    filter.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);

    // Start playing
    whiteNoise.start(0);

    rainNode = whiteNoise;
    rainGain = gain;

    // Subtle LFO modulation of rain volume for natural wind gusts
    const lfoInterval = setInterval(() => {
      if (!rainGain || !audioCtx) {
        clearInterval(lfoInterval);
        return;
      }
      const t = audioCtx.currentTime;
      const targetVolume = 0.02 + Math.random() * 0.04;
      rainGain.gain.linearRampToValueAtTime(targetVolume, t + 1.8);
    }, 2000);

  } catch (err) {
    console.warn('Procedural rain synth failed to engage:', err);
  }
}

export function stopAmbientRain() {
  if (rainNode) {
    try {
      (rainNode as AudioBufferSourceNode).stop();
    } catch (e) {}
    rainNode = null;
    rainGain = null;
  }
}

// Synthesize police radio static burst
export function playRadioBurst() {
  try {
    const ctx = getContext();
    const duration = 0.3 + Math.random() * 0.4;
    
    // Create short static noise
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  } catch (e) {}
}

// Play holographic scanner sweep sound
export function playScannerSweep() {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.8);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(5, ctx.currentTime); // LFO
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(30, ctx.currentTime);

    osc2.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {}
}

// Play typewriting tick
export function playTypewriterTick() {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

// Play successful system beep
export function playSuccessBeep() {
  try {
    const ctx = getContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
    osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.12); // C6

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}
