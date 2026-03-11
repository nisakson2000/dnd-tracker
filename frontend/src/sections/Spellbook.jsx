import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Sparkles, RotateCcw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpells, addSpell, updateSpell, deleteSpell, getSpellSlots, updateSpellSlots, resetSpellSlots } from '../api/spells';
import { getOverview } from '../api/overview';
import { useRuleset } from '../contexts/RulesetContext';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import { HELP } from '../data/helpText';

function calcMod(score) { return Math.floor((score - 10) / 2); }

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
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  const filteredSpells = searchQuery
    ? spells.filter(s => {
        const q = searchQuery.toLowerCase();
        return (s.name || '').toLowerCase().includes(q) || (s.school || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
      })
    : spells;

  const spellsByLevel = {};
  for (let i = 0; i <= 9; i++) spellsByLevel[i] = [];
  filteredSpells.forEach(s => {
    if (!spellsByLevel[s.level]) spellsByLevel[s.level] = [];
    spellsByLevel[s.level].push(s);
  });

  // Spellcasting calcs — handles base class casters and third-caster subclasses (EK/AT)
  let spellAbility = '';
  let spellMod = 0;
  let spellDC = 0;
  let spellAttack = 0;
  let isThirdCaster = false;
  if (charData) {
    const cls = CLASSES.find(c => c.name === charData.overview.primary_class);
    const subclass = charData.overview.primary_subclass;
    const thirdCasterInfo = THIRD_CASTER_SUBCLASSES[subclass];

    if (cls?.spellcasting) {
      spellAbility = cls.spellcasting.ability;
    } else if (thirdCasterInfo && thirdCasterInfo.className === charData.overview.primary_class) {
      spellAbility = thirdCasterInfo.ability;
      isThirdCaster = true;
    }

    if (spellAbility) {
      const abilScore = charData.ability_scores.find(a => a.ability === spellAbility);
      spellMod = calcMod(abilScore?.score || 10);
      const profBonus = PROFICIENCY_BONUS[charData.overview.level] || 2;
      spellDC = 8 + profBonus + spellMod;
      spellAttack = profBonus + spellMod;
    }
  }

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
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
          <input className="input w-full pl-10" placeholder="Search spells by name, school, or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      )}

      {/* Spellcasting Stats */}
      {spellAbility && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spellcasting Ability<HelpTooltip text={HELP.spellSlots} /></div>
            <div className="text-xl font-display text-purple-300">{spellAbility}</div>
          </div>
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spell Save DC<HelpTooltip text={HELP.spellSaveDC} /></div>
            <div className="text-xl font-display text-purple-300">{spellDC}</div>
          </div>
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spell Attack<HelpTooltip text={HELP.spellAttack} /></div>
            <div className="text-xl font-display text-purple-300">+{spellAttack}</div>
          </div>
        </div>
      )}

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
                  {Array.from({ length: maxSlots }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotToggle(level, i)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        i < usedSlots ? 'bg-purple-600/40 border-purple-400/40' : 'bg-purple-500 border-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.4)]'
                      }`}
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
      {[0,1,2,3,4,5,6,7,8,9].map(level => {
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
                {levelSpells.length === 0 && <p className="text-sm text-amber-200/30">No spells at this level.</p>}
                {levelSpells.map(spell => (
                  <div key={spell.id} className="bg-[#0d0d12] rounded p-3 border border-gold/10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-100 font-medium">{spell.name}</span>
                        {spell.concentration && <span className="text-xs bg-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded" title="Concentration: You must maintain focus. Taking damage forces a CON save.">C</span>}
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
                      <button onClick={() => setConfirmDelete(spell)} className="text-red-400/50 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-amber-200/40 space-x-3">
                      {spell.school && <span>{spell.school}</span>}
                      {spell.casting_time && <span>{spell.casting_time}</span>}
                      {spell.spell_range && <span>{spell.spell_range}</span>}
                      {spell.duration && <span>{spell.duration}</span>}
                    </div>
                    {spell.components && <div className="text-xs text-amber-200/30 mt-1">Components: {spell.components} {spell.material && `(${spell.material})`}</div>}
                    {spell.description && <p className="text-sm text-amber-200/60 mt-2">{spell.description}</p>}
                  </div>
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

function SpellForm({ spell, onSubmit, onCancel }) {
  const [form, setForm] = useState(spell || {
    name: '', level: 0, school: '', casting_time: '1 action',
    spell_range: '', components: '', material: '', duration: '',
    concentration: false, ritual: false, description: '', upcast_notes: '', prepared: false,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

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
          <input className="input w-full" placeholder="Spell name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Level</label>
              <select className="input w-full" value={form.level} onChange={e => update('level', parseInt(e.target.value))}>
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
          <textarea className="input w-full h-24 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
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
          <button onClick={() => form.name && onSubmit(form)} className="btn-primary text-sm">Add Spell</button>
        </div>
      </div>
    </div>
  );
}
