import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Swords } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAttacks, addAttack, deleteAttack, getConditions, updateConditions, getCombatNotes, updateCombatNotes } from '../api/combat';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { useRuleset } from '../contexts/RulesetContext';
import { HELP, ACTION_ECONOMY } from '../data/helpText';

const CONDITION_ICONS = {
  'Blinded': '\u{1F441}', 'Charmed': '\u{1F495}', 'Deafened': '\u{1F507}',
  'Exhaustion': '\u{1F635}', 'Frightened': '\u{1F631}', 'Grappled': '\u{1F91D}',
  'Incapacitated': '\u{1F4AB}', 'Invisible': '\u{1F47B}', 'Paralyzed': '\u{26A1}',
  'Petrified': '\u{1FAA8}', 'Poisoned': '\u{1F922}', 'Prone': '\u{2B07}',
  'Restrained': '\u{26D3}', 'Stunned': '\u{2B50}', 'Unconscious': '\u{1F480}',
};

export default function Combat({ characterId, onConditionsChange }) {
  const { CONDITIONS } = useRuleset();
  const [attacks, setAttacks] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [notes, setNotes] = useState({ actions: '', bonus_actions: '', reactions: '', legendary_actions: '' });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showConditionInfo, setShowConditionInfo] = useState(null);

  const load = async () => {
    try {
      const [atkData, condData, notesData] = await Promise.all([
        getAttacks(characterId), getConditions(characterId), getCombatNotes(characterId),
      ]);
      setAttacks(atkData);
      setConditions(condData);
      setNotes(notesData);
      onConditionsChange?.(condData.filter(c => c.active).length);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const saveNotesFn = useCallback(async (data) => {
    await updateCombatNotes(characterId, data);
  }, [characterId]);
  const { trigger: triggerNotes, saving, lastSaved } = useAutosave(saveNotesFn);

  const updateNote = (field, value) => {
    const updated = { ...notes, [field]: value };
    setNotes(updated);
    triggerNotes(updated);
  };

  const handleAddAttack = async (data) => {
    try {
      await addAttack(characterId, data);
      toast.success('Attack added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteAttack = async (id) => {
    try {
      await deleteAttack(characterId, id);
      toast.success('Attack removed');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleCondition = async (condName) => {
    const previous = [...conditions];
    const updated = conditions.map(c => c.name === condName ? { ...c, active: !c.active } : c);
    setConditions(updated);
    onConditionsChange?.(updated.filter(c => c.active).length);
    try { await updateConditions(characterId, updated); }
    catch (err) { setConditions(previous); onConditionsChange?.(previous.filter(c => c.active).length); toast.error(err.message); }
  };

  if (loading) return <div className="text-amber-200/40">Loading combat...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Swords size={20} />
          <div>
            <span>Combat</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your weapons, active conditions, and combat notes. Use the action economy reference below to know what you can do on your turn.</p>
          </div>
        </h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add Attack
        </button>
      </div>

      {/* Attacks */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-1">Attacks & Weapons<HelpTooltip text="Roll d20 + attack bonus. If the total meets or exceeds the target's AC, you hit. Then roll damage dice + modifier." /></h3>
        <p className="text-xs text-amber-200/30 mb-3">Your melee and ranged attacks. To attack: roll d20 + Attack bonus vs target's AC. On a hit, roll Damage.</p>
        {attacks.length === 0 ? (
          <p className="text-sm text-amber-200/30">No attacks configured. Add your weapons and cantrips here so you can quickly reference them during combat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-amber-200/40 text-left">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Attack</th>
                  <th className="pb-2">Damage</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Range</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attacks.map(atk => (
                  <tr key={atk.id} className="border-t border-gold/10">
                    <td className="py-2 text-amber-100">{atk.name}</td>
                    <td className="py-2 text-gold">{atk.attack_bonus}</td>
                    <td className="py-2">{atk.damage_dice}</td>
                    <td className="py-2 text-amber-200/50">{atk.damage_type}</td>
                    <td className="py-2 text-amber-200/50">{atk.attack_range}</td>
                    <td className="py-2">
                      <button onClick={() => handleDeleteAttack(atk.id)} className="text-red-400/50 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conditions */}
      <ConditionsPanel
        conditions={conditions}
        conditionDescriptions={CONDITIONS}
        onToggle={toggleCondition}
      />

      {/* Combat Notes */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-amber-100">Action Notes<HelpTooltip text={HELP.actions} /></h3>
          <SaveIndicator saving={saving} lastSaved={lastSaved} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'actions', label: 'Actions' },
            { key: 'bonus_actions', label: 'Bonus Actions' },
            { key: 'reactions', label: 'Reactions' },
            { key: 'legendary_actions', label: 'Legendary/Lair Actions' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <textarea className="input w-full h-24 resize-none" value={notes[key]} onChange={e => updateNote(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Economy Reference */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">{ACTION_ECONOMY.title}</h3>
        {ACTION_ECONOMY.sections.map(section => (
          <div key={section.label} className="mb-3 last:mb-0">
            <h4 className="text-xs text-gold font-semibold mb-1.5">{section.label}</h4>
            <ul className="space-y-1">
              {section.items.map((item, i) => (
                <li key={i} className="text-xs text-amber-200/60 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gold/40">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showAdd && <AttackForm onSubmit={handleAddAttack} onCancel={() => setShowAdd(false)} />}
    </div>
  );
}

function AttackForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', attack_bonus: '+0', damage_dice: '1d6', damage_type: '', attack_range: '', notes: '',
  });
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Attack</h3>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Weapon name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Attack bonus" value={form.attack_bonus} onChange={e => update('attack_bonus', e.target.value)} />
            <input className="input w-full" placeholder="Damage (e.g. 1d8+3)" value={form.damage_dice} onChange={e => update('damage_dice', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Damage type" value={form.damage_type} onChange={e => update('damage_type', e.target.value)} />
            <input className="input w-full" placeholder="Range" value={form.attack_range} onChange={e => update('attack_range', e.target.value)} />
          </div>
          <textarea className="input w-full h-16 resize-none" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.name && onSubmit(form)} className="btn-primary text-sm">Add</button>
        </div>
      </div>
    </div>
  );
}

function ConditionsPanel({ conditions, conditionDescriptions, onToggle }) {
  const [expanded, setExpanded] = useState(null);

  const handleConditionClick = (condName) => {
    onToggle(condName);
    if (expanded === condName) setExpanded(null);
  };

  const handleContextMenu = (e, condName) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(prev => prev === condName ? null : condName);
  };

  return (
    <div className="card">
      <h3 className="font-display text-amber-100 mb-1">Active Conditions</h3>
      <p className="text-xs text-amber-200/30 mb-3">
        Left-click to toggle on/off. Right-click for rule description.
      </p>
      <div className="flex flex-wrap gap-2">
        {conditions.map(cond => (
          <div key={cond.name} className="relative">
            <button
              onClick={() => handleConditionClick(cond.name)}
              onContextMenu={(e) => handleContextMenu(e, cond.name)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all select-none ${
                cond.active
                  ? 'bg-red-800/40 text-red-300 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                  : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/70 hover:border-amber-200/20'
              }`}
            >
              {CONDITION_ICONS[cond.name] && <span className="mr-1">{CONDITION_ICONS[cond.name]}</span>}
              {cond.name}
            </button>

            {expanded === cond.name && conditionDescriptions[cond.name] && (
              <div className="absolute z-20 top-full left-0 mt-1 p-3 bg-[#14121c] border border-gold/20 rounded text-xs text-amber-200/60 w-64 shadow-xl">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-display text-amber-100">{cond.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                    className="text-amber-200/30 hover:text-amber-200/60 text-xs ml-2"
                  >
                    &times;
                  </button>
                </div>
                <p className="leading-relaxed">{conditionDescriptions[cond.name]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {conditions.some(c => c.active) && (
        <div className="mt-3 pt-3 border-t border-amber-200/5 flex flex-wrap gap-1">
          <span className="text-xs text-amber-200/30 mr-1">Active:</span>
          {conditions.filter(c => c.active).map(c => (
            <span key={c.name} className="text-xs text-red-300">
              {CONDITION_ICONS[c.name] || ''} {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
