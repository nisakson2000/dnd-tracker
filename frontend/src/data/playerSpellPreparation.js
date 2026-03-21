/**
 * playerSpellPreparation.js
 * Player Mode: Spell preparation guide by class
 * Pure JS — no React dependencies.
 */

export const SPELL_PREP_CLASSES = [
  {
    class: 'Wizard',
    prepType: 'Prepared (from spellbook)',
    formula: 'INT modifier + Wizard level (minimum 1)',
    changeWhen: 'After a long rest. Can change entire list.',
    note: 'Must have spells written in spellbook. Can copy new spells from scrolls or other spellbooks.',
  },
  {
    class: 'Cleric',
    prepType: 'Prepared (from full class list)',
    formula: 'WIS modifier + Cleric level (minimum 1)',
    changeWhen: 'After a long rest. Can change entire list.',
    note: 'Domain spells are always prepared and don\'t count against your limit.',
  },
  {
    class: 'Druid',
    prepType: 'Prepared (from full class list)',
    formula: 'WIS modifier + Druid level (minimum 1)',
    changeWhen: 'After a long rest. Can change entire list.',
    note: 'Circle spells are always prepared and don\'t count against your limit.',
  },
  {
    class: 'Paladin',
    prepType: 'Prepared (from full class list)',
    formula: 'CHA modifier + half Paladin level rounded down (minimum 1)',
    changeWhen: 'After a long rest. Can change entire list.',
    note: 'Oath spells are always prepared and don\'t count against your limit.',
  },
  {
    class: 'Artificer',
    prepType: 'Prepared (from full class list)',
    formula: 'INT modifier + half Artificer level rounded down (minimum 1)',
    changeWhen: 'After a long rest. Can change entire list.',
    note: 'Subclass spells are always prepared free.',
  },
  {
    class: 'Bard',
    prepType: 'Known (fixed list)',
    formula: 'See Spells Known column on class table.',
    changeWhen: 'On level up, can swap ONE known spell for another.',
    note: 'Magical Secrets (10th, 14th, 18th) lets you learn spells from any class.',
  },
  {
    class: 'Sorcerer',
    prepType: 'Known (fixed list)',
    formula: 'See Spells Known column on class table.',
    changeWhen: 'On level up, can swap ONE known spell for another.',
    note: 'Limited list — choose versatile spells. Metamagic enhances what you have.',
  },
  {
    class: 'Warlock',
    prepType: 'Known (fixed list)',
    formula: 'See Spells Known column on class table.',
    changeWhen: 'On level up, can swap ONE known spell for another.',
    note: 'Very few slots (1-4) but they\'re all max level. Recover on short rest.',
  },
  {
    class: 'Ranger',
    prepType: 'Known (fixed list)',
    formula: 'See Spells Known column on class table.',
    changeWhen: 'On level up, can swap ONE known spell for another.',
    note: 'Subclass spells known automatically (Tasha\'s variant).',
  },
];

export const MUST_PREPARE_SPELLS = {
  healer: ['Healing Word', 'Cure Wounds', 'Lesser Restoration', 'Revivify'],
  control: ['Bless', 'Hold Person', 'Counterspell', 'Banishment'],
  damage: ['Fireball', 'Spirit Guardians', 'Spiritual Weapon', 'Guiding Bolt'],
  utility: ['Detect Magic', 'Dispel Magic', 'Remove Curse', 'Pass without Trace'],
  social: ['Zone of Truth', 'Suggestion', 'Charm Person', 'Sending'],
};

export const PREP_TIPS = [
  'Always have at least one healing spell prepared.',
  'Ritual spells don\'t need to be prepared (Wizard) or cost a slot to cast as rituals.',
  'Prepare for the day: dungeon crawl? Load up on combat spells. Social session? Bring charm spells.',
  'If you have domain/oath/circle spells, you have MORE flexibility with your prepared list.',
  'Don\'t prepare all damage — utility and healing save lives.',
  'Concentration spells are powerful but you can only maintain one. Prepare 2-3 options.',
];

export function getSpellPrepInfo(className) {
  return SPELL_PREP_CLASSES.find(c => c.class.toLowerCase() === (className || '').toLowerCase()) || null;
}

export function calculatePreparedCount(className, level, abilityMod) {
  const info = getSpellPrepInfo(className);
  if (!info) return 0;
  if (info.prepType.includes('Known')) return -1; // use class table
  if (['Paladin', 'Artificer'].includes(info.class)) return Math.max(1, abilityMod + Math.floor(level / 2));
  return Math.max(1, abilityMod + level);
}
