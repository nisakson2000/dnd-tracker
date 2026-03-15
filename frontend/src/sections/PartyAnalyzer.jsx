import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Heart, Swords, Sparkles, Eye, AlertTriangle,
  ChevronDown, ChevronUp, Target, Ear, Brain, Search as SearchIcon,
  RefreshCw, TrendingUp, Activity,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { ABILITIES } from '../utils/dndHelpers';

// ─── Constants ────────────────────────────────────────────────────────────────

const ABILITY_FULL = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma',
};

const SKILL_ABILITY_MAP = {
  Acrobatics: 'DEX', 'Animal Handling': 'WIS', Arcana: 'INT',
  Athletics: 'STR', Deception: 'CHA', History: 'INT',
  Insight: 'WIS', Intimidation: 'CHA', Investigation: 'INT',
  Medicine: 'WIS', Nature: 'INT', Perception: 'WIS',
  Performance: 'CHA', Persuasion: 'CHA', Religion: 'INT',
  'Sleight of Hand': 'DEX', Stealth: 'DEX', Survival: 'WIS',
};

const DARKVISION_RACES = [
  'dwarf', 'elf', 'half-elf', 'half-orc', 'gnome', 'tiefling',
  'drow', 'dragonborn', 'tabaxi', 'firbolg', 'bugbear', 'goblin',
  'hobgoblin', 'kobold', 'orc', 'aasimar', 'genasi', 'goliath',
  'shifter', 'changeling', 'kalashtar', 'warforged', 'satyr',
  'owlin', 'harengon', 'fairy', 'hadozee', 'plasmoid', 'thri-kreen',
  'astral elf', 'autognome', 'giff', 'githyanki', 'githzerai',
  'eladrin', 'shadar-kai', 'deep gnome', 'duergar',
];

const ROLE_DEFINITIONS = [
  {
    id: 'tank',
    label: 'Tank',
    icon: Shield,
    color: '#60a5fa',
    desc: 'High AC/HP, absorbs damage',
    classes: ['Fighter', 'Paladin', 'Barbarian'],
    check: (o, scores) => {
      const isClass = ['Fighter', 'Paladin', 'Barbarian'].some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const highAC = o.armor_class >= 16;
      const highHP = o.max_hp >= 30;
      const highCon = (scores.CON || 10) >= 14;
      if (isClass && (highAC || highHP)) return 'full';
      if (isClass || (highAC && highCon)) return 'partial';
      return 'none';
    },
  },
  {
    id: 'healer',
    label: 'Healer',
    icon: Heart,
    color: '#4ade80',
    desc: 'Restores HP, cures conditions',
    classes: ['Cleric', 'Druid', 'Paladin'],
    check: (o, scores) => {
      const healClasses = ['Cleric', 'Druid'];
      const isHealClass = healClasses.some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const isPaladin = o.primary_class?.toLowerCase().includes('paladin');
      const highWis = (scores.WIS || 10) >= 14;
      if (isHealClass) return 'full';
      if (isPaladin || highWis) return 'partial';
      return 'none';
    },
  },
  {
    id: 'damage',
    label: 'Damage',
    icon: Swords,
    color: '#f87171',
    desc: 'High single-target or AoE damage',
    classes: ['Rogue', 'Fighter', 'Ranger', 'Warlock', 'Sorcerer', 'Barbarian'],
    check: (o, scores) => {
      const dmgClasses = ['Rogue', 'Fighter', 'Ranger', 'Warlock', 'Sorcerer', 'Barbarian'];
      const isClass = dmgClasses.some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const highStr = (scores.STR || 10) >= 16;
      const highDex = (scores.DEX || 10) >= 16;
      if (isClass) return 'full';
      if (highStr || highDex) return 'partial';
      return 'none';
    },
  },
  {
    id: 'utility',
    label: 'Utility / Control',
    icon: Sparkles,
    color: '#c084fc',
    desc: 'Battlefield control, utility spells',
    classes: ['Wizard', 'Bard', 'Druid', 'Sorcerer'],
    check: (o, scores) => {
      const utilClasses = ['Wizard', 'Bard', 'Druid', 'Sorcerer'];
      const isClass = utilClasses.some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const highInt = (scores.INT || 10) >= 14;
      if (isClass) return 'full';
      if (highInt) return 'partial';
      return 'none';
    },
  },
  {
    id: 'face',
    label: 'Face / Social',
    icon: Ear,
    color: '#fbbf24',
    desc: 'Persuasion, deception, social skills',
    classes: ['Bard', 'Warlock', 'Sorcerer', 'Paladin'],
    check: (o, scores) => {
      const faceClasses = ['Bard', 'Warlock', 'Sorcerer', 'Paladin'];
      const isClass = faceClasses.some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const highCha = (scores.CHA || 10) >= 14;
      if (isClass && highCha) return 'full';
      if (isClass || highCha) return 'partial';
      return 'none';
    },
  },
  {
    id: 'scout',
    label: 'Scout',
    icon: Eye,
    color: '#34d399',
    desc: 'Stealth, perception, exploration',
    classes: ['Rogue', 'Ranger', 'Monk'],
    check: (o, scores, skills) => {
      const scoutClasses = ['Rogue', 'Ranger', 'Monk'];
      const isClass = scoutClasses.some(c =>
        o.primary_class?.toLowerCase().includes(c.toLowerCase()));
      const highDex = (scores.DEX || 10) >= 14;
      const highWis = (scores.WIS || 10) >= 14;
      const hasPerception = skills.some(s => s.name === 'Perception' && s.proficient);
      const hasStealth = skills.some(s => s.name === 'Stealth' && s.proficient);
      if (isClass && (hasPerception || hasStealth)) return 'full';
      if (isClass || (highDex && highWis) || (hasPerception && hasStealth)) return 'partial';
      return 'none';
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function abilityMod(score) {
  return Math.floor(((score || 10) - 10) / 2);
}

function profBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function passiveScore(abilityScore, level, proficient, expertise) {
  const mod = abilityMod(abilityScore);
  const pb = profBonus(level);
  return 10 + mod + (proficient ? pb : 0) + (expertise ? pb : 0);
}

function hasDarkvision(race) {
  if (!race) return false;
  const lower = race.toLowerCase();
  return DARKVISION_RACES.some(r => lower.includes(r));
}

function scoreToScoreMap(abilityScores) {
  const map = {};
  for (const a of (abilityScores || [])) {
    const key = a.ability?.toUpperCase()?.slice(0, 3);
    if (key) map[key] = a.score;
  }
  return map;
}

function heatColor(value, min, max) {
  const t = max === min ? 0.5 : (value - min) / (max - min);
  if (t < 0.25) return '#ef4444';
  if (t < 0.45) return '#f97316';
  if (t < 0.6) return '#eab308';
  if (t < 0.8) return '#4ade80';
  return '#22d3ee';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, marginBottom: 12, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 'calc(13px * var(--font-scale, 1))',
          fontWeight: 600, color: 'var(--text)', textAlign: 'left',
        }}
      >
        {Icon && <Icon size={15} style={{ color: iconColor || 'var(--text-dim)', flexShrink: 0 }} />}
        <span style={{ flex: 1 }}>{title}</span>
        {open ? <ChevronUp size={14} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 14px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ role, status }) {
  const bg = status === 'full'
    ? `${role.color}18`
    : status === 'partial'
    ? 'rgba(251,191,36,0.08)'
    : 'rgba(239,68,68,0.06)';
  const border = status === 'full'
    ? `${role.color}40`
    : status === 'partial'
    ? 'rgba(251,191,36,0.25)'
    : 'rgba(239,68,68,0.2)';
  const textColor = status === 'full'
    ? role.color
    : status === 'partial'
    ? '#fbbf24'
    : '#ef4444';
  const statusLabel = status === 'full' ? 'Covered' : status === 'partial' ? 'Partial' : 'Missing';
  const Icon = role.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
      background: bg, border: `1px solid ${border}`, borderRadius: 8,
    }}>
      <Icon size={16} style={{ color: textColor, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 'calc(12px * var(--font-scale, 1))',
          fontWeight: 600, color: textColor, marginBottom: 1,
        }}>
          {role.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 'calc(10px * var(--font-scale, 1))',
          color: 'var(--text-mute)',
        }}>
          {role.desc}
        </div>
      </div>
      <span style={{
        fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-ui)',
        letterSpacing: '0.06em', textTransform: 'uppercase', color: textColor,
        background: `${textColor}15`, border: `1px solid ${textColor}30`,
        borderRadius: 4, padding: '2px 8px',
      }}>
        {statusLabel}
      </span>
    </div>
  );
}

function PassiveRow({ label, icon: Icon, values, partyBest, partyWorst }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <Icon size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 'calc(11px * var(--font-scale, 1))',
        color: 'var(--text-dim)', minWidth: 90,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
        {values.map((v, i) => {
          const isBest = v.value === partyBest;
          const isWorst = v.value === partyWorst;
          return (
            <span
              key={i}
              title={v.name}
              style={{
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-ui)',
                color: isBest ? '#4ade80' : isWorst ? '#f87171' : 'var(--text)',
                background: isBest ? 'rgba(74,222,128,0.1)' : isWorst ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isBest ? 'rgba(74,222,128,0.25)' : isWorst ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 5, padding: '2px 8px',
              }}
            >
              {v.value} <span style={{ fontWeight: 400, color: 'var(--text-mute)', fontSize: 9 }}>{v.shortName}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function GapAlert({ message }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px',
      background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
      borderRadius: 7, marginBottom: 6,
    }}>
      <AlertTriangle size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 'calc(11px * var(--font-scale, 1))',
        color: '#fca5a5', lineHeight: 1.5,
      }}>
        {message}
      </span>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, minWidth: 80,
    }}>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 'calc(18px * var(--font-scale, 1))',
        fontWeight: 700, color: color || 'var(--text)',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 'calc(9px * var(--font-scale, 1))',
        color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PartyAnalyzer({ characterId }) {
  const [characters, setCharacters] = useState([]);
  const [overviews, setOverviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const chars = await invoke('list_characters');
      setCharacters(chars || []);

      const overviewMap = {};
      for (const c of (chars || [])) {
        try {
          const data = await invoke('get_overview', { characterId: c.id });
          overviewMap[c.id] = data;
        } catch {
          // skip characters we can't load
        }
      }
      setOverviews(overviewMap);
    } catch (e) {
      setError(e?.message || String(e));
      toast.error('Failed to load party data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived analysis ──

  const analysis = useMemo(() => {
    if (characters.length === 0) return null;

    const members = characters.map(c => {
      const ov = overviews[c.id];
      if (!ov) return null;
      const scores = scoreToScoreMap(ov.ability_scores);
      return {
        id: c.id,
        name: ov.overview.name || c.name || 'Unknown',
        shortName: (ov.overview.name || c.name || '?').split(' ')[0],
        overview: ov.overview,
        scores,
        skills: ov.skills || [],
        savingThrows: ov.saving_throws || [],
      };
    }).filter(Boolean);

    if (members.length === 0) return null;

    // Role coverage
    const roleResults = ROLE_DEFINITIONS.map(role => {
      const memberStatuses = members.map(m => ({
        name: m.name,
        status: role.check(m.overview, m.scores, m.skills),
      }));
      const best = memberStatuses.find(s => s.status === 'full')
        ? 'full'
        : memberStatuses.find(s => s.status === 'partial')
        ? 'partial'
        : 'none';
      return { ...role, partyStatus: best, memberStatuses };
    });

    // Passive scores
    const passiveSkills = ['Perception', 'Investigation', 'Insight'];
    const passiveData = passiveSkills.map(skillName => {
      const abilityKey = SKILL_ABILITY_MAP[skillName];
      const values = members.map(m => {
        const abilityScore = m.scores[abilityKey] || 10;
        const level = m.overview.level || 1;
        const sk = m.skills.find(s => s.name === skillName);
        const prof = sk?.proficient || false;
        const exp = sk?.expertise || false;
        return {
          name: m.name,
          shortName: m.shortName,
          value: passiveScore(abilityScore, level, prof, exp),
        };
      });
      const sorted = [...values].sort((a, b) => b.value - a.value);
      return {
        skill: skillName,
        values: sorted,
        best: sorted[0]?.value || 0,
        worst: sorted[sorted.length - 1]?.value || 0,
      };
    });

    // Ability score heat map
    const abilityHeatMap = ABILITIES.map(ab => {
      const scores = members.map(m => ({
        name: m.shortName,
        value: m.scores[ab] || 10,
      }));
      const avg = scores.reduce((s, v) => s + v.value, 0) / scores.length;
      const max = Math.max(...scores.map(s => s.value));
      const min = Math.min(...scores.map(s => s.value));
      return { ability: ab, scores, avg: Math.round(avg * 10) / 10, max, min };
    });

    // Gap alerts
    const gaps = [];

    // No healer
    const healerRole = roleResults.find(r => r.id === 'healer');
    if (healerRole?.partyStatus === 'none') {
      gaps.push('No healer in the party — consider a Cleric or Druid.');
    }

    // No tank
    const tankRole = roleResults.find(r => r.id === 'tank');
    if (tankRole?.partyStatus === 'none') {
      gaps.push('No frontline tank — the party may struggle to absorb damage.');
    }

    // Low Wisdom
    const avgWis = members.reduce((s, m) => s + (m.scores.WIS || 10), 0) / members.length;
    if (avgWis < 12) {
      gaps.push('Low Wisdom across the board — vulnerable to Wisdom saves and Perception checks.');
    }

    // No ranged
    const rangedClasses = ['Ranger', 'Warlock', 'Sorcerer', 'Wizard'];
    const hasRanged = members.some(m =>
      rangedClasses.some(c => m.overview.primary_class?.toLowerCase().includes(c.toLowerCase()))
      || (m.scores.DEX || 10) >= 16
    );
    if (!hasRanged) {
      gaps.push('No dedicated ranged damage dealers — consider a Ranger, Warlock, or ranged Fighter.');
    }

    // No thieves tools
    const hasThievesTools = members.some(m => {
      const tools = m.overview.proficiencies_tools?.toLowerCase() || '';
      return tools.includes('thiev') || m.overview.primary_class?.toLowerCase() === 'rogue';
    });
    if (!hasThievesTools) {
      gaps.push("No one proficient in Thieves' Tools — traps and locks will be challenging.");
    }

    // Darkvision coverage
    const dvCount = members.filter(m => hasDarkvision(m.overview.race)).length;
    if (dvCount === 0) {
      gaps.push('No party members have darkvision — plan for light sources in dark environments.');
    } else if (dvCount < members.length && dvCount > 0) {
      const without = members.filter(m => !hasDarkvision(m.overview.race)).map(m => m.shortName);
      gaps.push(`Incomplete darkvision coverage — ${without.join(', ')} lack${without.length === 1 ? 's' : ''} darkvision.`);
    }

    // No face
    const faceRole = roleResults.find(r => r.id === 'face');
    if (faceRole?.partyStatus === 'none') {
      gaps.push('No social specialist — the party may struggle in negotiation and diplomacy.');
    }

    // No scout
    const scoutRole = roleResults.find(r => r.id === 'scout');
    if (scoutRole?.partyStatus === 'none') {
      gaps.push('No dedicated scout — stealth missions and reconnaissance will be difficult.');
    }

    // Party stats summary
    const levels = members.map(m => m.overview.level || 1);
    const avgLevel = levels.reduce((s, v) => s + v, 0) / levels.length;
    const totalHP = members.reduce((s, m) => s + (m.overview.max_hp || 0), 0);
    const avgAC = members.reduce((s, m) => s + (m.overview.armor_class || 10), 0) / members.length;

    return {
      members,
      roleResults,
      passiveData,
      abilityHeatMap,
      gaps,
      stats: {
        count: members.length,
        avgLevel: Math.round(avgLevel * 10) / 10,
        totalHP,
        avgAC: Math.round(avgAC * 10) / 10,
      },
    };
  }, [characters, overviews]);

  // ── Render ──

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
        Analyzing party composition...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#f87171', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
        <AlertTriangle size={24} style={{ marginBottom: 8, opacity: 0.7 }} />
        <div>Failed to load party data</div>
        <button
          onClick={loadData}
          style={{
            marginTop: 12, padding: '6px 16px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text)',
            cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
        <Users size={28} style={{ marginBottom: 10, opacity: 0.4 }} />
        <div>No characters found</div>
        <div style={{ fontSize: 11, marginTop: 4, color: 'var(--text-mute)' }}>
          Create at least one character to see party analysis.
        </div>
      </div>
    );
  }

  const { members, roleResults, passiveData, abilityHeatMap, gaps, stats } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: 720, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'calc(20px * var(--font-scale, 1))',
            fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.3,
          }}>
            Party Composition
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 'calc(11px * var(--font-scale, 1))',
            color: 'var(--text-mute)', margin: '4px 0 0',
          }}>
            Analyzing {members.length} character{members.length !== 1 ? 's' : ''} for role coverage, gaps, and synergies
          </p>
        </div>
        <button
          onClick={loadData}
          title="Refresh analysis"
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6, color: 'var(--text-dim)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 11, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Party Stats Summary */}
      <SectionCard title="Party Stats" icon={Activity} iconColor="#60a5fa" defaultOpen={true}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <StatPill label="Members" value={stats.count} color="#60a5fa" />
          <StatPill label="Avg Level" value={stats.avgLevel} color="#c084fc" />
          <StatPill label="Total HP" value={stats.totalHP} color="#4ade80" />
          <StatPill label="Avg AC" value={stats.avgAC} color="#93c5fd" />
        </div>
        {/* Member list */}
        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {members.map(m => (
            <span key={m.id} style={{
              fontSize: 10, fontFamily: 'var(--font-ui)', color: 'var(--text-dim)',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 5, padding: '3px 10px',
            }}>
              {m.shortName}
              <span style={{ color: 'var(--text-mute)', marginLeft: 4 }}>
                {m.overview.primary_class || '?'} {m.overview.level || 1}
              </span>
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Role Coverage */}
      <SectionCard title="Role Coverage" icon={Target} iconColor="#fbbf24" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roleResults.map(role => (
            <RoleBadge key={role.id} role={role} status={role.partyStatus} />
          ))}
        </div>
      </SectionCard>

      {/* Gap Alerts */}
      {gaps.length > 0 && (
        <SectionCard title={`Gap Alerts (${gaps.length})`} icon={AlertTriangle} iconColor="#f87171" defaultOpen={true}>
          {gaps.map((g, i) => (
            <GapAlert key={i} message={g} />
          ))}
        </SectionCard>
      )}

      {/* Passive Scores */}
      <SectionCard title="Passive Scores" icon={Eye} iconColor="#34d399" defaultOpen={true}>
        <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', marginBottom: 8 }}>
          10 + ability modifier + proficiency (if proficient) + expertise (if expert)
        </div>
        <PassiveRow
          label="Perception"
          icon={Eye}
          values={passiveData[0].values}
          partyBest={passiveData[0].best}
          partyWorst={passiveData[0].worst}
        />
        <PassiveRow
          label="Investigation"
          icon={SearchIcon}
          values={passiveData[1].values}
          partyBest={passiveData[1].best}
          partyWorst={passiveData[1].worst}
        />
        <PassiveRow
          label="Insight"
          icon={Brain}
          values={passiveData[2].values}
          partyBest={passiveData[2].best}
          partyWorst={passiveData[2].worst}
        />
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
          <span style={{ color: '#4ade80' }}>Green</span> = party best &nbsp; <span style={{ color: '#f87171' }}>Red</span> = party vulnerability
        </div>
      </SectionCard>

      {/* Ability Score Heat Map */}
      <SectionCard title="Ability Score Overview" icon={TrendingUp} iconColor="#c084fc" defaultOpen={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 12 }}>
          {abilityHeatMap.map(ab => (
            <div key={ab.ability} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 700,
                color: 'var(--text-mute)', letterSpacing: '0.08em', marginBottom: 6,
              }}>
                {ab.ability}
              </div>
              {ab.scores.map((s, i) => (
                <div
                  key={i}
                  title={`${s.name}: ${s.value}`}
                  style={{
                    width: '100%', padding: '4px 0', marginBottom: 2,
                    borderRadius: 4, fontSize: 11, fontWeight: 600,
                    fontFamily: 'var(--font-ui)', textAlign: 'center',
                    color: heatColor(s.value, 6, 20),
                    background: `${heatColor(s.value, 6, 20)}12`,
                    border: `1px solid ${heatColor(s.value, 6, 20)}25`,
                  }}
                >
                  {s.value}
                </div>
              ))}
              <div style={{
                marginTop: 4, fontSize: 9, color: 'var(--text-mute)',
                fontFamily: 'var(--font-ui)', borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 4,
              }}>
                avg {ab.avg}
              </div>
            </div>
          ))}
        </div>
        {/* Row labels */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {members.map((m, i) => (
            <span key={m.id} style={{
              fontSize: 9, fontFamily: 'var(--font-ui)', color: 'var(--text-mute)',
              background: 'rgba(255,255,255,0.03)', borderRadius: 4, padding: '2px 6px',
            }}>
              Row {i + 1}: {m.shortName}
            </span>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}
