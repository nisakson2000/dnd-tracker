import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, Heart, Shield, Zap, Eye, Footprints, Moon, Coffee, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview, updateOverview, updateAbilityScores, updateSavingThrows, updateSkills } from '../api/overview';
import { longRest, shortRest } from '../api/rest';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { useRuleset } from '../contexts/RulesetContext';
import { RULESET_OPTIONS } from '../data/rulesets';
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
            <input className="input w-full" value={overview.name} onChange={e => updateField('name', e.target.value)} />
          </div>
          <div>
            <label className="label">{ancestryLabel}</label>
            <select className="input w-full" value={overview.race} onChange={e => updateField('race', e.target.value)}>
              <option value="">Select...</option>
              {RACES.map(r => (
                <option key={`${r.name}-${r.subrace}`} value={r.subrace ? `${r.name} (${r.subrace})` : r.name}>
                  {r.subrace ? `${r.name} (${r.subrace})` : r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Class</label>
            <select className="input w-full" value={overview.primary_class} onChange={e => updateField('primary_class', e.target.value)}>
              <option value="">Select...</option>
              {CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Level</label>
            <input type="number" className="input w-full" min={1} max={20}
              value={overview.level} onChange={e => updateField('level', parseInt(e.target.value) || 1)} />
          </div>
          <div>
            <label className="label">Subclass</label>
            {(() => {
              const cls = CLASSES.find(c => c.name === overview.primary_class);
              const subs = cls?.subclasses || [];
              if (subs.length > 0) {
                return (
                  <select className="input w-full" value={overview.primary_subclass} onChange={e => updateField('primary_subclass', e.target.value)}>
                    <option value="">Select...</option>
                    {subs.map(s => <option key={s} value={s}>{s}</option>)}
                    {overview.primary_subclass && !subs.includes(overview.primary_subclass) && (
                      <option value={overview.primary_subclass}>{overview.primary_subclass}</option>
                    )}
                  </select>
                );
              }
              return <input className="input w-full" value={overview.primary_subclass} onChange={e => updateField('primary_subclass', e.target.value)} />;
            })()}
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
          <div>
            <label className="label">Ruleset</label>
            <select className="input w-full" value={overview.ruleset || '5e-2014'} onChange={e => updateField('ruleset', e.target.value)}>
              {RULESET_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
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
            <p className="text-xs text-amber-200/30 mb-3">Click the circle to mark proficiency — adds your proficiency bonus ({modStr(profBonus)}) to the roll.</p>
            <div className="space-y-1.5">
              {ABILITIES.map(ab => {
                const score = abilityMap[ab] || 10;
                const prof = saveMap[ab] || false;
                const mod = calcMod(score) + (prof ? profBonus : 0);
                return (
                  <div key={ab} className="flex items-center gap-3 py-1 group">
                    <button
                      onClick={() => toggleSave(ab)}
                      className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                        prof
                          ? 'bg-gold border-gold shadow-[0_0_6px_rgba(201,168,76,0.3)]'
                          : 'border-amber-200/25 hover:border-amber-200/50'
                      }`}
                      title={prof ? 'Proficient — click to remove' : 'Not proficient — click to add'}
                    >
                      {prof && <Check size={12} className="text-[#0d0d12]" strokeWidth={3} />}
                    </button>
                    <span className={`text-sm font-medium w-8 ${prof ? 'text-gold' : 'text-amber-200/50'}`}>{modStr(mod)}</span>
                    <span className="text-sm text-amber-200/80">{ABILITY_NAMES[ab]}</span>
                    {prof && <span className="text-[10px] text-gold/40 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">proficient</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-display text-amber-100 mb-1">Skills</h3>
            <p className="text-xs text-amber-200/30 mb-3">
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-gold"></span> Proficient (+{profBonus})</span>
              <span className="mx-2">|</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-purple-500"></span> Expertise (+{profBonus * 2})</span>
            </p>
            <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-2">
              {Object.entries(SKILLS).sort(([a], [b]) => a.localeCompare(b)).map(([skillName, ability]) => {
                const sk = skills.find(s => s.name === skillName);
                const score = abilityMap[ability] || 10;
                const mod = calcMod(score) + (sk?.proficient ? profBonus : 0) + (sk?.expertise ? profBonus : 0);
                return (
                  <div key={skillName} className="flex items-center gap-2 py-1 group hover:bg-white/[0.02] rounded px-1 -mx-1">
                    <button
                      onClick={() => toggleSkillProf(skillName)}
                      className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                        sk?.proficient
                          ? 'bg-gold border-gold shadow-[0_0_4px_rgba(201,168,76,0.3)]'
                          : 'border-amber-200/25 hover:border-amber-200/50'
                      }`}
                      title={sk?.proficient ? 'Proficient — click to remove' : 'Not proficient — click to add'}
                    >
                      {sk?.proficient && <Check size={10} className="text-[#0d0d12]" strokeWidth={3} />}
                    </button>
                    <button
                      onClick={() => toggleSkillExpertise(skillName)}
                      className={`w-5 h-5 rounded border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                        sk?.expertise
                          ? 'bg-purple-500 border-purple-400 shadow-[0_0_4px_rgba(168,85,247,0.3)]'
                          : 'border-amber-200/15 hover:border-amber-200/40'
                      }`}
                      title={sk?.expertise ? 'Expertise — click to remove (requires proficiency)' : 'No expertise — click to add (auto-grants proficiency)'}
                    >
                      {sk?.expertise && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>
                    <span className={`text-sm w-8 text-right font-medium ${sk?.expertise ? 'text-purple-300' : sk?.proficient ? 'text-gold' : 'text-amber-200/40'}`}>{modStr(mod)}</span>
                    <span className="text-sm text-amber-200/80 flex-1">{skillName}</span>
                    <span className="text-[11px] text-amber-200/25">{ability}</span>
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
            <div className="hp-bar-container">
              <div
                className={hpBarClass}
                style={{ width: `${Math.min(100, Math.max(0, hpPercent))}%` }}
              />
            </div>
            <div className="text-xs text-amber-200/40 mt-1">
              {overview.current_hp} / {overview.max_hp}
              {overview.temp_hp > 0 && ` (+${overview.temp_hp} temp)`}
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
