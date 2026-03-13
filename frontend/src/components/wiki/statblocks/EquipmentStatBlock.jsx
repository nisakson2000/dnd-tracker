import { motion } from 'framer-motion';
import { Sword, Shield, Weight, Coins, Gem, Lock } from 'lucide-react';

const RARITY_STYLES = {
  common:      { bg: 'bg-gray-500/15',   text: 'text-gray-300',   label: 'Common' },
  uncommon:    { bg: 'bg-green-500/15',   text: 'text-green-300',  label: 'Uncommon' },
  rare:        { bg: 'bg-blue-500/15',    text: 'text-blue-300',   label: 'Rare' },
  'very rare': { bg: 'bg-purple-500/15',  text: 'text-purple-300', label: 'Very Rare' },
  'very-rare': { bg: 'bg-purple-500/15',  text: 'text-purple-300', label: 'Very Rare' },
  legendary:   { bg: 'bg-orange-500/15',  text: 'text-orange-300', label: 'Legendary' },
  artifact:    { bg: 'bg-amber-500/15',   text: 'text-amber-300',  label: 'Artifact' },
};

function getRarityStyle(rarity) {
  if (!rarity) return null;
  return RARITY_STYLES[rarity.toLowerCase().trim()] || {
    bg: 'bg-white/10',
    text: 'text-amber-200/70',
    label: rarity,
  };
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [String(value)];
}

export default function EquipmentStatBlock({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;

  const eqType = metadata.type || metadata.equipment_type;
  const damage = metadata.damage;
  const ac = metadata.ac ?? metadata.armor_class;
  const weight = metadata.weight;
  const cost = metadata.cost || metadata.price;
  const properties = toArray(metadata.properties);
  const stealth = metadata.stealth;
  const minStrength = metadata.strength;
  const rarity = getRarityStyle(metadata.rarity);
  const attunement = metadata.attunement;

  const hasPrimary = damage || ac;

  return (
    <motion.div
      className="card-grimoire mt-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Type badge + rarity */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {eqType && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-200/60 font-medium">
            {eqType}
          </span>
        )}
        {rarity && (
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${rarity.bg} ${rarity.text}`}>
            {rarity.label}
          </span>
        )}
        {attunement && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300/70 font-medium flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            {typeof attunement === 'string' ? attunement : 'Requires Attunement'}
          </span>
        )}
      </div>

      {/* Primary stat (damage or AC) */}
      {hasPrimary && (
        <div className="flex items-center gap-4 mb-3">
          {damage && (
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400/70" />
              <div>
                <p className="text-[10px] text-amber-200/40 uppercase tracking-wide">Damage</p>
                <p className="text-lg font-display font-bold text-amber-100">{damage}</p>
              </div>
            </div>
          )}
          {ac !== undefined && ac !== null && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400/70" />
              <div>
                <p className="text-[10px] text-amber-200/40 uppercase tracking-wide">Armor Class</p>
                <p className="text-lg font-display font-bold text-amber-100">{String(ac)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weight / Cost row */}
      {(weight || cost) && (
        <div className="flex items-center gap-4 mb-3">
          {weight && (
            <div className="flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5 text-amber-200/40" />
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Weight</span>
              <span className="text-sm text-amber-200/70 ml-1">
                {typeof weight === 'number' ? `${weight} lb.` : weight}
              </span>
            </div>
          )}
          {cost && (
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-200/40" />
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Cost</span>
              <span className="text-sm text-amber-200/70 ml-1">{cost}</span>
            </div>
          )}
        </div>
      )}

      {/* Stealth / Strength requirements */}
      {(stealth || minStrength) && (
        <div className="flex items-center gap-4 mb-3">
          {stealth && (
            <div>
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Stealth</span>
              <p className="text-xs text-red-400/80">{stealth}</p>
            </div>
          )}
          {minStrength && (
            <div>
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Min Strength</span>
              <p className="text-xs text-amber-200/70">{minStrength}</p>
            </div>
          )}
        </div>
      )}

      {/* Properties */}
      {properties.length > 0 && (
        <div className="pt-3 border-t border-gold/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Gem className="w-3 h-3 text-amber-200/40" />
            <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Properties</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {properties.map(prop => (
              <span
                key={prop}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-200/60 font-medium"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
