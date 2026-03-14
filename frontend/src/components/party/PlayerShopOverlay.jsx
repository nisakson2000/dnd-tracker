import { useState, useEffect, useCallback, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Store, ShoppingBag, Coins, Package, X, Clock, Check, Ban, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';

const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  'very rare': '#a78bfa',
  legendary: '#f59e0b',
};

const SELL_MULTIPLIER = 0.5;

export default function PlayerShopOverlay({ characterId, characterName }) {
  const { activeShop, pendingPurchases, setPendingPurchases, sendEvent } = useCampaignSync();
  const { myClientId } = useParty();

  const [tab, setTab] = useState('buy'); // buy | sell
  const [pendingItemIds, setPendingItemIds] = useState(new Set());
  const [inventory, setInventory] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [loading, setLoading] = useState(false);

  // Load player inventory for sell tab
  const loadInventory = useCallback(async () => {
    if (!characterId) return;
    try {
      const [items, curr] = await Promise.all([
        invoke('get_items', { characterId }),
        invoke('get_currency', { characterId }),
      ]);
      setInventory(items || []);
      setCurrency(curr || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
  }, [characterId]);

  useEffect(() => {
    if (activeShop) {
      loadInventory();
      setPendingItemIds(new Set());
    }
  }, [activeShop, loadInventory]);

  // Process purchase approvals/denials
  useEffect(() => {
    if (!pendingPurchases.length) return;
    const myPurchases = pendingPurchases.filter(p =>
      (p.approved === true || p.approved === false) && p.buyer_client_id !== undefined
    );
    if (!myPurchases.length) return;

    for (const p of myPurchases) {
      if (p.approved) {
        // Add item to inventory and deduct gold
        (async () => {
          try {
            await invoke('add_item', {
              characterId,
              payload: { name: p.item_name, type: 'gear', quantity: 1 },
            });
            // Deduct gold
            const currentCurrency = await invoke('get_currency', { characterId });
            const newGp = (currentCurrency?.gp || 0) - p.price_gp;
            await invoke('update_currency', {
              characterId,
              payload: { ...currentCurrency, gp: Math.max(0, newGp) },
            });
            toast.success(`Purchased ${p.item_name} for ${p.price_gp} GP`);
            await loadInventory();
          } catch (e) {
            console.error('Failed to process purchase:', e);
            toast.error('Failed to add purchased item');
          }
        })();
        setPendingItemIds(prev => { const n = new Set(prev); n.delete(p.item_id); return n; });
      } else {
        toast.error(`Purchase denied: ${p.item_name}${p.reason ? ' - ' + p.reason : ''}`);
        setPendingItemIds(prev => { const n = new Set(prev); n.delete(p.item_id); return n; });
      }
    }
    // Clear processed purchases
    setPendingPurchases(prev => prev.filter(p => p.approved === undefined));
  }, [pendingPurchases, characterId, loadInventory, setPendingPurchases]);

  const totalGold = useMemo(() => {
    return (currency.cp || 0) * 0.01 + (currency.sp || 0) * 0.1 + (currency.ep || 0) * 0.5 +
      (currency.gp || 0) + (currency.pp || 0) * 10;
  }, [currency]);

  const handleBuy = (item) => {
    if (pendingItemIds.has(item.id)) return;
    if (totalGold < item.price_gp) {
      toast.error('Not enough gold!');
      return;
    }
    setPendingItemIds(prev => new Set(prev).add(item.id));
    sendEvent('shop_purchase_request', {
      shop_id: activeShop.shop_id,
      item_id: item.id,
      item_name: item.name,
      price_gp: item.price_gp,
      buyer_client_id: myClientId,
      buyer_name: characterName || 'Player',
    });
    toast('Purchase request sent to DM', { icon: '\u23F3' });
  };

  const handleSell = async (item) => {
    // Estimate sell price: items without a known price sell for 0
    const sellPrice = item.value_gp ? Math.floor(item.value_gp * SELL_MULTIPLIER * 100) / 100 : 0;
    try {
      // Remove item from inventory
      await invoke('delete_item', { characterId, itemId: item.id });
      // Add gold
      if (sellPrice > 0) {
        const currentCurrency = await invoke('get_currency', { characterId });
        const newGp = (currentCurrency?.gp || 0) + sellPrice;
        await invoke('update_currency', {
          characterId,
          payload: { ...currentCurrency, gp: newGp },
        });
      }
      toast.success(`Sold ${item.name} for ${sellPrice} GP`);
      await loadInventory();
    } catch (e) {
      console.error('Failed to sell item:', e);
      toast.error('Failed to sell item');
    }
  };

  if (!activeShop) return null;

  const items = activeShop.items || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1816 0%, #151311 100%)',
        border: '1px solid rgba(201,168,76,0.25)', borderRadius: 12,
        width: '90%', maxWidth: 500, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid rgba(201,168,76,0.15)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Store size={18} style={{ color: '#c9a84c' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e0d8' }}>{activeShop.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{activeShop.shop_type}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: 12 }}>
            <Coins size={13} /> {totalGold.toFixed(1)} GP
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'buy', label: 'Buy', icon: ShoppingBag },
            { id: 'sell', label: 'Sell', icon: ArrowRightLeft },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
              background: tab === t.id ? 'rgba(201,168,76,0.08)' : 'transparent',
              border: 'none', borderBottom: tab === t.id ? '2px solid #c9a84c' : '2px solid transparent',
              color: tab === t.id ? '#c9a84c' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              fontFamily: 'var(--font-ui)',
            }}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {tab === 'buy' ? (
            items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                This shop has no items for sale.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map(item => {
                  const isPending = pendingItemIds.has(item.id);
                  const canAfford = totalGold >= item.price_gp;
                  const outOfStock = item.quantity === 0;
                  return (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                      background: 'rgba(255,255,255,0.02)', borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.04)',
                      opacity: outOfStock ? 0.4 : 1,
                    }}>
                      <Package size={14} style={{ color: RARITY_COLORS[item.rarity] || '#9ca3af', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: '#e2e0d8', fontWeight: 500 }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                          <span style={{ color: RARITY_COLORS[item.rarity] || '#9ca3af' }}>{item.rarity}</span>
                          <span>{item.item_type}</span>
                          {item.description && <span>{item.description}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>{item.price_gp} GP</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                          {item.quantity === -1 ? 'In stock' : outOfStock ? 'Out of stock' : `${item.quantity} left`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={isPending || !canAfford || outOfStock}
                        style={{
                          background: isPending ? 'rgba(251,191,36,0.1)' : canAfford && !outOfStock ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isPending ? 'rgba(251,191,36,0.3)' : canAfford && !outOfStock ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: 5, padding: '4px 10px', fontSize: 10, fontWeight: 600,
                          color: isPending ? '#fbbf24' : canAfford && !outOfStock ? '#4ade80' : 'rgba(255,255,255,0.2)',
                          cursor: isPending || !canAfford || outOfStock ? 'not-allowed' : 'pointer',
                          fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 3,
                        }}
                      >
                        {isPending ? <><Clock size={10} /> Pending</> : outOfStock ? 'Sold Out' : !canAfford ? 'Too Expensive' : <><ShoppingBag size={10} /> Buy</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Sell tab */
            inventory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                Your inventory is empty.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Items sell at 50% value
                </div>
                {inventory.map(item => {
                  const sellPrice = item.value_gp ? Math.floor(item.value_gp * SELL_MULTIPLIER * 100) / 100 : 0;
                  return (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                      background: 'rgba(255,255,255,0.02)', borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <Package size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#e2e0d8', fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                          {item.type || 'gear'} {item.quantity > 1 ? `x${item.quantity}` : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: sellPrice > 0 ? '#fbbf24' : 'rgba(255,255,255,0.2)', fontWeight: 600, flexShrink: 0 }}>
                        {sellPrice > 0 ? `${sellPrice} GP` : 'No value'}
                      </div>
                      <button
                        onClick={() => handleSell(item)}
                        style={{
                          background: 'rgba(251,191,36,0.08)',
                          border: '1px solid rgba(251,191,36,0.2)',
                          borderRadius: 5, padding: '4px 10px', fontSize: 10, fontWeight: 600,
                          color: '#fbbf24', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}
                      >
                        <Coins size={10} /> Sell
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
