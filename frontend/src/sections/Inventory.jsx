import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Trash2, Package, Coins, Search, ArrowRightLeft, FlaskConical, Shield, Swords, Sparkles, AlertTriangle, ChevronUp, ChevronDown, Zap, Pencil, Weight, Tag, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { getItems, addItem, updateItem, deleteItem, getCurrency, updateCurrency } from '../api/inventory';
import { getOverview, updateOverview } from '../api/overview';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { HELP } from '../data/helpText';
import { ITEM_CATALOG } from '../data/itemCatalog';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';

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

// --- Item Tag System ---
const TAG_STYLES = {
  magical:    { bg: 'bg-purple-900/30', text: 'text-purple-300', border: 'border-purple-500/30' },
  consumable: { bg: 'bg-emerald-900/30', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  'quest item': { bg: 'bg-yellow-900/30', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  equipped:   { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-500/30' },
  attuned:    { bg: 'bg-pink-900/30', text: 'text-pink-300', border: 'border-pink-500/30' },
};
const ALL_TAGS = ['magical', 'consumable', 'quest item', 'equipped', 'attuned'];

function getItemTags(item) {
  const tags = [];
  if (item.rarity && item.rarity.toLowerCase() !== 'common' && item.rarity.trim() !== '') tags.push('magical');
  if (['potion', 'scroll', 'consumable'].includes((item.item_type || '').toLowerCase())) tags.push('consumable');
  if ((item.description || '').toLowerCase().includes('quest')) tags.push('quest item');
  if (item.equipped) tags.push('equipped');
  if (item.attuned || item.attunement_status) tags.push('attuned');
  return tags;
}

// --- Equipment Comparison Helper ---
function getEquipmentStats(item) {
  const stats = {};
  // Weapon damage
  if (item.item_type === 'weapon' && item.description) {
    const dmgMatch = item.description.match(/(\d+d\d+(?:\s*\+\s*\d+)?)\s*([\w]+)?/i);
    if (dmgMatch) {
      stats.damage = dmgMatch[1];
      stats.damageType = dmgMatch[2] || '';
    }
  }
  // Armor AC
  if (item.item_type === 'armor') {
    const armorInfo = ARMOR_AC_TABLE[item.name];
    if (armorInfo) {
      stats.ac = armorInfo.base || armorInfo.bonus || 0;
      stats.isShield = !!armorInfo.bonus;
    }
  }
  stats.weight = item.weight || 0;
  stats.value = item.value_gp || 0;
  return stats;
}

function parseDiceAvg(diceStr) {
  if (!diceStr) return 0;
  // Parse "XdY+Z" format
  const match = diceStr.replace(/\s/g, '').match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (!match) return 0;
  const [, count, sides, bonus] = match;
  return (parseInt(count) * (parseInt(sides) + 1) / 2) + (parseInt(bonus) || 0);
}

export default function Inventory({ characterId, character }) {
  const syncCtx = useCampaignSyncSafe();
  const currencyLocked = syncCtx?.dmSessionActive && !syncCtx?.isHost;
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [strScore, setStrScore] = useState(10);
  const [dexScore, setDexScore] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showConverter, setShowConverter] = useState(false);
  const [convertFrom, setConvertFrom] = useState('gp');
  const [convertTo, setConvertTo] = useState('sp');
  const [convertAmount, setConvertAmount] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [comparisonItem, setComparisonItem] = useState(null);
  const [groupBy, setGroupBy] = useState('none');
  const [collapsedGroups, setCollapsedGroups] = useState({});

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

  // --- Aggregate stat modifiers from all equipped items ---
  const equippedStatBonuses = useMemo(() => {
    const bonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    const sources = []; // track which items contribute
    for (const item of items.filter(i => i.equipped)) {
      try {
        const mods = typeof item.stat_modifiers === 'string'
          ? JSON.parse(item.stat_modifiers || '{}')
          : (item.stat_modifiers || {});
        let hasBonus = false;
        for (const [stat, value] of Object.entries(mods)) {
          const key = stat.toLowerCase();
          if (key in bonuses && typeof value === 'number' && value !== 0) {
            bonuses[key] += value;
            hasBonus = true;
          }
        }
        if (hasBonus) sources.push(item.name);
      } catch { /* ignore bad JSON */ }
    }
    return { bonuses, sources, hasAny: sources.length > 0 };
  }, [items]);

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
    // Tag filter
    if (activeTagFilter) {
      filtered = filtered.filter(item => getItemTags(item).includes(activeTagFilter));
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'weight') return (b.weight * b.quantity) - (a.weight * a.quantity);
      if (sortBy === 'value') return ((b.value_gp || 0) * b.quantity) - ((a.value_gp || 0) * a.quantity);
      if (sortBy === 'type') return (a.item_type || '').localeCompare(b.item_type || '');
      return 0;
    });
  }, [items, searchQuery, sortBy, activeTagFilter]);

  // --- Group items by selected criterion ---
  const groupedItems = useMemo(() => {
    if (groupBy === 'none') return null;
    const groups = {};
    for (const item of sortedFilteredItems) {
      let key;
      if (groupBy === 'type') {
        key = (item.item_type || 'misc').charAt(0).toUpperCase() + (item.item_type || 'misc').slice(1);
      } else if (groupBy === 'rarity') {
        const r = (item.rarity || 'common').toLowerCase();
        key = r.charAt(0).toUpperCase() + r.slice(1);
      } else if (groupBy === 'equipped') {
        key = item.equipped ? 'Equipped' : 'Unequipped';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    // Sort group keys: for rarity use a defined order, otherwise alphabetical
    const rarityOrder = ['common', 'uncommon', 'rare', 'very rare', 'legendary'];
    const equippedOrder = ['Equipped', 'Unequipped'];
    let sortedKeys;
    if (groupBy === 'rarity') {
      sortedKeys = Object.keys(groups).sort((a, b) => {
        const ai = rarityOrder.indexOf(a.toLowerCase()); const bi = rarityOrder.indexOf(b.toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
    } else if (groupBy === 'equipped') {
      sortedKeys = Object.keys(groups).sort((a, b) => equippedOrder.indexOf(a) - equippedOrder.indexOf(b));
    } else {
      sortedKeys = Object.keys(groups).sort();
    }
    return sortedKeys.map(key => ({
      key,
      items: groups[key],
      totalWeight: groups[key].reduce((sum, i) => sum + ((i.weight || 0) * (i.quantity || 1)), 0),
      totalValue: groups[key].reduce((sum, i) => sum + ((i.value_gp || 0) * (i.quantity || 1)), 0),
    }));
  }, [sortedFilteredItems, groupBy]);

  const toggleGroup = (key) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Find the currently equipped item of a given type for comparison
  const getEquippedOfType = useCallback((itemType, itemName) => {
    if (itemType === 'weapon') return items.find(i => i.equipped && i.item_type === 'weapon' && i.id !== comparisonItem?.id);
    if (itemType === 'armor') {
      const isShield = itemName === 'Shield';
      return items.find(i => i.equipped && i.item_type === 'armor' && (isShield ? i.name === 'Shield' : i.name !== 'Shield') && i.id !== comparisonItem?.id);
    }
    return null;
  }, [items, comparisonItem]);

  // Encumbrance check helper — call after adding items or changing quantity
  const checkEncumbrance = (newTotalWeight) => {
    const cap = carryCapacity;
    if (cap <= 0) return;
    if (newTotalWeight > cap) {
      toast(`Heavily Over Capacity! Carrying ${newTotalWeight.toFixed(1)}/${cap} lbs\nSpeed -20 ft, Disadvantage on checks, attacks, and STR/DEX/CON saves`, {
        icon: '\u26A0\uFE0F', duration: 5000,
        style: { background: '#1a1520', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', whiteSpace: 'pre-line' }
      });
    } else if (newTotalWeight > strScore * 10) {
      toast(`Heavily Encumbered! Carrying ${newTotalWeight.toFixed(1)}/${cap} lbs\nSpeed -20 ft, Disadvantage on checks, attacks, and STR/DEX/CON saves`, {
        icon: '\u26A0\uFE0F', duration: 4000,
        style: { background: '#1a1520', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'pre-line' }
      });
    } else if (newTotalWeight > strScore * 5) {
      toast(`Encumbered! Carrying ${newTotalWeight.toFixed(1)}/${cap} lbs\nSpeed -10 ft`, {
        icon: '\uD83C\uDFCB\uFE0F', duration: 3000,
        style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.3)', whiteSpace: 'pre-line' }
      });
    }
  };

  const handleAdd = async (itemData) => {
    try {
      await addItem(characterId, itemData);
      toast.success('Item added');
      setShowAdd(false);
      // Check encumbrance with projected new weight
      const addedWeight = (parseFloat(itemData.weight) || 0) * (parseInt(itemData.quantity) || 1);
      if (addedWeight > 0) checkEncumbrance(totalWeight + addedWeight);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleEditSubmit = async (itemData) => {
    if (!editingItem) return;
    try {
      await updateItem(characterId, editingItem.id, {
        ...itemData,
        equipped: editingItem.equipped,
        attuned: editingItem.attuned,
      });
      toast.success('Item updated');
      setEditingItem(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleToggle = async (item, field) => {
    if (field === 'attuned' && !item.attuned && attunedCount >= 3) {
      toast.error('Maximum 3 attuned items (D&D 5e limit)');
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

  const handleUseConsumable = useCallback(async (item) => {
    try {
      // Check if it's a healing potion
      const healingDice = {
        'Potion of Healing': '2d4+2',
        'Potion of Greater Healing': '4d4+4',
        'Potion of Superior Healing': '8d4+8',
        'Potion of Supreme Healing': '10d4+20',
      };

      const potionKey = Object.keys(healingDice).find(k =>
        item.name?.toLowerCase().includes(k.toLowerCase())
      );

      if (potionKey) {
        // Roll healing
        const dice = healingDice[potionKey];
        const diceMatch = dice.match(/(\d+)d(\d+)\+(\d+)/);
        if (diceMatch) {
          const [, count, sides, bonus] = diceMatch.map(Number);
          let total = parseInt(bonus) || 0;
          for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
          }

          // Apply healing
          try {
            const ovData = await getOverview(characterId);
            const currentHp = ovData.overview?.current_hp || 0;
            const maxHp = ovData.overview?.max_hp || currentHp;
            const newHp = Math.min(maxHp, currentHp + total);
            await updateOverview(characterId, { current_hp: newHp });

            toast.success(`${item.name}: Healed ${total} HP! (${currentHp} \u2192 ${newHp})`, { duration: 4000 });
          } catch (e) {
            toast.success(`${item.name}: Healed ${total} HP!`, { duration: 3000 });
          }
        }
      } else {
        // Non-healing consumable — just show effect
        const effect = CONSUMABLE_EFFECTS[item.name] || item.description || 'Item used.';
        toast(`Used ${item.name}: ${effect}`, {
          icon: '\uD83E\uDDEA', duration: 3000,
          style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' }
        });
      }

      // Decrement quantity or delete
      const qty = item.quantity ?? 1;
      if (qty <= 1) {
        await deleteItem(characterId, item.id);
        setItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        await updateItem(characterId, item.id, { ...item, quantity: qty - 1 });
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: qty - 1 } : i));
      }
    } catch (e) {
      console.error('Failed to use consumable:', e);
      toast.error('Failed to use item');
    }
  }, [characterId]);

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) return;
    try {
      await updateItem(characterId, item.id, { ...item, quantity: newQty });
      // Check encumbrance when increasing quantity
      if (delta > 0 && item.weight > 0) {
        checkEncumbrance(totalWeight + (item.weight * delta));
      }
      load();
    } catch (err) { toast.error(err.message); }
  };

  // --- Shared item row renderer ---
  const renderItem = (item) => {
    const typeColor = { weapon: 'border-l-red-500/70', armor: 'border-l-blue-400/70', wondrous: 'border-l-purple-400/70', consumable: 'border-l-emerald-400/70', misc: 'border-l-amber-200/20' };
    const rarityColor = { common: 'border-l-gray-400/60', uncommon: 'border-l-emerald-400/70', rare: 'border-l-blue-400/70', 'very rare': 'border-l-purple-400/70', legendary: 'border-l-orange-400/70' };
    const leftBorder = item.rarity ? (rarityColor[item.rarity.toLowerCase()] || typeColor[item.item_type] || 'border-l-amber-200/20') : (typeColor[item.item_type] || 'border-l-amber-200/20');
    const consumableEffect = item.item_type === 'consumable' ? CONSUMABLE_EFFECTS[item.name] : null;
    const itemTags = getItemTags(item);
    const equippedCounterpart = !item.equipped && (item.item_type === 'weapon' || item.item_type === 'armor')
      ? getEquippedOfType(item.item_type, item.name)
      : null;
    return (
      <div
        key={item.id}
        className={`bg-[#0d0d12] rounded p-3 border border-l-[3px] ${leftBorder} flex items-start gap-3 ${item.attuned ? 'border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]' : 'border-gold/10'} relative`}
        title={item.description || undefined}
        onMouseEnter={() => equippedCounterpart && setComparisonItem(item)}
        onMouseLeave={() => setComparisonItem(null)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
            {itemTags.filter(t => t !== 'equipped' && t !== 'attuned').map(tag => {
              const style = TAG_STYLES[tag];
              return (
                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize ${style.bg} ${style.text} ${style.border}`}>
                  {tag}
                </span>
              );
            })}
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
          {consumableEffect && (
            <p className="text-xs text-emerald-400/60 mt-1 flex items-center gap-1">
              <FlaskConical size={10} /> {consumableEffect}
            </p>
          )}
          {(() => {
            try {
              const mods = typeof item.stat_modifiers === 'string'
                ? JSON.parse(item.stat_modifiers || '{}')
                : (item.stat_modifiers || {});
              const entries = Object.entries(mods).filter(([, v]) => v !== 0);
              if (entries.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-1 mt-1">
                  {entries.map(([stat, value]) => (
                    <span key={stat} className="text-[10px] bg-green-900/20 text-green-400/70 px-1.5 py-0.5 rounded font-mono">
                      {stat.toUpperCase()} {value > 0 ? '+' : ''}{value}
                    </span>
                  ))}
                </div>
              );
            } catch { return null; }
          })()}
          {comparisonItem?.id === item.id && equippedCounterpart && (() => {
            const currentStats = getEquipmentStats(equippedCounterpart);
            const newStats = getEquipmentStats(item);
            const comparisons = [];
            if (item.item_type === 'weapon') {
              const currentAvg = parseDiceAvg(currentStats.damage);
              const newAvg = parseDiceAvg(newStats.damage);
              if (currentStats.damage || newStats.damage) {
                const diff = newAvg - currentAvg;
                comparisons.push({
                  label: 'Damage', current: currentStats.damage || '\u2014', next: newStats.damage || '\u2014',
                  diff: diff !== 0 ? (diff > 0 ? `+${diff.toFixed(1)} avg` : `${diff.toFixed(1)} avg`) : 'same',
                  positive: diff > 0, negative: diff < 0,
                });
              }
            }
            if (item.item_type === 'armor') {
              const currentAC = currentStats.ac || 0;
              const newAC = newStats.ac || 0;
              const diff = newAC - currentAC;
              comparisons.push({
                label: currentStats.isShield || newStats.isShield ? 'Shield Bonus' : 'Base AC',
                current: currentAC || '\u2014', next: newAC || '\u2014',
                diff: diff !== 0 ? (diff > 0 ? `+${diff}` : `${diff}`) : 'same',
                positive: diff > 0, negative: diff < 0,
              });
            }
            const wDiff = newStats.weight - currentStats.weight;
            comparisons.push({
              label: 'Weight', current: `${currentStats.weight} lb`, next: `${newStats.weight} lb`,
              diff: wDiff !== 0 ? (wDiff > 0 ? `+${wDiff} lb` : `${wDiff} lb`) : 'same',
              positive: wDiff < 0, negative: wDiff > 0,
            });
            if (comparisons.length === 0) return null;
            return (
              <div className="mt-2 p-2 bg-amber-950/30 border border-amber-500/20 rounded text-xs">
                <div className="text-amber-200/50 font-medium mb-1.5 flex items-center gap-1">
                  <ArrowRightLeft size={10} /> vs. equipped: {equippedCounterpart.name}
                </div>
                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  <span className="text-amber-200/30"></span>
                  <span className="text-amber-200/30 text-center">Current</span>
                  <span className="text-amber-200/30 text-center">This</span>
                  <span className="text-amber-200/30 text-center">Diff</span>
                  {comparisons.map(c => (
                    <>
                      <span key={c.label} className="text-amber-200/50">{c.label}</span>
                      <span className="text-amber-200/40 text-center">{c.current}</span>
                      <span className="text-amber-100 text-center">{c.next}</span>
                      <span className={`text-center font-medium ${c.positive ? 'text-emerald-400' : c.negative ? 'text-red-400' : 'text-amber-200/30'}`}>
                        {c.diff}
                      </span>
                    </>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex gap-1">
            {(item.item_type === 'consumable' || Object.keys(CONSUMABLE_EFFECTS).some(k => item.name?.toLowerCase().includes(k.toLowerCase()))) && (
              <button onClick={(e) => { e.stopPropagation(); handleUseConsumable(item); }} className="btn-primary text-xs px-2 py-1 flex items-center gap-1" title={`Use ${item.name}${consumableEffect ? ` \u2014 ${consumableEffect}` : ''}`}>
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
            <button onClick={() => setEditingItem(item)} className="text-amber-200/40 hover:text-amber-200 p-1" aria-label={`Edit ${item.name || 'item'}`} title="Edit item">
              <Pencil size={14} />
            </button>
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
        {/* Equipped Item Stat Bonuses */}
        {equippedStatBonuses.hasAny && (
          <div className="mt-3 pt-3 border-t border-amber-200/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="text-green-400/60" />
              <span className="text-xs text-amber-200/50">Item Stat Bonuses</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(equippedStatBonuses.bonuses)
                .filter(([, v]) => v !== 0)
                .map(([stat, value]) => (
                  <span key={stat} className="text-xs bg-green-900/20 text-green-300 px-2 py-1 rounded border border-green-500/20 font-mono">
                    {stat.toUpperCase()} {value > 0 ? '+' : ''}{value}
                  </span>
                ))}
            </div>
            <div className="text-[10px] text-amber-200/30 mt-1.5">
              From: {equippedStatBonuses.sources.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Search + Sort + Tag Filter */}
      {items.length > 0 && (
        <div className="space-y-2">
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
          {/* Group By */}
          <div className="flex items-center gap-1.5">
            <Layers size={12} className="text-amber-200/30" />
            <span className="text-xs text-amber-200/40">Group:</span>
            {[['none', 'None'], ['type', 'Type'], ['rarity', 'Rarity'], ['equipped', 'Equipped']].map(([key, label]) => (
              <button key={key} onClick={() => { setGroupBy(key); setCollapsedGroups({}); }}
                className={`text-xs px-2.5 py-1 rounded ${groupBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
          {/* Tag Filter */}
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-amber-200/30" />
            <span className="text-xs text-amber-200/40">Filter:</span>
            {ALL_TAGS.map(tag => {
              const count = items.filter(i => getItemTags(i).includes(tag)).length;
              if (count === 0) return null;
              const style = TAG_STYLES[tag];
              const isActive = activeTagFilter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(isActive ? null : tag)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all capitalize ${
                    isActive
                      ? `${style.bg} ${style.text} ${style.border} ring-1 ring-current/20`
                      : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10 hover:border-amber-200/20'
                  }`}
                >
                  {tag} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
            {activeTagFilter && (
              <button onClick={() => setActiveTagFilter(null)} className="text-xs text-amber-200/30 hover:text-amber-200/60 ml-1 underline">
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Currency */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Coins size={16} className="text-gold" />
          <h3 className="font-display text-amber-100">Currency<HelpTooltip text={HELP.currency} /></h3>
          {currencyLocked && <span style={{ fontSize: 9, color: 'rgba(239,68,68,0.5)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '1px 6px' }}>DM Controlled</span>}
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
                value={currency[key]} onChange={e => updateCurrencyField(key, e.target.value)}
                disabled={currencyLocked}
                title={currencyLocked ? 'Currency is controlled by the DM during live sessions' : ''}
                style={currencyLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
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
      {(() => {
        const pct = carryCapacity > 0 ? (totalWeight / carryCapacity) * 100 : 0;
        const barColor = pct > 100 ? 'bg-red-500' : pct > 75 ? 'bg-orange-500' : pct > 50 ? 'bg-yellow-500' : 'bg-emerald-500';
        const textColor = pct > 100 ? 'text-red-400' : pct > 75 ? 'text-orange-400' : pct > 50 ? 'text-yellow-400' : 'text-emerald-400';
        const glowColor = pct > 100 ? 'shadow-[0_0_8px_rgba(239,68,68,0.3)]' : pct > 75 ? 'shadow-[0_0_8px_rgba(249,115,22,0.2)]' : '';
        return (
          <div className={`card ${glowColor}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Weight size={14} className={textColor} />
                <span className="text-sm text-amber-200/60">Carry Weight<HelpTooltip text={HELP.encumbrance} /></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">STR {strScore} x 15</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {totalWeight.toFixed(1)} / {carryCapacity} lbs
                  {pct > 100 && ' (Over Capacity!)'}
                  {heavilyEncumbered && pct <= 100 && ' (Heavily Encumbered!)'}
                  {encumbered && !heavilyEncumbered && pct <= 100 && ' (Encumbered)'}
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-[#0d0d14] rounded-full border border-amber-200/10 overflow-hidden" role="progressbar" aria-label={`Carry weight: ${totalWeight.toFixed(1)} of ${carryCapacity} lbs`} aria-valuenow={totalWeight} aria-valuemin={0} aria-valuemax={carryCapacity}>
              <div className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(100, pct)}%` }} />
              {/* Threshold markers */}
              <div className="absolute top-0 left-1/2 w-px h-full bg-amber-200/15" title="50%" />
              <div className="absolute top-0 left-3/4 w-px h-full bg-amber-200/15" title="75%" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-amber-200/20">0 lbs</span>
              <span className="text-[9px] text-amber-200/20">50%</span>
              <span className="text-[9px] text-amber-200/20">75%</span>
              <span className="text-[9px] text-amber-200/20">{carryCapacity} lbs</span>
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
        );
      })()}

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
        ) : groupedItems ? (
          <div className="space-y-4">
            {groupedItems.map(group => (
              <div key={group.key}>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-t bg-amber-200/5 border border-amber-200/10 hover:bg-amber-200/8 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown size={14} className={`text-amber-200/40 transition-transform ${collapsedGroups[group.key] ? '-rotate-90' : ''}`} />
                    <span className="text-sm font-display text-amber-100">{group.key}</span>
                    <span className="text-xs text-amber-200/40">({group.items.length})</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-amber-200/30">
                    {group.totalWeight > 0 && <span>{group.totalWeight.toFixed(1)} lb</span>}
                    {group.totalValue > 0 && (
                      <span className="text-gold/60">
                        {group.totalValue >= 1
                          ? `${group.totalValue.toFixed(group.totalValue % 1 === 0 ? 0 : 2)} gp`
                          : group.totalValue >= 0.1
                          ? `${Math.round(group.totalValue * 10)} sp`
                          : `${Math.round(group.totalValue * 100)} cp`}
                      </span>
                    )}
                  </div>
                </button>
                {!collapsedGroups[group.key] && (
                  <div className="space-y-2 mt-2 ml-2">
                    {group.items.map(item => renderItem(item))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFilteredItems.map(item => renderItem(item))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && <ItemForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} character={character} />}

      {/* Edit Modal */}
      {editingItem && <ItemForm onSubmit={handleEditSubmit} onCancel={() => setEditingItem(null)} character={character} initialData={editingItem} />}

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

function ItemForm({ onSubmit, onCancel, character, initialData }) {
  const isEditing = !!initialData;
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        item_type: initialData.item_type || 'misc',
        weight: initialData.weight || 0,
        value_gp: initialData.value_gp || 0,
        quantity: initialData.quantity || 1,
        description: initialData.description || '',
        attunement: initialData.attunement || false,
        equipment_slot: initialData.equipment_slot || '',
        rarity: initialData.rarity || 'common',
        stat_modifiers: typeof initialData.stat_modifiers === 'string'
          ? initialData.stat_modifiers
          : JSON.stringify(initialData.stat_modifiers || {}),
      };
    }
    return {
      name: '', item_type: 'misc', weight: 0, value_gp: 0,
      quantity: 1, description: '', attunement: false, equipment_slot: '',
      rarity: 'common', stat_modifiers: '{}',
    };
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
        <h3 className="font-display text-lg text-amber-100 mb-4">{isEditing ? 'Edit Item' : 'Add Item'}</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Rarity</label>
              <select className="input w-full" value={form.rarity} onChange={e => update('rarity', e.target.value)}>
                {['common', 'uncommon', 'rare', 'very rare', 'legendary'].map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Stat Bonuses</label>
              {(() => {
                let mods = {};
                try { mods = JSON.parse(form.stat_modifiers || '{}'); } catch {}
                const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
                const updateMods = (newMods) => {
                  const cleaned = Object.fromEntries(Object.entries(newMods).filter(([, v]) => v !== 0 && v !== ''));
                  update('stat_modifiers', Object.keys(cleaned).length ? JSON.stringify(cleaned) : '{}');
                };
                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {ABILITIES.map(ab => (
                      <div key={ab} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.5)', textTransform: 'uppercase', width: 24 }}>{ab}</span>
                        <input
                          type="number"
                          className="input"
                          style={{ width: 48, padding: '2px 4px', fontSize: 12, textAlign: 'center' }}
                          value={mods[ab] || ''}
                          placeholder="0"
                          onChange={e => {
                            const val = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                            updateMods({ ...mods, [ab]: val });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-amber-200/60">
            <input type="checkbox" checked={form.attunement} onChange={e => update('attunement', e.target.checked)} /> Requires Attunement
          </label>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.name && onSubmit(isEditing ? { ...form } : { ...form, attuned: false, equipped: false })} className="btn-primary text-sm">{isEditing ? 'Save Changes' : 'Add Item'}</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
