import { motion } from 'framer-motion';
import { Dices, Swords, Shield, Wrench, Sparkles, GitBranch } from 'lucide-react';

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [String(value)];
}

function formatHitDie(die) {
  if (!die) return null;
  const s = String(die).trim();
  return s.startsWith('d') ? s : `d${s}`;
}

function formatSpellcasting(value) {
  if (!value) return null;
  if (value === true) return 'Yes';
  if (value === false) return null;
  return String(value).replace(/\b\w/g, c => c.toUpperCase());
}

function PillList({ items, color = 'amber' }) {
  if (!items || items.length === 0) return <span className="text-xs text-amber-200/40 italic">None</span>;
  const colorMap = {
    amber: 'bg-white/5 text-amber-200/60',
    blue: 'bg-blue-500/10 text-blue-300/80',
    purple: 'bg-purple-500/10 text-purple-300/80',
    green: 'bg-green-500/10 text-green-300/80',
  };
  const cls = colorMap[color] || colorMap.amber;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(item => (
        <span key={item} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cls}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ClassStatBlock({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;

  const hitDie = formatHitDie(metadata.hit_die || metadata.hit_dice);
  const primaryAbility = toArray(metadata.primary_ability);
  const savingThrows = toArray(metadata.saving_throws || metadata.saving_throw_proficiencies);
  const armorProfs = toArray(metadata.armor_proficiencies);
  const weaponProfs = toArray(metadata.weapon_proficiencies);
  const toolProfs = toArray(metadata.tool_proficiencies);
  const spellcasting = formatSpellcasting(metadata.spellcasting ?? metadata.spellcaster);
  const subclassLevel = metadata.subclass_level;
  const skills = toArray(metadata.skills || metadata.skill_choices);

  const profSections = [
    { icon: Shield, label: 'Armor', items: armorProfs },
    { icon: Swords, label: 'Weapons', items: weaponProfs },
    { icon: Wrench, label: 'Tools', items: toolProfs },
  ].filter(s => s.items.length > 0);

  return (
    <motion.div
      className="card-grimoire mt-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hit die + primary ability row */}
      <div className="flex items-center gap-4 mb-3">
        {hitDie && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Dices className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-amber-200/40 uppercase tracking-wide">Hit Die</p>
              <p className="text-lg font-display font-bold text-amber-100">{hitDie}</p>
            </div>
          </div>
        )}

        {primaryAbility.length > 0 && (
          <div className="ml-auto text-right">
            <p className="text-[10px] text-amber-200/40 uppercase tracking-wide">Primary Ability</p>
            <p className="text-sm text-amber-200/70 font-medium">{primaryAbility.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Saving throws */}
      {savingThrows.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-amber-200/40 uppercase tracking-wide mb-1.5">Saving Throws</p>
          <PillList items={savingThrows} color="green" />
        </div>
      )}

      <hr className="border-gold/10 mb-3" />

      {/* Proficiencies */}
      {profSections.length > 0 && (
        <div className="space-y-2.5 mb-3">
          {profSections.map(({ icon: Icon, label, items }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3 h-3 text-amber-200/40" />
                <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">{label}</span>
              </div>
              <PillList items={items} />
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-amber-200/40 uppercase tracking-wide mb-1.5">Skill Choices</p>
          <PillList items={skills} color="blue" />
        </div>
      )}

      {/* Footer row: spellcasting + subclass level */}
      {(spellcasting || subclassLevel) && (
        <div className="flex items-center gap-3 pt-3 border-t border-gold/10">
          {spellcasting && (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400/70" />
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide mr-1">Spellcasting</span>
              <span className="text-xs text-purple-300/80 font-medium bg-purple-500/10 px-2 py-0.5 rounded-full">
                {spellcasting}
              </span>
            </div>
          )}
          {subclassLevel && (
            <div className="flex items-center gap-1.5 ml-auto">
              <GitBranch className="w-3.5 h-3.5 text-amber-200/40" />
              <span className="text-[10px] text-amber-200/40 uppercase tracking-wide mr-1">Subclass at</span>
              <span className="text-xs text-amber-200/70 font-medium">Lvl {subclassLevel}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
