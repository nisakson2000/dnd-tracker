// Audio feedback system using Web Audio API
// All sounds are synthesized - no audio files needed

let audioCtx = null;
let volume = 0.3;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function setAudioVolume(v) { volume = Math.max(0, Math.min(1, v)); }
export function getAudioVolume() { return volume; }

function playTone(freq, duration, type = 'sine', vol = volume) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) { /* Web Audio not available */ }
}

export function playDamageSound() {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (_) {}
}

export function playHealSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      gain.gain.setValueAtTime(volume * 0.3, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.25);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.25);
    });
  } catch (_) {}
}

export function playCriticalHitSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Impact
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(300, t);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.1);
    gain1.gain.setValueAtTime(volume * 0.6, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc1.start(t);
    osc1.stop(t + 0.15);
    // Sting
    [880, 1108.73].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + 0.1 + i * 0.05);
      gain.gain.setValueAtTime(volume * 0.2, t + 0.1 + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + i * 0.05 + 0.2);
      osc.start(t + 0.1 + i * 0.05);
      osc.stop(t + 0.1 + i * 0.05 + 0.2);
    });
  } catch (_) {}
}

export function playRollSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      const freq = 300 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, t + i * 0.04);
      gain.gain.setValueAtTime(volume * 0.15, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.06);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.06);
    }
  } catch (_) {}
}

export function playTurnChime() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(783.99, t + 0.1); // G5
    gain.gain.setValueAtTime(volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch (_) {}
}
