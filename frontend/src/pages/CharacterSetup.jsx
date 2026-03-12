import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Dice5, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { getRuleset } from '../data/rulesets';
import { APP_VERSION } from '../version';

// ─── Constants ──────────────────────────────────────────────────────────────

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_NAMES = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const POINT_BUY_TOTAL = 27;

const SKILL_ABILITIES = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 'Athletics': 'STR',
  'Deception': 'CHA', 'History': 'INT', 'Insight': 'WIS', 'Intimidation': 'CHA',
  'Investigation': 'INT', 'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS',
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 'Sleight of Hand': 'DEX',
  'Stealth': 'DEX', 'Survival': 'WIS',
};

function mod(score) {
  return Math.floor((score - 10) / 2);
}

function modStr(score) {
  const m = mod(score);
  return m >= 0 ? `+${m}` : `${m}`;
}

function roll4d6DropLowest() {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  dice.sort((a, b) => b - a);
  return { dice, total: dice[0] + dice[1] + dice[2] };
}

// ─── Shared styles ──────────────────────────────────────────────────────────

const accent = '#c9a84c';
const cardStyle = {
  borderRadius: 12, padding: '18px 20px',
  background: 'rgba(11,9,20,0.9)',
  border: '1px solid rgba(201,168,76,0.15)',
};

// ─── Step 1: Ability Scores ─────────────────────────────────────────────────

function StepAbilities({ scores, setScores, raceData }) {
  const [method, setMethod] = useState(null);
  const [rolls, setRolls] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [pointBuyScores, setPointBuyScores] = useState(
    Object.fromEntries(ABILITIES.map(a => [a, 8]))
  );

  const pointsSpent = Object.values(pointBuyScores).reduce((sum, v) => sum + (POINT_BUY_COSTS[v] || 0), 0);
  const pointsLeft = POINT_BUY_TOTAL - pointsSpent;

  const racialBonuses = raceData?.abilityBonuses || {};

  const doRoll = () => {
    const r = ABILITIES.map(() => roll4d6DropLowest());
    setRolls(r);
    setAssignments({});
  };

  const applyMethod = useCallback(() => {
    let base = {};
    if (method === 'standard') {
      // Need all 6 assigned
      ABILITIES.forEach((a, i) => {
        base[a] = assignments[a] != null ? STANDARD_ARRAY[assignments[a]] : 10;
      });
    } else if (method === 'pointbuy') {
      base = { ...pointBuyScores };
    } else if (method === 'roll') {
      ABILITIES.forEach((a, i) => {
        base[a] = assignments[a] != null ? rolls[assignments[a]].total : 10;
      });
    }
    // Apply racial bonuses
    const final = {};
    ABILITIES.forEach(a => {
      final[a] = (base[a] || 10) + (racialBonuses[a] || 0);
    });
    setScores(final);
  }, [method, assignments, pointBuyScores, rolls, racialBonuses, setScores]);

  // Auto-apply when point buy changes
  useEffect(() => {
    if (method === 'pointbuy') applyMethod();
  }, [pointBuyScores, method, applyMethod]);

  const allAssigned = method === 'standard'
    ? Object.keys(assignments).length === 6
    : method === 'roll'
    ? rolls && Object.keys(assignments).length === 6
    : method === 'pointbuy';

  // Drag-and-drop style assignment for standard array and roll
  const usedIndices = new Set(Object.values(assignments));

  const assignScore = (ability, idx) => {
    setAssignments(prev => {
      const next = { ...prev };
      // Remove ability if it was already assigned
      Object.entries(next).forEach(([a, v]) => { if (v === idx) delete next[a]; });
      // Remove this ability's old assignment
      delete next[ability];
      // Assign
      next[ability] = idx;
      return next;
    });
  };

  const clearAssignments = () => setAssignments({});

  useEffect(() => {
    if (allAssigned && method !== 'pointbuy') applyMethod();
  }, [assignments, allAssigned, method, applyMethod]);

  const scorePool = method === 'standard' ? STANDARD_ARRAY : method === 'roll' && rolls ? rolls.map(r => r.total) : [];

  const methods = [
    { id: 'pointbuy', label: 'Point Buy', desc: '27 points to spend. Most balanced.', icon: '⚖' },
    { id: 'standard', label: 'Standard Array', desc: '15, 14, 13, 12, 10, 8. Quick & fair.', icon: '📋' },
    { id: 'roll', label: 'Roll 4d6', desc: 'Roll 4d6, drop lowest. Classic!', icon: '🎲' },
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎲</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Ability Scores
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Choose how to generate your six ability scores.
        </p>
      </div>

      {/* Method selection */}
      {!method && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); if (m.id === 'roll') doRoll(); }}
              style={{
                ...cardStyle, cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}45`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'}
            >
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: '#efe0c0', letterSpacing: '0.03em' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.35)', marginTop: 2 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Point Buy */}
      {method === 'pointbuy' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setMethod(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={14} /> Change Method
            </button>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: pointsLeft < 0 ? '#ef4444' : pointsLeft === 0 ? '#4ade80' : accent }}>
              {pointsLeft} / {POINT_BUY_TOTAL} points left
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ABILITIES.map(a => {
              const base = pointBuyScores[a];
              const bonus = racialBonuses[a] || 0;
              const total = base + bonus;
              return (
                <div key={a} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, fontFamily: 'var(--font-heading)', fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{a}</div>
                  <div style={{ flex: 1, fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{ABILITY_NAMES[a]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setPointBuyScores(p => ({ ...p, [a]: Math.max(8, p[a] - 1) }))}
                      disabled={base <= 8}
                      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: base > 8 ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'rgba(200,175,130,0.5)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#efe0c0' }}>{base}</span>
                    <button
                      onClick={() => setPointBuyScores(p => {
                        const next = Math.min(15, p[a] + 1);
                        const newCost = pointsSpent - (POINT_BUY_COSTS[p[a]] || 0) + (POINT_BUY_COSTS[next] || 0);
                        if (newCost > POINT_BUY_TOTAL) return p;
                        return { ...p, [a]: next };
                      })}
                      disabled={base >= 15}
                      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: base < 15 ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'rgba(200,175,130,0.5)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                  {bonus > 0 && (
                    <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>+{bonus}</span>
                  )}
                  <div style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: accent }}>{total}</div>
                  <div style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>{modStr(total)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Standard Array / Roll — assignment UI */}
      {(method === 'standard' || method === 'roll') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => { setMethod(null); setRolls(null); clearAssignments(); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={14} /> Change Method
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {method === 'roll' && (
                <button onClick={doRoll} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: accent, fontFamily: 'var(--font-heading)', fontSize: 11 }}>
                  <RefreshCw size={12} /> Re-roll
                </button>
              )}
              {Object.keys(assignments).length > 0 && (
                <button onClick={clearAssignments} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 11 }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Score pool */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {scorePool.map((val, idx) => {
              const used = usedIndices.has(idx);
              return (
                <div key={idx} style={{
                  width: 52, height: 52, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: used ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.06)',
                  border: `1px solid ${used ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.2)'}`,
                  opacity: used ? 0.4 : 1,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: used ? '#4ade80' : '#efe0c0' }}>{val}</span>
                  {method === 'roll' && rolls && (
                    <span style={{ fontSize: 8, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-mono)' }}>
                      {rolls[idx].dice.join(',')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(200,175,130,0.3)', marginBottom: 14 }}>
            Click a score value for each ability to assign it
          </p>

          {/* Assignment rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ABILITIES.map(a => {
              const assignedIdx = assignments[a];
              const baseVal = assignedIdx != null ? scorePool[assignedIdx] : null;
              const bonus = racialBonuses[a] || 0;
              const total = baseVal != null ? baseVal + bonus : null;
              return (
                <div key={a} style={{ ...cardStyle, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, fontFamily: 'var(--font-heading)', fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{a}</div>
                  <div style={{ flex: 1, fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{ABILITY_NAMES[a]}</div>
                  {/* Score picker buttons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {scorePool.map((val, idx) => {
                      const usedByOther = usedIndices.has(idx) && assignments[a] !== idx;
                      const isThis = assignments[a] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => assignScore(a, idx)}
                          disabled={usedByOther}
                          style={{
                            width: 30, height: 26, borderRadius: 5, border: 'none', cursor: usedByOther ? 'not-allowed' : 'pointer',
                            background: isThis ? `${accent}30` : 'rgba(255,255,255,0.04)',
                            color: isThis ? accent : usedByOther ? 'rgba(200,175,130,0.15)' : 'rgba(200,175,130,0.5)',
                            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: isThis ? 700 : 400,
                            outline: isThis ? `1px solid ${accent}55` : 'none',
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  {bonus > 0 && <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>+{bonus}</span>}
                  <div style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: total != null ? accent : 'rgba(200,175,130,0.2)' }}>
                    {total ?? '—'}
                  </div>
                  <div style={{ width: 24, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
                    {total != null ? modStr(total) : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Auto-Apply Preview ─────────────────────────────────────────────

function StepAutoApply({ raceData, classData, backgroundData, scores }) {
  const items = [];

  // HP
  if (classData) {
    const conMod = mod(scores?.CON || 10);
    const hp = classData.hitDie + conMod;
    items.push({ label: 'Hit Points', value: `${hp} (${classData.hitDie} + ${conMod} CON)`, category: 'Combat' });
    items.push({ label: 'Hit Dice', value: `1d${classData.hitDie}`, category: 'Combat' });
  }

  // Speed
  if (raceData?.speed) items.push({ label: 'Speed', value: `${raceData.speed} ft`, category: 'Combat' });

  // AC
  items.push({ label: 'Armor Class', value: `${10 + mod(scores?.DEX || 10)} (10 + ${mod(scores?.DEX || 10)} DEX)`, category: 'Combat' });

  // Saving Throws
  if (classData?.savingThrows) items.push({ label: 'Saving Throws', value: classData.savingThrows.join(', '), category: 'Proficiencies' });

  // Armor profs
  if (classData?.armorProficiencies?.length) items.push({ label: 'Armor', value: classData.armorProficiencies.join(', '), category: 'Proficiencies' });

  // Weapon profs
  if (classData?.weaponProficiencies?.length) items.push({ label: 'Weapons', value: classData.weaponProficiencies.join(', '), category: 'Proficiencies' });

  // Languages
  if (raceData?.languages?.length) items.push({ label: 'Languages', value: raceData.languages.join(', '), category: 'Traits' });

  // Darkvision
  if (raceData?.darkvision > 0) items.push({ label: 'Darkvision', value: `${raceData.darkvision} ft`, category: 'Traits' });

  // Size
  if (raceData?.size) items.push({ label: 'Size', value: raceData.size, category: 'Traits' });

  // Racial traits
  if (raceData?.traits?.length) {
    raceData.traits.forEach(t => items.push({ label: t.name, value: t.description, category: 'Racial Traits' }));
  }

  // Background (2024)
  if (backgroundData) {
    if (backgroundData.feat) items.push({ label: 'Starting Feat', value: backgroundData.feat, category: 'Background' });
    if (backgroundData.skillProficiencies?.length) items.push({ label: 'Background Skills', value: backgroundData.skillProficiencies.join(', '), category: 'Background' });
  }

  // Spellcasting
  if (classData?.spellcasting) items.push({ label: 'Spellcasting', value: `${classData.spellcasting.ability} — ${classData.spellcasting.type} caster`, category: 'Magic' });

  // Group by category
  const groups = {};
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Auto-Applied Defaults
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          These are automatically set based on your race and class. Review before continuing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(groups).map(([cat, entries]) => (
          <div key={cat}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {entries.map((item, i) => (
                <div key={i} style={{ ...cardStyle, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#4ade80', fontSize: 10, marginTop: 3, flexShrink: 0 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#efe0c0' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.45)', marginTop: 2, lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Skill Proficiencies ────────────────────────────────────────────

function StepSkills({ classData, backgroundData, selectedSkills, setSelectedSkills, scores }) {
  const maxPicks = classData?.skillChoices?.count || 2;
  const availableSkills = classData?.skillChoices?.from || Object.keys(SKILL_ABILITIES);
  const bgSkills = backgroundData?.skillProficiencies || [];

  const toggle = (skill) => {
    if (bgSkills.includes(skill)) return; // Can't toggle background skills
    setSelectedSkills(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= maxPicks) return prev;
      return [...prev, skill];
    });
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📜</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Skill Proficiencies
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Choose {maxPicks} skill{maxPicks > 1 ? 's' : ''} from your class.
          {bgSkills.length > 0 && ` Your background already grants: ${bgSkills.join(', ')}.`}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99,
          background: selectedSkills.length === maxPicks ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.06)',
          border: `1px solid ${selectedSkills.length === maxPicks ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.2)'}`,
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: selectedSkills.length === maxPicks ? '#4ade80' : accent,
        }}>
          {selectedSkills.length} / {maxPicks} selected
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {availableSkills.map(skill => {
          const isBg = bgSkills.includes(skill);
          const isSelected = selectedSkills.includes(skill) || isBg;
          const ability = SKILL_ABILITIES[skill] || '?';
          const scoreMod = scores ? modStr(scores[ability] || 10) : '+0';
          const profBonus = isSelected ? '+2' : '+0';
          const disabled = !isSelected && selectedSkills.length >= maxPicks && !isBg;

          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              disabled={isBg}
              style={{
                ...cardStyle, padding: '10px 16px', cursor: isBg ? 'default' : disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                background: isSelected ? 'rgba(201,168,76,0.06)' : 'rgba(11,9,20,0.9)',
                borderColor: isSelected ? `${accent}35` : 'rgba(201,168,76,0.1)',
                opacity: disabled ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `1.5px solid ${isSelected ? accent : 'rgba(201,168,76,0.25)'}`,
                background: isSelected ? `${accent}25` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected && <Check size={12} style={{ color: accent }} />}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: isSelected ? '#efe0c0' : 'rgba(200,175,130,0.55)', fontWeight: isSelected ? 600 : 400 }}>
                  {skill}
                </span>
                {isBg && <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', marginLeft: 6 }}>(background)</span>}
              </div>
              <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-mono)', width: 28 }}>{ability}</span>
              <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', fontFamily: 'var(--font-mono)', width: 24, textAlign: 'right' }}>{scoreMod}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4: Review ─────────────────────────────────────────────────────────

function StepReview({ overview, scores, classData, raceData, backgroundData, selectedSkills }) {
  const conMod = mod(scores?.CON || 10);
  const hp = classData ? classData.hitDie + conMod : 10;
  const ac = 10 + mod(scores?.DEX || 10);
  const bgSkills = backgroundData?.skillProficiencies || [];
  const allSkills = [...new Set([...selectedSkills, ...bgSkills])];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚔</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Ready for Adventure
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Review your character before entering the world.
        </p>
      </div>

      {/* Character card preview */}
      <div style={{ ...cardStyle, padding: '24px', textAlign: 'center', marginBottom: 20, border: `1px solid ${accent}25` }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
          background: `${accent}15`, border: `2px solid ${accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, color: accent,
        }}>
          {(overview?.name || '?')[0]}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#efe0c0', marginBottom: 4 }}>{overview?.name}</div>
        <div style={{ fontSize: 13, color: `${accent}aa`, marginBottom: 2 }}>
          {[overview?.race, overview?.primary_class].filter(Boolean).join(' ')} · Level 1
        </div>
        {overview?.background && <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{overview.background} Background</div>}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>HP</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#4ade80' }}>{hp}</div>
        </div>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>AC</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#60a5fa' }}>{ac}</div>
        </div>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Speed</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: accent }}>{raceData?.speed || 30}</div>
        </div>
      </div>

      {/* Ability scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 16 }}>
        {ABILITIES.map(a => (
          <div key={a} style={{ ...cardStyle, padding: '8px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: accent, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', marginBottom: 4 }}>{a}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#efe0c0' }}>{scores?.[a] || 10}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.4)' }}>{modStr(scores?.[a] || 10)}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {allSkills.length > 0 && (
        <div style={{ ...cardStyle, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Skill Proficiencies</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allSkills.map(s => (
              <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: `${accent}10`, border: `1px solid ${accent}25`, color: `${accent}cc` }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Saves */}
      {classData?.savingThrows && (
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Saving Throw Proficiencies</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {classData.savingThrows.map(s => (
              <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Background Step (2024 only) ────────────────────────────────────────────

function StepBackground({ backgrounds, selected, setSelected }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📖</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Background
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Your background grants ability bonuses, skill proficiencies, and a feat.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {backgrounds.map(bg => {
          const sel = selected === bg.name;
          const bonuses = Object.entries(bg.abilityBonuses || {}).map(([a, v]) => `${a} +${v}`).join(', ');
          return (
            <button
              key={bg.name}
              onClick={() => setSelected(bg.name)}
              style={{
                ...cardStyle, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
                background: sel ? 'rgba(201,168,76,0.08)' : 'rgba(11,9,20,0.9)',
                borderColor: sel ? `${accent}45` : 'rgba(201,168,76,0.1)',
                outline: sel ? `1px solid ${accent}35` : 'none',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: sel ? accent : 'rgba(200,175,130,0.6)', marginBottom: 4, letterSpacing: '0.03em' }}>{bg.name}</div>
              {bonuses && <div style={{ fontSize: 10, color: '#4ade80', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{bonuses}</div>}
              {bg.skillProficiencies?.length > 0 && <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.35)' }}>{bg.skillProficiencies.join(', ')}</div>}
              {bg.feat && <div style={{ fontSize: 10, color: 'rgba(155,89,182,0.6)', marginTop: 3 }}>{bg.feat}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Setup Page ────────────────────────────────────────────────────────

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ'];
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: 30 + Math.random() * 70,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 10, dur: 14 + Math.random() * 8,
}));

export default function CharacterSetup() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [scores, setScores] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [saving, setSaving] = useState(false);

  // Load character overview
  useEffect(() => {
    (async () => {
      try {
        const ov = await invoke('get_overview', { characterId });
        setOverview(ov.overview);
      } catch (err) {
        toast.error('Failed to load character');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [characterId, navigate]);

  const rulesetId = overview?.ruleset || '5e-2014';
  const ruleset = getRuleset(rulesetId);
  const is2024 = rulesetId === '5e-2024';

  // Find race/class data
  const raceData = ruleset.RACES.find(r =>
    r.name === overview?.race && (!r.subrace || r.subrace === overview?.subrace || r.subrace === 'Standard' || r.subrace === '')
  ) || ruleset.RACES.find(r => r.name === overview?.race);

  const classData = ruleset.CLASSES.find(c => c.name === overview?.primary_class);
  const backgrounds = ruleset.BACKGROUNDS || [];
  const backgroundData = backgrounds.find(b => b.name === selectedBackground) || null;

  // Steps depend on edition
  const steps = is2024
    ? [
        { id: 'background', label: 'Background' },
        { id: 'abilities', label: 'Abilities' },
        { id: 'autoapply', label: 'Defaults' },
        { id: 'skills', label: 'Skills' },
        { id: 'review', label: 'Review' },
      ]
    : [
        { id: 'abilities', label: 'Abilities' },
        { id: 'autoapply', label: 'Defaults' },
        { id: 'skills', label: 'Skills' },
        { id: 'review', label: 'Review' },
      ];

  const currentStep = steps[step - 1];
  const isLast = step === steps.length;

  const canNext = () => {
    if (currentStep.id === 'abilities') return scores && Object.keys(scores).length === 6;
    if (currentStep.id === 'skills') return selectedSkills.length === (classData?.skillChoices?.count || 2);
    if (currentStep.id === 'background') return !!selectedBackground;
    return true;
  };

  // Save everything to backend
  const finishSetup = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const conMod = mod(scores?.CON || 10);
      const hp = classData ? classData.hitDie + conMod : 10;
      const ac = 10 + mod(scores?.DEX || 10);
      const bgSkills = backgroundData?.skillProficiencies || [];
      const allSkills = [...new Set([...selectedSkills, ...bgSkills])];

      // 1. Update ability scores
      await invoke('update_ability_scores', {
        characterId,
        payload: ABILITIES.map(a => ({ ability: a, score: scores?.[a] || 10 })),
      });

      // 2. Update saving throws
      const classSaves = classData?.savingThrows || [];
      await invoke('update_saving_throws', {
        characterId,
        payload: ABILITIES.map(a => ({ ability: a, proficient: classSaves.includes(a) })),
      });

      // 3. Update skills
      const allSkillNames = Object.keys(SKILL_ABILITIES);
      await invoke('update_skills', {
        characterId,
        payload: allSkillNames.map(name => ({
          name,
          proficient: allSkills.includes(name),
          expertise: false,
        })),
      });

      // 4. Update overview
      const senses = [];
      if (raceData?.darkvision > 0) senses.push(`Darkvision ${raceData.darkvision} ft`);

      await invoke('update_overview', {
        characterId,
        payload: {
          name: overview.name || 'New Character',
          race: overview.race || '',
          subrace: overview.subrace || '',
          primary_class: overview.primary_class || '',
          primary_subclass: overview.primary_subclass || '',
          level: 1,
          background: selectedBackground || overview.background || '',
          alignment: overview.alignment || '',
          experience_points: 0,
          max_hp: Math.max(1, hp),
          current_hp: Math.max(1, hp),
          temp_hp: 0,
          armor_class: ac,
          speed: raceData?.speed || 30,
          hit_dice_total: `1d${classData?.hitDie || 10}`,
          hit_dice_used: 0,
          death_save_successes: 0,
          death_save_failures: 0,
          inspiration: false,
          senses: senses.join(', '),
          languages: (raceData?.languages || ['Common']).join(', '),
          proficiencies_armor: (classData?.armorProficiencies || []).join(', '),
          proficiencies_weapons: (classData?.weaponProficiencies || []).join(', '),
          proficiencies_tools: '',
          campaign_name: overview.campaign_name || '',
          exhaustion_level: 0,
          ruleset: rulesetId,
          multiclass_data: '[]',
        },
      });

      toast.success(`${overview.name} is ready for adventure!`);
      navigate(`/character/${characterId}`);
    } catch (err) {
      toast.error(`Failed to save: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d12', color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', fontSize: 14 }}>
        Preparing character setup...
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0d0d12', overflow: 'hidden' }}>
      {/* Atmosphere */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(46,31,94,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontFamily: 'serif', fontSize: 12, color: accent, opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
            animate={{ y: [0, -100], opacity: [0, 0.06, 0.03, 0] }}
            transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, repeatDelay: Math.random() * 6 + 4, ease: 'linear' }}
          >
            {p.sym}
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '28px 24px 0', flexShrink: 0 }}>
        {/* Character name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.25)', marginBottom: 4 }}>Character Setup</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#efe0c0', fontWeight: 700 }}>
              {overview?.name || 'New Character'}
              <span style={{ fontSize: 12, color: 'rgba(200,175,130,0.35)', fontWeight: 400, marginLeft: 8 }}>
                {[overview?.race, overview?.primary_class].filter(Boolean).join(' ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/character/${characterId}`)}
            style={{ border: 'none', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.05em' }}
          >
            Skip Setup
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 700, flexShrink: 0,
                  border: `1.5px solid ${done || current ? accent : 'rgba(201,168,76,0.2)'}`,
                  background: done ? accent : current ? `${accent}20` : 'transparent',
                  color: done ? '#12101c' : current ? accent : 'rgba(201,168,76,0.3)',
                  transition: 'all 0.3s',
                }}>
                  {done ? <Check size={11} /> : n}
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', color: current ? accent : 'rgba(200,175,130,0.25)', whiteSpace: 'nowrap' }}>{s.label}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: done ? `${accent}50` : 'rgba(201,168,76,0.1)', marginLeft: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, width: '100%', maxWidth: 620, padding: '0 24px', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep.id === 'background' && (
              <StepBackground backgrounds={backgrounds} selected={selectedBackground} setSelected={setSelectedBackground} />
            )}
            {currentStep.id === 'abilities' && (
              <StepAbilities scores={scores} setScores={setScores} raceData={raceData} />
            )}
            {currentStep.id === 'autoapply' && (
              <StepAutoApply raceData={raceData} classData={classData} backgroundData={backgroundData} scores={scores} />
            )}
            {currentStep.id === 'skills' && (
              <StepSkills classData={classData} backgroundData={backgroundData} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} scores={scores} />
            )}
            {currentStep.id === 'review' && (
              <StepReview overview={overview} scores={scores} classData={classData} raceData={raceData} backgroundData={backgroundData} selectedSkills={selectedSkills} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '16px 24px 24px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            border: 'none', background: 'none', cursor: step > 1 ? 'pointer' : 'not-allowed',
            color: step > 1 ? 'rgba(200,175,130,0.45)' : 'rgba(200,175,130,0.15)',
            fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em',
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>

        <motion.button
          onClick={() => {
            if (isLast) finishSetup();
            else setStep(s => s + 1);
          }}
          disabled={!canNext() || saving}
          whileHover={canNext() && !saving ? { y: -2, boxShadow: `0 5px 18px ${accent}44` } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 24px', borderRadius: 9, border: 'none',
            cursor: canNext() && !saving ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
            background: canNext() ? `linear-gradient(135deg, ${accent}, #f0d878)` : `${accent}20`,
            color: canNext() ? '#12101c' : `${accent}50`,
            opacity: saving ? 0.6 : canNext() ? 1 : 0.5,
          }}
        >
          {saving ? 'Saving…' : isLast ? <><Check size={14} /> Finish Setup</> : <>Continue <ChevronRight size={14} /></>}
        </motion.button>
      </div>

      {/* Version */}
      <div style={{ position: 'fixed', bottom: 12, right: 16, fontFamily: 'var(--font-heading)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(200,175,130,0.12)' }}>
        {APP_VERSION}
      </div>
    </div>
  );
}
