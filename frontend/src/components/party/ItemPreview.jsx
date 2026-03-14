import { useState, useEffect } from 'react';
import { Swords, Shield, Sparkles, Beaker, Scroll, Package, Coins, Weight, Clock, Target, Zap, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { searchArticles } from '../../api/wiki';

const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  'very rare': '#a78bfa',
  legendary: '#f59e0b',
  artifact: '#ef4444',
};

const TYPE_ICONS = {
  weapon: Swords,
  armor: Shield,
  spell: Sparkles,
  potion: Beaker,
  scroll: Scroll,
  wondrous: Sparkles,
  gear: Package,
  misc: Package,
};

/**
 * Renders a preview card for a wiki item, spell, or custom item.
 * Props:
 *  - item: { title, category, subcategory, summary, metadata_json (string or object) }
 *  - compact: boolean (for inline list display)
 *  - onGive: callback when "Give to Player" is clicked
 */
export default function ItemPreview({ item, compact = false, onGive }) {
  const [loreData, setLoreData] = useState(null);
  const [loreLoading, setLoreLoading] = useState(false);
  const [loreExpanded, setLoreExpanded] = useState(false);

  // Reset lore state when item changes
  const itemKey = item?.title || item?.name;
  useEffect(() => {
    setLoreData(null);
    setLoreExpanded(false);
    setLoreLoading(false);
  }, [itemKey]);

  const handleViewLore = async () => {
    if (loreData !== null) {
      setLoreExpanded(e => !e);
      return;
    }
    setLoreLoading(true);
    try {
      const results = await searchArticles(item.title || item.name);
      if (results && results.length > 0) {
        setLoreData(results[0]);
      } else {
        setLoreData(false);
      }
      setLoreExpanded(true);
    } catch {
      setLoreData(false);
      setLoreExpanded(true);
    } finally {
      setLoreLoading(false);
    }
  };

  if (!item) return null;

  let meta = {};
  if (typeof item.metadata_json === 'string') {
    try { meta = JSON.parse(item.metadata_json); } catch { meta = {}; }
  } else if (item.metadata_json) {
    meta = item.metadata_json;
  }

  const category = (item.category || item.type || '').toLowerCase();
  const isWeapon = category.includes('weapon') || category.includes('equipment');
  const isArmor = category.includes('armor');
  const isSpell = category.includes('spell');
  const isPotion = category.includes('potion') || category.includes('consumable') || category === 'consumable';

  const rarity = (meta.rarity || item.rarity || '').toLowerCase();
  const rarityColor = RARITY_COLORS[rarity] || 'rgba(255,255,255,0.3)';

  const iconType = isWeapon ? 'weapon' : isArmor ? 'armor' : isSpell ? 'spell' : isPotion ? 'potion' : (item.type || 'misc');
  const Icon = TYPE_ICONS[iconType] || Package;

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 6,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        cursor: onGive ? 'pointer' : 'default',
      }} onClick={onGive}>
        <Icon size={12} style={{ color: rarityColor, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#e8d9b5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.title || item.name}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
            {item.subcategory || item.category || ''}
            {rarity && <span style={{ color: rarityColor, marginLeft: 6 }}>{rarity}</span>}
          </div>
        </div>
        {isWeapon && meta.damage && (
          <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
            {meta.damage}
          </span>
        )}
        {isArmor && meta.ac && (
          <span style={{ fontSize: 10, color: 'rgba(147,197,253,0.8)', fontWeight: 600 }}>
            AC {meta.ac}
          </span>
        )}
        {isSpell && meta.level != null && (
          <span style={{ fontSize: 9, color: 'rgba(167,139,250,0.7)', fontWeight: 600 }}>
            Lv{meta.level}
          </span>
        )}
      </div>
    );
  }

  // Full preview
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      background: 'rgba(10,10,16,0.9)', border: `1px solid ${rarityColor}30`,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
        background: `${rarityColor}08`, borderBottom: `1px solid ${rarityColor}20`,
      }}>
        <Icon size={16} style={{ color: rarityColor }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e8d9b5', fontFamily: 'Cinzel, Georgia, serif' }}>
            {item.title || item.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            {item.subcategory || item.category || ''}
            {rarity && <span style={{ color: rarityColor, marginLeft: 8, fontWeight: 600 }}>{rarity}</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Weapon stats */}
        {isWeapon && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {meta.damage && (
              <StatChip icon={Swords} label="Damage" value={meta.damage} color="#ef4444" />
            )}
            {meta.damage_type && (
              <StatChip icon={Zap} label="Type" value={meta.damage_type} color="#f97316" />
            )}
            {meta.weight && (
              <StatChip icon={Weight} label="Weight" value={`${meta.weight} lb`} color="rgba(255,255,255,0.4)" />
            )}
            {meta.cost && (
              <StatChip icon={Coins} label="Cost" value={meta.cost} color="#c9a84c" />
            )}
          </div>
        )}

        {/* Weapon properties */}
        {isWeapon && meta.properties && meta.properties.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(Array.isArray(meta.properties) ? meta.properties : [meta.properties]).map((p, i) => (
              <span key={i} style={{
                fontSize: 9, padding: '2px 6px', borderRadius: 4,
                background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                color: 'rgba(201,168,76,0.6)',
              }}>
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Armor stats */}
        {isArmor && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {meta.ac && <StatChip icon={Shield} label="AC" value={meta.ac} color="rgba(147,197,253,0.8)" />}
            {meta.armor_type && <StatChip icon={Shield} label="Type" value={meta.armor_type} color="rgba(255,255,255,0.4)" />}
            {meta.stealth_disadvantage && (
              <span style={{ fontSize: 9, color: '#ef4444', padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                Stealth Disadvantage
              </span>
            )}
            {meta.str_requirement && (
              <StatChip icon={Swords} label="STR Req" value={meta.str_requirement} color="#f97316" />
            )}
          </div>
        )}

        {/* Spell stats */}
        {isSpell && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {meta.level != null && <StatChip icon={Sparkles} label="Level" value={meta.level === 0 ? 'Cantrip' : meta.level} color="#a78bfa" />}
            {meta.school && <StatChip icon={Sparkles} label="School" value={meta.school} color="#c084fc" />}
            {meta.casting_time && <StatChip icon={Clock} label="Cast" value={meta.casting_time} color="rgba(255,255,255,0.4)" />}
            {meta.range && <StatChip icon={Target} label="Range" value={meta.range} color="rgba(255,255,255,0.4)" />}
            {meta.duration && <StatChip icon={Clock} label="Duration" value={meta.duration} color="rgba(255,255,255,0.4)" />}
          </div>
        )}

        {/* Spell components */}
        {isSpell && meta.components && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            <span style={{ fontWeight: 600, color: 'rgba(167,139,250,0.5)' }}>Components: </span>
            {meta.components}
          </div>
        )}

        {/* Spell classes */}
        {isSpell && meta.classes && Array.isArray(meta.classes) && meta.classes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {meta.classes.map((c, i) => (
              <span key={i} style={{
                fontSize: 9, padding: '1px 5px', borderRadius: 3,
                background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)',
                color: 'rgba(96,165,250,0.6)',
              }}>
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Potion/consumable */}
        {isPotion && meta.effect && (
          <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.7)', lineHeight: 1.4 }}>
            {meta.effect}
          </div>
        )}

        {/* Summary / Description */}
        {(item.summary || meta.description) && (
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8,
          }}>
            {item.summary || meta.description}
          </div>
        )}

        {/* View Lore button */}
        <button
          onClick={handleViewLore}
          disabled={loreLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
            color: 'rgba(201,168,76,0.7)', cursor: loreLoading ? 'wait' : 'pointer',
            fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
          }}
        >
          {loreLoading
            ? <><Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> Searching wiki...</>
            : <><BookOpen size={11} /> {loreExpanded ? 'Hide Lore' : 'View Lore'}
              {loreData !== null && (loreExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
            </>
          }
        </button>

        {/* Lore panel */}
        {loreExpanded && (
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)',
          }}>
            {loreData ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(201,168,76,0.8)', marginBottom: 4, fontFamily: 'Cinzel, Georgia, serif' }}>
                  {loreData.title}
                </div>
                {loreData.category && (
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                    {loreData.category}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {loreData.summary || 'No summary available.'}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                No lore found in wiki.
              </div>
            )}
          </div>
        )}

        {/* Give button */}
        {onGive && (
          <button
            onClick={onGive}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
              color: '#4ade80', cursor: 'pointer', fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em', marginTop: 4,
            }}
          >
            <Package size={12} /> Give to Player
          </button>
        )}
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 5,
      background: `${color}08`, border: `1px solid ${color}20`,
    }}>
      <Icon size={10} style={{ color }} />
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color, fontFamily: 'var(--font-mono, monospace)' }}>{value}</span>
    </div>
  );
}
