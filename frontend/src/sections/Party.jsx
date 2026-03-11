import { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Wifi, WifiOff, Copy, Check, LogIn, LogOut, Crown, Heart, Shield, RefreshCw, Signal } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';

const PARTY_PORT = 8787;

// ─── WebSocket hook ──────────────────────────────────────────────────────────

function usePartySocket({ roomCode, character, onMembers, onJoined, onUpdated, onLeft }) {
  const wsRef = useRef(null);
  const [status, setStatus] = useState('disconnected');
  const pingIntervalRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (!roomCode) return;
    setStatus('connecting');
    const ws = new WebSocket(`ws://localhost:${PARTY_PORT}/party/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      ws.send(JSON.stringify({ type: 'join', room: roomCode, character }));
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping', room: roomCode }));
      }, 25000);
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'welcome') onMembers(msg.members, msg.you);
        else if (msg.type === 'joined') onJoined(msg.member);
        else if (msg.type === 'updated') onUpdated(msg.member);
        else if (msg.type === 'left') onLeft(msg.client_id);
        else if (msg.type === 'error') toast.error(msg.message);
      } catch { /* ignore parse errors */ }
    };
    ws.onclose = () => { setStatus('disconnected'); clearInterval(pingIntervalRef.current); wsRef.current = null; };
    ws.onerror = () => { setStatus('disconnected'); };
  }, [roomCode, character]);

  const disconnect = useCallback(() => {
    clearInterval(pingIntervalRef.current);
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  const sendUpdate = useCallback((char) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && roomCode)
      wsRef.current.send(JSON.stringify({ type: 'update', room: roomCode, character: char }));
  }, [roomCode]);

  useEffect(() => () => disconnect(), [disconnect]);
  return { status, connect, disconnect, sendUpdate };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#c9a84c', '#6d9eeb', '#e06666', '#93c47d', '#c27ba0', '#8e7cc3', '#76a5af', '#f6b26b',
];

function hpColor(hp, maxHp) {
  if (!maxHp) return 'rgba(255,255,255,0.25)';
  const pct = hp / maxHp;
  if (pct <= 0) return '#ef4444';
  if (pct <= 0.25) return '#f87171';
  if (pct <= 0.5) return '#eab308';
  return '#4ade80';
}

function hpBarColor(hp, maxHp) {
  if (!maxHp) return 'rgba(255,255,255,0.1)';
  const pct = hp / maxHp;
  if (pct <= 0) return '#dc2626';
  if (pct <= 0.25) return '#f87171';
  if (pct <= 0.5) return '#eab308';
  return '#4ade80';
}

// ─── Member card ─────────────────────────────────────────────────────────────

function MemberCard({ member, isYou, colorIndex = 0 }) {
  const { character } = member;
  const hp = character.hp ?? 0;
  const maxHp = character.max_hp ?? 0;
  const hpPct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  const isDead = maxHp > 0 && hp <= 0;
  const accent = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <div className={`party-card${isYou ? ' is-you' : ''}`} style={isDead ? { opacity: 0.6 } : undefined}>
      <div className="party-card-header">
        <div className="party-card-avatar" style={{ background: `${accent}22`, borderColor: `${accent}55`, color: accent }}>
          {(character.name || '?')[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', color: '#e8d9b5', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {character.name || 'Unknown'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif' }}>
            {[character.race, character.primary_class].filter(Boolean).join(' ')}
            {character.level ? ` · Lv ${character.level}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(147,197,253,0.8)', flexShrink: 0 }}>
          <Shield size={12} />
          <span style={{ fontWeight: 700 }}>{character.ac ?? '—'}</span>
        </div>
      </div>
      <div className="party-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            <Heart size={11} /> HP
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: hpColor(hp, maxHp), fontFamily: 'Outfit, sans-serif' }}>
            {isDead ? '💀 Down' : `${hp} / ${maxHp}`}
          </span>
        </div>
        <div className="party-mini-bar">
          <div className="party-mini-bar-fill" style={{ width: `${hpPct}%`, background: hpBarColor(hp, maxHp) }} />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' :
        status === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-amber-200/20'
      }`} />
      <span className={status === 'connected' ? 'text-emerald-400' : status === 'connecting' ? 'text-yellow-400' : 'text-amber-200/30'}>
        {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting\u2026' : 'Disconnected'}
      </span>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Party({ characterId, character }) {
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [members, setMembers] = useState([]);
  const [myClientId, setMyClientId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const charSnapshot = {
    id: characterId,
    name: character?.name || 'Unknown',
    race: character?.race || '',
    primary_class: character?.primary_class || '',
    level: character?.level || 1,
    hp: character?.current_hp ?? character?.max_hp ?? 0,
    max_hp: character?.max_hp ?? 0,
    ac: character?.armor_class ?? 10,
  };

  const handleMembers = useCallback((list, youId) => { setMembers(list); setMyClientId(youId); }, []);
  const handleJoined = useCallback((member) => {
    setMembers(prev => prev.find(m => m.client_id === member.client_id) ? prev : [...prev, member]);
    toast.success(`${member.character?.name || 'Someone'} joined the party!`, { icon: '\u2694\uFE0F' });
  }, []);
  const handleUpdated = useCallback((member) => {
    setMembers(prev => prev.map(m => m.client_id === member.client_id ? member : m));
  }, []);
  const handleLeft = useCallback((clientId) => {
    setMembers(prev => {
      const leaving = prev.find(m => m.client_id === clientId);
      if (leaving) toast(`${leaving.character?.name || 'Someone'} left the party`, { icon: '\uD83D\uDC4B' });
      return prev.filter(m => m.client_id !== clientId);
    });
  }, []);

  const { status, connect, disconnect, sendUpdate } = usePartySocket({
    roomCode, character: charSnapshot,
    onMembers: handleMembers, onJoined: handleJoined, onUpdated: handleUpdated, onLeft: handleLeft,
  });

  useEffect(() => {
    if (status === 'connected' && autoSync) sendUpdate(charSnapshot);
  }, [character?.current_hp, character?.max_hp, character?.armor_class, character?.level]);

  const handleHost = async () => {
    try {
      // Start the embedded party server (auto-starts if not running)
      await invoke('start_party_server');
      const res = await fetch(`http://localhost:${PARTY_PORT}/party/rooms`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      setRoomCode(data.room_code);
      setMode('host');
    } catch {
      toast.error('Could not create party server');
    }
  };

  const handleJoin = () => {
    const code = joinInput.trim().toUpperCase();
    if (code.length < 4) { toast.error('Enter the 4-character room code'); return; }
    setRoomCode(code);
    setMode('join');
  };

  useEffect(() => { if (roomCode && mode) connect(); }, [roomCode, mode]);

  const handleLeave = async () => {
    disconnect();
    if (mode === 'host') {
      try { await invoke('stop_party_server'); } catch { /* ignore */ }
    }
    setMode(null); setRoomCode(''); setJoinInput(''); setMembers([]); setMyClientId(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Lobby ─────────────────────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
            <Users size={20} /> Party Connect
          </h2>
          <p className="text-sm text-amber-200/40 mt-1.5">
            See your whole party's HP, AC, and status live \u2014 over your local network. No internet needed.
          </p>
        </div>

        <div className="card border-gold/15 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60">How it works</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Crown, label: 'Host creates a room', sub: 'Gets a 4-char code' },
              { icon: Users, label: 'Players join the code', sub: 'On the same WiFi' },
              { icon: Signal, label: 'Stats sync live', sub: 'HP & AC update in real time' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="space-y-2">
                <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
                  <Icon size={16} className="text-gold/70" />
                </div>
                <div className="text-xs text-amber-100 font-medium">{label}</div>
                <div className="text-[11px] text-amber-200/30">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleHost} className="card border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all text-left group cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Crown size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-display text-amber-100 group-hover:text-gold transition-colors">Host a Session</div>
                <div className="text-xs text-amber-200/40">Create a new room</div>
              </div>
            </div>
            <p className="text-xs text-amber-200/40 leading-relaxed">
              Start a party room. Share the 4-char code with your players. Everyone on the same WiFi can join instantly.
            </p>
          </button>

          <div className="card border-amber-200/10 hover:border-amber-200/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <LogIn size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="font-display text-amber-100">Join a Session</div>
                <div className="text-xs text-amber-200/40">Enter room code</div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1 text-center tracking-[0.2em] font-mono text-sm uppercase"
                placeholder="ABCD"
                maxLength={4}
                value={joinInput}
                onChange={e => setJoinInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
              <button onClick={handleJoin} disabled={joinInput.length < 4} className="btn-primary text-xs px-3 disabled:opacity-30">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-200/25 border border-amber-200/8 rounded p-3">
          <Wifi size={13} className="shrink-0 mt-0.5" />
          <span>All players must be on the <strong className="text-amber-200/40">same WiFi or local network</strong> as the machine running The Codex. No cloud, no account required.</span>
        </div>
      </div>
    );
  }

  // ── Active session ────────────────────────────────────────────────────────
  const otherMembers = members.filter(m => m.client_id !== myClientId);
  const me = members.find(m => m.client_id === myClientId);

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
            <Users size={20} /> Party
            {mode === 'host' && <span className="text-xs bg-gold/20 text-gold border border-gold/30 rounded px-2 py-0.5 ml-1">HOST</span>}
          </h2>
          <StatusDot status={status} />
        </div>
        <div className="flex items-center gap-2">
          {status === 'connected' && (
            <button onClick={() => sendUpdate(charSnapshot)} className="btn-secondary text-xs flex items-center gap-1.5 px-2.5 py-1.5">
              <RefreshCw size={12} /> Sync
            </button>
          )}
          <button onClick={handleLeave} className="btn-secondary text-xs flex items-center gap-1.5 px-2.5 py-1.5 text-red-400/70 hover:text-red-400 border-red-400/20 hover:border-red-400/40">
            <LogOut size={12} /> Leave
          </button>
        </div>
      </div>

      {roomCode && (
        <div className="flex items-center justify-between bg-[#0d0d12] border border-gold/20 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-200/40">Room code</span>
            <span className="font-mono text-2xl font-bold text-gold tracking-[0.25em]">{roomCode}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-200/30">{members.length} player{members.length !== 1 ? 's' : ''}</span>
            <button onClick={copyCode} className="flex items-center gap-1.5 text-xs text-amber-200/50 hover:text-amber-200 border border-amber-200/15 hover:border-amber-200/30 rounded px-2.5 py-1.5 transition-colors">
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {status === 'disconnected' && (
        <div className="card border-red-400/20 bg-red-400/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-400/80"><WifiOff size={16} /> Connection lost</div>
          <button onClick={connect} className="btn-secondary text-xs border-red-400/30 text-red-400">Reconnect</button>
        </div>
      )}

      {me && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-200/30 mb-2">Your Character</h3>
          <MemberCard member={me} isYou={true} />
        </div>
      )}

      {otherMembers.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-200/30 mb-2">Party Members ({otherMembers.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherMembers.map((member, i) => <MemberCard key={member.client_id} member={member} isYou={false} colorIndex={i + 1} />)}
          </div>
        </div>
      ) : status === 'connected' ? (
        <div className="card border-dashed border-amber-200/10 text-center py-10">
          <Users size={28} className="mx-auto text-amber-200/20 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">Waiting for party members\u2026</p>
          <p className="text-xs text-amber-200/20">Share code <span className="font-mono text-gold/60">{roomCode}</span> with your players</p>
        </div>
      ) : null}

      {status === 'connected' && (
        <div className="flex items-center justify-between text-xs text-amber-200/30 pt-1 border-t border-amber-200/8">
          <span>Auto-sync HP/AC when you take damage</span>
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => setAutoSync(v => !v)}>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${autoSync ? 'bg-gold/40' : 'bg-amber-200/10'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white/80 transition-all ${autoSync ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className={autoSync ? 'text-gold/60' : ''}>{autoSync ? 'On' : 'Off'}</span>
          </label>
        </div>
      )}
    </div>
  );
}
