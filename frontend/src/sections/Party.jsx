import { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Wifi, WifiOff, Copy, Check, LogIn, LogOut, Crown, Heart, Shield, RefreshCw, Signal, AlertTriangle, Activity, Eye, Sparkles, ChevronDown, ChevronUp, Swords, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAppMode } from '../contexts/ModeContext';
import { useParty } from '../contexts/PartyContext';
import { modStr } from '../utils/dndHelpers';

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
  const [expanded, setExpanded] = useState(false);
  if (!member?.character) return null;
  const { character } = member;
  const hp = character.hp ?? 0;
  const maxHp = character.max_hp ?? 0;
  const hpPct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  const isDead = maxHp > 0 && hp <= 0;
  const accent = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const abilities = character.ability_scores || {};
  const saves = character.saving_throws || {};
  const conditions = character.conditions || [];
  const ExpandIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <div
      className={`party-card${isYou ? ' is-you' : ''}`}
      role="button"
      aria-expanded={expanded}
      aria-label={`${character.name || 'Unknown'} - click to ${expanded ? 'collapse' : 'expand'} details`}
      tabIndex={0}
      style={{ ...(isDead ? { opacity: 0.6 } : {}), cursor: 'pointer', transition: 'border-color 0.15s' }}
      onClick={() => setExpanded(e => !e)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(ex => !ex); } }}
    >
      <div className="party-card-header">
        <div className="party-card-avatar" style={{ background: `${accent}22`, borderColor: `${accent}55`, color: accent }}>
          {(character.name || '?')[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div title={character.name || 'Unknown'} style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', color: '#e8d9b5', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {character.name || 'Unknown'}
          </div>
          <div title={[character.race, character.primary_class].filter(Boolean).join(' ') + (character.level ? ` · Lv ${character.level}` : '')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {[character.race, character.primary_class].filter(Boolean).join(' ')}
            {character.level ? ` \u00B7 Lv ${character.level}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(147,197,253,0.8)' }}>
            <Shield size={12} />
            <span style={{ fontWeight: 700 }}>{character.ac ?? '\u2014'}</span>
          </div>
          <ExpandIcon size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
        </div>
      </div>
      <div className="party-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            <Heart size={11} /> HP
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: hpColor(hp, maxHp), fontFamily: 'Outfit, sans-serif' }}>
            {isDead ? '\uD83D\uDC80 Down' : `${hp} / ${maxHp}`}
            {(character.temp_hp ?? 0) > 0 && <span style={{ color: 'rgba(96,165,250,0.8)', marginLeft: 4 }}>+{character.temp_hp} temp</span>}
          </span>
        </div>
        <div className="party-mini-bar" role="progressbar" aria-label={`${character.name || 'Unknown'} HP: ${hp} of ${maxHp}`} aria-valuenow={hp} aria-valuemin={0} aria-valuemax={maxHp}>
          <div className="party-mini-bar-fill" style={{ width: `${hpPct}%`, background: hpBarColor(hp, maxHp) }} />
        </div>
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px 6px', display: 'flex', flexDirection: 'column', gap: 10 }} onClick={e => e.stopPropagation()}>
          {/* Ability Scores */}
          {Object.keys(abilities).length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.5)', marginBottom: 5 }}>
                Ability Scores
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(stat => (
                  <div key={stat} style={{
                    textAlign: 'center', padding: '4px 0', borderRadius: 6,
                    background: 'rgba(255,255,255,0.03)', border: saves[stat] ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', marginBottom: 2 }}>{stat}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: saves[stat] ? '#4ade80' : '#e8d9b5', fontFamily: 'Outfit, sans-serif' }}>
                      {modStr(abilities[stat] ?? 0)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(74,222,128,0.4)', marginTop: 3 }}>
                Green border = saving throw proficiency
              </div>
            </div>
          )}

          {/* Quick Stats Row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {character.passive_perception != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', borderRadius: 5, padding: '3px 8px' }}>
                <Eye size={10} /> PP {character.passive_perception}
              </div>
            )}
            {character.spell_save_dc != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(167,139,250,0.7)', background: 'rgba(167,139,250,0.08)', borderRadius: 5, padding: '3px 8px' }}>
                <Zap size={10} /> Spell DC {character.spell_save_dc}
              </div>
            )}
            {character.proficiency_bonus != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(201,168,76,0.6)', background: 'rgba(201,168,76,0.08)', borderRadius: 5, padding: '3px 8px' }}>
                <Swords size={10} /> Prof {modStr(character.proficiency_bonus)}
              </div>
            )}
            {character.inspiration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(251,191,36,0.8)', background: 'rgba(251,191,36,0.1)', borderRadius: 5, padding: '3px 8px' }}>
                <Sparkles size={10} /> Inspired
              </div>
            )}
          </div>

          {/* Active Conditions */}
          {conditions.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(239,68,68,0.5)', marginBottom: 4 }}>
                Conditions
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {conditions.map((c, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5', fontWeight: 500,
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Speed & Languages */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {character.speed != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(74,222,128,0.6)', background: 'rgba(74,222,128,0.08)', borderRadius: 5, padding: '3px 8px' }}>
                Speed {character.speed} ft
              </div>
            )}
            {character.concentration_spell && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(251,191,36,0.8)', background: 'rgba(251,191,36,0.1)', borderRadius: 5, padding: '3px 8px' }}>
                Concentrating: {character.concentration_spell}
              </div>
            )}
          </div>

          {/* Equipped Weapons */}
          {character.equipped_weapons && character.equipped_weapons.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(239,68,68,0.5)', marginBottom: 4 }}>
                Weapons
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {character.equipped_weapons.slice(0, 5).map((w, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    color: '#fca5a5', fontWeight: 500,
                  }}>
                    {typeof w === 'string' ? w : w.name || 'Weapon'}
                    {w.damage ? ` (${w.damage})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Spell Slots */}
          {character.spell_slots && Object.keys(character.spell_slots).length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(167,139,250,0.5)', marginBottom: 4 }}>
                Spell Slots
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(character.spell_slots).filter(([, v]) => v && (v.max > 0 || v.total > 0)).map(([level, slot]) => (
                  <span key={level} style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)',
                    color: '#c4b5fd', fontWeight: 500, fontFamily: 'Outfit, sans-serif',
                  }}>
                    L{level}: {slot.used ?? slot.remaining ?? 0}/{slot.max ?? slot.total ?? 0}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Currency */}
          {character.currency && Object.values(character.currency).some(v => v > 0) && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.5)', marginBottom: 4 }}>
                Currency
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { key: 'pp', label: 'PP', color: '#c0c0c0' },
                  { key: 'gp', label: 'GP', color: '#c9a84c' },
                  { key: 'ep', label: 'EP', color: '#a0a0a0' },
                  { key: 'sp', label: 'SP', color: '#94a3b8' },
                  { key: 'cp', label: 'CP', color: '#b87333' },
                ].filter(({ key }) => (character.currency[key] ?? 0) > 0).map(({ key, label, color }) => (
                  <span key={key} style={{ fontSize: 10, color, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                    {character.currency[key]} {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Death Saves */}
          {character.death_saves && (character.death_saves.successes > 0 || character.death_saves.failures > 0) && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#4ade80' }}>Saves: {'●'.repeat(character.death_saves.successes)}{'○'.repeat(3 - character.death_saves.successes)}</span>
              <span style={{ fontSize: 10, color: '#ef4444' }}>Fails: {'●'.repeat(character.death_saves.failures)}{'○'.repeat(3 - character.death_saves.failures)}</span>
            </div>
          )}
        </div>
      )}
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

export default function Party({ characterId, character, activeConditions, onBugReport }) {
  const { mode: appMode } = useAppMode();
  const party = useParty();
  const {
    wsStatus: status, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId,
    wasConnected, reconnecting, hostInfo,
    setJoinIp, setJoinInput,
    connect, sendUpdate, handleHost, handleLeave, manualReconnect,
    onBugReportRef,
  } = party;

  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Wire up the bug report callback
  useEffect(() => {
    onBugReportRef.current = onBugReport;
  }, [onBugReport, onBugReportRef]);

  const charSnapshot = useMemo(() => {
    const abilityScores = character?.ability_scores || {};
    const wisMod = abilityScores.WIS?.modifier ?? 0;
    const profBonus = character?.proficiency_bonus ?? 2;
    const skills = character?.skills || {};
    const perceptionProf = skills.Perception?.proficiency ?? false;
    const passivePerception = 10 + wisMod + (perceptionProf ? profBonus : 0);

    return {
      id: characterId,
      name: character?.name || 'Unknown',
      race: character?.race || '',
      primary_class: character?.primary_class || '',
      level: character?.level || 1,
      hp: character?.current_hp ?? character?.max_hp ?? 0,
      max_hp: character?.max_hp ?? 0,
      ac: character?.armor_class ?? 10,
      ability_scores: {
        STR: abilityScores.STR?.modifier ?? 0,
        DEX: abilityScores.DEX?.modifier ?? 0,
        CON: abilityScores.CON?.modifier ?? 0,
        INT: abilityScores.INT?.modifier ?? 0,
        WIS: wisMod,
        CHA: abilityScores.CHA?.modifier ?? 0,
      },
      saving_throws: {
        STR: !!character?.saving_throws?.STR,
        DEX: !!character?.saving_throws?.DEX,
        CON: !!character?.saving_throws?.CON,
        INT: !!character?.saving_throws?.INT,
        WIS: !!character?.saving_throws?.WIS,
        CHA: !!character?.saving_throws?.CHA,
      },
      proficiency_bonus: profBonus,
      conditions: activeConditions || [],
      spell_save_dc: character?.spell_save_dc ?? null,
      passive_perception: passivePerception,
      temp_hp: character?.temp_hp ?? 0,
      equipped_weapons: character?.equipped_weapons || character?.attacks || [],
      spell_slots: character?.spell_slots || {},
      prepared_spells: character?.prepared_spells || [],
      feature_charges: character?.feature_charges || [],
      class_resources: character?.class_resources || [],
      currency: character?.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      death_saves: character?.death_saves || { successes: 0, failures: 0 },
      concentration_spell: character?.concentration_spell || null,
      inspiration: character?.inspiration ? true : false,
      attacks: character?.attacks || [],
      speed: character?.speed || null,
      languages: character?.languages || [],
      dm_name: localStorage.getItem('codex-dm-name') || '',
    };
  }, [
    characterId, character?.name, character?.race, character?.primary_class,
    character?.level, character?.current_hp, character?.max_hp, character?.armor_class,
    character?.ability_scores, character?.saving_throws, character?.proficiency_bonus,
    character?.skills, character?.spell_save_dc, activeConditions,
    character?.temp_hp, character?.currency, character?.inspiration,
  ]);

  // Connect when room code + mode are ready
  // Pass params directly to avoid connRef race condition (child effects fire before parent effects)
  useEffect(() => {
    if (roomCode && mode) connect(charSnapshot, { mode, roomCode, joinIp });
  }, [roomCode, mode, joinIp, connect, charSnapshot]);

  // Auto-sync when any tracked character stat changes
  const prevStatsRef = useRef(null);
  useEffect(() => {
    if (status !== 'connected') return;
    const condKey = (activeConditions || []).join(',');
    const key = `${character?.current_hp}|${character?.max_hp}|${character?.armor_class}|${character?.level}|${character?.name}|${character?.race}|${character?.primary_class}|${character?.proficiency_bonus}|${character?.spell_save_dc}|${JSON.stringify(character?.ability_scores)}|${JSON.stringify(character?.saving_throws)}|${condKey}|${character?.temp_hp}|${JSON.stringify(character?.currency)}|${character?.inspiration}`;
    if (prevStatsRef.current === key) return;
    prevStatsRef.current = key;
    sendUpdate(charSnapshot);
  }, [
    status, sendUpdate, charSnapshot,
    character?.current_hp, character?.max_hp, character?.armor_class,
    character?.level, character?.name, character?.race, character?.primary_class,
    character?.proficiency_bonus, character?.spell_save_dc,
    character?.ability_scores, character?.saving_throws, activeConditions,
    character?.temp_hp, character?.currency, character?.inspiration,
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
            ].map(({ icon: Icon, label, sub }, i) => ( // eslint-disable-line no-unused-vars
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
  // DM host shouldn't appear as a party member — they're the DM, not a player
  const isHostDM = isDM && mode === 'host';
  const otherMembers = members.filter(m => {
    if (m.client_id === myClientId) return false;
    // Players should not see the DM in their party list
    if (!isHostDM && m.character?.dm_name) return false;
    return true;
  });
  const me = isHostDM ? null : members.find(m => m.client_id === myClientId);

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
          {status === 'connected' && !isHostDM && (
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
              <span className="text-xs text-amber-200/30">{isHostDM ? otherMembers.length : members.length} player{(isHostDM ? otherMembers.length : members.length) !== 1 ? 's' : ''}</span>
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
              <span className="text-xs text-amber-200/25">{'\u2014'} share this with your players</span>
            </div>
          )}
        </div>
      )}

      {/* Campaign & DM info — shown to joining players */}
      {hostInfo && (hostInfo.campaignName || hostInfo.dmName) && mode === 'join' && (
        <div className="bg-[#0d0d12] border border-purple-400/20 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <Crown size={16} className="text-purple-400/70 shrink-0" />
            <div>
              {hostInfo.campaignName && (
                <div className="font-display text-sm text-amber-100">{hostInfo.campaignName}</div>
              )}
              {hostInfo.dmName && (
                <div className="text-xs text-purple-300/60 mt-0.5">Dungeon Master: <span className="text-purple-300/90 font-medium">{hostInfo.dmName}</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reconnect banner — shows when disconnected after being previously connected */}
      {status === 'disconnected' && (wasConnected || !mode) && (
        <div className="card border-red-400/20 bg-red-400/5" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-2 text-sm text-red-400/80">
              <WifiOff size={16} />
              {reconnecting ? 'Reconnecting...' : 'Connection lost'}
            </div>
            <button
              onClick={manualReconnect}
              disabled={reconnecting}
              className="btn-secondary text-xs border-red-400/30 text-red-400 flex items-center gap-1.5"
              style={{ opacity: reconnecting ? 0.5 : 1 }}
            >
              <RefreshCw size={12} className={reconnecting ? 'animate-spin' : ''} />
              {reconnecting ? 'Retrying...' : 'Reconnect'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(252,165,165,0.5)' }}>
            Your character data is saved locally. {reconnecting ? 'Attempting to rejoin the session...' : 'Click Reconnect to rejoin the party.'}
          </div>
        </div>
      )}

      {/* Party Stats Overview — DM host only, when there are connected players */}
      {isHostDM && status === 'connected' && otherMembers.length > 0 && (
        <PartyStatsOverview members={otherMembers} />
      )}

      {/* DM Campaign Tools are now in the floating DmToolbar (top-right) */}

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
