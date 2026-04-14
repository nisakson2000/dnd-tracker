import { motion } from 'framer-motion';
import { Shield, Heart, Footprints, Eye, MessageSquare, Skull } from 'lucide-react';
import { ABILITIES } from '../../../utils/dndHelpers';
const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

function calcModifier(score) {
  const n = Number(score);
  if (isNaN(n)) return '+0';
  const mod = Math.floor((n - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function getAbilityScores(metadata) {
  // Try direct keys first (str, dex, etc.)
  const fromDirect = ABILITY_KEYS.map(k => metadata[k]);
  if (fromDirect.some(v => v !== undefined && v !== null)) {
    return ABILITY_KEYS.map(k => metadata[k] ?? '—');
  }
  // Try abilities object with STR/DEX/etc. keys
  if (metadata.abilities && typeof metadata.abilities === 'object') {
    return ABILITIES.map(k => metadata.abilities[k] ?? metadata.abilities[k.toLowerCase()] ?? '—');
  }
  return null;
}

function formatCR(cr) {
  if (cr === undefined || cr === null) return null;
  return String(cr);
}

export default function MonsterStatBlock({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;

  const cr = formatCR(metadata.cr ?? metadata.challenge_rating);
  const ac = metadata.ac ?? metadata.armor_class;
  const hp = metadata.hp ?? metadata.hit_points;
  const abilities = getAbilityScores(metadata);
  const subtitle = [metadata.size, metadata.type, metadata.alignment].filter(Boolean).join(' ');

  const infoRows = [
    { icon: Shield, label: 'Armor Class', value: ac },
    { icon: Heart, label: 'Hit Points', value: hp },
    { icon: Footprints, label: 'Speed', value: metadata.speed },
  ].filter(r => r.value !== undefined && r.value !== null);

  const detailRows = [
    { icon: Eye, label: 'Senses', value: metadata.senses },
    { icon: MessageSquare, label: 'Languages', value: metadata.languages },
  ].filter(r => r.value);

  return (
    <motion.div
      className="mt-6 overflow-hidden rounded-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Crimson top border */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700" />

      <div className="bg-stone-900/80 border-x border-gold/15 px-4 py-4">
        {/* Header with CR */}
        <div className="flex items-start justify-between mb-1">
          <div>
            {subtitle && (
              <p className="text-xs text-amber-200/50 italic">{subtitle}</p>
            )}
          </div>
          {cr && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Skull className="w-3.5 h-3.5 text-red-400/70" />
              <div className="text-center">
                <p className="text-[10px] text-amber-200/40 uppercase tracking-wide leading-none">CR</p>
                <p className="text-lg font-display font-bold text-red-400 leading-none mt-0.5">{cr}</p>
              </div>
            </div>
          )}
        </div>

        <hr className="border-red-700/40 my-2.5" />

        {/* AC / HP / Speed */}
        <div className="space-y-1.5">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-red-400/60 shrink-0" />
              <span className="text-xs text-amber-200/40 w-20 shrink-0">{label}</span>
              <span className="text-sm text-amber-200/70">{String(value)}</span>
            </div>
          ))}
        </div>

        {/* Ability scores */}
        {abilities && (
          <>
            <hr className="border-red-700/40 my-3" />
            <div className="grid grid-cols-6 gap-1 text-center">
              {ABILITIES.map((name, i) => {
                const score = abilities[i];
                const mod = score !== '—' ? calcModifier(score) : '';
                return (
                  <div key={name}>
                    <p className="text-[10px] text-red-400/70 font-bold tracking-wider mb-0.5">{name}</p>
                    <p className="text-sm text-amber-100 font-semibold leading-none">{score}</p>
                    {mod && (
                      <p className="text-[10px] text-amber-200/50 mt-0.5">({mod})</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Senses / Languages */}
        {detailRows.length > 0 && (
          <>
            <hr className="border-red-700/40 my-3" />
            <div className="space-y-1.5">
              {detailRows.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="w-3.5 h-3.5 text-amber-200/30 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">{label}</span>
                    <p className="text-xs text-amber-200/60">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Legendary badge */}
        {metadata.legendary_actions && (
          <div className="mt-3 pt-3 border-t border-red-700/40">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium">
              Legendary
            </span>
          </div>
        )}
      </div>

      {/* Crimson bottom border */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700" />
    </motion.div>
  );
}
