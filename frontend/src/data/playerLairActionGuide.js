/**
 * playerLairActionGuide.js
 * Player Mode: Understanding lair actions, regional effects, and how to counter them
 * Pure JS — no React dependencies.
 */

export const LAIR_ACTION_RULES = {
  what: 'Lair actions are environmental effects a creature can trigger in its lair on initiative count 20 (losing ties).',
  frequency: 'Once per round, on initiative 20.',
  effect: 'The lair itself attacks, reshapes, or hinders intruders. Not the creature\'s action.',
  counter: 'Destroy the lair, kill the creature, or use spells to counter specific effects.',
  note: 'Not all creatures have lair actions — only those with legendary status in their own domain.',
};

export const COMMON_LAIR_ACTIONS = [
  { creature: 'Adult Dragon (any)', actions: ['Tremor (DEX save or prone)', 'Volcanic gas/ice/poison in area', 'Terrain reshaping'], counter: 'Fly to avoid ground effects. Freedom of Movement. Fire/cold resistance.' },
  { creature: 'Beholder', actions: ['Eye ray at random target', 'Slippery/grasping tendrils from walls', 'Antimagic cone from lair eye'], counter: 'Spread out. Stay away from walls. Don\'t cluster for AoE lair effects.' },
  { creature: 'Lich', actions: ['Tethered spirits (necrotic damage)', 'Antilife shell in area', 'Dispel magic on all spells in area'], counter: 'Necrotic resistance. Nonmagical damage sources. Physical attacks over spells.' },
  { creature: 'Aboleth', actions: ['Flooding (water level rises)', 'Slime on surfaces (difficult terrain)', 'Psychic phantasms'], counter: 'Water Breathing. Freedom of Movement. Mind Blank. High WIS saves.' },
  { creature: 'Kraken', actions: ['Lightning through water', 'Strong current (forced movement)', 'Tentacles from walls/floor'], counter: 'Lightning resistance. STR saves. Stay mobile. Don\'t fight in water if possible.' },
  { creature: 'Mind Flayer Colony', actions: ['Psychic blast (INT save)', 'Dominate random creature', 'Telekinetic shove'], counter: 'Mind Blank. INT save proficiency. Intellect Fortress spell.' },
];

export const REGIONAL_EFFECTS = {
  description: 'Permanent environmental changes in the area around a legendary creature\'s lair. Usually within 1-6 miles.',
  examples: [
    { creature: 'Red Dragon', effects: ['Small earthquakes', 'Water sources heat up', 'Rocky fissures emit sulfurous gas'] },
    { creature: 'Green Dragon', effects: ['Thick fog', 'Undergrowth blocks paths', 'Animals become spies for the dragon'] },
    { creature: 'Lich', effects: ['Plants wither', 'Water is poisoned', 'Undead rise within the region'] },
    { creature: 'Hag Coven', effects: ['Perpetual fog', 'Animals flee', 'Milk curdles, food rots faster'] },
  ],
  removal: 'Regional effects fade in 1d10 days after the creature dies.',
};

export const LAIR_PREPARATION = [
  { step: 'Scout the lair', detail: 'Use familiars, scrying, or invisible scouts. Know the layout before fighting.' },
  { step: 'Identify lair actions', detail: 'Knowledge check (Arcana, Nature, History) to know what lair actions to expect.' },
  { step: 'Pre-buff party', detail: 'Resist elements, Freedom of Movement, Heroes\' Feast BEFORE entering.' },
  { step: 'Plan entry/exit routes', detail: 'Don\'t get trapped. Know how you\'re getting out if things go wrong.' },
  { step: 'Clear minions first', detail: 'If possible, deal with lesser creatures outside the lair before facing the boss.' },
  { step: 'Bring environmental counters', detail: 'Fly, Water Breathing, Fire Resistance, Tremorsense items. Match the lair.' },
  { step: 'Fight on initiative 20', detail: 'Lair actions happen on init 20. High initiative = act before lair action. Alert feat helps.' },
];

export function getLairCounters(creatureType) {
  const lair = COMMON_LAIR_ACTIONS.find(l =>
    l.creature.toLowerCase().includes((creatureType || '').toLowerCase())
  );
  return lair || { creature: creatureType, actions: ['Unknown — gather intel first'], counter: 'Scout the lair before engaging.' };
}

export function getPreparationChecklist(creatureType) {
  return {
    general: LAIR_PREPARATION,
    specific: getLairCounters(creatureType),
  };
}
