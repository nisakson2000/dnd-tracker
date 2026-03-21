/**
 * playerSpellcastingFocusHandGuide.js
 * Player Mode: Spellcasting focus, component rules, and hand management
 * Pure JS — no React dependencies.
 */

export const COMPONENT_RULES = {
  verbal: { symbol: 'V', rule: 'Must speak. Silence blocks this.', note: 'Subtle Spell bypasses.' },
  somatic: { symbol: 'S', rule: 'Must have a free hand to gesture.', note: 'Shield hand works if holding focus.' },
  material: { symbol: 'M', rule: 'Must hold components or focus in one hand.', note: 'Same hand can do somatic if spell has M component.' },
  costly: 'Materials with a gold cost must be actual items (not replaced by focus).',
  consumed: 'If "consumed," you need the actual item each cast.',
};

export const FOCUS_TYPES = [
  { type: 'Arcane Focus', classes: ['Wizard', 'Sorcerer', 'Warlock'], examples: 'Staff, wand, orb, crystal, rod', note: 'Replaces non-costly M components.' },
  { type: 'Holy Symbol', classes: ['Cleric', 'Paladin'], examples: 'Amulet, emblem, reliquary', note: 'Can be on shield. Frees both hands.' },
  { type: 'Druidic Focus', classes: ['Druid'], examples: 'Staff, totem, wooden wand, yew wand', note: 'Staff doubles as weapon + focus.' },
  { type: 'Component Pouch', classes: ['All casters'], examples: 'Belt pouch with common components', note: 'Universal alternative to focus. Works for any class.' },
  { type: 'Musical Instrument', classes: ['Bard'], examples: 'Lute, flute, drum, horn', note: 'Must be proficient. Two-handed instruments = no free hand.' },
  { type: 'Artificer Tools', classes: ['Artificer'], examples: 'Thieves\' tools, any artisan tools', note: 'Infused item can also serve as focus.' },
];

export const HAND_SCENARIOS = [
  { setup: 'Sword + Shield (Cleric/Paladin)', hands: '0 free', solution: 'Holy symbol on shield. S+M spells work. V+S only spells need War Caster.', note: 'War Caster feat solves everything.' },
  { setup: 'Two-Handed Weapon (Greatsword)', hands: '1 free (grip with one when not attacking)', solution: 'Let go with one hand → cast → re-grip. Free object interaction.', note: 'Two-handed only requires both hands to ATTACK.' },
  { setup: 'Dual Wielding', hands: '0 free', solution: 'Drop weapon (free) → cast → pick up (free next turn) or War Caster.', note: 'Clunky. War Caster recommended for dual-wield casters.' },
  { setup: 'Staff Focus + Shield', hands: '0 free, but staff IS focus', solution: 'Staff is focus (M) and can do somatic (S+M). V+S only spells need War Caster.', note: 'Staff as quarterstaff + focus. Best Druid setup.' },
  { setup: 'Wand/Orb + Free Hand', hands: '1 free', solution: 'Focus in one hand, free hand for S components. No issues.', note: 'Cleanest setup. No feat needed.' },
  { setup: 'Hand Crossbow + anything', hands: '0 free (need free hand to load)', solution: 'Crossbow Expert ignores loading. Still need free hand for S components.', note: 'CBE helps but doesn\'t solve casting.' },
];

export const FOCUS_TIPS = [
  'Component pouch: universal. Works for any class. Skip class-specific focus.',
  'Holy symbol on shield: Clerics/Paladins cast M+S spells with shield.',
  'War Caster: somatic components with full hands. Best fix for sword+board.',
  'Two-handed weapons: only need both hands TO ATTACK. Free hand between attacks.',
  'Ruby of the War Mage: attach to weapon = weapon becomes focus. Artificer infusion.',
  'Costly components (gold value): focus CANNOT replace these. Must have the item.',
  'Consumed components: need a new one each cast. Stock up.',
  'Staff: quarterstaff + focus + shield = best Druid loadout.',
  'Dual wielding casters: drop weapon → cast → pick up. Or get War Caster.',
  'Subtle Spell: no V or S. Bypasses all hand/silence problems.',
];
