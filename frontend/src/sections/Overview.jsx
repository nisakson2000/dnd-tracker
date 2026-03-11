import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, Heart, Shield, Zap, Eye, Footprints, Moon, Coffee, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview, updateOverview, updateAbilityScores, updateSavingThrows, updateSkills } from '../api/overview';
import { longRest, shortRest } from '../api/rest';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { useRuleset } from '../contexts/RulesetContext';
import { HELP } from '../data/helpText';

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_NAMES = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };

function calcMod(score) {
  return Math.floor((score - 10) / 2);
}

function modStr(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function Overview({ characterId, character, onCharacterUpdate, onLevelUp }) {
  const { PROFICIENCY_BONUS, SKILLS, RACES, CLASSES, CONDITIONS, EXHAUSTION_LEVELS, ancestryLabel } = useRuleset();
  const [overview, setOverview] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [saves, setSaves] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localAbilities, setLocalAbilities] = useState({});
  const prevLevelRef = useRef(null);

  const loadData = async () => {
    try {
      const data = await getOverview(characterId);
      setOverview(data.overview);
      setAbilities(data.ability_scores);
      setSaves(data.saving_throws);
      setSkills(data.skills);
      // Init local ability display strings
      const localAb = {};
      data.ability_scores.forEach(a => { localAb[a.ability] = String(a.score); });
      setLocalAbilities(localAb);
      prevLevelRef.current = data.overview.level;
    } catch (err) {
      toast.error(`Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [characterId]);

  const saveOverview = useCallback(async (data) => {
    await updateOverview(characterId, data);
    onCharacterUpdate(data);
  }, [characterId, onCharacterUpdate]);

  const saveAbilities = useCallback(async (data) => {
    await updateAbilityScores(characterId, data);
  }, [characterId]);

  const saveSaves = useCallback(async (data) => {
    await updateSavingThrows(characterId, data);
  }, [characterId]);

  const saveSkills = useCallback(async (data) => {
    await updateSkills(characterId, data);
  }, [characterId]);

  const { trigger: triggerOverview, saving: savingOverview, lastSaved: overviewSaved } = useAutosave(saveOverview);
  const { trigger: triggerAbilities } = useAutosave(saveAbilities);
  const { trigger: triggerSaves } = useAutosave(saveSaves);
  const { trigger: triggerSkills } = useAutosave(saveSkills);

  const [showShortRest, setShowShortRest] = useState(false);

  const handleLongRest = async () => {
    try {
      const result = await longRest(characterId);
      result.restored.forEach(msg => toast.success(msg, { duration: 3000 }));
      loadData();
    } catch (err) {
      toast.error(`Long rest failed: ${err.message}`);
    }
  };

  const handleShortRest = async (hitDice = 0) => {
    try {
      const result = await shortRest(characterId, hitDice);
      result.restored.forEach(msg => toast.success(msg, { duration: 3000 }));
      setShowShortRest(false);
      loadData();
    } catch (err) {
      toast.error(`Short rest failed: ${err.message}`);
    }
  };

  const updateField = (field, value) => {
    let v = value;
    // HP clamping
    if (field === 'current_hp') {
      v = Math.max(0, Math.min(v, overview.max_hp || 999));
    }
    if (field === 'temp_hp') {
      v = Math.max(0, v);
    }
    if (field === 'max_hp' && overview.current_hp > v && v > 0) {
      // If max HP drops below current, clamp current
      const updated = { ...overview, [field]: v, current_hp: v };
      setOverview(updated);
      triggerOverview(updated);
      return;
    }

    const updated = { ...overview, [field]: v };
    setOverview(updated);

    if (field === 'level' && prevLevelRef.current !== null && v > prevLevelRef.current) {
      onLevelUp(overview.name, v, overview.primary_class);
    }
    if (field === 'level') {
      prevLevelRef.current = v;
    }

    triggerOverview(updated);
  };

  const updateAbility = (ability, score) => {
    const updated = abilities.map(a => a.ability === ability ? { ...a, score } : a);
    setAbilities(updated);
    setLocalAbilities(prev => ({ ...prev, [ability]: String(score) }));
    triggerAbilities(updated);
  };

  const toggleSave = (ability) => {
    const prev = [...saves];
    const updated = saves.map(s => s.ability === ability ? { ...s, proficient: !s.proficient } : s);
    setSaves(updated);
    triggerSaves(updated);
  };

  const toggleSkillProf = (skillName) => {
    const updated = skills.map(s => s.name === skillName ? { ...s, proficient: !s.proficient, expertise: !s.proficient ? s.expertise : false } : s);
    setSkills(updated);
    triggerSkills(updated);
  };

  const toggleSkillExpertise = (skillName) => {
    const updated = skills.map(s => s.name === skillName ? { ...s, expertise: !s.expertise, proficient: !s.expertise ? true : s.proficient } : s);
    setSkills(updated);
    triggerSkills(updated);
  };

  if (loading || !overview) {
    return <div className="text-amber-200/40">Loading character sheet...</div>;
  }

  const profBonus = PROFICIENCY_BONUS[overview.level] || 2;
  const abilityMap = {};
  abilities.forEach(a => { abilityMap[a.ability] = a.score; });
  const saveMap = {};
  saves.forEach(s => { saveMap[s.ability] = s.proficient; });

  const dexMod = calcMod(abilityMap.DEX || 10);
  const wisMod = calcMod(abilityMap.WIS || 10);
  const percSkill = skills.find(s => s.name === 'Perception');
  const percMod = wisMod + (percSkill?.proficient ? profBonus : 0) + (percSkill?.expertise ? profBonus : 0);
  const passivePerc = 10 + percMod;
  const initiative = dexMod;

  const hpPercent = overview.max_hp > 0 ? (overview.current_hp / overview.max_hp) * 100 : 0;
  const hpBarClass = hpPercent >= 75 ? 'hp-bar-fill hp-high' :
                     hpPercent >= 50 ? 'hp-bar-fill hp-mid' :
                     hpPercent >= 25 ? 'hp-bar-fill hp-low' :
                     'hp-bar-fill hp-critical';

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-amber-100">Character Sheet</h2>
          <p className="text-xs text-amber-200/40 mt-1">Your character's core stats, abilities, and vitals. This is the hub for everything that defines who your character is mechanically.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator saving={savingOverview} lastSaved={overviewSaved} />
          <button
            onClick={() => setShowShortRest(true)}
            className="btn-secondary text-xs flex items-center gap-1"
            title="Rest for 1 hour. Spend hit dice to recover HP. Restores some class features."
          >
            <Coffee size={12} /> Short Rest
          </button>
          <button
            onClick={handleLongRest}
            className="btn-secondary text-xs flex items-center gap-1"
            title="Rest for 8 hours. Restores HP, spell slots, and most resources. Reduces exhaustion by 1."
          >
            <Moon size={12} /> Long Rest
          </button>
          <button
            onClick={() => {
              if (overview.level < 20) {
                updateField('level', overview.level + 1);
              }
            }}
            className="btn-secondary text-xs flex items-center gap-1"
            disabled={overview.level >= 20}
          >
            <TrendingUp size={12} /> Level Up!
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Name</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.name || 'Unknown'}</div>
          </div>
          <div>
            <label className="label">{ancestryLabel}</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.race || 'Not set'}</div>
          </div>
          <div>
            <label className="label">Class</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.primary_class || 'Not set'}</div>
          </div>
          <div>
            <label className="label">Level</label>
            <input type="number" className="input w-full" min={1} max={20}
              value={overview.level} onChange={e => updateField('level', parseInt(e.target.value) || 1)} />
          </div>
          <div>
            <label className="label">Subclass</label>
            {overview.primary_subclass ? (
              <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.primary_subclass}</div>
            ) : (
              (() => {
                const cls = CLASSES.find(c => c.name === overview.primary_class);
                const subs = cls?.subclasses || [];
                if (subs.length > 0) {
                  return (
                    <select className="input w-full" value={overview.primary_subclass} onChange={e => updateField('primary_subclass', e.target.value)}>
                      <option value="">Select...</option>
                      {subs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  );
                }
                return <input className="input w-full" value={overview.primary_subclass || ''} onChange={e => updateField('primary_subclass', e.target.value)} />;
              })()
            )}
          </div>
          <div>
            <label className="label">Background</label>
            <input className="input w-full" value={overview.background} onChange={e => updateField('background', e.target.value)} />
          </div>
          <div>
            <label className="label">Alignment</label>
            <select className="input w-full" value={overview.alignment} onChange={e => updateField('alignment', e.target.value)}>
              <option value="">Select...</option>
              {['Lawful Good','Neutral Good','Chaotic Good','Lawful Neutral','True Neutral','Chaotic Neutral','Lawful Evil','Neutral Evil','Chaotic Evil'].map(a =>
                <option key={a} value={a}>{a}</option>
              )}
            </select>
          </div>
          <div>
            <label className="label">Campaign</label>
            <input className="input w-full" value={overview.campaign_name} onChange={e => updateField('campaign_name', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Two-column layout for wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column: Ability Scores, Saving Throws, Skills */}
        <div className="space-y-6">
          {/* Ability Scores */}
          <div className="card">
            <h3 className="font-display text-amber-100 mb-4">Ability Scores<HelpTooltip text={HELP.modifier} /></h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {ABILITIES.map(ab => {
                const score = abilityMap[ab] || 10;
                const mod = calcMod(score);
                return (
                  <div key={ab} className="text-center p-4 rounded-lg bg-[#0a0a10] border-2 border-gold/20 hover:border-gold/40 transition-all">
                    <div className="text-[11px] text-amber-200/50 font-display tracking-widest mb-2">{ab}</div>
                    <div className="text-3xl font-bold text-gold mb-1">{modStr(mod)}</div>
                    <input
                      type="number" min={1} max={30}
                      className="input text-center w-16 mx-auto text-sm"
                      value={localAbilities[ab] ?? score}
                      onChange={e => setLocalAbilities(prev => ({ ...prev, [ab]: e.target.value }))}
                      onBlur={e => {
                        const val = parseInt(e.target.value) || 10;
                        updateAbility(ab, val);
                      }}
                    />
                    <div className="text-[10px] text-amber-200/30 mt-1">{ABILITY_NAMES[ab]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saving Throws */}
          <div className="card">
            <h3 className="font-display text-amber-100 mb-1">Saving Throws<HelpTooltip text={HELP.savingThrows} /></h3>
            <p className="text-xs text-amber-200/30 mb-3">Click to mark proficiency — adds +{profBonus} to the roll.</p>
            <div className="space-y-0.5">
              {ABILITIES.map(ab => {
                const score = abilityMap[ab] || 10;
                const prof = saveMap[ab] || false;
                const mod = calcMod(score) + (prof ? profBonus : 0);
                return (
                  <div
                    key={ab}
                    onClick={() => toggleSave(ab)}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer group hover:bg-white/[0.03] transition-colors select-none"
                  >
                    {/* Proficiency indicator */}
                    <div className={`prof-circle${prof ? ' active' : ''}`} />
                    <span className={`text-sm font-semibold w-8 text-right transition-colors ${prof ? 'text-gold' : 'text-amber-200/35'}`}>{modStr(mod)}</span>
                    <span className={`text-sm flex-1 transition-colors ${prof ? 'text-amber-100' : 'text-amber-200/60'}`}>{ABILITY_NAMES[ab]}</span>
                    {prof && (
                      <span className="text-[10px] font-display tracking-wider text-gold bg-gold/15 border border-gold/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">PROF</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-display text-amber-100 mb-1">Skills</h3>
            {/* Legend */}
            <div className="flex items-center gap-3.5 mb-3 text-[11px] text-amber-200/35">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-gold border-2 border-gold shadow-[0_0_6px_rgba(201,168,76,0.35)]" />
                Proficient (+{profBonus})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rotate-45 rounded-sm bg-purple-600 border-2 border-purple-400 shadow-[0_0_6px_rgba(124,77,189,0.4)]" />
                Expertise (+{profBonus * 2})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-amber-200/25 bg-amber-200/[0.04]" />
                None
              </span>
            </div>
            <div className="space-y-0 max-h-[380px] overflow-y-auto pr-1 skill-list">
              {Object.entries(SKILLS).sort(([a], [b]) => a.localeCompare(b)).map(([skillName, ability]) => {
                const sk = skills.find(s => s.name === skillName);
                const score = abilityMap[ability] || 10;
                const mod = calcMod(score) + (sk?.proficient ? profBonus : 0) + (sk?.expertise ? profBonus : 0);
                const state = sk?.expertise ? 'expertise' : sk?.proficient ? 'proficient' : 'none';
                return (
                  <div key={skillName} className="flex items-center gap-2 py-[5px] px-1.5 rounded group hover:bg-white/[0.025] transition-colors select-none">
                    {/* Proficiency circle */}
                    <button
                      onClick={() => toggleSkillProf(skillName)}
                      className={`prof-circle${sk?.proficient ? ' active' : ''}`}
                      style={{ width: '16px', height: '16px' }}
                      title={sk?.proficient ? 'Proficient — click to remove' : 'Click to add proficiency'}
                    />
                    {/* Expertise diamond */}
                    <button
                      onClick={() => toggleSkillExpertise(skillName)}
                      className={`expertise-diamond${sk?.expertise ? ' active' : ''}`}
                      title={sk?.expertise ? 'Expertise — click to remove' : 'Click to add expertise (auto-grants proficiency)'}
                    />
                    <span className={`text-[13px] font-semibold w-[30px] text-right flex-shrink-0 transition-colors ${
                      state === 'expertise' ? 'text-purple-300' : state === 'proficient' ? 'text-gold' : 'text-amber-200/35'
                    }`}>{modStr(mod)}</span>
                    <span className={`text-[13px] flex-1 transition-colors ${
                      state === 'expertise' ? 'text-purple-100' : state === 'proficient' ? 'text-amber-100' : 'text-amber-200/60'
                    }`}>{skillName}</span>
                    <span className="text-[10px] font-display tracking-wider text-amber-200/[0.18] w-[26px] text-right">{ability}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: HP, Core Stats, Hit Dice, Death Saves, Conditions */}
        <div className="space-y-6">
          {/* Proficiency + Core Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1">Proficiency<HelpTooltip text={HELP.proficiencyBonus} /></div>
              <div className="text-2xl font-display text-gold">{modStr(profBonus)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Shield size={12} /> AC<HelpTooltip text={HELP.ac} /></div>
              <input type="number" className="input text-center text-2xl font-display w-20 mx-auto" value={overview.armor_class} onChange={e => updateField('armor_class', parseInt(e.target.value) || 10)} />
            </div>
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Zap size={12} /> Initiative<HelpTooltip text={HELP.initiative} /></div>
              <div className="text-2xl font-display text-amber-100">{modStr(initiative)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Footprints size={12} /> Speed</div>
              <input type="number" className="input text-center text-2xl font-display w-20 mx-auto" value={overview.speed} onChange={e => updateField('speed', parseInt(e.target.value) || 30)} />
            </div>
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Eye size={12} /> Passive Perc.<HelpTooltip text={HELP.passivePerception} /></div>
              <div className="text-2xl font-display text-amber-100">{passivePerc}</div>
            </div>
          </div>

          {/* HP Section */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-red-400" />
              <h3 className="font-display text-amber-100">Hit Points<HelpTooltip text={HELP.hp} /></h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label className="label">Max HP</label>
                <input type="number" className="input w-full" value={overview.max_hp} onChange={e => updateField('max_hp', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Current HP</label>
                <input type="number" className="input w-full" value={overview.current_hp} onChange={e => updateField('current_hp', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Temp HP<HelpTooltip text={HELP.tempHp} /></label>
                <input type="number" className="input w-full" value={overview.temp_hp} onChange={e => updateField('temp_hp', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            {/* HP bar with color states and temp HP segment */}
            <div className="hp-bar-bg" style={{ marginTop: '10px' }}>
              <div
                className={`hp-bar-fill${hpPercent < 10 ? ' animate-pulse' : ''}`}
                style={{
                  width: `${Math.min(100, Math.max(0, hpPercent))}%`,
                  background: hpPercent < 10
                    ? 'linear-gradient(90deg, #7f1d1d, #ef4444)'
                    : hpPercent < 25
                    ? 'linear-gradient(90deg, #c2410c, #f97316)'
                    : hpPercent <= 50
                    ? 'linear-gradient(90deg, #a16207, #eab308)'
                    : 'linear-gradient(90deg, #166534, #4ade80)',
                }}
              />
              {overview.temp_hp > 0 && overview.max_hp > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${Math.min(100, Math.max(0, hpPercent))}%`,
                    width: `${Math.min(100 - hpPercent, (overview.temp_hp / overview.max_hp) * 100)}%`,
                    height: '100%',
                    background: 'rgba(96,165,250,0.6)',
                    borderRadius: '0 4px 4px 0',
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', fontFamily: 'Outfit, sans-serif' }}>
              <span style={{ color: hpPercent < 25 ? '#fca5a5' : 'rgba(255,255,255,0.5)', fontWeight: hpPercent < 25 ? 600 : 400 }}>
                {overview.current_hp} / {overview.max_hp} HP
              </span>
              {overview.temp_hp > 0 && (
                <span style={{ color: '#93c5fd' }}>+{overview.temp_hp} temp</span>
              )}
            </div>
          </div>

          {/* Hit Dice & Death Saves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-display text-amber-100 mb-1">Hit Dice<HelpTooltip text={HELP.hitDice} /></h3>
              <p className="text-xs text-amber-200/30 mb-3">Spend during short rests to heal. Total = your class die (e.g., "3d10"). Half recover on long rest.</p>
              <div className="flex items-center gap-4">
                <div>
                  <label className="label">Total</label>
                  <input className="input w-24" placeholder="e.g. 5d10" value={overview.hit_dice_total} onChange={e => updateField('hit_dice_total', e.target.value)} />
                </div>
                <div>
                  <label className="label">Used</label>
                  <input type="number" className="input w-20" min={0} value={overview.hit_dice_used} onChange={e => updateField('hit_dice_used', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-display text-amber-100 mb-1">Death Saves<HelpTooltip text={HELP.deathSaves} /></h3>
              <p className="text-xs text-amber-200/30 mb-3">Click circles to track saves when at 0 HP. Three of either = outcome.</p>
              <div className="flex gap-8">
                <div>
                  <label className="label text-emerald-400/70 mb-1.5">Successes</label>
                  <div className="flex gap-2.5">
                    {[1,2,3].map(i => (
                      <button key={i}
                        onClick={() => updateField('death_save_successes', overview.death_save_successes === i ? i-1 : i)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          i <= overview.death_save_successes
                            ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : 'border-emerald-400/25 hover:border-emerald-400/50'
                        }`}
                        title={i <= overview.death_save_successes ? 'Click to remove success' : 'Click to mark success'}
                      >
                        {i <= overview.death_save_successes && <Check size={14} className="text-white" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label text-red-400/70 mb-1.5">Failures</label>
                  <div className="flex gap-2.5">
                    {[1,2,3].map(i => (
                      <button key={i}
                        onClick={() => updateField('death_save_failures', overview.death_save_failures === i ? i-1 : i)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          i <= overview.death_save_failures
                            ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                            : 'border-red-400/25 hover:border-red-400/50'
                        }`}
                        title={i <= overview.death_save_failures ? 'Click to remove failure' : 'Click to mark failure'}
                      >
                        {i <= overview.death_save_failures && <span className="text-white text-sm font-bold">&times;</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-amber-200/25 mt-3">
                At 0 HP, roll d20 each turn: 10+ = success, 9 or less = failure. Nat 20 = regain 1 HP. Nat 1 = two failures.
              </p>
            </div>
          </div>

          {/* Inspiration & Exhaustion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-display text-amber-100 mb-1">Inspiration<HelpTooltip text={HELP.inspiration} /></h3>
              <p className="text-xs text-amber-200/30 mb-3">Click the star to toggle. Spend to gain advantage on one roll.</p>
              <button
                onClick={() => updateField('inspiration', !overview.inspiration)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  overview.inspiration
                    ? 'bg-gold/20 border-gold text-gold shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                    : 'border-amber-200/20 text-amber-200/20 hover:border-amber-200/40'
                }`}
                title={overview.inspiration ? 'Inspired! Click to spend' : 'No inspiration — click when your DM awards it'}
              >
                <Star size={20} fill={overview.inspiration ? 'currentColor' : 'none'} />
              </button>
              <p className={`text-xs mt-2 ${overview.inspiration ? 'text-gold/60' : 'text-amber-200/20'}`}>
                {overview.inspiration ? 'Inspired! Use it for advantage on a roll.' : 'Not inspired'}
              </p>
            </div>

            <div className="card">
              <h3 className="font-display text-amber-100 mb-1">Exhaustion<HelpTooltip text={HELP.exhaustion} /></h3>
              <p className="text-xs text-amber-200/30 mb-3">Click a level to set. Effects stack. One level removed per long rest.</p>
              <div className="flex gap-1.5 flex-wrap">
                {EXHAUSTION_LEVELS.map((effect, i) => {
                  const lvl = i + 1;
                  return (
                    <button key={lvl}
                      onClick={() => updateField('exhaustion_level', overview.exhaustion_level === lvl ? lvl-1 : lvl)}
                      className={`w-9 h-9 rounded text-xs font-bold transition-all ${
                        lvl <= overview.exhaustion_level
                          ? 'bg-red-700/50 border-2 border-red-500 text-red-200 shadow-[0_0_6px_rgba(239,68,68,0.2)]'
                          : 'border-2 border-amber-200/15 text-amber-200/25 hover:border-amber-200/30'
                      }`}
                      title={`Level ${lvl}: ${effect}`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
              {overview.exhaustion_level > 0 && (
                <div className="text-xs text-red-300/60 mt-2 space-y-0.5">
                  {EXHAUSTION_LEVELS.slice(0, overview.exhaustion_level).map((effect, i) => (
                    <p key={i}>Level {i + 1}: {effect}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Race Traits & Class Features */}
      {(() => {
        const raceData = RACES.find(r => {
          const val = r.subrace ? `${r.name} (${r.subrace})` : r.name;
          return val === overview.race;
        });
        const classData = CLASSES.find(c => c.name === overview.primary_class);
        const raceTraits = raceData?.traits || [];
        const classFeatures = (classData?.features || []).filter(f => f.level <= overview.level);
        if (raceTraits.length === 0 && classFeatures.length === 0) return null;
        return (
          <div className="card">
            <h3 className="font-display text-amber-100 mb-3">Features & Traits</h3>
            {raceTraits.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-200/40 mb-2">
                  Racial Traits — {overview.race}
                </h4>
                <div className="space-y-2">
                  {raceTraits.map((t, i) => (
                    <div key={i} className="bg-[#0a0a10] rounded p-3 border border-amber-200/8">
                      <div className="text-sm text-amber-100 font-medium">{t.name}</div>
                      <div className="text-xs text-amber-200/45 mt-0.5">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {classFeatures.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-200/40 mb-2">
                  Class Features — {overview.primary_class} (Lv {overview.level})
                </h4>
                <div className="space-y-2">
                  {classFeatures.map((f, i) => (
                    <div key={i} className="bg-[#0a0a10] rounded p-3 border border-amber-200/8">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-100 font-medium">{f.name}</span>
                        <span className="text-[10px] text-amber-200/30 bg-amber-200/5 px-1.5 py-0.5 rounded">Lv {f.level}</span>
                      </div>
                      <div className="text-xs text-amber-200/45 mt-0.5">{f.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Misc fields */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-1">Proficiencies & Senses</h3>
        <p className="text-xs text-amber-200/30 mb-3">Record what your character can see, speak, and use. Check your class and race for these.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Senses</label>
            <input className="input w-full" value={overview.senses} onChange={e => updateField('senses', e.target.value)} placeholder="Darkvision 60ft..." />
          </div>
          <div>
            <label className="label">Languages</label>
            <input className="input w-full" value={overview.languages} onChange={e => updateField('languages', e.target.value)} placeholder="Common, Elvish..." />
          </div>
          <div>
            <label className="label">Armor Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_armor} onChange={e => updateField('proficiencies_armor', e.target.value)} />
          </div>
          <div>
            <label className="label">Weapon Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_weapons} onChange={e => updateField('proficiencies_weapons', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Tool Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_tools} onChange={e => updateField('proficiencies_tools', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Short Rest Modal */}
      {showShortRest && (
        <ShortRestModal
          overview={overview}
          onRest={handleShortRest}
          onCancel={() => setShowShortRest(false)}
        />
      )}
    </div>
  );
}

function ShortRestModal({ overview, onRest, onCancel }) {
  const [diceToSpend, setDiceToSpend] = useState(0);
  const available = Math.max(0, overview.level - overview.hit_dice_used);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-2">Short Rest</h3>
        <p className="text-sm text-amber-200/50 mb-4">
          Rest for at least 1 hour. You may spend hit dice to recover HP.
          Roll each die and add your CON modifier to regain that much HP.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-amber-200/60">
            <span>Available Hit Dice</span>
            <span className="text-amber-100 font-display">{available} / {overview.level}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-amber-200/60">
            <span>Current HP</span>
            <span className="text-amber-100">{overview.current_hp} / {overview.max_hp}</span>
          </div>

          {available > 0 && (
            <div>
              <label className="label">Hit Dice to Spend</label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={available}
                  value={diceToSpend} onChange={e => setDiceToSpend(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-display text-gold w-8 text-center">{diceToSpend}</span>
              </div>
              <p className="text-xs text-amber-200/30 mt-1">
                Each die: roll {overview.hit_dice_total?.replace(/^\d+/, '1') || '1d10'} + CON modifier, add to current HP
              </p>
            </div>
          )}

          {overview.primary_class === 'Warlock' && (
            <p className="text-xs text-purple-300/70 bg-purple-900/20 rounded p-2">
              Pact Magic spell slots will be fully restored.
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => onRest(diceToSpend)} className="btn-primary text-sm">Rest</button>
        </div>
      </div>
    </div>
  );
}
