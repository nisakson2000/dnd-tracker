import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Coins, Plus, Trash2, Save, Loader2, Eye, Calculator,
  TrendingUp, TrendingDown, ShoppingBag, Landmark, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRESETS = {
  'Prosperous City': { prosperity: 80, taxRate: 12, priceModifier: 1.2, notes: 'Wealthy urban center with thriving commerce.' },
  'War-Torn': { prosperity: 20, taxRate: 35, priceModifier: 1.8, notes: 'Ravaged by conflict. Supplies scarce, prices inflated.' },
  'Trade Hub': { prosperity: 70, taxRate: 8, priceModifier: 0.8, notes: 'Major trade crossroads. Competitive prices, diverse goods.' },
  'Remote Village': { prosperity: 30, taxRate: 5, priceModifier: 1.5, notes: 'Isolated settlement. Limited stock, higher markups.' },
};

function ProsperityBar({ value }) {
  const color = value >= 70 ? '#4ade80' : value >= 40 ? '#facc15' : '#f87171';
  const label = value >= 70 ? 'Prosperous' : value >= 40 ? 'Stable' : 'Struggling';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Prosperity</span>
        <span className="text-[10px] font-medium" style={{ color }}>{value}/100 - {label}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function EconomyPanel() {
  const [region, setRegion] = useState('default');
  const [prosperity, setProsperity] = useState(50);
  const [taxRate, setTaxRate] = useState(10);
  const [priceModifier, setPriceModifier] = useState(1.0);
  const [tradeGoods, setTradeGoods] = useState([]);
  const [newGood, setNewGood] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Price calculator
  const [basePrice, setBasePrice] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const data = await invoke('get_economy', { region: region || 'default' });
      if (data) {
        setProsperity(data.prosperity ?? 50);
        setTaxRate(data.tax_rate ?? data.taxRate ?? 10);
        setPriceModifier(data.price_modifier ?? data.priceModifier ?? 1.0);
        setNotes(data.notes || '');
        try {
          const goods = data.trade_goods_json || data.tradeGoodsJson;
          setTradeGoods(goods ? JSON.parse(goods) : []);
        } catch {
          setTradeGoods([]);
        }
      }
      toast.success(`Loaded economy for "${region}"`);
    } catch (err) {
      console.error('[EconomyPanel] get_economy:', err);
      toast.error('Failed to load economy');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await invoke('set_economy', {
        region: region || 'default',
        prosperity,
        taxRate,
        tradeGoodsJson: JSON.stringify(tradeGoods),
        priceModifier,
        notes,
      });
      toast.success('Economy saved');
    } catch (err) {
      console.error('[EconomyPanel] set_economy:', err);
      toast.error('Failed to save economy');
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (name) => {
    const preset = PRESETS[name];
    if (!preset) return;
    setProsperity(preset.prosperity);
    setTaxRate(preset.taxRate);
    setPriceModifier(preset.priceModifier);
    setNotes(preset.notes);
    toast.success(`Applied "${name}" preset`);
  };

  const addTradeGood = () => {
    const good = newGood.trim();
    if (!good || tradeGoods.includes(good)) return;
    setTradeGoods(prev => [...prev, good]);
    setNewGood('');
  };

  const removeTradeGood = (index) => {
    setTradeGoods(prev => prev.filter((_, i) => i !== index));
  };

  const calculatedPrice = basePrice ? (parseFloat(basePrice) * priceModifier).toFixed(2) : null;
  const taxedPrice = calculatedPrice ? (parseFloat(calculatedPrice) * (1 + taxRate / 100)).toFixed(2) : null;

  const modIcon = priceModifier > 1 ? <TrendingUp size={11} className="text-red-400" /> :
    priceModifier < 1 ? <TrendingDown size={11} className="text-green-400" /> : null;

  return (
    <div className="space-y-3">
      {/* Region & Load */}
      <div className="flex gap-2">
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region name"
          className="flex-1 text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none"
          style={{
            background: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'var(--text)',
          }}
        />
        <button
          onClick={handleLoad}
          disabled={loading}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.06)',
            color: 'var(--text-dim)',
          }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
          Load
        </button>
      </div>

      {/* Prosperity */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <ProsperityBar value={prosperity} />
        <input
          type="range"
          min={0}
          max={100}
          value={prosperity}
          onChange={(e) => setProsperity(parseInt(e.target.value))}
          className="w-full mt-1.5 accent-purple-500"
          style={{ height: '4px' }}
        />
      </div>

      {/* Tax Rate & Price Modifier */}
      <div className="grid grid-cols-2 gap-2">
        <div
          className="rounded-xl p-3 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            <Landmark size={11} style={{ color: 'var(--text-mute)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Tax Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={50}
              value={taxRate}
              onChange={(e) => setTaxRate(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full text-sm font-medium rounded px-2 py-1 border focus:outline-none"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
            />
            <span className="text-sm font-medium" style={{ color: '#c084fc' }}>%</span>
          </div>
        </div>
        <div
          className="rounded-xl p-3 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            {modIcon || <Coins size={11} style={{ color: 'var(--text-mute)' }} />}
            <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Price Modifier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0.5}
              max={2.0}
              step={0.1}
              value={priceModifier}
              onChange={(e) => setPriceModifier(Math.min(2.0, Math.max(0.5, parseFloat(e.target.value) || 1.0)))}
              className="w-full text-sm font-medium rounded px-2 py-1 border focus:outline-none"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
            />
            <span className="text-sm font-medium" style={{ color: '#c084fc' }}>x</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="text-[10px] mb-1.5" style={{ color: 'var(--text-mute)' }}>Quick Presets</div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="text-[11px] px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer hover:brightness-125"
              style={{
                background: 'rgba(192,132,252,0.05)',
                borderColor: 'rgba(192,132,252,0.15)',
                color: 'var(--text-dim)',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Goods */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <ShoppingBag size={12} style={{ color: '#c084fc' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>Trade Goods</span>
          <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>({tradeGoods.length})</span>
        </div>

        {tradeGoods.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tradeGoods.map((good, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border group"
                style={{ background: 'rgba(192,132,252,0.06)', borderColor: 'rgba(192,132,252,0.2)', color: 'var(--text-dim)' }}
              >
                {good}
                <button
                  onClick={() => removeTradeGood(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-400"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-1.5">
          <input
            type="text"
            value={newGood}
            onChange={(e) => setNewGood(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTradeGood()}
            placeholder="Add trade good..."
            className="flex-1 text-xs rounded px-2 py-1.5 border focus:outline-none"
            style={{
              background: 'rgba(0,0,0,0.2)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'var(--text)',
            }}
          />
          <button
            onClick={addTradeGood}
            disabled={!newGood.trim()}
            className="p-1.5 rounded border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(192,132,252,0.1)',
              borderColor: 'rgba(192,132,252,0.25)',
              color: '#c084fc',
            }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Price Calculator */}
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border transition-all cursor-pointer"
        style={{
          background: showCalculator ? 'rgba(192,132,252,0.08)' : 'rgba(255,255,255,0.03)',
          borderColor: showCalculator ? 'rgba(192,132,252,0.25)' : 'rgba(255,255,255,0.06)',
          color: showCalculator ? '#c084fc' : 'var(--text-dim)',
        }}
      >
        <Calculator size={12} />
        Price Calculator
      </button>

      {showCalculator && (
        <div
          className="rounded-xl p-3 border space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Enter base price (gp)</div>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="e.g. 50"
            min={0}
            step={0.01}
            className="w-full text-xs rounded px-2.5 py-1.5 border focus:outline-none"
            style={{
              background: 'rgba(0,0,0,0.2)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'var(--text)',
            }}
          />
          {calculatedPrice && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-mute)' }}>Base price:</span>
                <span style={{ color: 'var(--text-dim)' }}>{parseFloat(basePrice).toFixed(2)} gp</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-mute)' }}>After modifier ({priceModifier}x):</span>
                <span style={{ color: 'var(--text)' }}>{calculatedPrice} gp</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-mute)' }}>With tax ({taxRate}%):</span>
                <span className="font-medium" style={{ color: '#c084fc' }}>{taxedPrice} gp</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-[10px] mb-1.5" style={{ color: 'var(--text-mute)' }}>Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Economic notes, trade routes, market conditions..."
          rows={3}
          className="w-full text-xs rounded px-2.5 py-1.5 border focus:outline-none resize-y"
          style={{
            background: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'rgba(192,132,252,0.12)',
          borderColor: 'rgba(192,132,252,0.3)',
          color: '#c084fc',
        }}
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
        Save Economy
      </button>
    </div>
  );
}
