import { motion } from 'framer-motion';
import { Footprints, Ruler, Eye, MessageSquare, Sparkles, Users } from 'lucide-react';

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [String(value)];
}

function formatAbilityBonuses(bonuses) {
  if (!bonuses) return [];
  // String format: "+2 Dex, +1 Wis"
  if (typeof bonuses === 'string') {
    return bonuses.split(',').map(s => s.trim()).filter(Boolean);
  }
  // Object format: { dexterity: 2, wisdom: 1 }
  if (typeof bonuses === 'object' && !Array.isArray(bonuses)) {
    return Object.entries(bonuses).map(([ability, mod]) => {
      const name = ability.charAt(0).toUpperCase() + ability.slice(1).toLowerCase();
      const n = Number(mod);
      return `${n >= 0 ? '+' : ''}${n} ${name}`;
    });
  }
  if (Array.isArray(bonuses)) return bonuses.map(String);
  return [];
}

function formatDarkvision(value) {
  if (!value) return null;
  if (typeof value === 'boolean') return value ? '60 ft.' : null;
  const n = Number(value);
  if (!isNaN(n)) return `${n} ft.`;
  return String(value);
}

export default function RaceStatBlock({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;

  const abilityBonuses = formatAbilityBonuses(metadata.ability_bonuses || metadata.ability_score_increase);
  const speed = metadata.speed;
  const size = metadata.size;
  const languages = toArray(metadata.languages);
  const traits = toArray(metadata.traits || metadata.racial_traits);
  const darkvision = formatDarkvision(metadata.darkvision);
  const subraces = toArray(metadata.subraces);

  const quickStats = [
    { icon: Ruler, label: 'Size', value: size },
    { icon: Footprints, label: 'Speed', value: speed ? (typeof speed === 'number' ? `${speed} ft.` : speed) : null },
    { icon: Eye, label: 'Darkvision', value: darkvision },
  ].filter(s => s.value);

  return (
    <motion.div
      className="card-grimoire mt-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quick stats row */}
      {quickStats.length > 0 && (
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          {quickStats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-emerald-400/60" />
              <div>
                <p className="text-[10px] text-amber-200/40 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-amber-200/70 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ability bonuses */}
      {abilityBonuses.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-amber-200/40 uppercase tracking-wide mb-1.5">Ability Score Increases</p>
          <div className="flex flex-wrap gap-1.5">
            {abilityBonuses.map(bonus => (
              <span
                key={bonus}
                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300/80 font-medium"
              >
                {bonus}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3 h-3 text-amber-200/40" />
            <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Languages</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {languages.map(lang => (
              <span
                key={lang}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-200/60 font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Racial traits */}
      {traits.length > 0 && (
        <div className="pt-3 border-t border-gold/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-amber-200/40" />
            <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Racial Traits</span>
          </div>
          <ul className="space-y-1">
            {traits.map(trait => (
              <li key={trait} className="text-xs text-amber-200/60 flex items-start gap-1.5">
                <span className="text-amber-200/30 mt-1 shrink-0">--</span>
                {trait}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subraces */}
      {subraces.length > 0 && (
        <div className="pt-3 mt-3 border-t border-gold/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Users className="w-3 h-3 text-amber-200/40" />
            <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Subraces</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subraces.map(sub => (
              <span
                key={sub}
                className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300/70 font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
