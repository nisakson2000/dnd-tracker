/**
 * playerSpellcastingFocus.js
 * Player Mode: Spellcasting focus types and rules by class
 * Pure JS — no React dependencies.
 */

export const FOCUS_TYPES = [
  {
    type: 'Arcane Focus',
    items: ['Crystal', 'Orb', 'Rod', 'Staff', 'Wand'],
    classes: ['Sorcerer', 'Warlock', 'Wizard'],
    rule: 'Replaces non-consumed material components without a gold cost.',
  },
  {
    type: 'Holy Symbol',
    items: ['Amulet', 'Emblem', 'Reliquary'],
    classes: ['Cleric', 'Paladin'],
    rule: 'Can be worn or emblazoned on shield. Replaces non-consumed material components without a gold cost.',
  },
  {
    type: 'Druidic Focus',
    items: ['Sprig of Mistletoe', 'Totem', 'Wooden Staff', 'Yew Wand'],
    classes: ['Druid'],
    rule: 'Replaces non-consumed material components without a gold cost.',
  },
  {
    type: 'Musical Instrument',
    items: ['Lute', 'Lyre', 'Flute', 'Drum', 'etc.'],
    classes: ['Bard'],
    rule: 'Bards use a musical instrument as their focus.',
  },
  {
    type: 'Component Pouch',
    items: ['Component Pouch'],
    classes: ['Any spellcaster'],
    rule: 'Universal alternative to a focus. Contains all non-consumed, non-costed material components.',
    cost: 25,
  },
];

export const COMPONENT_RULES = {
  verbal: 'Must be able to speak. Silenced = can\'t cast.',
  somatic: 'Must have a free hand. War Caster feat allows somatic with hands full.',
  material: 'Need a focus, component pouch, or the actual material. If material has a gold cost or is consumed, must have the actual component.',
  goldCost: 'Focus/pouch does NOT replace components with a listed gold cost.',
  consumed: 'Focus/pouch does NOT replace components that are consumed by the spell.',
};

export function getFocusForClass(className) {
  return FOCUS_TYPES.filter(f =>
    f.classes.some(c => c.toLowerCase() === (className || '').toLowerCase()) ||
    f.classes.includes('Any spellcaster')
  );
}

export function needsActualComponent(spell) {
  if (!spell?.materialCost) return false;
  return spell.materialCost > 0 || spell.materialConsumed;
}
