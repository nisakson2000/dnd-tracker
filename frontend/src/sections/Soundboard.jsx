import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Play, Pause, Music, Save, Trash2, X,
  Flame, Swords, TreePine, Skull, CloudLightning, Waves, Tent, Building2,
  ChevronDown, ChevronUp, RotateCcw,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   Ambient Soundboard — procedural audio via Web Audio API
   No external audio files needed.
   ══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'codex_soundboard_presets';
const MASTER_VOL_KEY = 'codex_soundboard_master';

/* ── Helpers ── */
function loadPresets() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function savePresets(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* */ }
}

/* ── Color palette per channel ── */
const CHANNEL_COLORS = {
  tavern:  '#f59e0b',
  combat:  '#ef4444',
  forest:  '#22c55e',
  dungeon: '#8b5cf6',
  storm:   '#6366f1',
  ocean:   '#06b6d4',
  camp:    '#f97316',
  city:    '#a78bfa',
};

const CHANNEL_ICONS = {
  tavern:  Flame,
  combat:  Swords,
  forest:  TreePine,
  dungeon: Skull,
  storm:   CloudLightning,
  ocean:   Waves,
  camp:    Tent,
  city:    Building2,
};

const CHANNEL_LABELS = {
  tavern:  'Tavern',
  combat:  'Combat',
  forest:  'Forest',
  dungeon: 'Dungeon',
  storm:   'Storm',
  ocean:   'Ocean',
  camp:    'Campfire',
  city:    'City',
};

const CHANNEL_IDS = ['tavern', 'combat', 'forest', 'dungeon', 'storm', 'ocean', 'camp', 'city'];

/* ── Quick-scene presets ── */
const QUICK_SCENES = [
  { name: 'Cozy Tavern',    config: { tavern: 0.8, camp: 0.3 } },
  { name: 'Dark Dungeon',   config: { dungeon: 0.9, storm: 0.15 } },
  { name: 'Forest Journey',  config: { forest: 0.8, camp: 0.2 } },
  { name: 'Stormy Night',   config: { storm: 0.9, tavern: 0.2 } },
  { name: 'Battle!',        config: { combat: 1.0 } },
  { name: 'Ocean Voyage',   config: { ocean: 0.9, storm: 0.25 } },
];

const FADE_MS = 500;

/* ══════════════════════════════════════════════════════════
   Audio Engine — procedural sound synthesis
   ══════════════════════════════════════════════════════════ */

function createNoiseBuffer(ctx, type = 'white', duration = 2) {
  const sr = ctx.sampleRate;
  const len = sr * duration;
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  if (type === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  } else if (type === 'brown') {
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  }
  return buf;
}

/* Each builder returns { nodes: [...], gain: GainNode } where gain is the channel output */
function buildTavern(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // warm low hum
  const hum = ctx.createOscillator(); hum.type = 'sine'; hum.frequency.value = 85;
  const humG = ctx.createGain(); humG.gain.value = 0.12; hum.connect(humG); humG.connect(gain); hum.start();
  // murmur — filtered brown noise
  const murmurBuf = createNoiseBuffer(ctx, 'brown', 2);
  const murmur = ctx.createBufferSource(); murmur.buffer = murmurBuf; murmur.loop = true;
  const murmurF = ctx.createBiquadFilter(); murmurF.type = 'bandpass'; murmurF.frequency.value = 300; murmurF.Q.value = 0.8;
  const murmurG = ctx.createGain(); murmurG.gain.value = 0.18;
  murmur.connect(murmurF); murmurF.connect(murmurG); murmurG.connect(gain); murmur.start();
  // crackle — filtered white noise
  const crackleBuf = createNoiseBuffer(ctx, 'white', 2);
  const crackle = ctx.createBufferSource(); crackle.buffer = crackleBuf; crackle.loop = true;
  const crackleF = ctx.createBiquadFilter(); crackleF.type = 'highpass'; crackleF.frequency.value = 800;
  const crackleG = ctx.createGain(); crackleG.gain.value = 0.04;
  crackle.connect(crackleF); crackleF.connect(crackleG); crackleG.connect(gain); crackle.start();
  return { nodes: [hum, murmur, crackle], gain };
}

function buildCombat(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // tension drone
  const drone = ctx.createOscillator(); drone.type = 'sawtooth'; drone.frequency.value = 55;
  const droneF = ctx.createBiquadFilter(); droneF.type = 'lowpass'; droneF.frequency.value = 200;
  const droneG = ctx.createGain(); droneG.gain.value = 0.15;
  drone.connect(droneF); droneF.connect(droneG); droneG.connect(gain); drone.start();
  // rapid drumbeat via oscillator with LFO amplitude modulation
  const drum = ctx.createOscillator(); drum.type = 'sine'; drum.frequency.value = 80;
  const drumLfo = ctx.createOscillator(); drumLfo.type = 'square'; drumLfo.frequency.value = 3;
  const drumLfoG = ctx.createGain(); drumLfoG.gain.value = 0.15;
  const drumG = ctx.createGain(); drumG.gain.value = 0;
  drumLfo.connect(drumLfoG); drumLfoG.connect(drumG.gain);
  drum.connect(drumG); drumG.connect(gain); drum.start(); drumLfo.start();
  // high tension
  const tens = ctx.createOscillator(); tens.type = 'sine'; tens.frequency.value = 220;
  const tensG = ctx.createGain(); tensG.gain.value = 0.04;
  tens.connect(tensG); tensG.connect(gain); tens.start();
  return { nodes: [drone, drum, drumLfo, tens], gain };
}

function buildForest(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // wind — filtered pink noise
  const windBuf = createNoiseBuffer(ctx, 'pink', 2);
  const wind = ctx.createBufferSource(); wind.buffer = windBuf; wind.loop = true;
  const windF = ctx.createBiquadFilter(); windF.type = 'lowpass'; windF.frequency.value = 600;
  const windG = ctx.createGain(); windG.gain.value = 0.2;
  wind.connect(windF); windF.connect(windG); windG.connect(gain); wind.start();
  // bird chirps — high freq oscillator pulses
  const bird = ctx.createOscillator(); bird.type = 'sine'; bird.frequency.value = 2200;
  const birdLfo = ctx.createOscillator(); birdLfo.type = 'square'; birdLfo.frequency.value = 1.5;
  const birdLfoG = ctx.createGain(); birdLfoG.gain.value = 0.03;
  const birdG = ctx.createGain(); birdG.gain.value = 0;
  birdLfo.connect(birdLfoG); birdLfoG.connect(birdG.gain);
  bird.connect(birdG); birdG.connect(gain); bird.start(); birdLfo.start();
  // second bird (different pitch)
  const bird2 = ctx.createOscillator(); bird2.type = 'sine'; bird2.frequency.value = 3400;
  const bird2Lfo = ctx.createOscillator(); bird2Lfo.type = 'square'; bird2Lfo.frequency.value = 0.7;
  const bird2LfoG = ctx.createGain(); bird2LfoG.gain.value = 0.02;
  const bird2G = ctx.createGain(); bird2G.gain.value = 0;
  bird2Lfo.connect(bird2LfoG); bird2LfoG.connect(bird2G.gain);
  bird2.connect(bird2G); bird2G.connect(gain); bird2.start(); bird2Lfo.start();
  return { nodes: [wind, bird, birdLfo, bird2, bird2Lfo], gain };
}

function buildDungeon(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // deep reverberant drone
  const drone = ctx.createOscillator(); drone.type = 'sine'; drone.frequency.value = 42;
  const droneG = ctx.createGain(); droneG.gain.value = 0.2;
  drone.connect(droneG); droneG.connect(gain); drone.start();
  // sub-harmonic
  const sub = ctx.createOscillator(); sub.type = 'triangle'; sub.frequency.value = 63;
  const subG = ctx.createGain(); subG.gain.value = 0.08;
  sub.connect(subG); subG.connect(gain); sub.start();
  // dripping — short high blips
  const drip = ctx.createOscillator(); drip.type = 'sine'; drip.frequency.value = 1600;
  const dripLfo = ctx.createOscillator(); dripLfo.type = 'square'; dripLfo.frequency.value = 0.4;
  const dripLfoG = ctx.createGain(); dripLfoG.gain.value = 0.05;
  const dripG = ctx.createGain(); dripG.gain.value = 0;
  dripLfo.connect(dripLfoG); dripLfoG.connect(dripG.gain);
  drip.connect(dripG); dripG.connect(gain); drip.start(); dripLfo.start();
  return { nodes: [drone, sub, drip, dripLfo], gain };
}

function buildStorm(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // rain — filtered white noise
  const rainBuf = createNoiseBuffer(ctx, 'white', 2);
  const rain = ctx.createBufferSource(); rain.buffer = rainBuf; rain.loop = true;
  const rainF = ctx.createBiquadFilter(); rainF.type = 'bandpass'; rainF.frequency.value = 1000; rainF.Q.value = 0.5;
  const rainG = ctx.createGain(); rainG.gain.value = 0.25;
  rain.connect(rainF); rainF.connect(rainG); rainG.connect(gain); rain.start();
  // low rumble
  const rumble = ctx.createOscillator(); rumble.type = 'sine'; rumble.frequency.value = 35;
  const rumbleLfo = ctx.createOscillator(); rumbleLfo.type = 'sine'; rumbleLfo.frequency.value = 0.15;
  const rumbleLfoG = ctx.createGain(); rumbleLfoG.gain.value = 0.1;
  const rumbleG = ctx.createGain(); rumbleG.gain.value = 0.05;
  rumbleLfo.connect(rumbleLfoG); rumbleLfoG.connect(rumbleG.gain);
  rumble.connect(rumbleG); rumbleG.connect(gain); rumble.start(); rumbleLfo.start();
  return { nodes: [rain, rumble, rumbleLfo], gain };
}

function buildOcean(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // ocean waves — filtered noise with slow LFO sweep
  const waveBuf = createNoiseBuffer(ctx, 'pink', 2);
  const wave = ctx.createBufferSource(); wave.buffer = waveBuf; wave.loop = true;
  const waveF = ctx.createBiquadFilter(); waveF.type = 'lowpass'; waveF.frequency.value = 500;
  const waveLfo = ctx.createOscillator(); waveLfo.type = 'sine'; waveLfo.frequency.value = 0.08;
  const waveLfoG = ctx.createGain(); waveLfoG.gain.value = 300;
  waveLfo.connect(waveLfoG); waveLfoG.connect(waveF.frequency);
  const waveG = ctx.createGain(); waveG.gain.value = 0.3;
  wave.connect(waveF); waveF.connect(waveG); waveG.connect(gain); wave.start(); waveLfo.start();
  // foam hiss
  const foamBuf = createNoiseBuffer(ctx, 'white', 2);
  const foam = ctx.createBufferSource(); foam.buffer = foamBuf; foam.loop = true;
  const foamF = ctx.createBiquadFilter(); foamF.type = 'highpass'; foamF.frequency.value = 3000;
  const foamG = ctx.createGain(); foamG.gain.value = 0.03;
  foam.connect(foamF); foamF.connect(foamG); foamG.connect(gain); foam.start();
  return { nodes: [wave, waveLfo, foam], gain };
}

function buildCamp(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // fire crackle — brown noise + pops
  const fireBuf = createNoiseBuffer(ctx, 'brown', 2);
  const fire = ctx.createBufferSource(); fire.buffer = fireBuf; fire.loop = true;
  const fireF = ctx.createBiquadFilter(); fireF.type = 'bandpass'; fireF.frequency.value = 500; fireF.Q.value = 1.2;
  const fireG = ctx.createGain(); fireG.gain.value = 0.2;
  fire.connect(fireF); fireF.connect(fireG); fireG.connect(gain); fire.start();
  // pops
  const popBuf = createNoiseBuffer(ctx, 'white', 2);
  const pop = ctx.createBufferSource(); pop.buffer = popBuf; pop.loop = true;
  const popF = ctx.createBiquadFilter(); popF.type = 'highpass'; popF.frequency.value = 2000;
  const popLfo = ctx.createOscillator(); popLfo.type = 'square'; popLfo.frequency.value = 0.5;
  const popLfoG = ctx.createGain(); popLfoG.gain.value = 0.02;
  const popG = ctx.createGain(); popG.gain.value = 0;
  popLfo.connect(popLfoG); popLfoG.connect(popG.gain);
  pop.connect(popF); popF.connect(popG); popG.connect(gain); pop.start(); popLfo.start();
  // crickets — high oscillator
  const cricket = ctx.createOscillator(); cricket.type = 'sine'; cricket.frequency.value = 4200;
  const cricketLfo = ctx.createOscillator(); cricketLfo.type = 'square'; cricketLfo.frequency.value = 7;
  const cricketLfoG = ctx.createGain(); cricketLfoG.gain.value = 0.015;
  const cricketG = ctx.createGain(); cricketG.gain.value = 0;
  cricketLfo.connect(cricketLfoG); cricketLfoG.connect(cricketG.gain);
  cricket.connect(cricketG); cricketG.connect(gain); cricket.start(); cricketLfo.start();
  return { nodes: [fire, pop, popLfo, cricket, cricketLfo], gain };
}

function buildCity(ctx, dest) {
  const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(dest);
  // ambient noise floor
  const noiseBuf = createNoiseBuffer(ctx, 'pink', 2);
  const noise = ctx.createBufferSource(); noise.buffer = noiseBuf; noise.loop = true;
  const noiseF = ctx.createBiquadFilter(); noiseF.type = 'lowpass'; noiseF.frequency.value = 800;
  const noiseG = ctx.createGain(); noiseG.gain.value = 0.15;
  noise.connect(noiseF); noiseF.connect(noiseG); noiseG.connect(gain); noise.start();
  // distant sounds — muted tone wobble
  const tone = ctx.createOscillator(); tone.type = 'triangle'; tone.frequency.value = 180;
  const toneLfo = ctx.createOscillator(); toneLfo.type = 'sine'; toneLfo.frequency.value = 0.3;
  const toneLfoG = ctx.createGain(); toneLfoG.gain.value = 30;
  toneLfo.connect(toneLfoG); toneLfoG.connect(tone.frequency);
  const toneG = ctx.createGain(); toneG.gain.value = 0.04;
  tone.connect(toneG); toneG.connect(gain); tone.start(); toneLfo.start();
  // murmur
  const murmurBuf = createNoiseBuffer(ctx, 'brown', 2);
  const murmur = ctx.createBufferSource(); murmur.buffer = murmurBuf; murmur.loop = true;
  const murmurF = ctx.createBiquadFilter(); murmurF.type = 'bandpass'; murmurF.frequency.value = 400; murmurF.Q.value = 0.6;
  const murmurG = ctx.createGain(); murmurG.gain.value = 0.06;
  murmur.connect(murmurF); murmurF.connect(murmurG); murmurG.connect(gain); murmur.start();
  return { nodes: [noise, tone, toneLfo, murmur], gain };
}

const BUILDERS = { tavern: buildTavern, combat: buildCombat, forest: buildForest, dungeon: buildDungeon, storm: buildStorm, ocean: buildOcean, camp: buildCamp, city: buildCity };

/* ══════════════════════════════════════════════════════════
   Mini Waveform Canvas
   ══════════════════════════════════════════════════════════ */

function WaveformCanvas({ analyser, color, playing }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!playing || !analyser) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const c = canvasRef.current;
      if (c) { const cx = c.getContext('2d'); cx.clearRect(0, 0, c.width, c.height); }
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    const bufLen = analyser.frequencyBinCount;
    const dataArr = new Uint8Array(bufLen);

    function draw() {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArr);
      cx.clearRect(0, 0, canvas.width, canvas.height);
      cx.lineWidth = 1.5;
      cx.strokeStyle = color;
      cx.beginPath();
      const sliceW = canvas.width / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = dataArr[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
        x += sliceW;
      }
      cx.lineTo(canvas.width, canvas.height / 2);
      cx.stroke();
    }
    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [analyser, color, playing]);

  return <canvas ref={canvasRef} width={80} height={24} style={{ display: 'block', borderRadius: 4, opacity: playing ? 1 : 0.2, transition: 'opacity 0.3s' }} />;
}

/* ══════════════════════════════════════════════════════════
   Main Soundboard Component
   ══════════════════════════════════════════════════════════ */

export default function Soundboard() {
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const channelsRef = useRef({});  // { [id]: { gain, analyser, nodes } }
  const [playing, setPlaying] = useState({});       // { [id]: bool }
  const [volumes, setVolumes] = useState(() => {
    const init = {};
    CHANNEL_IDS.forEach(id => { init[id] = 0.7; });
    return init;
  });
  const [masterVol, setMasterVol] = useState(() => {
    try { return parseFloat(localStorage.getItem(MASTER_VOL_KEY)) || 0.7; }
    catch { return 0.7; }
  });
  const [presets, setPresets] = useState(loadPresets);
  const [presetName, setPresetName] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [showScenes, setShowScenes] = useState(true);

  /* ── Initialize AudioContext lazily on first interaction ── */
  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.value = masterVol;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterGainRef.current = master;
    return ctx;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      Object.values(channelsRef.current).forEach(ch => {
        ch.nodes.forEach(n => { try { n.stop(); } catch { /* */ } });
      });
      if (ctxRef.current) { try { ctxRef.current.close(); } catch { /* */ } }
    };
  }, []);

  /* ── Persist master volume ── */
  useEffect(() => {
    localStorage.setItem(MASTER_VOL_KEY, String(masterVol));
    if (masterGainRef.current) masterGainRef.current.gain.value = masterVol;
  }, [masterVol]);

  /* ── Start channel ── */
  const startChannel = useCallback((id, overrideVol) => {
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();
    // If already playing, skip
    if (channelsRef.current[id]) return;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    // Build the sound chain
    const { nodes, gain } = BUILDERS[id](ctx, analyser);
    analyser.connect(masterGainRef.current);
    // Fade in — use overrideVol when provided to avoid stale closure
    const vol = overrideVol !== undefined ? overrideVol : volumes[id];
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + FADE_MS / 1000);
    channelsRef.current[id] = { gain, analyser, nodes };
    setPlaying(prev => ({ ...prev, [id]: true }));
  }, [ensureCtx, volumes]);

  /* ── Stop channel ── */
  const stopChannel = useCallback((id) => {
    const ch = channelsRef.current[id];
    if (!ch) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    // Fade out
    ch.gain.gain.setValueAtTime(ch.gain.gain.value, ctx.currentTime);
    ch.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_MS / 1000);
    setTimeout(() => {
      ch.nodes.forEach(n => { try { n.stop(); } catch { /* */ } });
      delete channelsRef.current[id];
    }, FADE_MS + 50);
    setPlaying(prev => ({ ...prev, [id]: false }));
  }, []);

  /* ── Toggle ── */
  const toggleChannel = useCallback((id) => {
    if (playing[id]) stopChannel(id); else startChannel(id);
  }, [playing, startChannel, stopChannel]);

  /* ── Volume change ── */
  const setChannelVolume = useCallback((id, val) => {
    setVolumes(prev => ({ ...prev, [id]: val }));
    const ch = channelsRef.current[id];
    if (ch && ctxRef.current) {
      ch.gain.gain.setValueAtTime(ch.gain.gain.value, ctxRef.current.currentTime);
      ch.gain.gain.linearRampToValueAtTime(val, ctxRef.current.currentTime + 0.05);
    }
  }, []);

  /* ── Stop all ── */
  const stopAll = useCallback(() => {
    CHANNEL_IDS.forEach(id => { if (playing[id]) stopChannel(id); });
  }, [playing, stopChannel]);

  /* ── Apply a scene / preset config ── */
  const applyConfig = useCallback((config) => {
    // Stop channels not in config
    CHANNEL_IDS.forEach(id => {
      if (!config[id] && playing[id]) stopChannel(id);
    });
    // Start/adjust channels in config
    Object.entries(config).forEach(([id, vol]) => {
      setVolumes(prev => ({ ...prev, [id]: vol }));
      if (!playing[id]) {
        // We need to start after volume is set; use a micro-delay
        setTimeout(() => startChannel(id, vol), 10);
      } else {
        const ch = channelsRef.current[id];
        if (ch && ctxRef.current) {
          ch.gain.gain.linearRampToValueAtTime(vol, ctxRef.current.currentTime + 0.15);
        }
      }
    });
  }, [playing, startChannel, stopChannel]);

  /* ── Save preset ── */
  const savePreset = useCallback(() => {
    if (!presetName.trim()) return;
    const config = {};
    CHANNEL_IDS.forEach(id => { if (playing[id]) config[id] = volumes[id]; });
    if (Object.keys(config).length === 0) return;
    const newPresets = [...presets, { name: presetName.trim(), config }];
    setPresets(newPresets);
    savePresets(newPresets);
    setPresetName('');
  }, [presetName, playing, volumes, presets]);

  const deletePreset = useCallback((idx) => {
    const newPresets = presets.filter((_, i) => i !== idx);
    setPresets(newPresets);
    savePresets(newPresets);
  }, [presets]);

  /* ── Count active channels ── */
  const activeCount = useMemo(() => CHANNEL_IDS.filter(id => playing[id]).length, [playing]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Music size={20} style={{ color: '#c4b5fd' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(18px * var(--font-scale, 1))', fontWeight: 700, color: 'var(--text)' }}>
            Ambient Soundboard
          </span>
          {activeCount > 0 && (
            <span style={{ fontSize: 10, background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 4, padding: '1px 8px', fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
              {activeCount} active
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeCount > 0 && (
            <button
              onClick={stopAll}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            >
              <VolumeX size={13} /> Stop All
            </button>
          )}
        </div>
      </div>

      {/* Master Volume */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Volume2 size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', fontWeight: 500, minWidth: 90 }}>Master Volume</span>
        <input
          type="range" min="0" max="1" step="0.01" value={masterVol}
          onChange={e => setMasterVol(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#c4b5fd', cursor: 'pointer' }}
        />
        <span style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'right' }}>
          {Math.round(masterVol * 100)}%
        </span>
      </div>

      {/* Quick Scenes */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setShowScenes(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', padding: '4px 0', marginBottom: 8 }}
        >
          {showScenes ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Quick Scenes
        </button>
        <AnimatePresence>
          {showScenes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8, overflow: 'hidden' }}
            >
              {QUICK_SCENES.map(scene => (
                <button
                  key={scene.name}
                  onClick={() => applyConfig(scene.config)}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    border: '1px solid rgba(139,92,246,0.2)',
                    background: 'rgba(139,92,246,0.06)',
                    color: '#d4bcfd', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
                >
                  {scene.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Channel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
        {CHANNEL_IDS.map(id => {
          const Icon = CHANNEL_ICONS[id];
          const color = CHANNEL_COLORS[id];
          const isPlaying = !!playing[id];
          const ch = channelsRef.current[id];
          return (
            <motion.div
              key={id}
              layout
              style={{
                background: isPlaying ? `rgba(255,255,255,0.04)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isPlaying ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                borderLeft: `3px solid ${isPlaying ? color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10,
                padding: '14px 16px',
                transition: 'all 0.3s',
                boxShadow: isPlaying ? `0 0 20px ${color}15` : 'none',
              }}
            >
              {/* Channel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                    ...(isPlaying ? { boxShadow: `0 0 12px ${color}30` } : {}),
                  }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isPlaying ? 'var(--text)' : 'var(--text-dim)', fontFamily: 'var(--font-ui)', transition: 'color 0.3s' }}>
                      {CHANNEL_LABELS[id]}
                    </div>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: 9, color: color, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        Playing
                      </motion.div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleChannel(id)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: isPlaying ? `${color}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isPlaying ? color + '40' : 'rgba(255,255,255,0.1)'}`,
                    color: isPlaying ? color : 'var(--text-dim)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = isPlaying ? `${color}30` : 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isPlaying ? `${color}20` : 'rgba(255,255,255,0.05)'; }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 1 }} />}
                </button>
              </div>

              {/* Waveform */}
              <div style={{ marginBottom: 8, minHeight: 24 }}>
                <WaveformCanvas analyser={ch?.analyser || null} color={color} playing={isPlaying} />
              </div>

              {/* Volume slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VolumeX size={11} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={volumes[id]}
                  onChange={e => setChannelVolume(id, parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: color, cursor: 'pointer', height: 4 }}
                />
                <Volume2 size={11} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', minWidth: 28, textAlign: 'right' }}>
                  {Math.round(volumes[id] * 100)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Save Preset */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Save size={14} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>Save Current Mix as Preset</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') savePreset(); }}
            placeholder="Preset name..."
            maxLength={40}
            style={{
              flex: 1, padding: '7px 12px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text)', fontSize: 12,
              fontFamily: 'var(--font-ui)', outline: 'none',
            }}
          />
          <button
            onClick={savePreset}
            disabled={!presetName.trim() || activeCount === 0}
            style={{
              padding: '7px 16px', borderRadius: 6,
              background: activeCount > 0 && presetName.trim() ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: activeCount > 0 && presetName.trim() ? '#c4b5fd' : 'var(--text-mute)',
              fontSize: 11, fontWeight: 600, cursor: activeCount > 0 && presetName.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Saved Presets */}
      {presets.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px' }}>
          <button
            onClick={() => setShowPresets(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', padding: 0, marginBottom: showPresets ? 10 : 0, width: '100%' }}
          >
            {showPresets ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Saved Presets ({presets.length})
          </button>
          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                {presets.map((preset, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                      onClick={() => applyConfig(preset.config)}
                      style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', color: 'var(--text)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-ui)', padding: 0 }}
                    >
                      {preset.name}
                    </button>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Object.keys(preset.config).map(chId => {
                        const ChIcon = CHANNEL_ICONS[chId];
                        return ChIcon ? <ChIcon key={chId} size={11} style={{ color: CHANNEL_COLORS[chId], opacity: 0.7 }} /> : null;
                      })}
                    </div>
                    <button
                      onClick={() => deletePreset(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-mute)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fca5a5'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-mute)'; }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer note */}
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
        All sounds generated procedurally via Web Audio API — no downloads required
      </div>
    </div>
  );
}
