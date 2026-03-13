import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Coins, Users, ArrowRight, Dices, Plus, Trash2, Search, ChevronDown, ChevronUp, ScrollText, Scale, X, Check, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCharacters } from '../api/characters';
import { addItem, getCurrency, updateCurrency } from '../api/inventory';

// ── Storage helpers ──
const LOOT_KEY = id => `party-loot-${id}`;
const TREASURY_KEY = id => `party-treasury-${id}`;
const LOG_KEY = id => `party-loot-log-${id}`;

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function saveJSON(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ── Rarity colors (inline style) ──
const RARITY_COLORS = {
  common:      { border: 'rgba(156,163,175,0.5)', text: '#9ca3af', bg: 'rgba(156,163,175,0.08)' },
  uncommon:    { border: 'rgba(74,222,128,0.5)',   text: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  rare:        { border: 'rgba(96,165,250,0.5)',   text: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  'very rare': { border: 'rgba(192,132,252,0.5)',  text: '#c084fc', bg: 'rgba(192,132,252,0.08)' },
  legendary:   { border: 'rgba(251,191,36,0.5)',   text: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
};

const COIN_STYLES = {
  cp: { color: '#c2854a', bg: 'rgba(194,133,74,0.15)', label: 'CP' },
  sp: { color: '#a8b4c0', bg: 'rgba(168,180,192,0.15)', label: 'SP' },
  ep: { color: '#7da2c9', bg: 'rgba(125,162,201,0.15)', label: 'EP' },
  gp: { color: '#f0c850', bg: 'rgba(240,200,80,0.15)',  label: 'GP' },
  pp: { color: '#c9a0f0', bg: 'rgba(201,160,240,0.15)', label: 'PP' },
};

const CURRENCY_RATES = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };

// ── Quick Loot Tables (simplified DMG random treasure) ──
const QUICK_LOOT_TABLES = {
  'CR 0-4': {
    goldDice: { count: 1, sides: 6, mult: 10 },
    items: [
      { name: 'Potion of Healing', item_type: 'consumable', rarity: 'common', weight: 0.5, value_gp: 50, quantity: 1, description: 'Restores 2d4+2 HP' },
      { name: 'Scroll of Identify', item_type: 'consumable', rarity: 'common', weight: 0, value_gp: 25, quantity: 1, description: '1st-level spell scroll' },
      { name: 'Gem (Agate)', item_type: 'misc', rarity: 'common', weight: 0, value_gp: 10, quantity: 1, description: 'A polished agate gemstone' },
    ],
  },
  'CR 5-10': {
    goldDice: { count: 1, sides: 6, mult: 100 },
    items: [
      { name: 'Cloak of Protection', item_type: 'wondrous', rarity: 'uncommon', weight: 1, value_gp: 500, quantity: 1, description: '+1 AC and saving throws. Requires attunement.' },
      { name: 'Potion of Greater Healing', item_type: 'consumable', rarity: 'uncommon', weight: 0.5, value_gp: 150, quantity: 1, description: 'Restores 4d4+4 HP' },
      { name: 'Gem (Jade)', item_type: 'misc', rarity: 'uncommon', weight: 0, value_gp: 100, quantity: 1, description: 'A carved jade gemstone' },
    ],
  },
  'CR 11-16': {
    goldDice: { count: 1, sides: 6, mult: 1000 },
    items: [
      { name: 'Flame Tongue Longsword', item_type: 'weapon', rarity: 'rare', weight: 3, value_gp: 5000, quantity: 1, description: 'Deals extra 2d6 fire damage when ignited. Requires attunement.' },
      { name: 'Potion of Superior Healing', item_type: 'consumable', rarity: 'rare', weight: 0.5, value_gp: 500, quantity: 1, description: 'Restores 8d4+8 HP' },
      { name: 'Gem (Diamond)', item_type: 'misc', rarity: 'rare', weight: 0, value_gp: 1000, quantity: 1, description: 'A brilliant diamond' },
    ],
  },
};

function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}

let _nextId = Date.now();
function uid() { return `loot-${_nextId++}-${Math.random().toString(36).slice(2, 8)}`; }

// ── Shared input style ──
const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
  color: '#e8dcc8', fontSize: '12px', fontFamily: 'var(--font-ui, Outfit, sans-serif)',
  outline: 'none', transition: 'border-color 0.15s',
};

const btnPrimary = {
  padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
  background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.15))',
  color: '#f0c850', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-ui, Outfit, sans-serif)',
  transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6,
};

const btnSecondary = {
  padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(228,216,196,0.6)', fontSize: '11px', fontWeight: 500,
  fontFamily: 'var(--font-ui, Outfit, sans-serif)', transition: 'all 0.15s',
  display: 'inline-flex', alignItems: 'center', gap: 5,
};

const cardStyle = {
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10, padding: 16,
};

const labelStyle = {
  fontSize: '10px', fontWeight: 600, color: 'rgba(228,216,196,0.5)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
  fontFamily: 'var(--font-ui, Outfit, sans-serif)',
};

// ══════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════
export default function PartyLoot({ characterId }) {
  // ── State ──
  const [items, setItems] = useState([]);
  const [treasury, setTreasury] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [log, setLog] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [distributeTargets, setDistributeTargets] = useState(new Set());
  const [showDistribute, setShowDistribute] = useState(false);
  const [showSplitCurrency, setShowSplitCurrency] = useState(false);
  const [splitCurrency, setSplitCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [splitTargets, setSplitTargets] = useState(new Set());
  const [showQuickLoot, setShowQuickLoot] = useState(false);
  const [selectedCR, setSelectedCR] = useState('CR 0-4');
  const [showLog, setShowLog] = useState(false);
  const [tab, setTab] = useState('loot'); // loot | treasury | distribute | log

  // ── Load data ──
  useEffect(() => {
    setItems(loadJSON(LOOT_KEY(characterId), []));
    setTreasury(loadJSON(TREASURY_KEY(characterId), { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }));
    setLog(loadJSON(LOG_KEY(characterId), []));
    listCharacters().then(setCharacters).catch(() => {});
  }, [characterId]);

  // ── Persist helpers ──
  const saveItems = useCallback((newItems) => {
    setItems(newItems);
    saveJSON(LOOT_KEY(characterId), newItems);
  }, [characterId]);

  const saveTreasury = useCallback((newTreasury) => {
    setTreasury(newTreasury);
    saveJSON(TREASURY_KEY(characterId), newTreasury);
  }, [characterId]);

  const addLogEntry = useCallback((text) => {
    const entry = { id: uid(), text, timestamp: new Date().toISOString() };
    setLog(prev => {
      const updated = [entry, ...prev].slice(0, 200);
      saveJSON(LOG_KEY(characterId), updated);
      return updated;
    });
  }, [characterId]);

  // ── Computed ──
  const totalWeight = useMemo(() => items.reduce((sum, i) => sum + ((i.weight || 0) * (i.quantity || 1)), 0), [items]);
  const totalValue = useMemo(() => items.reduce((sum, i) => sum + ((i.value_gp || 0) * (i.quantity || 1)), 0), [items]);
  const treasuryTotalGP = useMemo(() =>
    Object.entries(treasury).reduce((sum, [k, v]) => sum + (v * (CURRENCY_RATES[k] || 0)), 0)
  , [treasury]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.item_type || '').toLowerCase().includes(q) ||
      (i.rarity || '').toLowerCase().includes(q) ||
      (i.looted_from || '').toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // ── Handlers ──
  const handleAddItem = (itemData) => {
    const newItem = { ...itemData, id: uid() };
    const updated = [...items, newItem];
    saveItems(updated);
    addLogEntry(`Added ${itemData.quantity || 1}x ${itemData.name}${itemData.looted_from ? ` (from ${itemData.looted_from})` : ''}`);
    setShowAddForm(false);
    toast.success(`Added ${itemData.name} to party loot`);
  };

  const handleDeleteItem = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    saveItems(items.filter(i => i.id !== itemId));
    setSelectedItems(prev => { const n = new Set(prev); n.delete(itemId); return n; });
    addLogEntry(`Removed ${item.name} from party loot`);
    toast.success(`Removed ${item.name}`);
  };

  const handleUpdateQuantity = (itemId, delta) => {
    const updated = items.map(i => {
      if (i.id !== itemId) return i;
      const newQty = Math.max(1, (i.quantity || 1) + delta);
      return { ...i, quantity: newQty };
    });
    saveItems(updated);
  };

  // ── Distribute selected items to characters ──
  const handleDistribute = async () => {
    if (selectedItems.size === 0 || distributeTargets.size === 0) {
      toast.error('Select items and at least one character');
      return;
    }
    const targetChars = characters.filter(c => distributeTargets.has(c.id));
    const distributeItems = items.filter(i => selectedItems.has(i.id));
    let successCount = 0;

    for (const item of distributeItems) {
      const totalQty = item.quantity || 1;
      const perChar = Math.floor(totalQty / targetChars.length);
      let remainder = totalQty - perChar * targetChars.length;

      for (const char of targetChars) {
        const qty = perChar + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        if (qty <= 0) continue;
        try {
          await addItem(char.id, {
            name: item.name,
            item_type: item.item_type || 'misc',
            quantity: qty,
            weight: item.weight || 0,
            value_gp: item.value_gp || 0,
            rarity: item.rarity || 'common',
            description: item.description || '',
            attunement: false,
            attuned: false,
            equipped: false,
            stat_modifiers: '{}',
          });
          successCount++;
        } catch (err) {
          toast.error(`Failed to give ${item.name} to ${char.name}: ${err?.message || err}`);
        }
      }
    }

    // Remove distributed items from party loot
    const remaining = items.filter(i => !selectedItems.has(i.id));
    saveItems(remaining);

    const charNames = targetChars.map(c => c.name).join(', ');
    const itemNames = distributeItems.map(i => i.name).join(', ');
    addLogEntry(`Distributed ${itemNames} to ${charNames}`);

    setSelectedItems(new Set());
    setDistributeTargets(new Set());
    setShowDistribute(false);
    toast.success(`Distributed ${successCount} item(s) to ${targetChars.length} character(s)`);
  };

  // ── Split currency among characters ──
  const handleSplitCurrency = async () => {
    if (splitTargets.size === 0) {
      toast.error('Select at least one character');
      return;
    }
    const targetChars = characters.filter(c => splitTargets.has(c.id));
    const count = targetChars.length;
    const perChar = {};
    const remainder = {};

    for (const denom of ['cp', 'sp', 'ep', 'gp', 'pp']) {
      const total = splitCurrency[denom] || 0;
      perChar[denom] = Math.floor(total / count);
      remainder[denom] = total - (perChar[denom] * count);
    }

    let successCount = 0;
    for (const char of targetChars) {
      try {
        const existing = await getCurrency(char.id);
        const updated = {};
        for (const denom of ['cp', 'sp', 'ep', 'gp', 'pp']) {
          updated[denom] = (existing[denom] || 0) + perChar[denom];
        }
        await updateCurrency(char.id, updated);
        successCount++;
      } catch (err) {
        toast.error(`Failed to add currency to ${char.name}: ${err?.message || err}`);
      }
    }

    // Deduct split amount from treasury, keep remainder
    const newTreasury = { ...treasury };
    for (const denom of ['cp', 'sp', 'ep', 'gp', 'pp']) {
      newTreasury[denom] = Math.max(0, newTreasury[denom] - (splitCurrency[denom] || 0) + remainder[denom]);
    }
    saveTreasury(newTreasury);

    const denomStr = ['cp', 'sp', 'ep', 'gp', 'pp']
      .filter(d => perChar[d] > 0)
      .map(d => `${perChar[d]} ${d.toUpperCase()}`)
      .join(', ');
    const remainderStr = ['cp', 'sp', 'ep', 'gp', 'pp']
      .filter(d => remainder[d] > 0)
      .map(d => `${remainder[d]} ${d.toUpperCase()}`)
      .join(', ');

    addLogEntry(`Split currency: ${denomStr || '0'} each to ${targetChars.map(c => c.name).join(', ')}${remainderStr ? `. Remainder: ${remainderStr}` : ''}`);
    setSplitCurrency({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
    setSplitTargets(new Set());
    setShowSplitCurrency(false);
    toast.success(`Split currency among ${successCount} character(s)`);
  };

  // ── Quick Loot ──
  const handleQuickLoot = () => {
    const table = QUICK_LOOT_TABLES[selectedCR];
    if (!table) return;

    const goldRoll = rollDice(table.goldDice.count, table.goldDice.sides) * table.goldDice.mult;
    const newTreasury = { ...treasury, gp: treasury.gp + goldRoll };
    saveTreasury(newTreasury);

    // Pick 1-2 random items from the table
    const numItems = Math.min(table.items.length, Math.floor(Math.random() * 2) + 1);
    const shuffled = [...table.items].sort(() => Math.random() - 0.5);
    const pickedItems = shuffled.slice(0, numItems);

    const newItems = pickedItems.map(item => ({ ...item, id: uid(), looted_from: `${selectedCR} encounter` }));
    saveItems([...items, ...newItems]);

    const itemNames = newItems.map(i => i.name).join(', ');
    addLogEntry(`Quick Loot (${selectedCR}): ${goldRoll} GP and ${itemNames}`);
    toast.success(`Rolled ${goldRoll} GP + ${numItems} item(s)!`);
    setShowQuickLoot(false);
  };

  // ── Treasury currency update ──
  const updateTreasuryField = (denom, value) => {
    const updated = { ...treasury, [denom]: Math.max(0, parseInt(value) || 0) };
    saveTreasury(updated);
  };

  // ── Toggle helpers ──
  const toggleItemSelect = (id) => {
    setSelectedItems(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleDistributeTarget = (id) => {
    setDistributeTargets(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSplitTarget = (id) => {
    setSplitTargets(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // ══════════════════════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 'none' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
          <Package size={22} style={{ color: '#f0c850' }} />
          <div>
            <span>Party Loot</span>
            <p style={{ fontSize: '11px', color: 'rgba(228,216,196,0.35)', fontWeight: 400, marginTop: 2, fontFamily: 'var(--font-ui, Outfit, sans-serif)' }}>
              Shared party inventory — bag of holding, treasury, and loot distribution.
            </p>
          </div>
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnSecondary} onClick={() => setShowQuickLoot(!showQuickLoot)}>
            <Dices size={13} /> Quick Loot
          </button>
          <button style={btnPrimary} onClick={() => setShowAddForm(true)}>
            <Plus size={13} /> Add Item
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {[
          { key: 'loot', label: 'Bag of Holding', icon: Package },
          { key: 'treasury', label: 'Treasury', icon: Coins },
          { key: 'distribute', label: 'Distribute', icon: Users },
          { key: 'log', label: 'Loot Log', icon: ScrollText },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '8px 16px', borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer',
              background: tab === key ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderBottom: tab === key ? '2px solid #f0c850' : '2px solid transparent',
              color: tab === key ? '#e8dcc8' : 'rgba(228,216,196,0.4)',
              fontSize: '12px', fontWeight: tab === key ? 600 : 400,
              fontFamily: 'var(--font-ui, Outfit, sans-serif)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
            }}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── Summary Bar ── */}
      <div style={{ ...cardStyle, display: 'flex', gap: 24, alignItems: 'center', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={14} style={{ color: 'rgba(228,216,196,0.4)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>Items:</span>
          <span style={{ fontSize: '13px', color: '#e8dcc8', fontWeight: 600 }}>{items.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Scale size={14} style={{ color: 'rgba(228,216,196,0.4)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>Weight:</span>
          <span style={{ fontSize: '13px', color: '#e8dcc8', fontWeight: 600 }}>{totalWeight.toFixed(1)} lbs</span>
          <span style={{ fontSize: '10px', color: 'rgba(228,216,196,0.3)' }}>(Bag of Holding: 500 lb limit)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Coins size={14} style={{ color: '#f0c850' }} />
          <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>Loot Value:</span>
          <span style={{ fontSize: '13px', color: '#f0c850', fontWeight: 600 }}>{totalValue.toFixed(1)} GP</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Coins size={14} style={{ color: '#f0c850' }} />
          <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>Treasury:</span>
          <span style={{ fontSize: '13px', color: '#f0c850', fontWeight: 600 }}>{treasuryTotalGP.toFixed(2)} GP</span>
        </div>
      </div>

      {/* ══════════ Quick Loot Panel ══════════ */}
      <AnimatePresence>
        {showQuickLoot && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ ...cardStyle, borderColor: 'rgba(251,191,36,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <Dices size={16} style={{ color: '#f0c850' }} /> Quick Loot by CR
                </h3>
                <button onClick={() => setShowQuickLoot(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(228,216,196,0.4)', padding: 4 }}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>Challenge Rating</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Object.keys(QUICK_LOOT_TABLES).map(cr => (
                      <button
                        key={cr}
                        onClick={() => setSelectedCR(cr)}
                        style={{
                          ...btnSecondary, flex: 1, justifyContent: 'center',
                          ...(selectedCR === cr ? { background: 'rgba(240,200,80,0.12)', borderColor: 'rgba(240,200,80,0.3)', color: '#f0c850' } : {}),
                        }}
                      >
                        {cr}
                      </button>
                    ))}
                  </div>
                </div>
                <button style={btnPrimary} onClick={handleQuickLoot}>
                  <Dices size={14} /> Roll Loot
                </button>
              </div>
              <div style={{ marginTop: 10, fontSize: '11px', color: 'rgba(228,216,196,0.35)' }}>
                {selectedCR === 'CR 0-4' && 'Rolls 1d6 x 10 GP + common items (potions, gems, scrolls)'}
                {selectedCR === 'CR 5-10' && 'Rolls 1d6 x 100 GP + uncommon items (cloaks, greater potions)'}
                {selectedCR === 'CR 11-16' && 'Rolls 1d6 x 1,000 GP + rare items (magic weapons, diamonds)'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ Add Item Form (Modal-style) ══════════ */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={e => { if (e.target === e.currentTarget) setShowAddForm(false); }}
          >
            <AddItemForm onSubmit={handleAddItem} onCancel={() => setShowAddForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ TAB: Bag of Holding ══════════ */}
      {tab === 'loot' && (
        <div>
          {/* Search */}
          {items.length > 0 && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(228,216,196,0.25)', pointerEvents: 'none' }} />
              <input
                style={{ ...inputStyle, paddingLeft: 34 }}
                placeholder="Search loot by name, type, rarity, or source..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Selection actions */}
          {selectedItems.size > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>{selectedItems.size} selected</span>
              <button style={btnPrimary} onClick={() => { setShowDistribute(true); setTab('distribute'); }}>
                <ArrowRight size={13} /> Distribute to Party
              </button>
              <button style={btnSecondary} onClick={() => setSelectedItems(new Set())}>
                Clear Selection
              </button>
            </div>
          )}

          {/* Item Cards */}
          {filteredItems.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
              <Package size={32} style={{ color: 'rgba(228,216,196,0.15)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px', color: 'rgba(228,216,196,0.3)', marginBottom: 12 }}>
                {items.length === 0 ? 'No loot yet. Add items from encounters or use Quick Loot to roll random treasure.' : 'No items match your search.'}
              </p>
              {items.length === 0 && (
                <button style={btnPrimary} onClick={() => setShowAddForm(true)}>
                  <Plus size={13} /> Add First Item
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <AnimatePresence>
                {filteredItems.map(item => {
                  const rarity = RARITY_COLORS[(item.rarity || 'common').toLowerCase()] || RARITY_COLORS.common;
                  const isSelected = selectedItems.has(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      style={{
                        background: isSelected ? 'rgba(240,200,80,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(240,200,80,0.25)' : 'rgba(255,255,255,0.06)'}`,
                        borderLeft: `3px solid ${rarity.border}`,
                        borderRadius: 8, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onClick={() => toggleItemSelect(item.id)}
                    >
                      {/* Select checkbox */}
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                        border: isSelected ? '2px solid #f0c850' : '2px solid rgba(255,255,255,0.15)',
                        background: isSelected ? 'rgba(240,200,80,0.2)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <Check size={11} style={{ color: '#f0c850' }} />}
                      </div>

                      {/* Item info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8dcc8', fontFamily: 'var(--font-ui, Outfit, sans-serif)' }}>
                            {item.name}
                          </span>
                          <span style={{
                            fontSize: '9px', padding: '1px 6px', borderRadius: 4,
                            background: rarity.bg, color: rarity.text,
                            border: `1px solid ${rarity.border}`, fontWeight: 600, textTransform: 'capitalize',
                          }}>
                            {item.rarity || 'common'}
                          </span>
                          {item.item_type && (
                            <span style={{ fontSize: '10px', color: 'rgba(228,216,196,0.35)', textTransform: 'capitalize' }}>
                              {item.item_type}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '11px', color: 'rgba(228,216,196,0.35)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </div>
                        )}
                        {item.looted_from && (
                          <div style={{ fontSize: '10px', color: 'rgba(228,216,196,0.25)', marginTop: 2, fontStyle: 'italic' }}>
                            Looted from: {item.looted_from}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={e => { e.stopPropagation(); handleUpdateQuantity(item.id, -1); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(228,216,196,0.3)', padding: 2 }}
                          >
                            <ChevronDown size={12} />
                          </button>
                          <span style={{ fontSize: '12px', color: '#e8dcc8', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                            x{item.quantity || 1}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); handleUpdateQuantity(item.id, 1); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(228,216,196,0.3)', padding: 2 }}
                          >
                            <ChevronUp size={12} />
                          </button>
                        </div>

                        {item.weight > 0 && (
                          <span style={{ fontSize: '11px', color: 'rgba(228,216,196,0.35)', whiteSpace: 'nowrap' }}>
                            {(item.weight * (item.quantity || 1)).toFixed(1)} lb
                          </span>
                        )}
                        {item.value_gp > 0 && (
                          <span style={{ fontSize: '11px', color: '#f0c850', whiteSpace: 'nowrap' }}>
                            {((item.value_gp || 0) * (item.quantity || 1)).toFixed(0)} gp
                          </span>
                        )}

                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteItem(item.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)', padding: 4, transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.5)'}
                          title="Remove from party loot"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Weight reference */}
          {items.length > 0 && (
            <div style={{ ...cardStyle, marginTop: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={14} style={{ color: 'rgba(228,216,196,0.3)' }} />
                <span style={{ fontSize: '12px', color: 'rgba(228,216,196,0.5)' }}>
                  Total Weight: <strong style={{ color: totalWeight > 500 ? '#ef4444' : '#e8dcc8' }}>{totalWeight.toFixed(1)} lbs</strong>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(228,216,196,0.3)' }}>
                Bag of Holding: 500 lb / 64 cu.ft. limit
                {totalWeight > 500 && (
                  <span style={{ color: '#ef4444', fontWeight: 600, marginLeft: 8 }}>OVER CAPACITY!</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════ TAB: Treasury ══════════ */}
      {tab === 'treasury' && (
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Coins size={16} style={{ color: '#f0c850' }} />
              <h3 style={{ fontSize: '15px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', margin: 0 }}>
                Party Treasury
              </h3>
              <div style={{ marginLeft: 'auto' }}>
                <button style={btnSecondary} onClick={() => setShowSplitCurrency(!showSplitCurrency)}>
                  <Users size={12} /> Split Currency
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {['cp', 'sp', 'ep', 'gp', 'pp'].map(denom => {
                const cs = COIN_STYLES[denom];
                return (
                  <div key={denom} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: cs.bg, border: `1px solid ${cs.color}40`,
                      }}>
                        <span style={{ fontSize: '8px', fontWeight: 700, color: cs.color }}>{cs.label[0]}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: cs.color }}>{cs.label}</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      style={{ ...inputStyle, textAlign: 'center', fontSize: '14px', fontWeight: 600 }}
                      value={treasury[denom]}
                      onChange={e => updateTreasuryField(denom, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12, textAlign: 'right', fontSize: '12px', color: 'rgba(228,216,196,0.4)' }}>
              Total value: <span style={{ color: '#f0c850', fontWeight: 600 }}>{treasuryTotalGP.toFixed(2)} GP</span>
            </div>
          </div>

          {/* ── Currency Split Panel ── */}
          <AnimatePresence>
            {showSplitCurrency && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ ...cardStyle, marginTop: 12, borderColor: 'rgba(192,132,252,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Users size={15} style={{ color: '#c084fc' }} />
                    <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', margin: 0 }}>
                      Split Currency
                    </h3>
                    <button onClick={() => setShowSplitCurrency(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(228,216,196,0.4)', padding: 4 }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Amount to split */}
                  <div style={labelStyle}>Amount to Split</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map(denom => (
                      <div key={denom}>
                        <div style={{ fontSize: '10px', color: COIN_STYLES[denom].color, textAlign: 'center', marginBottom: 2, fontWeight: 600 }}>
                          {COIN_STYLES[denom].label}
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={treasury[denom]}
                          style={{ ...inputStyle, textAlign: 'center' }}
                          value={splitCurrency[denom]}
                          onChange={e => setSplitCurrency(prev => ({ ...prev, [denom]: Math.min(treasury[denom], parseInt(e.target.value) || 0) }))}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick-fill: split all treasury */}
                  <button
                    style={{ ...btnSecondary, marginBottom: 14, fontSize: '10px' }}
                    onClick={() => setSplitCurrency({ ...treasury })}
                  >
                    Use Entire Treasury
                  </button>

                  {/* Character selection */}
                  <div style={labelStyle}>Split Among</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {characters.map(char => {
                      const selected = splitTargets.has(char.id);
                      return (
                        <button
                          key={char.id}
                          onClick={() => toggleSplitTarget(char.id)}
                          style={{
                            ...btnSecondary,
                            ...(selected ? { background: 'rgba(192,132,252,0.12)', borderColor: 'rgba(192,132,252,0.3)', color: '#c084fc' } : {}),
                          }}
                        >
                          <div style={{
                            width: 20, height: 20, borderRadius: 6,
                            background: selected ? 'rgba(192,132,252,0.25)' : 'rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, color: selected ? '#c084fc' : 'rgba(228,216,196,0.5)',
                          }}>
                            {char.name?.[0] || '?'}
                          </div>
                          {char.name}
                          {selected && <Check size={11} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Split preview */}
                  {splitTargets.size > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
                      <div style={{ fontSize: '10px', color: 'rgba(228,216,196,0.4)', marginBottom: 4 }}>Each character receives:</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {['cp', 'sp', 'ep', 'gp', 'pp'].filter(d => splitCurrency[d] > 0).map(denom => (
                          <span key={denom} style={{ fontSize: '12px', color: COIN_STYLES[denom].color, fontWeight: 600 }}>
                            {Math.floor(splitCurrency[denom] / splitTargets.size)} {COIN_STYLES[denom].label}
                          </span>
                        ))}
                      </div>
                      {['cp', 'sp', 'ep', 'gp', 'pp'].some(d => (splitCurrency[d] % splitTargets.size) > 0) && (
                        <div style={{ fontSize: '10px', color: 'rgba(228,216,196,0.3)', marginTop: 4 }}>
                          Remainder stays in treasury:{' '}
                          {['cp', 'sp', 'ep', 'gp', 'pp']
                            .filter(d => (splitCurrency[d] % splitTargets.size) > 0)
                            .map(d => `${splitCurrency[d] % splitTargets.size} ${COIN_STYLES[d].label}`)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    style={{ ...btnPrimary, ...(splitTargets.size === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
                    onClick={handleSplitCurrency}
                    disabled={splitTargets.size === 0}
                  >
                    <Coins size={13} /> Split Currency
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ══════════ TAB: Distribute ══════════ */}
      {tab === 'distribute' && (
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Users size={16} style={{ color: '#60a5fa' }} />
              <h3 style={{ fontSize: '15px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', margin: 0 }}>
                Distribute Loot
              </h3>
            </div>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30 }}>
                <Archive size={28} style={{ color: 'rgba(228,216,196,0.15)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: '12px', color: 'rgba(228,216,196,0.3)' }}>No items in the party bag to distribute.</p>
              </div>
            ) : (
              <>
                {/* Select items */}
                <div style={labelStyle}>Select Items to Distribute</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, maxHeight: 250, overflowY: 'auto' }}>
                  {items.map(item => {
                    const rarity = RARITY_COLORS[(item.rarity || 'common').toLowerCase()] || RARITY_COLORS.common;
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemSelect(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                          background: isSelected ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.06)'}`,
                          borderLeft: `3px solid ${rarity.border}`,
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: 3,
                          border: isSelected ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.15)',
                          background: isSelected ? 'rgba(96,165,250,0.2)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {isSelected && <Check size={9} style={{ color: '#60a5fa' }} />}
                        </div>
                        <span style={{ fontSize: '12px', color: '#e8dcc8', fontWeight: 500, flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: '10px', color: rarity.text, padding: '1px 5px', borderRadius: 3, background: rarity.bg, border: `1px solid ${rarity.border}` }}>
                          {item.rarity || 'common'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(228,216,196,0.4)' }}>x{item.quantity || 1}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Select characters */}
                <div style={labelStyle}>Distribute To</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {characters.map(char => {
                    const selected = distributeTargets.has(char.id);
                    return (
                      <button
                        key={char.id}
                        onClick={() => toggleDistributeTarget(char.id)}
                        style={{
                          ...btnSecondary,
                          ...(selected ? { background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.3)', color: '#60a5fa' } : {}),
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: selected ? 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(96,165,250,0.15))' : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 700, color: selected ? '#60a5fa' : 'rgba(228,216,196,0.5)',
                        }}>
                          {char.name?.[0] || '?'}
                        </div>
                        {char.name}
                        {selected && <Check size={11} />}
                      </button>
                    );
                  })}
                </div>

                {/* Distribute button */}
                <button
                  style={{
                    ...btnPrimary,
                    background: 'linear-gradient(135deg, rgba(96,165,250,0.25), rgba(96,165,250,0.15))', color: '#60a5fa',
                    ...(selectedItems.size === 0 || distributeTargets.size === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
                  }}
                  onClick={handleDistribute}
                  disabled={selectedItems.size === 0 || distributeTargets.size === 0}
                >
                  <ArrowRight size={14} />
                  Distribute {selectedItems.size} Item{selectedItems.size !== 1 ? 's' : ''} to {distributeTargets.size} Character{distributeTargets.size !== 1 ? 's' : ''}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════ TAB: Loot Log ══════════ */}
      {tab === 'log' && (
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <ScrollText size={16} style={{ color: '#c9a84c' }} />
              <h3 style={{ fontSize: '15px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', margin: 0 }}>
                Loot Log
              </h3>
              {log.length > 0 && (
                <button
                  style={{ ...btnSecondary, marginLeft: 'auto', fontSize: '10px' }}
                  onClick={() => { setLog([]); saveJSON(LOG_KEY(characterId), []); toast.success('Log cleared'); }}
                >
                  <Trash2 size={10} /> Clear Log
                </button>
              )}
            </div>

            {log.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30 }}>
                <ScrollText size={28} style={{ color: 'rgba(228,216,196,0.12)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: '12px', color: 'rgba(228,216,196,0.3)' }}>No loot log entries yet. Actions will be recorded here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 500, overflowY: 'auto' }}>
                {log.map(entry => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: 'rgba(228,216,196,0.25)', whiteSpace: 'nowrap', minWidth: 70, paddingTop: 1 }}>
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
                      {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(228,216,196,0.6)', lineHeight: 1.4 }}>
                      {entry.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Add Item Form (sub-component)
// ══════════════════════════════════════════════════════════
function AddItemForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', item_type: 'misc', quantity: 1, weight: 0, value_gp: 0,
    rarity: 'common', description: '', looted_from: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      style={{
        background: '#14121c', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10,
        padding: 24, maxWidth: 440, width: '100%', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto',
      }}
    >
      <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-display, Cinzel, serif)', color: '#e8dcc8', marginBottom: 16, margin: '0 0 16px' }}>
        Add to Party Loot
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Type */}
        <select
          style={inputStyle}
          value={form.item_type}
          onChange={e => update('item_type', e.target.value)}
        >
          {['weapon', 'armor', 'wondrous', 'consumable', 'misc'].map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        {/* Name */}
        <input
          style={inputStyle}
          placeholder="Item name"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          autoFocus
        />

        {/* Weight / Value / Qty */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div>
            <div style={labelStyle}>Weight</div>
            <input type="number" style={inputStyle} value={form.weight} onChange={e => update('weight', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <div style={labelStyle}>Value (GP)</div>
            <input type="number" style={inputStyle} value={form.value_gp} onChange={e => update('value_gp', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <div style={labelStyle}>Qty</div>
            <input type="number" style={inputStyle} min={1} value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 1)} />
          </div>
        </div>

        {/* Description */}
        <textarea
          style={{ ...inputStyle, height: 56, resize: 'none' }}
          placeholder="Description / properties"
          value={form.description}
          onChange={e => update('description', e.target.value)}
        />

        {/* Rarity + Looted From */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={labelStyle}>Rarity</div>
            <select style={inputStyle} value={form.rarity} onChange={e => update('rarity', e.target.value)}>
              {['common', 'uncommon', 'rare', 'very rare', 'legendary'].map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={labelStyle}>Looted From</div>
            <input style={inputStyle} placeholder="e.g. Dragon's Hoard" value={form.looted_from} onChange={e => update('looted_from', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button style={btnSecondary} onClick={onCancel}>Cancel</button>
        <button
          style={{ ...btnPrimary, ...(form.name ? {} : { opacity: 0.4, cursor: 'not-allowed' }) }}
          onClick={() => form.name && onSubmit(form)}
          disabled={!form.name}
        >
          Add Item
        </button>
      </div>
    </motion.div>
  );
}
