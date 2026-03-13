import { motion } from 'framer-motion';
import { Clock, Crosshair, Sparkles, Timer, BookOpen, Zap } from 'lucide-react';
import { getCategoryConfig } from '../../../data/wikiCategoryConfig.js';

const SCHOOL_COLORS = {
  abjuration:    '#3b82f6',
  conjuration:   '#f59e0b',
  divination:    '#a78bfa',
  enchantment:   '#ec4899',
  evocation:     '#ef4444',
  illusion:      '#8b5cf6',
  necromancy:    '#6b7280',
  transmutation: '#10b981',
};

function formatLevel(level) {
  if (level === 0 || level === '0' || level === 'cantrip') return 'Cantrip';
  const n = Number(level);
  if (n === 1) return '1st Level';
  if (n === 2) return '2nd Level';
  if (n === 3) return '3rd Level';
  return `${n}th Level`;
}

function formatComponents(components) {
  if (typeof components === 'string') return components;
  if (typeof components === 'object' && components !== null) {
    const parts = [];
    if (components.verbal || components.V) parts.push('V');
    if (components.somatic || components.S) parts.push('S');
    if (components.material || components.M) {
      const mat = typeof components.material === 'string' ? components.material : components.M;
      parts.push(typeof mat === 'string' && mat.length > 1 ? `M (${mat})` : 'M');
    }
    return parts.join(', ') || JSON.stringify(components);
  }
  return String(components || '');
}

export default function SpellStatBlock({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;

  const school = (metadata.school || '').toLowerCase();
  const schoolColor = SCHOOL_COLORS[school] || getCategoryConfig('spells').color;
  const levelText = formatLevel(metadata.level);
  const isCantrip = metadata.level === 0 || metadata.level === '0' || metadata.level === 'cantrip';
  const higherLevels = metadata.higher_levels || metadata.at_higher_levels;
  const classes = Array.isArray(metadata.classes) ? metadata.classes : [];

  const stats = [
    { icon: Clock,     label: 'Casting Time', value: metadata.casting_time },
    { icon: Crosshair, label: 'Range',        value: metadata.range },
    { icon: Sparkles,  label: 'Components',   value: formatComponents(metadata.components) },
    { icon: Timer,     label: 'Duration',     value: metadata.duration },
  ].filter(s => s.value);

  return (
    <motion.div
      className="card-grimoire mt-6 overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${schoolColor}20` }}
        >
          <Zap className="w-4 h-4" style={{ color: schoolColor }} />
        </div>
        <div>
          <p className="text-xs font-display uppercase tracking-wider" style={{ color: schoolColor }}>
            {metadata.school || 'Spell'}
          </p>
          <p className="text-sm text-amber-200/70">
            {isCantrip ? 'Cantrip' : `${levelText} ${metadata.school || ''}`}
          </p>
        </div>
      </div>

      {/* Concentration / Ritual badges */}
      {(metadata.concentration || metadata.ritual) && (
        <div className="flex gap-2 mb-3">
          {metadata.concentration && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 font-medium">
              Concentration
            </span>
          )}
          {metadata.ritual && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-medium">
              Ritual
            </span>
          )}
        </div>
      )}

      <hr className="border-gold/10 mb-3" />

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className="w-3 h-3 text-amber-200/40" />
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-sm text-amber-200/70 leading-snug">{value}</p>
          </div>
        ))}
      </div>

      {/* Higher levels */}
      {higherLevels && (
        <div className="mt-3 pt-3 border-t border-gold/10">
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3 h-3 text-amber-200/40" />
            <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">At Higher Levels</span>
          </div>
          <p className="text-xs text-amber-200/60 leading-relaxed">{higherLevels}</p>
        </div>
      )}

      {/* Class pills */}
      {classes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gold/10">
          <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">Classes</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {classes.map(cls => (
              <span
                key={cls}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-200/60 font-medium"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
