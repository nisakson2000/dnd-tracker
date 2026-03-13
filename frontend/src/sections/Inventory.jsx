import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Trash2, Package, Coins, Search, ArrowRightLeft, FlaskConical, ArrowDownAZ, ArrowDownWideNarrow, Shield, Swords, Sparkles, AlertTriangle, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getItems, addItem, updateItem, deleteItem, getCurrency, updateCurrency } from '../api/inventory';
import { getOverview } from '../api/overview';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { HELP } from '../data/helpText';
import { ITEM_CATALOG } from '../data/itemCatalog';

// --- Standard 5e Armor AC values ---
const ARMOR_AC_TABLE = {
  'Padded Armor': { base: 11, type: 'light' },
  'Leather Armor': { base: 11, type: 'light' },
  'Studded Leather': { base: 12, type: 'light' },
  'Hide Armor': { base: 12, type: 'medium', maxDex: 2 },
  'Chain Shirt': { base: 13, type: 'medium', maxDex: 2 },
  'Scale Mail': { base: 14, type: 'medium', maxDex: 2 },
  'Breastplate': { base: 14, type: 'medium', maxDex: 2 },
  'Half Plate': { base: 15, type: 'medium', maxDex: 2 },
  'Ring Mail': { base: 14, type: 'heavy' },
  'Chain Mail': { base: 16, type: 'heavy' },
  'Splint Armor': { base: 17, type: 'heavy' },
  'Plate Armor': { base: 18, type: 'heavy' },
  'Shield': { bonus: 2 },
};

// --- Currency exchange rates ---
const CURRENCY_RATES = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };

// --- Consumable effect descriptions ---
const CONSUMABLE_EFFECTS = {
  'Potion of Healing': 'Restores 2d4+2 HP (avg 7)',
  'Potion of Greater Healing': 'Restores 4d4+4 HP (avg 14)',
  'Potion of Superior Healing': 'Restores 8d4+8 HP (avg 28)',
  'Potion of Supreme Healing': 'Restores 10d4+20 HP (avg 45)',
  'Potion of Fire Resistance': 'Resistance to fire damage for 1 hour',
  'Potion of Invisibility': 'Invisible for 1 hour or until you attack/cast',
  'Potion of Speed': 'Haste for 1 minute (no save at end)',
  'Antitoxin': 'Advantage on saves vs poison for 1 hour',
};

// ---- Proficiency resolver ----
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

function calcMod(score) { return Math.floor(((typeof score === 'number' && !isNaN(score) ? score : 10) - 10) / 2); }

export default function Inventory({ characterId, character }) {
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [strScore, setStrScore] = useState(10);
  const [dexScore, setDexScore] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showConverter, setShowConverter] = useState(false);
  const [convertFrom, setConvertFrom] = useState('gp');
  const [convertTo, setConvertTo] = useState('sp');
  const [convertAmount, setConvertAmount] = useState('');

  const load = async () => {
    try {
      const [itemData, currData, overview] = await Promise.all([
        getItems(characterId), getCurrency(characterId), getOverview(characterId),
      ]);
      setItems(itemData);
      setCurrency(currData);
      const str = overview?.ability_scores?.find(a => a.ability === 'STR');
      setStrScore(str?.score || 10);
      const dex = overview?.ability_scores?.find(a => a.ability === 'DEX');
      setDexScore(dex?.score || 10);
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

  const convertAllToGP = () => {
    const totalGP = (currency.cp / 100) + (currency.sp / 10) + (currency.ep / 2) + currency.gp + (currency.pp * 10);
    const rounded = Math.floor(totalGP * 100) / 100;
    const updated = { cp: 0, sp: 0, ep: 0, gp: rounded, pp: 0 };
    setCurrency(updated);
    triggerCurrency(updated);
    toast.success(`Converted all currency to ${rounded.toFixed(2)} GP`);
  };

  // Auto-Consolidate: convert everything to highest denominations possible (PP > GP > SP > CP)
  const autoConsolidate = () => {
    // Convert everything to total copper first
    let totalCP = Math.round(
      currency.cp + (currency.sp * 10) + (currency.ep * 50) + (currency.gp * 100) + (currency.pp * 1000)
    );
    const pp = Math.floor(totalCP / 1000); totalCP -= pp * 1000;
    const gp = Math.floor(totalCP / 100);  totalCP -= gp * 100;
    const sp = Math.floor(totalCP / 10);   totalCP -= sp * 10;
    const cp = totalCP;
    const updated = { cp, sp, ep: 0, gp, pp };
    setCurrency(updated);
    triggerCurrency(updated);
    toast.success(`Consolidated: ${pp ? pp + ' PP ' : ''}${gp ? gp + ' GP ' : ''}${sp ? sp + ' SP ' : ''}${cp ? cp + ' CP' : ''}`.trim() || 'No currency to consolidate');
  };

  // Convert Up: consolidate lower denominations into the next higher one
  const convertUp = (denom) => {
    const chain = ['cp', 'sp', 'gp', 'pp']; // ep excluded — goes into sp
    const idx = chain.indexOf(denom);
    if (idx <= 0) return; // Can't convert up from CP or unknown
    const lower = chain[idx - 1];
    const rate = 10; // 10 lower = 1 higher in standard chain
    const available = currency[lower];
    if (available < rate) {
      toast.error(`Need at least ${rate} ${lower.toUpperCase()} to convert up`);
      return;
    }
    const converted = Math.floor(available / rate);
    const remainder = available - (converted * rate);
    const updated = { ...currency, [lower]: remainder, [denom]: currency[denom] + converted };
    setCurrency(updated);
    triggerCurrency(updated);
    toast.success(`Converted ${converted * rate} ${lower.toUpperCase()} → ${converted} ${denom.toUpperCase()}`);
  };

  // Convert Down: break 1 of a denomination into 10 of the next lower one
  const convertDown = (denom) => {
    const chain = ['cp', 'sp', 'gp', 'pp'];
    const idx = chain.indexOf(denom);
    if (idx <= 0) return; // can't break CP further
    if (currency[denom] < 1) {
      toast.error(`No ${denom.toUpperCase()} to break down`);
      return;
    }
    const target = chain[idx - 1];
    const updated = { ...currency, [denom]: currency[denom] - 1, [target]: currency[target] + 10 };
    setCurrency(updated);
    triggerCurrency(updated);
    toast.success(`Broke 1 ${denom.toUpperCase()} → 10 ${target.toUpperCase()}`);
  };

  // Currency converter
  const handleConvert = () => {
    const amount = parseFloat(convertAmount);
    if (!amount || amount <= 0) return;
    const fromRate = CURRENCY_RATES[convertFrom];
    const toRate = CURRENCY_RATES[convertTo];
    if (!fromRate || !toRate) return;
    // Check if we have enough
    if (currency[convertFrom] < amount) {
      toast.error(`Not enough ${convertFrom.toUpperCase()}`);
      return;
    }
    const gpValue = amount * fromRate;
    const resultAmount = Math.floor(gpValue / toRate);
    const leftover = gpValue - (resultAmount * toRate);
    const leftoverInFrom = Math.round(leftover / fromRate);
    const updated = {
      ...currency,
      [convertFrom]: currency[convertFrom] - amount + leftoverInFrom,
      [convertTo]: (currency[convertTo] || 0) + resultAmount,
    };
    setCurrency(updated);
    triggerCurrency(updated);
    toast.success(`Converted ${amount} ${convertFrom.toUpperCase()} to ${resultAmount} ${convertTo.toUpperCase()}`);
    setConvertAmount('');
  };

  const attunedCount = items.filter(i => i.attuned).length;
  const totalWeight = items.reduce((sum, i) => sum + (i.weight * i.quantity), 0);
  const carryCapacity = strScore * 15;
  const encumbered = totalWeight > strScore * 5;
  const heavilyEncumbered = totalWeight > strScore * 10;

  const totalInventoryValue = useMemo(() => {
    return items.reduce((sum, i) => sum + ((i.value_gp || 0) * (i.quantity || 1)), 0);
  }, [items]);

  const equippedCount = items.filter(i => i.equipped).length;

  // --- Auto-calculate AC from equipped armor ---
  const calculatedAC = useMemo(() => {
    const dexMod = calcMod(dexScore);
    const equippedItems = items.filter(i => i.equipped);
    let baseAC = 10 + dexMod; // Unarmored default
    let shieldBonus = 0;
    let armorFound = false;

    for (const item of equippedItems) {
      const armorInfo = ARMOR_AC_TABLE[item.name];
      if (armorInfo) {
        if (armorInfo.bonus) {
          // Shield
          shieldBonus = armorInfo.bonus;
        } else {
          armorFound = true;
          if (armorInfo.type === 'light') {
            baseAC = armorInfo.base + dexMod;
          } else if (armorInfo.type === 'medium') {
            baseAC = armorInfo.base + Math.min(dexMod, armorInfo.maxDex || 2);
          } else if (armorInfo.type === 'heavy') {
            baseAC = armorInfo.base;
          }
        }
      }
    }
    return { total: baseAC + shieldBonus, base: baseAC, shield: shieldBonus, hasArmor: armorFound, hasShield: shieldBonus > 0 };
  }, [items, dexScore]);

  // --- Equipment Slots Visual ---
  const equippedSlots = useMemo(() => {
    const equippedItems = items.filter(i => i.equipped);
    const weapon = equippedItems.find(i => i.item_type === 'weapon');
    const armor = equippedItems.find(i => i.item_type === 'armor' && i.name !== 'Shield');
    const shield = equippedItems.find(i => i.name === 'Shield');
    return { weapon, armor, shield };
  }, [items]);

  const handleUnequipAll = async () => {
    const equipped = items.filter(i => i.equipped);
    if (equipped.length === 0) { toast('No items equipped'); return; }
    try {
      await Promise.all(equipped.map(i => updateItem(characterId, i.id, { ...i, equipped: false })));
      toast.success(`Unequipped ${equipped.length} item${equipped.length !== 1 ? 's' : ''}`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const sortedFilteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (item.name || '').toLowerCase().includes(q) || (item.item_type || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'weight') return (b.weight * b.quantity) - (a.weight * a.quantity);
      if (sortBy === 'value') return ((b.value_gp || 0) * b.quantity) - ((a.value_gp || 0) * a.quantity);
      if (sortBy === 'type') return (a.item_type || '').localeCompare(b.item_type || '');
      return 0;
    });
  }, [items, searchQuery, sortBy]);

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
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUseItem = async (item) => {
    const effectText = CONSUMABLE_EFFECTS[item.name];
    if (item.quantity <= 1) {
      try {
        await deleteItem(characterId, item.id);
        toast.success(`Used last ${item.name}${effectText ? ` \u2014 ${effectText}` : ''}`, { icon: '\u2728', duration: 4000 });
        load();
      } catch (err) { toast.error(err.message); }
    } else {
      try {
        await updateItem(characterId, item.id, { ...item, quantity: item.quantity - 1 });
        toast.success(`Used ${item.name} (${item.quantity - 1} left)${effectText ? ` \u2014 ${effectText}` : ''}`, { icon: '\u2728', duration: 4000 });
        load();
      } catch (err) { toast.error(err.message); }
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) return;
    try {
      await updateItem(characterId, item.id, { ...item, quantity: newQty });
      load();
    } catch (err) { toast.error(err.message); }
  };

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
        <div className="flex gap-2">
          {equippedCount > 0 && (
            <button onClick={handleUnequipAll} className="btn-secondary text-xs flex items-center gap-1" title="Unequip all items (camp/rest)">
              Unequip All
            </button>
          )}
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add Item
          </button>
        </div>
      </div>

      {/* Equipment Slots Visual + AC */}
      <div className="card bg-gradient-to-r from-[#14121c] to-[#1a1520]">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-blue-400" />
          <h3 className="font-display text-amber-100">Equipment & AC</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {/* AC Display */}
          <div className="bg-blue-950/40 border border-blue-500/20 rounded-lg p-3 text-center">
            <div className="text-[10px] text-blue-400/60 uppercase tracking-wider mb-1">Armor Class</div>
            <div className="text-3xl font-display text-blue-300">{calculatedAC.total}</div>
            <div className="text-[10px] text-blue-400/40 mt-1">
              {calculatedAC.hasArmor ? `Base ${calculatedAC.base}` : `10 + DEX (${calcMod(dexScore) >= 0 ? '+' : ''}${calcMod(dexScore)})`}
              {calculatedAC.hasShield ? ` + ${calculatedAC.shield} shield` : ''}
            </div>
          </div>
          {/* Weapon Slot */}
          <div className={`border rounded-lg p-3 text-center ${equippedSlots.weapon ? 'bg-red-950/20 border-red-500/20' : 'bg-[#0d0d14] border-amber-200/10 border-dashed'}`}>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-1">Weapon</div>
            {equippedSlots.weapon ? (
              <>
                <Swords size={20} className="mx-auto text-red-400/80 mb-1" />
                <div className="text-xs text-amber-100 font-medium truncate">{equippedSlots.weapon.name}</div>
                {equippedSlots.weapon.description && (
                  <div className="text-[10px] text-amber-200/30 truncate mt-0.5">{equippedSlots.weapon.description.split('\u00B7')[0]?.trim()}</div>
                )}
              </>
            ) : (
              <div className="text-xs text-amber-200/20 mt-2">Empty</div>
            )}
          </div>
          {/* Armor Slot */}
          <div className={`border rounded-lg p-3 text-center ${equippedSlots.armor ? 'bg-blue-950/20 border-blue-500/20' : 'bg-[#0d0d14] border-amber-200/10 border-dashed'}`}>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-1">Armor</div>
            {equippedSlots.armor ? (
              <>
                <Shield size={20} className="mx-auto text-blue-400/80 mb-1" />
                <div className="text-xs text-amber-100 font-medium truncate">{equippedSlots.armor.name}</div>
                {ARMOR_AC_TABLE[equippedSlots.armor.name] && (
                  <div className="text-[10px] text-blue-300/50 mt-0.5">AC {ARMOR_AC_TABLE[equippedSlots.armor.name].base}</div>
                )}
              </>
            ) : (
              <div className="text-xs text-amber-200/20 mt-2">Unarmored</div>
            )}
          </div>
          {/* Shield Slot */}
          <div className={`border rounded-lg p-3 text-center ${equippedSlots.shield ? 'bg-blue-950/20 border-blue-500/20' : 'bg-[#0d0d14] border-amber-200/10 border-dashed'}`}>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-1">Shield</div>
            {equippedSlots.shield ? (
              <>
                <Shield size={20} className="mx-auto text-blue-400/60 mb-1" />
                <div className="text-xs text-amber-100 font-medium">Shield</div>
                <div className="text-[10px] text-blue-300/50 mt-0.5">+2 AC</div>
              </>
            ) : (
              <div className="text-xs text-amber-200/20 mt-2">Empty</div>
            )}
          </div>
        </div>
        {/* Attunement Slots */}
        <div className="mt-3 pt-3 border-t border-amber-200/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-purple-400/60" />
              <span className="text-xs text-amber-200/50">Attunement Slots</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all ${
                  i < attunedCount
                    ? 'bg-purple-500 border-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.4)]'
                    : 'border-purple-400/20 bg-transparent'
                }`} title={i < attunedCount ? `Slot ${i + 1}: occupied` : `Slot ${i + 1}: empty`} />
              ))}
              <span className="text-xs text-amber-200/40 ml-2">{attunedCount}/3</span>
              {attunedCount >= 3 && (
                <span className="text-xs text-amber-400 flex items-center gap-1 ml-1">
                  <AlertTriangle size={10} /> Full
                </span>
              )}
            </div>
          </div>
          {items.filter(i => i.attuned).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {items.filter(i => i.attuned).map(i => (
                <span key={i.id} className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                  {i.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search + Sort */}
      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
            <input className="input w-full pl-10" placeholder="Search items by name, type, or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-200/40">Sort:</span>
            {[['name', 'Name'], ['weight', 'Weight'], ['value', 'Value'], ['type', 'Type']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Currency */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Coins size={16} className="text-gold" />
          <h3 className="font-display text-amber-100">Currency<HelpTooltip text={HELP.currency} /></h3>
          <SaveIndicator saving={savingCurrency} lastSaved={currencySaved} />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowConverter(prev => !prev)}
              className={`btn-secondary text-xs flex items-center gap-1 ${showConverter ? 'bg-gold/15 text-gold border-gold/30' : ''}`}
              title="Open currency converter"
            >
              <ArrowRightLeft size={11} /> Convert
            </button>
            <button
              onClick={autoConsolidate}
              className="btn-secondary text-xs flex items-center gap-1"
              title="Auto-consolidate into highest denominations (PP/GP/SP/CP)"
            >
              <Zap size={11} /> Consolidate
            </button>
            <button
              onClick={convertAllToGP}
              className="btn-secondary text-xs flex items-center gap-1"
              title="Convert all currency to gold pieces"
            >
              All to GP
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { key: 'cp', label: 'CP', color: 'text-orange-300', coinBg: 'bg-orange-700', coinBorder: 'border-orange-400', coinText: 'text-orange-200' },
            { key: 'sp', label: 'SP', color: 'text-gray-300', coinBg: 'bg-gray-500', coinBorder: 'border-gray-300', coinText: 'text-gray-100' },
            { key: 'ep', label: 'EP', color: 'text-blue-300', coinBg: 'bg-blue-700', coinBorder: 'border-blue-300', coinText: 'text-blue-100' },
            { key: 'gp', label: 'GP', color: 'text-gold', coinBg: 'bg-yellow-600', coinBorder: 'border-yellow-300', coinText: 'text-yellow-100' },
            { key: 'pp', label: 'PP', color: 'text-purple-300', coinBg: 'bg-purple-700', coinBorder: 'border-purple-300', coinText: 'text-purple-100' },
          ].map(({ key, label, color, coinBg, coinBorder, coinText }) => (
            <div key={key} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className={`w-5 h-5 rounded-full ${coinBg} border ${coinBorder} flex items-center justify-center shadow-sm`}>
                  <span className={`text-[8px] font-bold ${coinText}`}>{label[0]}</span>
                </div>
                <label className={`label !mb-0 ${color}`}>{label}</label>
              </div>
              <input type="number" min={0} className="input w-full text-center"
                value={currency[key]} onChange={e => updateCurrencyField(key, e.target.value)} />
              {/* Convert Up / Down arrows for non-EP denominations */}
              {key !== 'ep' && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {key !== 'cp' && (
                    <button
                      onClick={() => convertDown(key)}
                      className="text-amber-200/30 hover:text-amber-200/70 p-0.5 rounded hover:bg-white/5 transition-colors"
                      title={`Break 1 ${label} into 10 ${key === 'sp' ? 'CP' : key === 'gp' ? 'SP' : key === 'pp' ? 'GP' : ''}`}
                    >
                      <ChevronDown size={12} />
                    </button>
                  )}
                  {key !== 'pp' && (
                    <button
                      onClick={() => convertUp(key === 'cp' ? 'sp' : key === 'sp' ? 'gp' : key === 'gp' ? 'pp' : '')}
                      className="text-amber-200/30 hover:text-amber-200/70 p-0.5 rounded hover:bg-white/5 transition-colors"
                      title={`Convert 10 ${label} into 1 ${key === 'cp' ? 'SP' : key === 'sp' ? 'GP' : key === 'gp' ? 'PP' : ''}`}
                    >
                      <ChevronUp size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-amber-200/40 mt-2 text-right">
          Total value: <span className="text-gold font-medium">
            {((currency.pp * 10) + currency.gp + (currency.ep * 0.5) + (currency.sp * 0.1) + (currency.cp * 0.01)).toFixed(2)} GP
          </span>
        </div>

        {/* Currency Converter */}
        {showConverter && (
          <div className="mt-3 pt-3 border-t border-amber-200/10">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-1">
                <div className="text-xs text-amber-200/50 font-medium mb-1">Custom Conversion</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="input w-24 text-sm"
                    placeholder="Amount"
                    value={convertAmount}
                    onChange={e => setConvertAmount(e.target.value)}
                    min={1}
                  />
                  <select className="input w-20 text-sm" value={convertFrom} onChange={e => setConvertFrom(e.target.value)}>
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                  <ArrowRightLeft size={14} className="text-amber-200/30" />
                  <select className="input w-20 text-sm" value={convertTo} onChange={e => setConvertTo(e.target.value)}>
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                  <button onClick={handleConvert} className="btn-primary text-xs px-3 py-1.5">Convert</button>
                  {convertAmount && convertFrom !== convertTo && (
                    <span className="text-xs text-amber-200/40">
                      = {Math.floor((parseFloat(convertAmount) || 0) * CURRENCY_RATES[convertFrom] / CURRENCY_RATES[convertTo])} {convertTo.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-amber-200/30 leading-relaxed border-l border-amber-200/10 pl-3">
                <div className="text-amber-200/50 font-medium mb-0.5">D&D Exchange Rates</div>
                <div>1 PP = 10 GP</div>
                <div>1 GP = 10 SP</div>
                <div>1 SP = 10 CP</div>
                <div className="text-amber-200/20">1 EP = 5 SP (optional)</div>
              </div>
            </div>
          </div>
        )}
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
        <div className="hp-bar-container" role="progressbar" aria-label={`Carry weight: ${totalWeight.toFixed(1)} of ${carryCapacity} lbs`} aria-valuenow={totalWeight} aria-valuemin={0} aria-valuemax={carryCapacity}>
          <div className={`hp-bar-fill ${heavilyEncumbered ? 'hp-critical' : encumbered ? 'hp-low' : 'hp-high'}`}
            style={{ width: `${Math.min(100, (totalWeight / carryCapacity) * 100)}%` }} />
        </div>
        {encumbered && (
          <div className={`mt-2 text-xs font-medium px-3 py-1.5 rounded border ${
            heavilyEncumbered
              ? 'bg-red-900/20 text-red-400 border-red-500/20'
              : 'bg-yellow-900/20 text-yellow-400 border-yellow-500/20'
          }`}>
            {heavilyEncumbered
              ? 'Speed -20 ft, Disadvantage on ability checks, attack rolls, and STR/DEX/CON saving throws'
              : 'Speed -10 ft'}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-amber-100">Items</h3>
          {items.length > 0 && totalInventoryValue > 0 && (
            <span className="text-xs text-amber-200/40">
              Total inventory value: <span className="text-gold font-medium">
                {totalInventoryValue >= 1
                  ? `${totalInventoryValue.toFixed(totalInventoryValue % 1 === 0 ? 0 : 2)} gp`
                  : totalInventoryValue >= 0.1
                  ? `${Math.round(totalInventoryValue * 10)} sp`
                  : `${Math.round(totalInventoryValue * 100)} cp`}
              </span>
            </span>
          )}
        </div>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-amber-200/30 mb-3">No items yet. Add weapons, armor, potions, and other gear your character carries.</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary text-xs inline-flex items-center gap-1">
              <Plus size={12} /> Add Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFilteredItems.map(item => {
              const typeColor = { weapon: 'border-l-red-500/70', armor: 'border-l-blue-400/70', wondrous: 'border-l-purple-400/70', consumable: 'border-l-emerald-400/70', misc: 'border-l-amber-200/20' };
              const rarityColor = { common: 'border-l-gray-400/60', uncommon: 'border-l-emerald-400/70', rare: 'border-l-blue-400/70', 'very rare': 'border-l-purple-400/70', legendary: 'border-l-orange-400/70' };
              const leftBorder = item.rarity ? (rarityColor[item.rarity.toLowerCase()] || typeColor[item.item_type] || 'border-l-amber-200/20') : (typeColor[item.item_type] || 'border-l-amber-200/20');
              const consumableEffect = item.item_type === 'consumable' ? CONSUMABLE_EFFECTS[item.name] : null;
              return (
              <div key={item.id} className={`bg-[#0d0d12] rounded p-3 border border-l-[3px] ${leftBorder} flex items-start gap-3 ${item.attuned ? 'border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]' : 'border-gold/10'}`} title={item.description || undefined}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-100 font-medium">{item.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-amber-200/40">x{item.quantity}</span>}
                    {item.quantity > 0 && item.quantity <= 5 && (item.item_type === 'consumable') && (
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${item.quantity <= 3 ? 'bg-red-500' : 'bg-amber-400'}`} title={`Low stock: ${item.quantity} remaining`} />
                        {item.quantity <= 3 && <span className="text-[10px] font-bold text-red-400">LOW</span>}
                      </span>
                    )}
                    <span className="text-xs text-amber-200/30 capitalize">{item.item_type}</span>
                    {item.rarity && <span className="text-xs text-amber-200/30 capitalize">{item.rarity}</span>}
                    {item.equipped && <span className="text-xs bg-emerald-800/40 text-emerald-300 px-1.5 py-0.5 rounded">Equipped</span>}
                    {item.attuned && <span className="text-xs bg-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Sparkles size={10} />Attuned</span>}
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
                  {item.description && (
                    <p className={`text-xs text-amber-200/30 italic mt-1 ${item.equipped ? '' : 'truncate'}`}>{item.description}</p>
                  )}
                  {/* Consumable effect hint */}
                  {consumableEffect && (
                    <p className="text-xs text-emerald-400/60 mt-1 flex items-center gap-1">
                      <FlaskConical size={10} /> {consumableEffect}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex gap-1">
                    {item.item_type === 'consumable' && (
                      <button onClick={() => handleUseItem(item)} className="btn-primary text-xs px-2 py-1 flex items-center gap-1" title={`Use ${item.name}${consumableEffect ? ` \u2014 ${consumableEffect}` : ''}`}>
                        <FlaskConical size={11} /> Use
                      </button>
                    )}
                    <button onClick={() => handleToggle(item, 'equipped')} className="btn-secondary text-xs px-2 py-1">
                      {item.equipped ? 'Unequip' : 'Equip'}
                    </button>
                    {item.attunement && (
                      <button onClick={() => handleToggle(item, 'attuned')} className="btn-secondary text-xs px-2 py-1">
                        {item.attuned ? 'Unattune' : 'Attune'}
                      </button>
                    )}
                    <button onClick={() => setConfirmDelete(item)} className="text-red-400/50 hover:text-red-400 p-1" aria-label={`Delete ${item.name || 'item'}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {item.quantity > 1 && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleQuantityChange(item, -1)} className="text-amber-200/40 hover:text-amber-200 p-0.5 rounded hover:bg-white/5" title="Decrease quantity">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs text-amber-200/50 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item, 1)} className="text-amber-200/40 hover:text-amber-200 p-0.5 rounded hover:bg-white/5" title="Increase quantity">
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && <ItemForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} character={character} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Item?"
        message={`Remove "${confirmDelete?.name}"${confirmDelete?.quantity > 1 ? ` (x${confirmDelete.quantity})` : ''}? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
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

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

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
            found.properties && found.properties !== '\u2014' ? found.properties : '',
          ].filter(Boolean).join(' \u00B7 '),
        }));
        break;
      }
    }
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
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
                <option value="">\u2014 Pick from catalog or type custom below \u2014</option>
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
                            {!prof ? ' \u2014 not proficient' : ''}
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
                        {'\u2713'} {character?.primary_class || 'Your class'} is proficient with this{isDruidMetal ? ' \u2014 note: Druids avoid metal armor' : ''}
                      </>
                    ) : (
                      <>
                        {'\u2717'} {character?.primary_class || 'Your class'} is not proficient \u2014 you can still use it, but no proficiency bonus
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
          <button onClick={() => form.name && onSubmit({ ...form, attuned: false, equipped: false })} className="btn-primary text-sm">Add Item</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
