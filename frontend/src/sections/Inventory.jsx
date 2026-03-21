import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Trash2, Package, Coins, Search, ArrowRightLeft, FlaskConical, Shield, Swords, Sparkles, AlertTriangle, ChevronUp, ChevronDown, ChevronRight, Zap, Pencil, Weight, Tag, Layers, Loader2, ShoppingCart } from 'lucide-react';
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
import { calcMod } from '../utils/dndHelpers';

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

// --- Equipment pack contents (5e SRD) ---
const PACK_CONTENTS = {
  "Explorer's Pack": { cost: '10 gp', totalWeight: 59, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Bedroll', qty: 1, weight: 7 },
    { name: 'Mess Kit', qty: 1, weight: 1 },
    { name: 'Tinderbox', qty: 1, weight: 1 },
    { name: 'Torch', qty: 10, weight: 1 },
    { name: 'Rations (1 day)', qty: 10, weight: 2 },
    { name: 'Waterskin', qty: 1, weight: 5 },
    { name: 'Hempen Rope (50 ft)', qty: 1, weight: 10 },
  ]},
  "Burglar's Pack": { cost: '16 gp', totalWeight: 46.5, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Ball Bearings (bag of 1,000)', qty: 1, weight: 2 },
    { name: 'String (10 ft)', qty: 1, weight: 0 },
    { name: 'Bell', qty: 1, weight: 0 },
    { name: 'Candle', qty: 5, weight: 0 },
    { name: 'Crowbar', qty: 1, weight: 5 },
    { name: 'Hammer', qty: 1, weight: 3 },
    { name: 'Piton', qty: 10, weight: 0.25 },
    { name: 'Hooded Lantern', qty: 1, weight: 2 },
    { name: 'Oil (flask)', qty: 2, weight: 1 },
    { name: 'Rations (1 day)', qty: 5, weight: 2 },
    { name: 'Tinderbox', qty: 1, weight: 1 },
    { name: 'Waterskin', qty: 1, weight: 5 },
    { name: 'Hempen Rope (50 ft)', qty: 1, weight: 10 },
  ]},
  "Dungeoneer's Pack": { cost: '12 gp', totalWeight: 61.5, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Crowbar', qty: 1, weight: 5 },
    { name: 'Hammer', qty: 1, weight: 3 },
    { name: 'Piton', qty: 10, weight: 0.25 },
    { name: 'Torch', qty: 10, weight: 1 },
    { name: 'Tinderbox', qty: 1, weight: 1 },
    { name: 'Rations (1 day)', qty: 10, weight: 2 },
    { name: 'Waterskin', qty: 1, weight: 5 },
    { name: 'Hempen Rope (50 ft)', qty: 1, weight: 10 },
  ]},
  "Diplomat's Pack": { cost: '39 gp', totalWeight: 36, items: [
    { name: 'Chest', qty: 1, weight: 25 },
    { name: 'Case, Map or Scroll', qty: 2, weight: 1 },
    { name: 'Fine Clothes', qty: 1, weight: 6 },
    { name: 'Ink (1 oz bottle)', qty: 1, weight: 0 },
    { name: 'Ink Pen', qty: 1, weight: 0 },
    { name: 'Lamp', qty: 1, weight: 1 },
    { name: 'Oil (flask)', qty: 2, weight: 1 },
    { name: 'Paper (sheet)', qty: 5, weight: 0 },
    { name: 'Perfume (vial)', qty: 1, weight: 0 },
    { name: 'Sealing Wax', qty: 1, weight: 0 },
    { name: 'Soap', qty: 1, weight: 0 },
  ]},
  "Entertainer's Pack": { cost: '40 gp', totalWeight: 38, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Bedroll', qty: 1, weight: 7 },
    { name: 'Costume (set)', qty: 2, weight: 4 },
    { name: 'Candle', qty: 5, weight: 0 },
    { name: 'Rations (1 day)', qty: 5, weight: 2 },
    { name: 'Waterskin', qty: 1, weight: 5 },
    { name: 'Disguise Kit', qty: 1, weight: 3 },
  ]},
  "Priest's Pack": { cost: '19 gp', totalWeight: 24, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Blanket', qty: 1, weight: 3 },
    { name: 'Candle', qty: 10, weight: 0 },
    { name: 'Tinderbox', qty: 1, weight: 1 },
    { name: 'Alms Box', qty: 1, weight: 0 },
    { name: 'Block of Incense', qty: 2, weight: 0 },
    { name: 'Censer', qty: 1, weight: 0 },
    { name: 'Vestments', qty: 1, weight: 0 },
    { name: 'Rations (1 day)', qty: 2, weight: 2 },
    { name: 'Waterskin', qty: 1, weight: 5 },
  ]},
  "Scholar's Pack": { cost: '40 gp', totalWeight: 10, items: [
    { name: 'Backpack', qty: 1, weight: 5 },
    { name: 'Book of Lore', qty: 1, weight: 5 },
    { name: 'Ink (1 oz bottle)', qty: 1, weight: 0 },
    { name: 'Ink Pen', qty: 1, weight: 0 },
    { name: 'Parchment (sheet)', qty: 10, weight: 0 },
    { name: 'Little Bag of Sand', qty: 1, weight: 0 },
    { name: 'Small Knife', qty: 1, weight: 0 },
  ]},
  "Monster Hunter's Pack": { cost: '33 gp', totalWeight: 48.5, items: [
    { name: 'Chest', qty: 1, weight: 25 },
    { name: 'Crowbar', qty: 1, weight: 5 },
    { name: 'Hammer', qty: 1, weight: 3 },
    { name: 'Wooden Stake', qty: 3, weight: 0.5 },
    { name: 'Holy Symbol', qty: 1, weight: 0 },
    { name: 'Holy Water (flask)', qty: 1, weight: 1 },
    { name: 'Manacles', qty: 1, weight: 6 },
    { name: 'Steel Mirror', qty: 1, weight: 0.5 },
    { name: 'Oil (flask)', qty: 1, weight: 1 },
    { name: 'Tinderbox', qty: 1, weight: 1 },
    { name: 'Torch', qty: 3, weight: 1 },
  ]},
};

// Helper to match item name to a known pack
function getPackContents(itemName) {
  if (!itemName) return null;
  const lower = itemName.toLowerCase();
  for (const [packName, data] of Object.entries(PACK_CONTENTS)) {
    if (lower === packName.toLowerCase() || lower.includes(packName.toLowerCase())) {
      return { packName, ...data };
    }
  }
  return null;
}

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
  const [sellMode, setSellMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [expandedPacks, setExpandedPacks] = useState({});

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
    const updated = { ...currency, [field]: Math.max(0, parseInt(value) || 0) };
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
  const totalWeight = items.reduce((sum, i) => sum + ((i.weight || 0) * (i.quantity || 1)), 0);
  const carryCapacity = strScore * 15;

  // Respect encumbrance rules setting
  const encumbranceRule = (() => {
    try { return JSON.parse(localStorage.getItem('codex-v3-settings') || '{}').encumbrance || 'variant'; } catch { return 'variant'; }
  })();
  const encumbered = encumbranceRule === 'variant' ? totalWeight > strScore * 5 : false;
  const heavilyEncumbered = encumbranceRule === 'variant' ? totalWeight > strScore * 10 : false;

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
          shieldBonus = armorInfo.bonus + (item.magic_bonus || 0);
        } else {
          armorFound = true;
          const mb = item.magic_bonus || 0;
          if (armorInfo.type === 'light') {
            baseAC = armorInfo.base + dexMod + mb;
          } else if (armorInfo.type === 'medium') {
            baseAC = armorInfo.base + Math.min(dexMod, armorInfo.maxDex || 2) + mb;
          } else if (armorInfo.type === 'heavy') {
            baseAC = armorInfo.base + mb;
          }
        }
      }
    }
    return { total: baseAC + shieldBonus, base: baseAC, shield: shieldBonus, hasArmor: armorFound, hasShield: shieldBonus > 0 };
  }, [items, dexScore]);

  // --- Sync calculated AC back to Overview when armor/shield is equipped ---
  useEffect(() => {
    if (!loading && items.length > 0 && (calculatedAC.hasArmor || calculatedAC.hasShield)) {
      updateOverview(characterId, { armor_class: calculatedAC.total }).catch(() => {});
    }
  }, [calculatedAC.total, loading, characterId]);

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
      toast(`Over Capacity! Carrying ${newTotalWeight.toFixed(1)}/${cap} lbs`, {
        icon: '\u26A0\uFE0F', duration: 5000,
        style: { background: '#1a1520', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', whiteSpace: 'pre-line' }
      });
    } else if (encumbranceRule === 'variant' && newTotalWeight > strScore * 10) {
      toast(`Heavily Encumbered! Carrying ${newTotalWeight.toFixed(1)}/${cap} lbs\nSpeed -20 ft, Disadvantage on checks, attacks, and STR/DEX/CON saves`, {
        icon: '\u26A0\uFE0F', duration: 4000,
        style: { background: '#1a1520', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'pre-line' }
      });
    } else if (encumbranceRule === 'variant' && newTotalWeight > strScore * 5) {
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

  // --- Sell Mode helpers ---
  const toggleItemSelected = (itemId) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const sellModeTotal = useMemo(() => {
    if (!sellMode || selectedItems.size === 0) return { count: 0, fullValue: 0, sellValue: 0 };
    let fullValue = 0;
    let count = 0;
    for (const item of items) {
      if (selectedItems.has(item.id)) {
        fullValue += (item.value_gp || 0) * (item.quantity || 1);
        count++;
      }
    }
    return { count, fullValue, sellValue: Math.floor(fullValue * 50) / 100 }; // half value, rounded down to 2 decimals
  }, [sellMode, selectedItems, items]);

  const handleSellSelected = async () => {
    if (selectedItems.size === 0) return;
    const sellValue = sellModeTotal.sellValue;
    try {
      // Delete all selected items
      await Promise.all(
        [...selectedItems].map(id => deleteItem(characterId, id))
      );
      // Add gold to currency
      const gpToAdd = Math.floor(sellValue);
      const spToAdd = Math.round((sellValue - gpToAdd) * 10);
      const updated = {
        ...currency,
        gp: currency.gp + gpToAdd,
        sp: currency.sp + spToAdd,
      };
      setCurrency(updated);
      await updateCurrency(characterId, updated);
      toast.success(`Sold ${sellModeTotal.count} item${sellModeTotal.count !== 1 ? 's' : ''} for ${sellValue} GP`);
      setSellMode(false);
      setSelectedItems(new Set());
      load();
    } catch (err) {
      toast.error('Failed to sell items: ' + err.message);
    }
  };

  const exitSellMode = () => {
    setSellMode(false);
    setSelectedItems(new Set());
  };

  // --- Shared item row renderer ---
  const renderItem = (item) => {
    const typeColor = { weapon: 'border-l-red-500/70', armor: 'border-l-blue-400/70', wondrous: 'border-l-purple-400/70', consumable: 'border-l-emerald-400/70', misc: 'border-l-amber-200/20' };
    const rarityClass = item.rarity ? `rarity-${item.rarity.toLowerCase().replace(/\s+/g, '-')}` : '';
    const leftBorder = rarityClass || (typeColor[item.item_type] ? typeColor[item.item_type] : 'border-l-amber-200/20');
    const consumableEffect = item.item_type === 'consumable' ? CONSUMABLE_EFFECTS[item.name] : null;
    const itemTags = getItemTags(item);
    const equippedCounterpart = !item.equipped && (item.item_type === 'weapon' || item.item_type === 'armor')
      ? getEquippedOfType(item.item_type, item.name)
      : null;
    return (
      <div
        key={item.id}
        className={`bg-[#0d0d12] rounded p-3 border ${rarityClass ? rarityClass : `border-l-[3px] ${leftBorder}`} flex items-start gap-3 ${item.attuned ? 'border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]' : 'border-gold/10'} relative`}
        title={item.description || undefined}
        onMouseEnter={() => equippedCounterpart && setComparisonItem(item)}
        onMouseLeave={() => setComparisonItem(null)}
      >
        {sellMode && (
          <label className="flex items-center cursor-pointer shrink-0 mt-1" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={selectedItems.has(item.id)}
              onChange={() => toggleItemSelected(item.id)}
              className="w-4 h-4 rounded border-amber-200/30 bg-[#0d0d12] text-gold accent-amber-500 cursor-pointer"
            />
          </label>
        )}
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
          {/* Pack contents dropdown */}
          {(() => {
            const pack = getPackContents(item.name);
            if (!pack) return null;
            const isExpanded = expandedPacks[item.id];
            return (
              <div className="mt-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedPacks(prev => ({ ...prev, [item.id]: !prev[item.id] })); }}
                  className="flex items-center gap-1 text-[11px] text-amber-300/60 hover:text-amber-200 transition-colors"
                >
                  <ChevronRight size={12} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  <Package size={11} />
                  <span className="font-medium">Pack Contents</span>
                  <span className="text-amber-200/30">({pack.items.length} items · {pack.totalWeight} lb)</span>
                </button>
                {isExpanded && (
                  <div className="mt-1.5 ml-1 pl-3 border-l-2 border-amber-500/15 space-y-0.5">
                    {pack.items.map((pi, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] py-0.5">
                        <span className="text-amber-200/50">
                          {pi.name}
                          {pi.qty > 1 && <span className="text-amber-200/30 ml-1">×{pi.qty}</span>}
                        </span>
                        <span className="text-amber-200/25 font-mono tabular-nums">
                          {(pi.weight * pi.qty) > 0 ? `${(pi.weight * pi.qty)} lb` : '—'}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-[11px] pt-1 mt-1 border-t border-amber-200/8 font-medium">
                      <span className="text-amber-300/50">Total</span>
                      <span className="text-amber-300/50 font-mono">{pack.totalWeight} lb</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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
          {/* Magic properties display */}
          {(item.magic_bonus > 0 || item.extra_damage || item.save_bonus > 0 || item.special_properties) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.magic_bonus > 0 && (
                <span className="text-[10px] bg-purple-900/20 text-purple-400/70 px-1.5 py-0.5 rounded font-mono">
                  +{item.magic_bonus} {item.item_type === 'weapon' ? 'attack/dmg' : item.item_type === 'armor' ? 'AC' : 'magic'}
                </span>
              )}
              {item.extra_damage && (
                <span className="text-[10px] bg-red-900/20 text-red-400/70 px-1.5 py-0.5 rounded font-mono">
                  +{item.extra_damage}
                </span>
              )}
              {item.save_bonus > 0 && (
                <span className="text-[10px] bg-blue-900/20 text-blue-400/70 px-1.5 py-0.5 rounded font-mono">
                  +{item.save_bonus} saves
                </span>
              )}
              {item.special_properties && (
                <span className="text-[10px] bg-amber-900/20 text-amber-400/70 px-1.5 py-0.5 rounded italic truncate max-w-[200px]" title={item.special_properties}>
                  {item.special_properties}
                </span>
              )}
            </div>
          )}
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

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-12 text-amber-200/40">
      <Loader2 size={18} className="animate-spin" />
      <span>Loading inventory...</span>
    </div>
  );

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
          {items.length > 0 && (
            <button
              onClick={() => sellMode ? exitSellMode() : setSellMode(true)}
              className={`text-xs flex items-center gap-1 ${sellMode ? 'btn-primary bg-amber-600 hover:bg-amber-700 border-amber-500' : 'btn-secondary'}`}
              title={sellMode ? 'Exit sell mode' : 'Enter sell mode to batch-sell items'}
            >
              <ShoppingCart size={12} /> {sellMode ? 'Exit Sell Mode' : 'Sell Mode'}
            </button>
          )}
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

      {/* Sell Mode Summary Bar */}
      {sellMode && (
        <div className="sticky bottom-0 z-10 bg-[#14121c]/95 backdrop-blur border border-amber-500/30 rounded-lg p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-amber-400" />
              <span className="text-sm text-amber-100 font-medium">Sell Mode</span>
            </div>
            <span className="text-sm text-amber-200/60">
              {sellModeTotal.count} item{sellModeTotal.count !== 1 ? 's' : ''} selected
              {sellModeTotal.count > 0 && (
                <span className="ml-2">
                  · Total value: <span className="text-gold font-medium">{sellModeTotal.fullValue.toFixed(2)} GP</span>
                  · Sell price: <span className="text-emerald-400 font-medium">{sellModeTotal.sellValue.toFixed(2)} GP</span>
                  <span className="text-amber-200/30 ml-1">(half value)</span>
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exitSellMode}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={handleSellSelected}
              disabled={sellModeTotal.count === 0}
              className={`text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1 ${
                sellModeTotal.count > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
                  : 'bg-gray-700 text-gray-400 border border-gray-600 cursor-not-allowed'
              }`}
            >
              <Coins size={12} /> Sell Selected
            </button>
          </div>
        </div>
      )}

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
        magic_bonus: initialData.magic_bonus || 0,
        extra_damage: initialData.extra_damage || '',
        save_bonus: initialData.save_bonus || 0,
        special_properties: initialData.special_properties || '',
      };
    }
    return {
      name: '', item_type: 'misc', weight: 0, value_gp: 0,
      quantity: 1, description: '', attunement: false, equipment_slot: '',
      rarity: 'common', stat_modifiers: '{}',
      magic_bonus: 0, extra_damage: '', save_bonus: 0, special_properties: '',
    };
  });
  const [selectedCatalogItem, setSelectedCatalogItem] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(() => {
    if (!initialData) return false;
    return (initialData.rarity && initialData.rarity !== 'common') ||
      (initialData.magic_bonus && initialData.magic_bonus > 0) ||
      (initialData.save_bonus && initialData.save_bonus > 0) ||
      (initialData.extra_damage && initialData.extra_damage.length > 0) ||
      (initialData.special_properties && initialData.special_properties.length > 0) ||
      (initialData.attunement === true);
  });
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
          rarity: found.rarity || prev.rarity,
          magic_bonus: found.magic_bonus ?? prev.magic_bonus,
          save_bonus: found.save_bonus ?? prev.save_bonus,
          extra_damage: found.extra_damage || prev.extra_damage,
          attunement: found.attunement ?? prev.attunement,
          stat_modifiers: found.stat_modifiers || prev.stat_modifiers,
          special_properties: found.special_properties || prev.special_properties,
        }));
        break;
      }
    }
  };

  const handleFormSubmit = () => {
    if (!form.name || !form.name.trim()) { toast.error('Item name is required'); return; }
    onSubmit(isEditing ? { ...form } : { ...form, attuned: false, equipped: false });
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{isEditing ? 'Edit Item' : 'Add Item'}</h3>
        <div className="space-y-3" onKeyDown={e => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleFormSubmit(); } }}>
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

          {/* Advanced fields toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center gap-2 text-xs text-amber-200/50 hover:text-amber-200/70 transition-colors py-1.5 px-2 rounded hover:bg-white/[0.03]"
          >
            <span style={{ fontSize: 10, transition: 'transform 0.15s', transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>&#9654;</span>
            Magic & Advanced Properties
            {!showAdvanced && (form.rarity !== 'common' || form.magic_bonus > 0 || form.attunement) && (
              <span className="text-[10px] text-purple-400/60 ml-auto">has values</span>
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-1 pl-1 border-l-2 border-purple-500/15 ml-1">
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
              {/* Magic bonus, extra damage, save bonus — shown for weapons, armor, wondrous */}
              {['weapon', 'armor', 'wondrous'].includes(form.item_type) && (
                <div className="space-y-2 pt-2 border-t border-amber-200/8">
                  <div className="text-[10px] text-amber-200/30 uppercase tracking-wider">Magic Properties</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">Magic Bonus</label>
                      <select className="input w-full" value={form.magic_bonus} onChange={e => update('magic_bonus', parseInt(e.target.value) || 0)}>
                        <option value={0}>None</option>
                        <option value={1}>+1</option>
                        <option value={2}>+2</option>
                        <option value={3}>+3</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Save Bonus</label>
                      <select className="input w-full" value={form.save_bonus} onChange={e => update('save_bonus', parseInt(e.target.value) || 0)} title="Bonus to all saving throws (e.g., Cloak of Protection)">
                        <option value={0}>None</option>
                        <option value={1}>+1</option>
                        <option value={2}>+2</option>
                        <option value={3}>+3</option>
                      </select>
                    </div>
                    {form.item_type === 'weapon' && (
                      <div>
                        <label className="label">Extra Damage</label>
                        <input className="input w-full" placeholder="e.g. 2d6 fire" value={form.extra_damage} onChange={e => update('extra_damage', e.target.value)} title="Additional damage dice (e.g., Flame Tongue: 2d6 fire)" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="label">Special Properties</label>
                    <input className="input w-full" placeholder="e.g. On hit: DC 15 CON save or poisoned" value={form.special_properties} onChange={e => update('special_properties', e.target.value)} />
                  </div>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-amber-200/60">
                <input type="checkbox" checked={form.attunement} onChange={e => update('attunement', e.target.checked)} /> Requires Attunement
              </label>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleFormSubmit} className="btn-primary text-sm">{isEditing ? 'Save Changes' : 'Add Item'}</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
