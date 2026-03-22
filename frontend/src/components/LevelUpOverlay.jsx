import { useState, useEffect, useCallback, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getLevelUpGains } from '../utils/levelUpGains';
import { rollDie } from '../utils/dice';
import { addFeature, getFeatures, updateFeature } from '../api/features';
import { updateAbilityScores } from '../api/overview';
import { FEAT_CATALOG } from '../data/featCatalog';
import { Star, Swords, Sparkles, BookOpen, ArrowUp, Heart, Dices, Search, Check, X } from 'lucide-react';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
  size: 2 + Math.random() * 6,
}));

const ABILITY_LABELS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_FULL = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma',
};

function GainSection({ icon, title, children, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="flex items-start gap-3"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div className="text-amber-400/70 mt-0.5 shrink-0">{icon}</div>
      <div className="w-full">
        <div className="text-xs text-amber-200/50 uppercase tracking-wider mb-0.5">{title}</div>
        {children}
      </div>
    </div>
  );
}

// ASI levels per class (standard 5e)
const ASI_LEVELS = [4, 8, 12, 16, 19];

// ---------- ASI Picker sub-component ----------
function ASIPicker({ characterId, abilityScores, level, className: charClass, onDone }) {
  const [mode, setMode] = useState(null); // 'plus2' | 'plus1x2' | 'feat'
  const [selected, setSelected] = useState([]); // ability names selected
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Feat state
  const [featSearch, setFeatSearch] = useState('');
  const [selectedFeat, setSelectedFeat] = useState(null);

  const scoreMap = useMemo(() => {
    const m = {};
    for (const ab of abilityScores) m[ab.ability] = ab.score;
    return m;
  }, [abilityScores]);

  const filteredFeats = useMemo(() => {
    if (!featSearch.trim()) return FEAT_CATALOG;
    const q = featSearch.toLowerCase();
    return FEAT_CATALOG.filter(f => f.name.toLowerCase().includes(q));
  }, [featSearch]);

  const canConfirmASI = () => {
    if (mode === 'plus2') return selected.length === 1;
    if (mode === 'plus1x2') return selected.length === 2;
    return false;
  };

  const wouldExceedMax = (ability, bonus) => (scoreMap[ability] || 10) + bonus > 20;

  const toggleAbility = (ab) => {
    if (mode === 'plus2') {
      if (wouldExceedMax(ab, 2)) return;
      setSelected(prev => prev[0] === ab ? [] : [ab]);
    } else if (mode === 'plus1x2') {
      if (wouldExceedMax(ab, 1) && !selected.includes(ab)) return;
      setSelected(prev => {
        if (prev.includes(ab)) return prev.filter(a => a !== ab);
        if (prev.length >= 2) return prev;
        return [...prev, ab];
      });
    }
  };

  const handleConfirmASI = async (e) => {
    e.stopPropagation();
    if (confirming || confirmed) return;
    setConfirming(true);
    try {
      const updated = abilityScores.map(ab => {
        const bonus =
          mode === 'plus2' && selected.includes(ab.ability) ? 2 :
          mode === 'plus1x2' && selected.includes(ab.ability) ? 1 : 0;
        return { ability: ab.ability, score: ab.score + bonus };
      });
      await updateAbilityScores(characterId, updated);
      setConfirmed(true);
      if (onDone) onDone();
    } catch (err) {
      console.warn('[LevelUpOverlay] Failed to update ability scores:', err);
    } finally {
      setConfirming(false);
    }
  };

  const handleConfirmFeat = async (e) => {
    e.stopPropagation();
    if (confirming || confirmed || !selectedFeat) return;
    setConfirming(true);
    try {
      await addFeature(characterId, {
        name: selectedFeat.name,
        description: selectedFeat.description || '',
        source: 'Feat',
        source_level: level,
      });
      setConfirmed(true);
      if (onDone) onDone();
    } catch (err) {
      console.warn('[LevelUpOverlay] Failed to add feat:', err);
    } finally {
      setConfirming(false);
    }
  };

  if (confirmed) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-display mt-1">
        <Check size={14} />
        {mode === 'feat' ? `Feat "${selectedFeat?.name}" added!` : 'Ability scores updated!'}
      </div>
    );
  }

  const radioStyle = (active) => ({
    background: active ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#fde68a' : 'rgba(253,230,138,0.5)',
  });

  const abilityBtnStyle = (ab, isSelected) => {
    const atMax = mode === 'plus2' ? wouldExceedMax(ab, 2) : wouldExceedMax(ab, 1);
    const disabled = !isSelected && atMax;
    return {
      background: isSelected ? 'rgba(201,168,76,0.25)' : disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isSelected ? 'rgba(201,168,76,0.6)' : disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}`,
      color: disabled ? 'rgba(253,230,138,0.25)' : '#fde68a',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
    };
  };

  return (
    <div className="space-y-3 mt-1" onClick={(e) => e.stopPropagation()}>
      {/* Mode selection */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'plus2', label: '+2 to one ability' },
          { key: 'plus1x2', label: '+1 to two abilities' },
          { key: 'feat', label: 'Take a Feat' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => { setMode(opt.key); setSelected([]); setSelectedFeat(null); }}
            className="px-3 py-1.5 rounded-md text-xs font-display transition-all duration-200 hover:scale-105"
            style={radioStyle(mode === opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* +2 to one / +1 to two — ability grid */}
      {(mode === 'plus2' || mode === 'plus1x2') && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {ABILITY_LABELS.map(ab => {
              const score = scoreMap[ab] ?? 10;
              const isSelected = selected.includes(ab);
              const bonus = mode === 'plus2' ? 2 : 1;
              return (
                <button
                  key={ab}
                  onClick={() => toggleAbility(ab)}
                  className="flex flex-col items-center py-2 px-2 rounded-lg text-center transition-all duration-150"
                  style={abilityBtnStyle(ab, isSelected)}
                >
                  <span className="text-xs font-bold tracking-wider">{ab}</span>
                  <span className="text-lg font-display">{score}</span>
                  {isSelected && (
                    <span className="text-xs text-emerald-400 font-display">
                      +{bonus} → {score + bonus}
                    </span>
                  )}
                  {!isSelected && score + bonus > 20 && (
                    <span className="text-[10px] text-red-400/60">max 20</span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleConfirmASI}
            disabled={!canConfirmASI() || confirming}
            className="w-full py-2 rounded-lg text-sm font-display transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: canConfirmASI() ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${canConfirmASI() ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
              color: canConfirmASI() ? '#6ee7b7' : 'rgba(255,255,255,0.2)',
              cursor: canConfirmASI() ? 'pointer' : 'not-allowed',
            }}
          >
            {confirming ? 'Applying...' : 'Confirm ASI'}
          </button>
        </div>
      )}

      {/* Feat picker */}
      {mode === 'feat' && (
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-200/30" />
            <input
              type="text"
              value={featSearch}
              onChange={(e) => { setFeatSearch(e.target.value); setSelectedFeat(null); }}
              placeholder="Search feats..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md text-sm bg-white/5 border border-white/10 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Feat list */}
          <div
            className="max-h-[150px] overflow-y-auto space-y-1 scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredFeats.length === 0 && (
              <p className="text-xs text-amber-200/30 text-center py-2">No feats match your search.</p>
            )}
            {filteredFeats.map(feat => (
              <button
                key={feat.id}
                onClick={() => setSelectedFeat(feat)}
                className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150"
                style={{
                  background: selectedFeat?.id === feat.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedFeat?.id === feat.id ? 'rgba(201,168,76,0.4)' : 'transparent'}`,
                  color: '#fde68a',
                }}
              >
                <span className="font-display">{feat.name}</span>
                {feat.prerequisite && (
                  <span className="text-[10px] text-amber-200/30 ml-2">({feat.prerequisite})</span>
                )}
              </button>
            ))}
          </div>

          {/* Selected feat detail */}
          {selectedFeat && (
            <div
              className="rounded-lg p-3"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <div className="text-sm font-display text-amber-100 mb-1">{selectedFeat.name}</div>
              <p className="text-xs text-amber-200/60 leading-relaxed">{selectedFeat.description}</p>
              {selectedFeat.prerequisite && (
                <p className="text-[10px] text-amber-200/40 mt-1 italic">Prerequisite: {selectedFeat.prerequisite}</p>
              )}
            </div>
          )}

          <button
            onClick={handleConfirmFeat}
            disabled={!selectedFeat || confirming}
            className="w-full py-2 rounded-lg text-sm font-display transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: selectedFeat ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selectedFeat ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
              color: selectedFeat ? '#6ee7b7' : 'rgba(255,255,255,0.2)',
              cursor: selectedFeat ? 'pointer' : 'not-allowed',
            }}
          >
            {confirming ? 'Adding...' : 'Confirm Feat'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LevelUpOverlay({ show, name, level, className, rulesetId, characterId, onDismiss }) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [contentIn, setContentIn] = useState(false);
  const [gainsIn, setGainsIn] = useState(false);
  const [hintIn, setHintIn] = useState(false);

  // HP roll state
  const [hpChoice, setHpChoice] = useState(null); // null | 'average' | 'roll'
  const [hpRollResult, setHpRollResult] = useState(null);
  const [conModifier, setConModifier] = useState(0);
  const [featuresAdded, setFeaturesAdded] = useState(false);

  // Ability scores for ASI picker
  const [abilityScores, setAbilityScores] = useState([]);

  const gains = show ? getLevelUpGains(className, level, rulesetId) : null;

  // Parse hit die size from gains.hitDie (e.g. "d8" -> 8)
  const hitDieSize = gains?.hitDie ? parseInt(gains.hitDie.replace('d', '')) : 0;
  const averageHp = hitDieSize ? Math.floor(hitDieSize / 2) + 1 : 0;

  // Fetch CON modifier and ability scores when overlay shows
  useEffect(() => {
    if (!show || !characterId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await invoke('get_overview', { characterId });
        if (cancelled) return;
        const abilities = data.ability_scores || [];
        setAbilityScores(abilities);
        const conAb = abilities.find(a => a.ability === 'CON');
        setConModifier(conAb ? Math.floor((conAb.score - 10) / 2) : 0);
      } catch (err) {
        console.warn('[LevelUpOverlay] Failed to load ability scores:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [show, characterId]);

  // Reset HP choice state when overlay opens/closes
  useEffect(() => {
    if (show) {
      setHpChoice(null);
      setHpRollResult(null);
      setFeaturesAdded(false);
    }
  }, [show]);

  // Auto-add class features on level up when overlay is shown
  useEffect(() => {
    if (!show || !characterId || !gains || featuresAdded) return;
    let cancelled = false;
    (async () => {
      try {
        const featuresToAdd = gains.features || [];
        for (const feat of featuresToAdd) {
          if (cancelled) break;
          const payload = {
            name: feat.name,
            description: feat.description || '',
            source: className || '',
            source_level: level,
          };
          // Add uses/recharge if present in the feature data
          if (feat.uses_total != null) {
            payload.uses_total = feat.uses_total;
            payload.uses_remaining = feat.uses_total;
          }
          if (feat.recharge) {
            payload.recharge = feat.recharge;
          }
          await addFeature(characterId, payload);
        }
        // Auto-scale class resources (Ki/Focus Points, Sorcery Points, etc.)
        const resourceUpdates = gains.resourceUpdates || [];
        if (resourceUpdates.length > 0) {
          try {
            const existingFeatures = await getFeatures(characterId);
            for (const update of resourceUpdates) {
              if (cancelled) break;
              const existing = existingFeatures.find(f => f.name === update.name);
              if (existing && existing.uses_total !== update.uses_total) {
                await updateFeature(characterId, existing.id, {
                  ...existing,
                  uses_total: update.uses_total,
                  uses_remaining: Math.min(existing.uses_remaining + (update.uses_total - existing.uses_total), update.uses_total),
                });
              }
            }
          } catch (err) {
            console.warn('[LevelUpOverlay] Failed to auto-scale resources:', err);
          }
        }
        if (!cancelled) setFeaturesAdded(true);
      } catch (err) {
        console.warn('[LevelUpOverlay] Failed to auto-add features:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [show, characterId, gains, className, level, featuresAdded]);

  const handleTakeAverage = useCallback((e) => {
    e.stopPropagation();
    setHpChoice('average');
    setHpRollResult(null);
  }, []);

  const handleRollHp = useCallback((e) => {
    e.stopPropagation();
    const roll = rollDie(hitDieSize);
    setHpChoice('roll');
    setHpRollResult(roll);
  }, [hitDieSize]);

  // Compute final HP gain
  const getHpGain = () => {
    if (hpChoice === 'average') return Math.max(1, averageHp + conModifier);
    if (hpChoice === 'roll' && hpRollResult != null) return Math.max(1, hpRollResult + conModifier);
    return null;
  };

  const hpGain = getHpGain();

  useEffect(() => {
    if (show) {
      setMounted(true);
      // Stagger the animations
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
      const t1 = setTimeout(() => setContentIn(true), 300);
      const t2 = setTimeout(() => setGainsIn(true), 1000);
      const t3 = setTimeout(() => setHintIn(true), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setAnimateIn(false);
      setContentIn(false);
      setGainsIn(false);
      setHintIn(false);
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
      style={{
        opacity: animateIn ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.1) 30%, transparent 60%)',
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #c9a84c, #f0d878)',
            boxShadow: '0 0 6px #c9a84c',
            bottom: '-5%',
            animation: `levelup-particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-lg w-full mx-4"
        style={{
          opacity: contentIn ? 1 : 0,
          transform: contentIn ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <h1
          className="text-7xl md:text-8xl font-display font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #f0d878, #c9a84c, #f0d878)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        >
          LEVEL UP!
        </h1>

        <div
          className="text-2xl md:text-3xl text-amber-200/80 mt-6"
          style={{
            opacity: contentIn ? 1 : 0,
            transform: contentIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s',
          }}
        >
          <span className="text-amber-100 font-display">{name}</span>
        </div>

        <div
          className="text-5xl md:text-6xl font-display mt-4"
          style={{
            color: '#c9a84c',
            textShadow: '0 0 30px rgba(201,168,76,0.5)',
            opacity: contentIn ? 1 : 0,
            transform: contentIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease 0.5s, transform 0.4s ease 0.5s',
          }}
        >
          Level {level}
        </div>

        {/* Divider */}
        <div
          className="h-px mx-auto mt-6 mb-5 w-3/4"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)',
            opacity: gainsIn ? 1 : 0,
            transform: gainsIn ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        />

        {/* Gains */}
        {gains && gainsIn && (
          <div className="max-h-[40vh] overflow-y-auto text-left space-y-4 px-2 scrollbar-thin">

            {/* HP Roll Choice */}
            {hitDieSize > 0 && (
              <div
                className="flex flex-col items-center gap-3 text-center"
                style={{
                  opacity: gainsIn ? 1 : 0,
                  transform: gainsIn ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s',
                }}
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-red-400/70" />
                  <span className="text-xs text-amber-200/50 uppercase tracking-wider">Hit Points</span>
                </div>

                {hpChoice === null ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTakeAverage}
                      className="px-3 py-1.5 rounded-md text-sm font-display transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'rgba(201,168,76,0.15)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: '#fde68a',
                      }}
                    >
                      Take Average ({averageHp})
                    </button>
                    <span className="text-xs text-amber-200/30">or</span>
                    <button
                      onClick={handleRollHp}
                      className="px-3 py-1.5 rounded-md text-sm font-display transition-all duration-200 hover:scale-105 flex items-center gap-1.5"
                      style={{
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        color: '#c4b5fd',
                      }}
                    >
                      <Dices size={14} />
                      Roll (1d{hitDieSize})
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    {hpChoice === 'average' && (
                      <div className="text-lg font-display text-amber-100">
                        <span className="text-amber-200/50 text-sm">Average: </span>
                        {averageHp}
                        <span className="text-amber-200/50 text-sm"> {conModifier >= 0 ? '+' : ''}{conModifier} CON</span>
                        <span className="text-emerald-400 ml-2">= +{hpGain} HP</span>
                      </div>
                    )}
                    {hpChoice === 'roll' && hpRollResult != null && (
                      <div className="text-lg font-display text-amber-100">
                        <span className="text-purple-300 text-sm">Rolled: </span>
                        <span className="text-purple-200">{hpRollResult}</span>
                        <span className="text-amber-200/50 text-sm"> on 1d{hitDieSize}</span>
                        <span className="text-amber-200/50 text-sm"> {conModifier >= 0 ? '+' : ''}{conModifier} CON</span>
                        <span className="text-emerald-400 ml-2">= +{hpGain} HP</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Proficiency Bonus */}
            {gains.proficiencyBonus && (
              <div
                className="flex items-center justify-center gap-6 text-center"
                style={{
                  opacity: gainsIn ? 1 : 0,
                  transform: gainsIn ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
                }}
              >
                <div>
                  <div className="text-xs text-amber-200/50 uppercase tracking-wider">Proficiency</div>
                  <div className="text-lg font-display text-emerald-300">
                    +{gains.proficiencyBonus.old} → +{gains.proficiencyBonus.new}
                  </div>
                </div>
              </div>
            )}

            {/* Spell Slots */}
            {gains.newSpellSlots && (
              <GainSection icon={<Sparkles size={16} />} title="New Spell Slots" delay={1.3}>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {Object.entries(gains.newSpellSlots).map(([label, value]) => (
                    <span key={label} className="text-sm text-purple-300">
                      <span className="text-purple-200/70">{label}:</span> {value}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-purple-300/50 mt-2 italic">
                  You may learn new spells — visit the Spellbook section to add them.
                </p>
              </GainSection>
            )}

            {/* ASI */}
            {gains.isASI && (
              <GainSection icon={<ArrowUp size={16} />} title="Ability Score Improvement" delay={1.4}>
                {abilityScores.length > 0 ? (
                  <ASIPicker
                    characterId={characterId}
                    abilityScores={abilityScores}
                    level={level}
                    className={className}
                  />
                ) : (
                  <p className="text-sm text-amber-100">
                    Loading ability scores...
                  </p>
                )}
              </GainSection>
            )}

            {/* Class Features */}
            {gains.features.length > 0 && (
              <GainSection icon={<BookOpen size={16} />} title="Class Features" delay={1.5}>
                <div className="space-y-2">
                  {gains.features.map((f, i) => (
                    <div key={`${f.name}-${i}`}>
                      <span className="text-sm font-medium text-amber-100">{f.name}</span>
                      <p className="text-xs text-amber-200/50 leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
                {featuresAdded && (
                  <p className="text-xs text-emerald-400/60 mt-2 italic">
                    Features auto-added to your character sheet
                  </p>
                )}
              </GainSection>
            )}
          </div>
        )}

        <p
          className="text-sm text-amber-200/40 mt-6"
          style={{
            opacity: hintIn ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          Click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
