import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MOOD_CONFIG = {
  combat: {
    label: 'Combat',
    emoji: '\u2694\uFE0F',
    gradient: 'radial-gradient(ellipse at center, transparent 50%, rgba(239,68,68,0.15) 100%)',
    chipColor: '#ef4444',
    animation: null,
  },
  exploration: {
    label: 'Exploration',
    emoji: '\uD83C\uDF32',
    gradient: 'radial-gradient(ellipse at center, transparent 50%, rgba(74,222,128,0.12) 100%)',
    chipColor: '#4ade80',
    animation: null,
  },
  social: {
    label: 'Social',
    emoji: '\uD83D\uDDE3\uFE0F',
    gradient: 'radial-gradient(ellipse at center, transparent 55%, rgba(96,165,250,0.10) 100%)',
    chipColor: '#60a5fa',
    animation: null,
  },
  mystery: {
    label: 'Mystery',
    emoji: '\uD83D\uDD2E',
    gradient: 'radial-gradient(ellipse at center, transparent 45%, rgba(192,132,252,0.14) 100%)',
    chipColor: '#c084fc',
    animation: null,
  },
  danger: {
    label: 'Danger',
    emoji: '\u26A0\uFE0F',
    gradient: 'radial-gradient(ellipse at center, transparent 45%, rgba(249,115,22,0.16) 100%)',
    chipColor: '#f97316',
    animation: 'moodDangerPulse 3s ease-in-out infinite',
  },
  celebration: {
    label: 'Celebration',
    emoji: '\uD83C\uDF89',
    gradient: 'radial-gradient(ellipse at center, transparent 55%, rgba(234,179,8,0.10) 100%)',
    chipColor: '#eab308',
    animation: null,
    border: true,
  },
  calm: {
    label: 'Calm',
    emoji: '\uD83C\uDF19',
    gradient: 'radial-gradient(ellipse at center, transparent 55%, rgba(45,212,191,0.10) 100%)',
    chipColor: '#2dd4bf',
    animation: null,
  },
};

// Simple oscillator-based ambient sound generators
const AMBIENT_GENERATORS = {
  tavern: (ctx) => {
    // Warm low hum + gentle noise
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start();
    return { nodes: [osc, gain, filter], stop: () => osc.stop() };
  },
  forest: (ctx) => {
    // Soft white noise filtered to sound like rustling
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.04;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    return { nodes: [source, filter, gain], stop: () => source.stop() };
  },
  dungeon: (ctx) => {
    // Deep, resonant low drone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 58;
    const gain = ctx.createGain();
    gain.gain.value = 0.04;
    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain);
    osc.start();
    osc2.start();
    return { nodes: [osc, osc2, gain], stop: () => { osc.stop(); osc2.stop(); } };
  },
  storm: (ctx) => {
    // White noise with LFO modulation
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    return { nodes: [source, filter, gain, lfo, lfoGain], stop: () => { source.stop(); lfo.stop(); } };
  },
  battle: (ctx) => {
    // Rhythmic low pulse
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 40;
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(ctx.destination);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    const gain = ctx.createGain();
    gain.gain.value = 0.04;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start();
    lfo.start();
    return { nodes: [osc, filter, gain, lfo, lfoGain], stop: () => { osc.stop(); lfo.stop(); } };
  },
  ocean: (ctx) => {
    // Filtered noise with slow LFO for wave effect
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    return { nodes: [source, filter, gain, lfo, lfoGain], stop: () => { source.stop(); lfo.stop(); } };
  },
  campfire: (ctx) => {
    // Warm crackle: filtered noise + low tone
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.95 ? 1 : 0.1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    // Add warm undertone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 120;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.015;
    osc.connect(oscGain).connect(ctx.destination);
    osc.start();
    return { nodes: [source, filter, gain, osc, oscGain], stop: () => { source.stop(); osc.stop(); } };
  },
  city: (ctx) => {
    // Low rumble + mid noise
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 65;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.025;
    osc.connect(oscGain).connect(ctx.destination);
    osc.start();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.3;
    const gain = ctx.createGain();
    gain.gain.value = 0.02;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    return { nodes: [osc, oscGain, source, filter, gain], stop: () => { osc.stop(); source.stop(); } };
  },
  cave: (ctx) => {
    // Deep reverberant drone with drip-like clicks
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 45;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 47;
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain);
    osc.start();
    osc2.start();
    return { nodes: [osc, osc2, gain], stop: () => { osc.stop(); osc2.stop(); } };
  },
};

// Inject CSS keyframes for mood animations
const MOOD_STYLES = `
@keyframes moodDangerPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes moodCelebrationShimmer {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}
`;

export default function MoodOverlay({ mood, ambient }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [chipExpanded, setChipExpanded] = useState(false);
  const audioCtxRef = useRef(null);
  const activeAmbientRef = useRef(null);
  const masterGainRef = useRef(null);

  const config = mood ? MOOD_CONFIG[mood] : null;

  // Inject keyframe styles once
  useEffect(() => {
    const id = 'mood-overlay-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = MOOD_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Set up / tear down ambient audio
  const stopAmbient = useCallback(() => {
    if (activeAmbientRef.current) {
      try { activeAmbientRef.current.stop(); } catch (_) {}
      activeAmbientRef.current = null;
    }
  }, []);

  useEffect(() => {
    stopAmbient();

    if (!ambient || muted) return;

    const generator = AMBIENT_GENERATORS[ambient];
    if (!generator) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Create master gain if needed
      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.connect(ctx.destination);
      }

      // Temporarily redirect destination through master gain
      const origDest = ctx.destination;
      const result = generator({
        ...ctx,
        destination: masterGainRef.current,
        createOscillator: () => ctx.createOscillator(),
        createGain: () => ctx.createGain(),
        createBiquadFilter: () => ctx.createBiquadFilter(),
        createBuffer: (c, l, r) => ctx.createBuffer(c, l, r),
        createBufferSource: () => ctx.createBufferSource(),
        sampleRate: ctx.sampleRate,
      });
      masterGainRef.current.gain.value = volume;
      activeAmbientRef.current = result;
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[MoodOverlay] Audio error:', e);
    }

    return () => stopAmbient();
  }, [ambient, muted, stopAmbient]);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (_) {}
        audioCtxRef.current = null;
      }
    };
  }, [stopAmbient]);

  if (!mood && !ambient) return null;

  return (
    <>
      {/* Vignette overlay - no pointer events so it doesn't block interaction */}
      {config && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
            background: config.gradient,
            animation: config.animation || 'none',
            transition: 'background 0.8s ease',
          }}
        />
      )}

      {/* Celebration border shimmer */}
      {mood === 'celebration' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
            border: '2px solid rgba(234,179,8,0.2)',
            borderRadius: 0,
            boxShadow: 'inset 0 0 30px rgba(234,179,8,0.08)',
            animation: 'moodCelebrationShimmer 4s ease-in-out infinite',
          }}
        />
      )}

      {/* Mood indicator chip - interactive */}
      <div
        onClick={() => setChipExpanded(!chipExpanded)}
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: chipExpanded ? 8 : 0,
          background: 'rgba(20,18,15,0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${config?.chipColor || 'rgba(255,255,255,0.1)'}40`,
          borderRadius: 10,
          padding: chipExpanded ? '10px 12px' : '6px 12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
      >
        {/* Main chip row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {config && (
            <span style={{ fontSize: 13 }}>{config.emoji}</span>
          )}
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: config?.chipColor || '#e8d9b5',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.03em',
          }}>
            {config?.label || ''}
          </span>
          {ambient && (
            <span style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.35)',
              marginLeft: 4,
              textTransform: 'capitalize',
            }}>
              {ambient}
            </span>
          )}
        </div>

        {/* Expanded controls */}
        {chipExpanded && ambient && (
          <div
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <button
              onClick={() => setMuted(!muted)}
              style={{
                background: 'none',
                border: 'none',
                color: muted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{
                width: 80,
                height: 3,
                appearance: 'none',
                WebkitAppearance: 'none',
                background: `linear-gradient(to right, ${config?.chipColor || '#e8d9b5'} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
                borderRadius: 2,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', minWidth: 24, textAlign: 'right' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>
    </>
  );
}
