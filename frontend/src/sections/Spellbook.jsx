import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronUp, Sparkles, RotateCcw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpells, addSpell, updateSpell, deleteSpell, getSpellSlots, updateSpellSlots, resetSpellSlots } from '../api/spells';
import { getOverview } from '../api/overview';
import { useRuleset } from '../contexts/RulesetContext';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import { HELP } from '../data/helpText';

function calcMod(score) { const s = typeof score === 'number' && !isNaN(score) ? score : 10; return Math.floor((s - 10) / 2); }

// Subclasses that grant third-caster spellcasting
const THIRD_CASTER_SUBCLASSES = {
  'Eldritch Knight': { ability: 'INT', className: 'Fighter' },
  'Arcane Trickster': { ability: 'INT', className: 'Rogue' },
};

export default function Spellbook({ characterId }) {
  const { PROFICIENCY_BONUS, CLASSES, SPELL_SLOTS } = useRuleset();
  const [spells, setSpells] = useState([]);
  const [slots, setSlots] = useState([]);
  const [charData, setCharData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState(() => {
    try { return sessionStorage.getItem(`codex_spellfilter_${characterId}`) || 'all'; } catch { return 'all'; }
  });
  const [preparedFilter, setPreparedFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [concentratingOn, setConcentratingOn] = useState(null); // spell id
  const [expandedSpell, setExpandedSpell] = useState(null);

  const load = async () => {
    try {
      const [spellData, slotData, overview] = await Promise.all([
        getSpells(characterId),
        getSpellSlots(characterId),
        getOverview(characterId),
      ]);
      setSpells(spellData);
      setSlots(slotData);
      setCharData(overview);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [characterId]);

  // Persist spell level filter to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem(`codex_spellfilter_${characterId}`, levelFilter); } catch {}
  }, [levelFilter, characterId]);

  const filteredSpells = useMemo(() => spells.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(s.name || '').toLowerCase().includes(q) && !(s.school || '').toLowerCase().includes(q) && !(s.description || '').toLowerCase().includes(q)) return false;
    }
    if (levelFilter !== 'all' && s.level !== parseInt(levelFilter, 10)) return false;
    if (preparedFilter === 'prepared' && !s.prepared) return false;
    if (preparedFilter === 'unprepared' && s.prepared) return false;
    return true;
  }), [spells, searchQuery, levelFilter, preparedFilter]);

  const spellsByLevel = useMemo(() => {
    const byLevel = {};
    for (let i = 0; i <= 9; i++) byLevel[i] = [];
    filteredSpells.forEach(s => {
      if (!byLevel[s.level]) byLevel[s.level] = [];
      byLevel[s.level].push(s);
    });
    return byLevel;
  }, [filteredSpells]);

  // Spellcasting calcs — handles base class casters and third-caster subclasses (EK/AT)
  const { spellAbility, spellMod, spellDC, spellAttack, isThirdCaster } = useMemo(() => {
    let ability = '';
    let mod = 0;
    let dc = 0;
    let attack = 0;
    let thirdCaster = false;
    if (charData) {
      const cls = CLASSES.find(c => c.name === charData.overview.primary_class);
      const subclass = charData.overview.primary_subclass;
      const thirdCasterInfo = THIRD_CASTER_SUBCLASSES[subclass];

      if (cls?.spellcasting) {
        ability = cls.spellcasting.ability;
      } else if (thirdCasterInfo && thirdCasterInfo.className === charData.overview.primary_class) {
        ability = thirdCasterInfo.ability;
        thirdCaster = true;
      }

      if (ability) {
        const abilScore = charData?.ability_scores?.find(a => a.ability === ability);
        mod = calcMod(abilScore?.score || 10);
        const profBonus = PROFICIENCY_BONUS[charData.overview.level] || 2;
        dc = 8 + profBonus + mod;
        attack = profBonus + mod;
      }
    }
    return { spellAbility: ability, spellMod: mod, spellDC: dc, spellAttack: attack, isThirdCaster: thirdCaster };
  }, [charData, CLASSES, PROFICIENCY_BONUS]);

  const handleAddSpell = async (spellData) => {
    try {
      await addSpell(characterId, spellData);
      toast.success('Spell added');
      load();
      setShowAdd(false);
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdateSpell = async (spellId, spellData) => {
    try {
      await updateSpell(characterId, spellId, spellData);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteSpell = async (spellId) => {
    try {
      await deleteSpell(characterId, spellId);
      toast.success('Spell removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleSlotToggle = async (level, index) => {
    const slot = slots.find(s => s.slot_level === level);
    if (!slot) return;
    const newUsed = index < slot.used_slots ? index : index + 1;
    const updated = slots.map(s => s.slot_level === level ? { ...s, used_slots: Math.min(newUsed, s.max_slots) } : s);
    setSlots(updated);
    const payload = updated.map(({ slot_level, max_slots, used_slots }) => ({ slot_level, max_slots, used_slots }));
    try { await updateSpellSlots(characterId, payload); } catch (err) { toast.error(err.message); }
  };

  const handleResetSlots = async () => {
    try {
      await resetSpellSlots(characterId);
      toast.success('Spell slots reset');
      load();
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <div className="text-amber-200/40">Loading spellbook...</div>;

  const levelNames = ['Cantrips', '1st Level', '2nd Level', '3rd Level', '4th Level', '5th Level', '6th Level', '7th Level', '8th Level', '9th Level'];

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Sparkles size={20} />
          <div>
            <span>Spellbook</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Manage your known spells, track spell slots, and see your spellcasting stats. Add spells you learn and mark which ones you have prepared for the day.</p>
          </div>
        </h2>
        <div className="flex gap-2">
          <button onClick={handleResetSlots} className="btn-secondary text-xs flex items-center gap-1">
            <RotateCcw size={12} /> Long Rest
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add Spell
          </button>
        </div>
      </div>

      {/* Spell Search */}
      {spells.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
            <input className="input w-full pl-10" placeholder="Search spells by name, school, or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-200/40">Level:</span>
            {['all', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(lv => (
              <button key={lv} onClick={() => setLevelFilter(lv)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${levelFilter === lv ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                {lv === 'all' ? 'All' : lv === '0' ? 'Cantrip' : `${lv}${lv === '1' ? 'st' : lv === '2' ? 'nd' : lv === '3' ? 'rd' : 'th'}`}
              </button>
            ))}
            <span className="text-xs text-amber-200/40 ml-2">Status:</span>
            {['all', 'prepared', 'unprepared'].map(pf => (
              <button key={pf} onClick={() => setPreparedFilter(pf)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${preparedFilter === pf ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                {pf === 'all' ? 'All' : pf}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spellcasting Stats */}
      {spellAbility && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spellcasting Ability<HelpTooltip text={HELP.spellSlots} /></div>
            <div className="text-xl font-display text-purple-300">{spellAbility}</div>
          </div>
          <div className="card text-center" title={`Spell Save DC = 8 + proficiency + ${spellAbility} modifier`}>
            <div className="text-xs text-amber-200/50">Spell Save DC<HelpTooltip text={HELP.spellSaveDC} /></div>
            <div className="text-xl font-display text-purple-300">{spellDC}</div>
          </div>
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spell Attack<HelpTooltip text={HELP.spellAttack} /></div>
            <div className="text-xl font-display text-purple-300">+{spellAttack}</div>
          </div>
        </div>
      )}

      {/* Concentration Banner */}
      {concentratingOn && (() => {
        const spell = spells.find(s => s.id === concentratingOn);
        if (!spell) return null;
        return (
          <div className="bg-purple-950/50 border-2 border-purple-500/40 rounded-lg p-4 shadow-[0_0_20px_rgba(124,77,189,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-sm font-display text-purple-200">Concentrating on:</span>
                <span className="text-sm font-semibold text-purple-100">{spell.name}</span>
                <span className="text-xs bg-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded">C</span>
              </div>
              <button
                onClick={() => setConcentratingOn(null)}
                className="text-xs text-purple-300/60 hover:text-purple-200 border border-purple-500/30 rounded px-2 py-1 transition-colors"
              >
                Drop Concentration
              </button>
            </div>
            <p className="text-xs text-purple-300/50 mt-1.5">Taking damage forces a CON save (DC = max of 10 or half damage taken). Failing ends the spell.</p>
          </div>
        );
      })()}

      {/* Spell Slots */}
      <div className="card overflow-visible">
        <h3 className="font-display text-amber-100 mb-1">
          {charData?.overview.primary_class === 'Warlock' ? 'Pact Magic Slots' : 'Spell Slots'}
          <HelpTooltip text={charData?.overview.primary_class === 'Warlock' ? HELP.pactMagic : HELP.spellSlots} />
          {charData?.overview.primary_class === 'Warlock' && (
            <span className="text-xs text-purple-300/60 font-normal ml-2">(recover on short rest)</span>
          )}
        </h3>
        <p className="text-xs text-amber-200/30 mb-4">Click a circle to mark it as used. Bright = available, dim = spent. Use "Long Rest" to restore all.</p>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
          {[1,2,3,4,5,6,7,8,9].map(level => {
            const slot = slots.find(s => s.slot_level === level);
            const maxSlots = slot?.max_slots || 0;
            const usedSlots = slot?.used_slots || 0;
            if (maxSlots === 0) return (
              <div key={level} className="text-center opacity-30">
                <div className="text-xs text-amber-200/50 mb-1">{levelNames[level]?.split(' ')[0] || level}</div>
                <div className="text-xs">—</div>
              </div>
            );
            return (
              <div key={level} className="text-center pb-1">
                <div className="text-xs text-amber-200/50 mb-2">{levelNames[level]}</div>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {Array.from({ length: Math.max(0, maxSlots) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotToggle(level, i)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        i < usedSlots ? 'bg-purple-600/40 border-purple-400/40' : 'bg-purple-500 border-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.4)]'
                      }`}
                      title={`${maxSlots - usedSlots}/${maxSlots} ${levelNames[level]} slots remaining`}
                      aria-label={`${levelNames[level]} spell slot ${i + 1} of ${maxSlots}, ${i < usedSlots ? 'used' : 'available'}`}
                    />
                  ))}
                </div>
                <div className="text-xs text-amber-200/30 mt-1">{maxSlots - usedSlots}/{maxSlots}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spells by Level */}
      <p className="text-xs text-amber-200/30 -mb-3">Click a spell level header to expand and see your spells. Mark spells as "Prepared" if your class requires it.</p>
      {spells.length === 0 && (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Sparkles size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No spells yet — add your first spell to get started</p>
          <p className="text-xs text-amber-200/20">Use the "Add Spell" button to build your spellbook</p>
        </div>
      )}

      {/* Cantrips — pinned at top */}
      {(spellsByLevel[0] || []).length > 0 && (
        <div className="card border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-amber-100">Cantrips</h3>
            <span className="text-xs text-purple-300/60 font-normal">— At Will</span>
            <span className="text-amber-200/40 text-sm ml-auto">({spellsByLevel[0].length})</span>
          </div>
          <div className="space-y-2">
            {spellsByLevel[0].map(spell => (
              <SpellRow key={spell.id} spell={spell} level={0} spells={spells} concentratingOn={concentratingOn} setConcentratingOn={setConcentratingOn} handleUpdateSpell={handleUpdateSpell} setConfirmDelete={setConfirmDelete} expandedSpell={expandedSpell} setExpandedSpell={setExpandedSpell} />
            ))}
          </div>
        </div>
      )}

      {/* Divider between cantrips and leveled spells */}
      {(spellsByLevel[0] || []).length > 0 && [1,2,3,4,5,6,7,8,9].some(l => (spellsByLevel[l] || []).length > 0) && (
        <div className="border-t border-amber-200/10" />
      )}

      {/* Leveled spells (1-9) */}
      {[1,2,3,4,5,6,7,8,9].map(level => {
        const levelSpells = spellsByLevel[level] || [];
        if (levelSpells.length === 0) return null;
        const isExpanded = expandedLevel === level;
        return (
          <div key={level} className="card">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => setExpandedLevel(isExpanded ? -1 : level)}
            >
              <h3 className="font-display text-amber-100">
                {levelNames[level]} <span className="text-amber-200/40 text-sm ml-2">({levelSpells.length})</span>
              </h3>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isExpanded && (
              <div className="mt-3 space-y-2">
                {levelSpells.map(spell => (
                  <SpellRow key={spell.id} spell={spell} level={level} spells={spells} concentratingOn={concentratingOn} setConcentratingOn={setConcentratingOn} handleUpdateSpell={handleUpdateSpell} setConfirmDelete={setConfirmDelete} expandedSpell={expandedSpell} setExpandedSpell={setExpandedSpell} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Spell Modal */}
      {showAdd && <SpellForm onSubmit={handleAddSpell} onCancel={() => setShowAdd(false)} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Spell?"
        message={`Remove "${confirmDelete?.name}" from your spellbook? This cannot be undone.`}
        onConfirm={() => handleDeleteSpell(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function SpellRow({ spell, level, spells, concentratingOn, setConcentratingOn, handleUpdateSpell, setConfirmDelete, expandedSpell, setExpandedSpell }) {
  return (
    <div className="bg-[#0d0d12] rounded p-3 border border-gold/10">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-100 font-medium">{spell.name}</span>
          {spell.concentration && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (concentratingOn === spell.id) {
                  setConcentratingOn(null);
                } else {
                  if (concentratingOn) {
                    const prev = spells.find(s => s.id === concentratingOn);
                    toast(`Dropped concentration on ${prev?.name || 'previous spell'}`, { icon: '\u26A0\uFE0F', duration: 3000 });
                  }
                  setConcentratingOn(spell.id);
                  toast.success(`Concentrating on ${spell.name}`);
                }
              }}
              className={`text-xs px-1.5 py-0.5 rounded transition-all ${
                concentratingOn === spell.id
                  ? 'bg-purple-600/60 text-purple-100 border border-purple-400/50 shadow-[0_0_8px_rgba(124,77,189,0.3)]'
                  : 'bg-purple-800/40 text-purple-300 hover:bg-purple-700/50'
              }`}
              title={concentratingOn === spell.id ? 'Click to drop concentration' : 'Click to concentrate on this spell'}
            >
              C
            </button>
          )}
          {spell.ritual && <span className="text-xs bg-blue-800/40 text-blue-300 px-1.5 py-0.5 rounded" title="Ritual: Can be cast in 10 extra minutes without using a spell slot.">R</span>}
          {level > 0 && (
            <button
              onClick={() => handleUpdateSpell(spell.id, { ...spell, prepared: !spell.prepared })}
              className={`text-xs px-1.5 py-0.5 rounded ${spell.prepared ? 'bg-emerald-800/40 text-emerald-300' : 'bg-gray-800/40 text-gray-400'}`}
            >
              {spell.prepared ? 'Prepared' : 'Unprepared'}
            </button>
          )}
        </div>
        <button onClick={() => setConfirmDelete(spell)} className="text-red-400/50 hover:text-red-400" aria-label={`Delete spell ${spell.name}`}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="text-xs text-amber-200/40 space-x-3">
        {spell.school && <span>{spell.school}</span>}
        {spell.casting_time && <span>{spell.casting_time}</span>}
        {spell.spell_range && <span>Range: {spell.spell_range}</span>}
        {spell.duration && <span>Duration: {spell.duration}</span>}
      </div>
      {spell.components && (
        <div className="flex items-center gap-1 mt-1">
          {spell.components.split(',').map(c => c.trim()).filter(Boolean).map(comp => {
            const letter = comp.charAt(0).toUpperCase();
            const isM = letter === 'M';
            return (
              <span
                key={comp}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-800/30 text-amber-300/80"
                title={isM && spell.material ? spell.material : `${comp === 'V' ? 'Verbal' : comp === 'S' ? 'Somatic' : comp === 'M' ? 'Material' : comp}`}
              >
                {letter}
              </span>
            );
          })}
        </div>
      )}
      {spell.description && (
        <button
          onClick={() => setExpandedSpell(expandedSpell === spell.id ? null : spell.id)}
          className="flex items-center gap-1 text-xs text-amber-200/30 hover:text-amber-200/50 mt-1.5 transition-colors"
        >
          {expandedSpell === spell.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expandedSpell === spell.id ? 'Hide description' : 'Show description'}
        </button>
      )}
      {expandedSpell === spell.id && spell.description && (
        <p className="text-sm text-amber-200/60 mt-2">{spell.description}</p>
      )}
    </div>
  );
}

function SpellForm({ spell, onSubmit, onCancel }) {
  const [form, setForm] = useState(spell || {
    name: '', level: 0, school: '', casting_time: '1 action',
    spell_range: '', components: '', material: '', duration: '',
    concentration: false, ritual: false, description: '', upcast_notes: '', prepared: false,
  });
  const [nameError, setNameError] = useState(false);

  const update = (field, value) => {
    if (field === 'name') setNameError(false);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { setNameError(true); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Spell</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="Spell name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Level</label>
              <select className="input w-full" value={form.level} onChange={e => update('level', parseInt(e.target.value, 10))}>
                {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? 'Cantrip' : `${l}`}</option>)}
              </select>
            </div>
            <div>
              <label className="label">School</label>
              <select className="input w-full" value={form.school} onChange={e => update('school', e.target.value)}>
                <option value="">Select...</option>
                {['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Casting time" value={form.casting_time} onChange={e => update('casting_time', e.target.value)} />
            <input className="input w-full" placeholder="Range" value={form.spell_range} onChange={e => update('spell_range', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Components (V,S,M)" value={form.components} onChange={e => update('components', e.target.value)} />
            <input className="input w-full" placeholder="Duration" value={form.duration} onChange={e => update('duration', e.target.value)} />
          </div>
          <input className="input w-full" placeholder="Material components" value={form.material} onChange={e => update('material', e.target.value)} />
          <textarea className="input w-full h-24 resize-none" placeholder="Describe the spell's effects, range, components, etc." value={form.description} onChange={e => update('description', e.target.value)} />
          <textarea className="input w-full h-16 resize-none" placeholder="Upcast notes" value={form.upcast_notes} onChange={e => update('upcast_notes', e.target.value)} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.concentration} onChange={e => update('concentration', e.target.checked)} /> Concentration
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.ritual} onChange={e => update('ritual', e.target.checked)} /> Ritual
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.prepared} onChange={e => update('prepared', e.target.checked)} /> Prepared
            </label>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">Add Spell</button>
        </div>
      </div>
    </div>
  );
}
