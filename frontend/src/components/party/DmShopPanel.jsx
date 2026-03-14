import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Store, Plus, Trash2, ShoppingBag, X, Check, Ban, Package, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useLiveSession } from '../../contexts/LiveSessionContext';
import { useParty } from '../../contexts/PartyContext';

const SHOP_TYPES = ['General', 'Blacksmith', 'Magic', 'Potion', 'Tavern'];
const RARITIES = ['common', 'uncommon', 'rare', 'very rare', 'legendary'];
const ITEM_TYPES = ['gear', 'weapon', 'armor', 'potion', 'scroll', 'wondrous', 'tool', 'food'];

const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  'very rare': '#a78bfa',
  legendary: '#f59e0b',
};

// Styling helpers matching DM panel conventions
const panelBg = { background: 'rgba(0,0,0,0.25)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', padding: 10 };
const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 5, padding: '5px 8px', fontSize: 11, color: '#e2e0d8',
  width: '100%', outline: 'none', fontFamily: 'var(--font-ui)',
};
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const goldAccent = 'rgba(201,168,76,';
const btnStyle = (active = false) => ({
  background: active ? `${goldAccent}0.15)` : 'rgba(255,255,255,0.04)',
  border: `1px solid ${active ? `${goldAccent}0.4)` : 'rgba(255,255,255,0.08)'}`,
  borderRadius: 5, padding: '5px 10px', fontSize: 11, color: active ? `${goldAccent}1)` : '#e2e0d8',
  cursor: 'pointer', fontFamily: 'var(--font-ui)', display: 'inline-flex', alignItems: 'center', gap: 4,
});
const smallLabel = { fontSize: 10, color: `${goldAccent}0.35)`, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 };

export default function DmShopPanel() {
  const { sendShopOpen, sendShopClose, pendingPurchases, clearPendingPurchases, activeShop, sendEvent } = useCampaignSync();
  const { sendTargetedEvent } = useParty();
  const { activeCampaignId } = useLiveSession();

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [view, setView] = useState('list'); // list | detail | create

  // Create shop form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('General');
  const [newDesc, setNewDesc] = useState('');

  // Add item form
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState('-1');
  const [itemType, setItemType] = useState('gear');
  const [itemRarity, setItemRarity] = useState('common');
  const [showAddItem, setShowAddItem] = useState(false);

  const campaignId = activeCampaignId;

  const loadShops = useCallback(async () => {
    if (!campaignId) return;
    try {
      const result = await invoke('get_shops', { campaignId });
      setShops(result || []);
    } catch (e) {
      console.error('Failed to load shops:', e);
    }
  }, [campaignId]);

  const loadItems = useCallback(async (shopId) => {
    try {
      const result = await invoke('get_shop_items', { shopId });
      setShopItems(result || []);
    } catch (e) {
      console.error('Failed to load shop items:', e);
    }
  }, []);

  useEffect(() => { loadShops(); }, [loadShops]);

  const handleCreateShop = async () => {
    if (!newName.trim() || !campaignId) return;
    try {
      await invoke('create_shop', {
        campaignId, name: newName.trim(), shopType: newType.toLowerCase(), description: newDesc.trim(),
      });
      setNewName(''); setNewDesc(''); setNewType('General');
      setView('list');
      await loadShops();
      toast.success('Shop created');
    } catch (e) {
      toast.error('Failed to create shop');
    }
  };

  const handleDeleteShop = async (shopId) => {
    try {
      await invoke('delete_shop', { shopId });
      if (selectedShop?.id === shopId) { setSelectedShop(null); setView('list'); }
      await loadShops();
      toast.success('Shop deleted');
    } catch (e) {
      toast.error('Failed to delete shop');
    }
  };

  const handleSelectShop = async (shop) => {
    setSelectedShop(shop);
    setView('detail');
    await loadItems(shop.id);
  };

  const handleAddItem = async () => {
    if (!itemName.trim() || !selectedShop) return;
    const price = parseFloat(itemPrice) || 0;
    const qty = parseInt(itemQty, 10);
    try {
      await invoke('add_shop_item', {
        shopId: selectedShop.id, name: itemName.trim(), description: itemDesc.trim(),
        priceGp: price, quantity: isNaN(qty) ? -1 : qty, itemType, rarity: itemRarity,
      });
      setItemName(''); setItemDesc(''); setItemPrice(''); setItemQty('-1');
      setItemType('gear'); setItemRarity('common'); setShowAddItem(false);
      await loadItems(selectedShop.id);
      toast.success('Item added');
    } catch (e) {
      toast.error('Failed to add item');
    }
  };

  const handleOpenShop = async () => {
    if (!selectedShop) return;
    sendShopOpen({
      shop_id: selectedShop.id,
      name: selectedShop.name,
      shop_type: selectedShop.shop_type,
      items: shopItems,
    });
    toast.success(`${selectedShop.name} opened for players`);
  };

  const handleCloseShop = () => {
    sendShopClose();
    toast.success('Shop closed');
  };

  const handleApprovePurchase = async (purchase, idx) => {
    try {
      // Decrement quantity if not unlimited (-1)
      const item = shopItems.find(i => i.id === purchase.item_id);
      if (item && item.quantity > 0) {
        await invoke('update_shop_item_quantity', { itemId: purchase.item_id, newQuantity: item.quantity - 1 });
        await loadItems(selectedShop?.id || purchase.shop_id);
      }
      sendTargetedEvent('shop_purchase_approved', {
        item_id: purchase.item_id,
        item_name: purchase.item_name,
        price_gp: purchase.price_gp,
        buyer_name: purchase.buyer_name,
      }, [purchase.buyer_client_id]);
      // Remove from pending
      clearPendingPurchases();
      toast.success(`Approved ${purchase.item_name} for ${purchase.buyer_name}`);

      // Refresh open shop for players if shop is currently open
      if (activeShop && selectedShop) {
        const updatedItems = await invoke('get_shop_items', { shopId: selectedShop.id });
        sendShopOpen({
          shop_id: selectedShop.id,
          name: selectedShop.name,
          shop_type: selectedShop.shop_type,
          items: updatedItems || [],
        });
      }
    } catch (e) {
      toast.error('Failed to approve purchase');
    }
  };

  const handleDenyPurchase = (purchase, idx) => {
    sendTargetedEvent('shop_purchase_denied', {
      item_id: purchase.item_id,
      item_name: purchase.item_name,
      buyer_name: purchase.buyer_name,
      reason: 'Denied by DM',
    }, [purchase.buyer_client_id]);
    clearPendingPurchases();
    toast('Purchase denied');
  };

  // Filter pending purchases to only show buy requests (not approved/denied results)
  const buyRequests = pendingPurchases.filter(p => p.buyer_client_id && !p.approved && p.approved !== false);

  const isShopOpen = activeShop !== null;

  // ── Render ──

  if (view === 'create') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <button onClick={() => setView('list')} style={{ ...btnStyle(), padding: '3px 6px' }}><ChevronLeft size={12} /></button>
          <span style={{ fontSize: 12, color: `${goldAccent}0.7)`, fontWeight: 600 }}>Create Shop</span>
        </div>
        <div style={panelBg}>
          <div style={smallLabel}>Shop Name</div>
          <input style={inputStyle} value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. The Golden Anvil" />
          <div style={{ ...smallLabel, marginTop: 8 }}>Type</div>
          <select style={selectStyle} value={newType} onChange={e => setNewType(e.target.value)}>
            {SHOP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{ ...smallLabel, marginTop: 8 }}>Description</div>
          <textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="A dusty shop filled with curiosities..." />
          <button onClick={handleCreateShop} disabled={!newName.trim()} style={{ ...btnStyle(true), marginTop: 8, width: '100%', justifyContent: 'center', opacity: newName.trim() ? 1 : 0.4 }}>
            <Plus size={12} /> Create Shop
          </button>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedShop) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <button onClick={() => { setView('list'); setSelectedShop(null); }} style={{ ...btnStyle(), padding: '3px 6px' }}><ChevronLeft size={12} /></button>
          <Store size={14} style={{ color: `${goldAccent}0.7)` }} />
          <span style={{ fontSize: 12, color: `${goldAccent}0.7)`, fontWeight: 600 }}>{selectedShop.name}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{selectedShop.shop_type}</span>
        </div>

        {/* Open/Close shop for players */}
        <div style={{ display: 'flex', gap: 6 }}>
          {!isShopOpen ? (
            <button onClick={handleOpenShop} style={{ ...btnStyle(true), flex: 1, justifyContent: 'center' }}>
              <ShoppingBag size={12} /> Open for Players
            </button>
          ) : (
            <button onClick={handleCloseShop} style={{ ...btnStyle(), flex: 1, justifyContent: 'center', color: '#ef4444' }}>
              <X size={12} /> Close Shop
            </button>
          )}
        </div>

        {/* Pending purchase requests */}
        {buyRequests.length > 0 && (
          <div style={{ ...panelBg, borderColor: `${goldAccent}0.3)` }}>
            <div style={{ ...smallLabel, color: '#fbbf24' }}>Purchase Requests</div>
            {buyRequests.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 11, color: '#e2e0d8', flex: 1 }}>
                  <b>{p.buyer_name}</b> wants <b>{p.item_name}</b> ({p.price_gp} GP)
                </span>
                <button onClick={() => handleApprovePurchase(p, i)} style={{ ...btnStyle(), padding: '2px 6px', color: '#4ade80' }}>
                  <Check size={11} />
                </button>
                <button onClick={() => handleDenyPurchase(p, i)} style={{ ...btnStyle(), padding: '2px 6px', color: '#ef4444' }}>
                  <Ban size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Items list */}
        <div style={panelBg}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={smallLabel}>Inventory ({shopItems.length})</div>
            <button onClick={() => setShowAddItem(!showAddItem)} style={{ ...btnStyle(), padding: '2px 6px' }}>
              {showAddItem ? <X size={11} /> : <Plus size={11} />}
            </button>
          </div>

          {showAddItem && (
            <div style={{ ...panelBg, marginBottom: 8, background: 'rgba(201,168,76,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <div style={smallLabel}>Name</div>
                  <input style={inputStyle} value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Longsword" />
                </div>
                <div>
                  <div style={smallLabel}>Price (GP)</div>
                  <input style={inputStyle} type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="15" />
                </div>
                <div>
                  <div style={smallLabel}>Quantity (-1 = unlimited)</div>
                  <input style={inputStyle} type="number" value={itemQty} onChange={e => setItemQty(e.target.value)} />
                </div>
                <div>
                  <div style={smallLabel}>Rarity</div>
                  <select style={selectStyle} value={itemRarity} onChange={e => setItemRarity(e.target.value)}>
                    {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <div style={smallLabel}>Type</div>
                  <select style={selectStyle} value={itemType} onChange={e => setItemType(e.target.value)}>
                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={smallLabel}>Description</div>
                  <input style={inputStyle} value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="Optional" />
                </div>
              </div>
              <button onClick={handleAddItem} disabled={!itemName.trim()} style={{ ...btnStyle(true), marginTop: 6, width: '100%', justifyContent: 'center', opacity: itemName.trim() ? 1 : 0.4 }}>
                <Plus size={12} /> Add Item
              </button>
            </div>
          )}

          {shopItems.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: 12 }}>No items yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 260, overflowY: 'auto' }}>
              {shopItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.02)' }}>
                  <Package size={11} style={{ color: RARITY_COLORS[item.rarity] || '#9ca3af', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#e2e0d8', flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 10, color: RARITY_COLORS[item.rarity] || '#9ca3af' }}>{item.rarity}</span>
                  <span style={{ fontSize: 10, color: '#fbbf24', minWidth: 40, textAlign: 'right' }}>{item.price_gp} GP</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 24, textAlign: 'right' }}>
                    {item.quantity === -1 ? '\u221E' : `x${item.quantity}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Shop List View ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Store size={14} style={{ color: `${goldAccent}0.7)` }} />
          <span style={{ fontSize: 12, color: `${goldAccent}0.7)`, fontWeight: 600 }}>Shops</span>
        </div>
        <button onClick={() => setView('create')} style={{ ...btnStyle(), padding: '3px 8px' }}>
          <Plus size={11} /> New
        </button>
      </div>

      {shops.length === 0 ? (
        <div style={{ ...panelBg, textAlign: 'center', padding: 20 }}>
          <Store size={24} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>No shops created yet</div>
          <button onClick={() => setView('create')} style={{ ...btnStyle(true), marginTop: 8 }}>
            <Plus size={12} /> Create Your First Shop
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {shops.map(shop => (
            <div key={shop.id} style={{ ...panelBg, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 10px' }}
              onClick={() => handleSelectShop(shop)}>
              <Store size={14} style={{ color: `${goldAccent}0.5)`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#e2e0d8', fontWeight: 500 }}>{shop.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{shop.shop_type}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDeleteShop(shop.id); }}
                style={{ ...btnStyle(), padding: '2px 6px', color: '#ef4444' }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pending purchase requests (visible even from list view) */}
      {buyRequests.length > 0 && (
        <div style={{ ...panelBg, borderColor: `${goldAccent}0.3)` }}>
          <div style={{ ...smallLabel, color: '#fbbf24' }}>Purchase Requests ({buyRequests.length})</div>
          {buyRequests.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 11, color: '#e2e0d8', flex: 1 }}>
                <b>{p.buyer_name}</b>: {p.item_name} ({p.price_gp} GP)
              </span>
              <button onClick={() => handleApprovePurchase(p, i)} style={{ ...btnStyle(), padding: '2px 6px', color: '#4ade80' }}>
                <Check size={11} />
              </button>
              <button onClick={() => handleDenyPurchase(p, i)} style={{ ...btnStyle(), padding: '2px 6px', color: '#ef4444' }}>
                <Ban size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
