import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Users, Wifi, WifiOff, Copy, Check, LogIn, LogOut, Crown, Heart, Shield, RefreshCw, Signal, AlertTriangle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAppMode } from '../contexts/ModeContext';
import { useParty } from '../contexts/PartyContext';

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
  if (!member?.character) return null;
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
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
            {isDead ? '\uD83D\uDC80 Down' : `${hp} / ${maxHp}`}
          </span>
        </div>
        <div className="party-mini-bar" role="progressbar" aria-label={`${character.name || 'Unknown'} HP: ${hp} of ${maxHp}`} aria-valuenow={hp} aria-valuemin={0} aria-valuemax={maxHp}>
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

// ─── Party Stats Overview (DM Host) ──────────────────────────────────────

function PartyStatsOverview({ members }) {
  if (!members || members.length === 0) return null;

  const withHp = members.filter(m => m.character && m.character.max_hp > 0);
  const totalSize = members.length;

  if (withHp.length === 0) return null;

  const hpPercentages = withHp.map(m => (m.character.hp / m.character.max_hp) * 100);
  const avgHpPct = Math.round(hpPercentages.reduce((a, b) => a + b, 0) / hpPercentages.length);

  let lowestMember = withHp[0];
  let lowestPct = 100;
  withHp.forEach(m => {
    const pct = (m.character.hp / m.character.max_hp) * 100;
    if (pct < lowestPct) { lowestPct = pct; lowestMember = m; }
  });
  lowestPct = Math.round(lowestPct);

  const levels = members.filter(m => m.character?.level).map(m => m.character.level);
  const minLevel = levels.length > 0 ? Math.min(...levels) : '?';
  const maxLevel = levels.length > 0 ? Math.max(...levels) : '?';
  const levelRange = minLevel === maxLevel ? `${minLevel}` : `${minLevel}\u2013${maxLevel}`;

  const avgColor = avgHpPct <= 25 ? '#ef4444' : avgHpPct <= 50 ? '#eab308' : '#4ade80';
  const lowestColor = lowestPct <= 0 ? '#ef4444' : lowestPct <= 25 ? '#f87171' : lowestPct <= 50 ? '#eab308' : '#4ade80';

  const statCardStyle = {
    borderRadius: 8, padding: '10px 12px',
    background: 'rgba(11,9,20,0.6)', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0,
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.5)', marginBottom: 8, fontFamily: 'var(--font-ui, Outfit, sans-serif)' }}>
        Party Overview
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <div style={statCardStyle}>
          <Activity size={14} style={{ color: avgColor }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: avgColor, fontFamily: 'Cinzel, Georgia, serif', lineHeight: 1 }}>{avgHpPct}%</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Avg HP</div>
        </div>
        <div style={statCardStyle}>
          <AlertTriangle size={14} style={{ color: lowestColor }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: lowestColor, fontFamily: 'Cinzel, Georgia, serif', lineHeight: 1.2, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {lowestMember.character?.name?.split(' ')[0] || '?'}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            Lowest ({lowestPct}%)
          </div>
        </div>
        <div style={statCardStyle}>
          <Shield size={14} style={{ color: 'rgba(147,197,253,0.7)' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(147,197,253,0.9)', fontFamily: 'Cinzel, Georgia, serif', lineHeight: 1 }}>{levelRange}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Level Range</div>
        </div>
        <div style={statCardStyle}>
          <Users size={14} style={{ color: 'rgba(201,168,76,0.7)' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(201,168,76,0.9)', fontFamily: 'Cinzel, Georgia, serif', lineHeight: 1 }}>{totalSize}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Party Size</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Party({ characterId, character, onBugReport }) {
  const { mode: appMode } = useAppMode();
  const party = useParty();
  const {
    wsStatus: status, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId, autoSync,
    setJoinIp, setJoinInput, setAutoSync,
    connect, sendUpdate, handleHost, handleLeave,
    onBugReportRef,
  } = party;

  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Wire up the bug report callback
  useEffect(() => {
    onBugReportRef.current = onBugReport;
  }, [onBugReport, onBugReportRef]);

  const charSnapshot = useMemo(() => ({
    id: characterId,
    name: character?.name || 'Unknown',
    race: character?.race || '',
    primary_class: character?.primary_class || '',
    level: character?.level || 1,
    hp: character?.current_hp ?? character?.max_hp ?? 0,
    max_hp: character?.max_hp ?? 0,
    ac: character?.armor_class ?? 10,
  }), [characterId, character?.name, character?.race, character?.primary_class, character?.level, character?.current_hp, character?.max_hp, character?.armor_class]);

  // Connect when room code + mode are ready
  useEffect(() => {
    if (roomCode && mode) connect(charSnapshot);
  }, [roomCode, mode, connect, charSnapshot]);

  // Auto-sync when any tracked character stat changes
  const prevStatsRef = useRef(null);
  useEffect(() => {
    if (status !== 'connected' || !autoSync) return;
    const key = `${character?.current_hp}|${character?.max_hp}|${character?.armor_class}|${character?.level}|${character?.name}|${character?.race}|${character?.primary_class}`;
    if (prevStatsRef.current === key) return;
    prevStatsRef.current = key;
    sendUpdate(charSnapshot);
  }, [
    status, autoSync, sendUpdate,
    character?.current_hp, character?.max_hp, character?.armor_class,
    character?.level, character?.name, character?.race, character?.primary_class,
  ]);

  const handleJoin = () => {
    const code = joinInput.trim().toUpperCase();
    const ip = joinIp.trim();
    if (!ip) { toast.error('Enter the host\'s IP address'); return; }
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip) || ip.split('.').some(n => parseInt(n) > 255)) { toast.error('Enter a valid IP address (e.g. 192.168.1.5)'); return; }
    if (code.length < 4) { toast.error('Enter the 4-character room code'); return; }
    party.setRoomCode(code);
    party.setMode('join');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(`${roomCode} \u00B7 ${hostIp}`);
      setCopied(true);
      toast.success(`Copied: ${roomCode} \u00B7 ${hostIp}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  // ── Lobby ─────────────────────────────────────────────────────────────────
  const isDM = appMode === 'dm';
  const isPlayer = appMode === 'player';

  if (!mode) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
            <Users size={20} /> Party Connect
          </h2>
          <p className="text-sm text-amber-200/40 mt-1.5">
            {isDM
              ? 'Host a session so your players can join and sync their characters in real-time.'
              : 'Join your DM\'s party session to sync your character live \u2014 over your local network.'}
          </p>
        </div>

        <div className="card border-gold/15 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60">How it works</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Crown, label: isDM ? 'You host a room' : 'DM hosts a room', sub: isDM ? 'You get a code + IP' : 'Gets a code + IP' },
              { icon: Users, label: isDM ? 'Players join with your code' : 'You join with IP & code', sub: 'On the same WiFi' },
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

        {/* DM Mode: Host only */}
        {isDM && (
          <button onClick={handleHost} className="card border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all text-left group cursor-pointer w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Crown size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-display text-amber-100 group-hover:text-gold transition-colors">Host a Session</div>
                <div className="text-xs text-amber-200/40">Create a new room for your players</div>
              </div>
            </div>
            <p className="text-xs text-amber-200/40 leading-relaxed">
              Start a party room. Share your IP and room code with your players. Everyone on the same WiFi can join instantly.
            </p>
          </button>
        )}

        {/* Player Mode: Join only */}
        {isPlayer && (
          <div className="card border-amber-200/10 hover:border-amber-200/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <LogIn size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="font-display text-amber-100">Join Your DM's Session</div>
                <div className="text-xs text-amber-200/40">Enter the IP and room code your DM gave you</div>
              </div>
            </div>
            <div className="space-y-2">
              <input
                className="input w-full text-sm"
                placeholder="Host IP (e.g. 192.168.1.5)"
                value={joinIp}
                onChange={e => setJoinIp(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-center tracking-[0.2em] font-mono text-sm uppercase"
                  placeholder="ABCD"
                  maxLength={4}
                  value={joinInput}
                  onChange={e => setJoinInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
                <button onClick={handleJoin} disabled={joinInput.length < 4 || !joinIp.trim()} className="btn-primary text-xs px-3 disabled:opacity-30">
                  Join
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-amber-200/25 border border-amber-200/8 rounded p-3">
          <Wifi size={13} className="shrink-0 mt-0.5" />
          <span>All players must be on the <strong className="text-amber-200/40">same WiFi or local network</strong> as the host. Windows may ask to allow network access the first time \u2014 click <strong className="text-amber-200/40">Allow</strong>.</span>
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
          <button onClick={() => setShowLeaveConfirm(true)} className="btn-secondary text-xs flex items-center gap-1.5 px-2.5 py-1.5 text-red-400/70 hover:text-red-400 border-red-400/20 hover:border-red-400/40">
            <LogOut size={12} /> Leave
          </button>
        </div>
      </div>

      {roomCode && (
        <div className="bg-[#0d0d12] border border-gold/20 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-200/40">Room code</span>
              <span className="font-mono text-2xl font-bold text-gold tracking-[0.25em]">{roomCode}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-200/30">{members.length} player{members.length !== 1 ? 's' : ''}</span>
              <button onClick={copyCode} className="flex items-center gap-1.5 text-xs text-amber-200/50 hover:text-amber-200 border border-amber-200/15 hover:border-amber-200/30 rounded px-2.5 py-1.5 transition-colors" aria-label="Copy room code and IP">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          {mode === 'host' && hostIp && hostIp !== 'localhost' && (
            <div className="mt-2 pt-2 border-t border-amber-200/8 flex items-center gap-2">
              <Wifi size={12} className="text-amber-200/30" />
              <span className="text-xs text-amber-200/40">Your IP:</span>
              <span className="font-mono text-sm text-amber-100 font-semibold">{hostIp}</span>
              <span className="text-xs text-amber-200/25">\u2014 share this with your players</span>
            </div>
          )}
        </div>
      )}

      {status === 'disconnected' && !mode && (
        <div className="card border-red-400/20 bg-red-400/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-400/80"><WifiOff size={16} /> Connection lost</div>
          <button onClick={() => connect(charSnapshot)} className="btn-secondary text-xs border-red-400/30 text-red-400">Reconnect</button>
        </div>
      )}

      {/* Party Stats Overview — DM host only, when there are connected members */}
      {mode === 'host' && isDM && status === 'connected' && members.length > 1 && (
        <PartyStatsOverview members={otherMembers} />
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
          <p className="text-xs text-amber-200/20">Share code <span className="font-mono text-gold/60">{roomCode}</span> and IP <span className="font-mono text-gold/60">{hostIp}</span> with your players</p>
        </div>
      ) : null}

      {status === 'connected' && (
        <div className="flex items-center justify-between text-xs text-amber-200/30 pt-1 border-t border-amber-200/8">
          <span>Auto-sync HP/AC when you take damage</span>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setAutoSync(v => !v)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAutoSync(v => !v); } }}
            tabIndex={0}
            role="switch"
            aria-checked={autoSync}
            aria-label="Auto-sync HP/AC"
          >
            <div className={`w-8 h-4 rounded-full transition-colors relative ${autoSync ? 'bg-gold/40' : 'bg-amber-200/10'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white/80 transition-all ${autoSync ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className={autoSync ? 'text-gold/60' : ''}>{autoSync ? 'On' : 'Off'}</span>
          </div>
        </div>
      )}

      <ConfirmDialog
        show={showLeaveConfirm}
        title={mode === 'host' ? 'End Party Session?' : 'Leave Party?'}
        message={mode === 'host' ? 'This will disconnect all players and end the session.' : 'You will be disconnected from the party.'}
        onConfirm={() => { setShowLeaveConfirm(false); handleLeave(); }}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  );
}
