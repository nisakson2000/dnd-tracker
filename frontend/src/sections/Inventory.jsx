import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Package, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import { getItems, addItem, updateItem, deleteItem, getCurrency, updateCurrency } from '../api/inventory';
import { getOverview } from '../api/overview';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';

// ── Item Catalog: standard PHB weapons, armor, and gear ──
const ITEM_CATALOG = {
  weapon: {
    'Simple Melee': [
      { name: 'Club', damage_dice: '1d4', damage_type: 'bludgeoning', weight: 2, value_gp: 0.1, properties: 'Light' },
      { name: 'Dagger', damage_dice: '1d4', damage_type: 'piercing', weight: 1, value_gp: 2, properties: 'Finesse, Light, Thrown (20/60)' },
      { name: 'Greatclub', damage_dice: '1d8', damage_type: 'bludgeoning', weight: 10, value_gp: 0.2, properties: 'Two-handed' },
      { name: 'Handaxe', damage_dice: '1d6', damage_type: 'slashing', weight: 2, value_gp: 5, properties: 'Light, Thrown (20/60)' },
      { name: 'Javelin', damage_dice: '1d6', damage_type: 'piercing', weight: 2, value_gp: 0.5, properties: 'Thrown (30/120)' },
      { name: 'Light Hammer', damage_dice: '1d4', damage_type: 'bludgeoning', weight: 2, value_gp: 2, properties: 'Light, Thrown (20/60)' },
      { name: 'Mace', damage_dice: '1d6', damage_type: 'bludgeoning', weight: 4, value_gp: 5, properties: '—' },
      { name: 'Quarterstaff', damage_dice: '1d6', damage_type: 'bludgeoning', weight: 4, value_gp: 0.2, properties: 'Versatile (1d8)' },
      { name: 'Sickle', damage_dice: '1d4', damage_type: 'slashing', weight: 2, value_gp: 1, properties: 'Light' },
      { name: 'Spear', damage_dice: '1d6', damage_type: 'piercing', weight: 3, value_gp: 1, properties: 'Thrown (20/60), Versatile (1d8)' },
    ],
    'Simple Ranged': [
      { name: 'Light Crossbow', damage_dice: '1d8', damage_type: 'piercing', weight: 5, value_gp: 25, properties: 'Ammunition (80/320), Loading, Two-handed' },
      { name: 'Dart', damage_dice: '1d4', damage_type: 'piercing', weight: 0.25, value_gp: 0.05, properties: 'Finesse, Thrown (20/60)' },
      { name: 'Shortbow', damage_dice: '1d6', damage_type: 'piercing', weight: 2, value_gp: 25, properties: 'Ammunition (80/320), Two-handed' },
      { name: 'Sling', damage_dice: '1d4', damage_type: 'bludgeoning', weight: 0, value_gp: 0.1, properties: 'Ammunition (30/120)' },
    ],
    'Martial Melee': [
      { name: 'Battleaxe', damage_dice: '1d8', damage_type: 'slashing', weight: 4, value_gp: 10, properties: 'Versatile (1d10)' },
      { name: 'Flail', damage_dice: '1d8', damage_type: 'bludgeoning', weight: 2, value_gp: 10, properties: '—' },
      { name: 'Glaive', damage_dice: '1d10', damage_type: 'slashing', weight: 6, value_gp: 20, properties: 'Heavy, Reach, Two-handed' },
      { name: 'Greataxe', damage_dice: '1d12', damage_type: 'slashing', weight: 7, value_gp: 30, properties: 'Heavy, Two-handed' },
      { name: 'Greatsword', damage_dice: '2d6', damage_type: 'slashing', weight: 6, value_gp: 50, properties: 'Heavy, Two-handed' },
      { name: 'Halberd', damage_dice: '1d10', damage_type: 'slashing', weight: 6, value_gp: 20, properties: 'Heavy, Reach, Two-handed' },
      { name: 'Lance', damage_dice: '1d12', damage_type: 'piercing', weight: 6, value_gp: 10, properties: 'Reach, Special' },
      { name: 'Longsword', damage_dice: '1d8', damage_type: 'slashing', weight: 3, value_gp: 15, properties: 'Versatile (1d10)' },
      { name: 'Maul', damage_dice: '2d6', damage_type: 'bludgeoning', weight: 10, value_gp: 10, properties: 'Heavy, Two-handed' },
      { name: 'Morningstar', damage_dice: '1d8', damage_type: 'piercing', weight: 4, value_gp: 15, properties: '—' },
      { name: 'Pike', damage_dice: '1d10', damage_type: 'piercing', weight: 18, value_gp: 5, properties: 'Heavy, Reach, Two-handed' },
      { name: 'Rapier', damage_dice: '1d8', damage_type: 'piercing', weight: 2, value_gp: 25, properties: 'Finesse' },
      { name: 'Scimitar', damage_dice: '1d6', damage_type: 'slashing', weight: 3, value_gp: 25, properties: 'Finesse, Light' },
      { name: 'Shortsword', damage_dice: '1d6', damage_type: 'piercing', weight: 2, value_gp: 10, properties: 'Finesse, Light' },
      { name: 'Trident', damage_dice: '1d6', damage_type: 'piercing', weight: 4, value_gp: 5, properties: 'Thrown (20/60), Versatile (1d8)' },
      { name: 'War Pick', damage_dice: '1d8', damage_type: 'piercing', weight: 2, value_gp: 5, properties: '—' },
      { name: 'Warhammer', damage_dice: '1d8', damage_type: 'bludgeoning', weight: 2, value_gp: 15, properties: 'Versatile (1d10)' },
      { name: 'Whip', damage_dice: '1d4', damage_type: 'slashing', weight: 3, value_gp: 2, properties: 'Finesse, Reach' },
    ],
    'Martial Ranged': [
      { name: 'Blowgun', damage_dice: '1', damage_type: 'piercing', weight: 1, value_gp: 10, properties: 'Ammunition (25/100), Loading' },
      { name: 'Hand Crossbow', damage_dice: '1d6', damage_type: 'piercing', weight: 3, value_gp: 75, properties: 'Ammunition (30/120), Light, Loading' },
      { name: 'Heavy Crossbow', damage_dice: '1d10', damage_type: 'piercing', weight: 18, value_gp: 50, properties: 'Ammunition (100/400), Heavy, Loading, Two-handed' },
      { name: 'Longbow', damage_dice: '1d8', damage_type: 'piercing', weight: 2, value_gp: 50, properties: 'Ammunition (150/600), Heavy, Two-handed' },
      { name: 'Net', damage_dice: '—', damage_type: '—', weight: 3, value_gp: 1, properties: 'Special, Thrown (5/15)' },
    ],
  },
  armor: {
    'Light Armor': [
      { name: 'Padded Armor', ac_formula: '11 + DEX', weight: 8, value_gp: 5, properties: 'Disadvantage on Stealth' },
      { name: 'Leather Armor', ac_formula: '11 + DEX', weight: 10, value_gp: 10, properties: '—' },
      { name: 'Studded Leather', ac_formula: '12 + DEX', weight: 13, value_gp: 45, properties: '—' },
    ],
    'Medium Armor': [
      { name: 'Hide Armor', ac_formula: '12 + DEX (max 2)', weight: 12, value_gp: 10, properties: '—' },
      { name: 'Chain Shirt', ac_formula: '13 + DEX (max 2)', weight: 20, value_gp: 50, properties: '—' },
      { name: 'Scale Mail', ac_formula: '14 + DEX (max 2)', weight: 45, value_gp: 50, properties: 'Disadvantage on Stealth' },
      { name: 'Breastplate', ac_formula: '14 + DEX (max 2)', weight: 20, value_gp: 400, properties: '—' },
      { name: 'Half Plate', ac_formula: '15 + DEX (max 2)', weight: 40, value_gp: 750, properties: 'Disadvantage on Stealth' },
    ],
    'Heavy Armor': [
      { name: 'Ring Mail', ac_formula: '14', weight: 40, value_gp: 30, properties: 'Disadvantage on Stealth' },
      { name: 'Chain Mail', ac_formula: '16', weight: 55, value_gp: 75, properties: 'Disadvantage on Stealth, STR 13' },
      { name: 'Splint Armor', ac_formula: '17', weight: 60, value_gp: 200, properties: 'Disadvantage on Stealth, STR 15' },
      { name: 'Plate Armor', ac_formula: '18', weight: 65, value_gp: 1500, properties: 'Disadvantage on Stealth, STR 15' },
    ],
    'Shield': [
      { name: 'Shield', ac_formula: '+2', weight: 6, value_gp: 10, properties: '—' },
    ],
  },
};

// ── Proficiency resolver ──
function getCharacterProficiencies(characterClass, characterRace) {
  const SIMPLE_MELEE   = ['Club','Dagger','Greatclub','Handaxe','Javelin','Light Hammer','Mace','Quarterstaff','Sickle','Spear'];
  const SIMPLE_RANGED  = ['Light Crossbow','Dart','Shortbow','Sling'];
  const SIMPLE_ALL     = [...SIMPLE_MELEE, ...SIMPLE_RANGED];
  const MARTIAL_MELEE  = ['Battleaxe','Flail','Glaive','Greataxe','Greatsword','Halberd','Lance','Longsword','Maul','Morningstar','Pike','Rapier','Scimitar','Shortsword','Trident','War Pick','Warhammer','Whip'];
  const MARTIAL_RANGED = ['Blowgun','Hand Crossbow','Heavy Crossbow','Longbow','Net'];
  const MARTIAL_ALL    = [...MARTIAL_MELEE, ...MARTIAL_RANGED];
  const LIGHT_ARMOR    = ['Padded Armor','Leather Armor','Studded Leather'];
  const MEDIUM_ARMOR   = ['Hide Armor','Chain Shirt','Scale Mail','Breastplate','Half Plate'];
  const HEAVY_ARMOR    = ['Ring Mail','Chain Mail','Splint Armor','Plate Armor'];
  const SHIELDS        = ['Shield'];
  const ALL_ARMOR      = [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...HEAVY_ARMOR, ...SHIELDS];

  const CLASS_PROFS = {
    'Barbarian':  { weapons: [...SIMPLE_ALL, ...MARTIAL_ALL], armor: [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...SHIELDS] },
    'Bard':       { weapons: [...SIMPLE_ALL, 'Hand Crossbow', 'Longsword', 'Rapier', 'Shortsword'], armor: LIGHT_ARMOR },
    'Cleric':     { weapons: SIMPLE_ALL, armor: [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...SHIELDS] },
    'Druid':      { weapons: ['Club','Dagger','Dart','Javelin','Mace','Quarterstaff','Scimitar','Sickle','Sling','Spear'], armor: [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...SHIELDS] },
    'Fighter':    { weapons: [...SIMPLE_ALL, ...MARTIAL_ALL], armor: ALL_ARMOR },
    'Monk':       { weapons: [...SIMPLE_ALL, 'Shortsword'], armor: [] },
    'Paladin':    { weapons: [...SIMPLE_ALL, ...MARTIAL_ALL], armor: ALL_ARMOR },
    'Ranger':     { weapons: [...SIMPLE_ALL, ...MARTIAL_ALL], armor: [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...SHIELDS] },
    'Rogue':      { weapons: [...SIMPLE_ALL, 'Hand Crossbow', 'Longsword', 'Rapier', 'Shortsword'], armor: LIGHT_ARMOR },
    'Sorcerer':   { weapons: ['Dagger','Dart','Sling','Quarterstaff','Light Crossbow'], armor: [] },
    'Warlock':    { weapons: ['Dagger','Dart','Sling','Quarterstaff','Light Crossbow'], armor: LIGHT_ARMOR },
    'Wizard':     { weapons: ['Dagger','Dart','Sling','Quarterstaff','Light Crossbow'], armor: [] },
  };

  const RACE_WEAPON_BONUS = {
    'Dwarf':           ['Battleaxe','Handaxe','Light Hammer','Warhammer'],
    'Elf':             ['Longsword','Shortsword','Shortbow','Longbow'],
    'High Elf':        ['Longsword','Shortsword','Shortbow','Longbow'],
    'Wood Elf':        ['Longsword','Shortsword','Shortbow','Longbow'],
    'Dark Elf (Drow)': ['Rapier','Shortsword','Hand Crossbow'],
  };

  const classKey = Object.keys(CLASS_PROFS).find(k =>
    characterClass?.toLowerCase().includes(k.toLowerCase())
  );
  const classProfs = CLASS_PROFS[classKey] || { weapons: [], armor: [] };
  const raceBonusWeapons = RACE_WEAPON_BONUS[characterRace] || [];

  return {
    proficientWeapons: [...new Set([...classProfs.weapons, ...raceBonusWeapons])],
    proficientArmor: classProfs.armor,
    isDruid: classKey === 'Druid',
    isMonk: classKey === 'Monk',
  };
}

export default function Inventory({ characterId, character }) {
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [strScore, setStrScore] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const [itemData, currData, overview] = await Promise.all([
        getItems(characterId), getCurrency(characterId), getOverview(characterId),
      ]);
      setItems(itemData);
      setCurrency(currData);
      const str = overview.ability_scores.find(a => a.ability === 'STR');
      setStrScore(str?.score || 10);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const saveCurrencyFn = useCallback(async (data) => {
    await updateCurrency(characterId, data);
  }, [characterId]);
  const { trigger: triggerCurrency, saving: savingCurrency, lastSaved: currencySaved } = useAutosave(saveCurrencyFn);

  const updateCurrencyField = (field, value) => {
    const updated = { ...currency, [field]: parseInt(value) || 0 };
    setCurrency(updated);
    triggerCurrency(updated);
  };

  const handleAdd = async (itemData) => {
    try {
      await addItem(characterId, itemData);
      toast.success('Item added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleToggle = async (item, field) => {
    if (field === 'attuned' && !item.attuned && attunedCount >= 3) {
      toast.error('Cannot attune more than 3 items (PHB p.138)');
      return;
    }
    try {
      await updateItem(characterId, item.id, { ...item, [field]: !item[field] });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(characterId, id);
      toast.success('Item removed');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const totalWeight = items.reduce((sum, i) => sum + (i.weight * i.quantity), 0);
  const carryCapacity = strScore * 15;
  const encumbered = totalWeight > strScore * 5;
  const heavilyEncumbered = totalWeight > strScore * 10;
  const attunedCount = items.filter(i => i.attuned).length;

  if (loading) return <div className="text-amber-200/40">Loading inventory...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Package size={20} />
          <div>
            <span>Inventory</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your gear, currency, and carrying capacity. Mark items as equipped or attuned, and keep an eye on your encumbrance.</p>
          </div>
        </h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add Item
        </button>
      </div>

      {/* Currency */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Coins size={16} className="text-gold" />
          <h3 className="font-display text-amber-100">Currency<HelpTooltip text={HELP.currency} /></h3>
          <SaveIndicator saving={savingCurrency} lastSaved={currencySaved} />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { key: 'cp', label: 'CP', color: 'text-orange-300' },
            { key: 'sp', label: 'SP', color: 'text-gray-300' },
            { key: 'ep', label: 'EP', color: 'text-blue-300' },
            { key: 'gp', label: 'GP', color: 'text-gold' },
            { key: 'pp', label: 'PP', color: 'text-purple-300' },
          ].map(({ key, label, color }) => (
            <div key={key} className="text-center">
              <label className={`label ${color}`}>{label}</label>
              <input type="number" min={0} className="input w-full text-center"
                value={currency[key]} onChange={e => updateCurrencyField(key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="text-xs text-amber-200/40 mt-2 text-right">
          Total value: <span className="text-gold font-medium">
            {((currency.pp * 10) + currency.gp + (currency.ep * 0.5) + (currency.sp * 0.1) + (currency.cp * 0.01)).toFixed(2)} GP
          </span>
        </div>
      </div>

      {/* Encumbrance */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-amber-200/60">Carry Weight<HelpTooltip text={HELP.encumbrance} /></span>
          <span className={`text-sm font-medium ${heavilyEncumbered ? 'text-red-400' : encumbered ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {totalWeight.toFixed(1)} / {carryCapacity} lbs
            {heavilyEncumbered && ' (Heavily Encumbered!)'}
            {encumbered && !heavilyEncumbered && ' (Encumbered)'}
          </span>
        </div>
        <div className="hp-bar-container">
          <div className={`hp-bar-fill ${heavilyEncumbered ? 'hp-critical' : encumbered ? 'hp-low' : 'hp-high'}`}
            style={{ width: `${Math.min(100, (totalWeight / carryCapacity) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-amber-200/30 mt-1">
          <span>Attunement: {attunedCount}/3<HelpTooltip text={HELP.attunement} size={12} /></span>
        </div>
      </div>

      {/* Items */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Items</h3>
        {items.length === 0 ? (
          <p className="text-sm text-amber-200/30">No items yet. Add weapons, armor, potions, and other gear your character carries.</p>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="bg-[#0d0d12] rounded p-3 border border-gold/10 flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-100 font-medium">{item.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-amber-200/40">x{item.quantity}</span>}
                    <span className="text-xs text-amber-200/30 capitalize">{item.item_type}</span>
                    {item.equipped && <span className="text-xs bg-emerald-800/40 text-emerald-300 px-1.5 py-0.5 rounded">Equipped</span>}
                    {item.attuned && <span className="text-xs bg-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded">Attuned</span>}
                  </div>
                  <div className="text-xs text-amber-200/40">
                    <span>{item.weight > 0 ? `${item.weight} lb` : '\u2014'}</span>
                    {item.value_gp > 0 && (
                      <span className="ml-3">
                        {item.value_gp >= 1
                          ? `${item.value_gp} gp`
                          : item.value_gp >= 0.1
                          ? `${Math.round(item.value_gp * 10)} sp`
                          : `${Math.round(item.value_gp * 100)} cp`}
                      </span>
                    )}
                  </div>
                  {item.description && <p className="text-xs text-amber-200/40 mt-1">{item.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(item, 'equipped')} className="btn-secondary text-xs px-2 py-1">
                    {item.equipped ? 'Unequip' : 'Equip'}
                  </button>
                  {item.attunement && (
                    <button onClick={() => handleToggle(item, 'attuned')} className="btn-secondary text-xs px-2 py-1">
                      {item.attuned ? 'Unattune' : 'Attune'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="text-red-400/50 hover:text-red-400 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && <ItemForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} character={character} />}
    </div>
  );
}

function ItemForm({ onSubmit, onCancel, character }) {
  const [form, setForm] = useState({
    name: '', item_type: 'misc', weight: 0, value_gp: 0,
    quantity: 1, description: '', attunement: false, equipment_slot: '',
  });
  const [selectedCatalogItem, setSelectedCatalogItem] = useState('');
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const profs = getCharacterProficiencies(character?.primary_class, character?.race);

  const isProficient = (itemName, itemType) => {
    if (itemType === 'weapon') return profs.proficientWeapons.includes(itemName);
    if (itemType === 'armor') return profs.proficientArmor.includes(itemName);
    return true;
  };

  const catalog = ITEM_CATALOG[form.item_type];

  const handleCatalogSelect = (itemName) => {
    setSelectedCatalogItem(itemName);
    if (!itemName || !catalog) return;
    for (const group of Object.values(catalog)) {
      const found = group.find(i => i.name === itemName);
      if (found) {
        setForm(prev => ({
          ...prev,
          name: found.name,
          weight: found.weight || 0,
          value_gp: found.value_gp || 0,
          description: [
            found.damage_dice ? `${found.damage_dice} ${found.damage_type}` : '',
            found.ac_formula ? `AC: ${found.ac_formula}` : '',
            found.properties && found.properties !== '—' ? found.properties : '',
          ].filter(Boolean).join(' · '),
        }));
        break;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Item</h3>
        <div className="space-y-3">
          <select className="input w-full" value={form.item_type} onChange={e => { update('item_type', e.target.value); setSelectedCatalogItem(''); }}>
            {['weapon','armor','wondrous','consumable','misc'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* Catalog picker for weapons and armor */}
          {catalog && (
            <>
              <select
                className="input w-full"
                value={selectedCatalogItem}
                onChange={e => handleCatalogSelect(e.target.value)}
              >
                <option value="">— Pick from catalog or type custom below —</option>
                {Object.entries(catalog).map(([group, items]) => (
                  <optgroup key={group} label={group}>
                    {items
                      .sort((a, b) => {
                        const aProf = isProficient(a.name, form.item_type);
                        const bProf = isProficient(b.name, form.item_type);
                        if (aProf && !bProf) return -1;
                        if (!aProf && bProf) return 1;
                        return 0;
                      })
                      .map(item => {
                        const prof = isProficient(item.name, form.item_type);
                        return (
                          <option key={item.name} value={item.name}>
                            {prof ? '\u2713 ' : '\u2717 '}{item.name}
                            {item.damage_dice ? ` (${item.damage_dice} ${item.damage_type})` : ''}
                            {item.ac_formula ? ` (AC ${item.ac_formula})` : ''}
                            {!prof ? ' — not proficient' : ''}
                          </option>
                        );
                      })}
                  </optgroup>
                ))}
              </select>

              {/* Proficiency notice */}
              {selectedCatalogItem && (() => {
                const prof = isProficient(selectedCatalogItem, form.item_type);
                const isDruidMetal = profs.isDruid && form.item_type === 'armor' && prof;
                return (
                  <div className={`text-xs px-3 py-2 rounded ${
                    prof
                      ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-900/20 text-red-400 border border-red-500/20'
                  }`}>
                    {prof ? (
                      <>
                        {'\u2713'} {character?.primary_class || 'Your class'} is proficient with this{isDruidMetal ? ' — note: Druids avoid metal armor' : ''}
                      </>
                    ) : (
                      <>
                        {'\u2717'} {character?.primary_class || 'Your class'} is not proficient — you can still use it, but no proficiency bonus
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Monk unarmored defense note */}
              {profs.isMonk && form.item_type === 'armor' && selectedCatalogItem && selectedCatalogItem !== 'Shield' && (
                <div className="text-xs px-3 py-2 rounded bg-amber-900/20 text-amber-400 border border-amber-500/20">
                  Monks lose Unarmored Defense (10 + DEX + WIS) when wearing armor
                </div>
              )}
            </>
          )}

          <input className="input w-full" placeholder="Item name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Weight</label><input type="number" className="input w-full" value={form.weight} onChange={e => update('weight', parseFloat(e.target.value) || 0)} /></div>
            <div><label className="label">Value (GP)</label><input type="number" className="input w-full" value={form.value_gp} onChange={e => update('value_gp', parseFloat(e.target.value) || 0)} /></div>
            <div><label className="label">Qty</label><input type="number" className="input w-full" min={1} value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 1)} /></div>
          </div>
          <textarea className="input w-full h-16 resize-none" placeholder="Description / properties" value={form.description} onChange={e => update('description', e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-amber-200/60">
            <input type="checkbox" checked={form.attunement} onChange={e => update('attunement', e.target.checked)} /> Requires Attunement
          </label>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.name && onSubmit(form)} className="btn-primary text-sm">Add Item</button>
        </div>
      </div>
    </div>
  );
}
