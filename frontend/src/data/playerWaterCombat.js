/**
 * playerWaterCombat.js
 * Player Mode: Underwater combat rules, swimming, drowning, and aquatic encounters
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleeAttacks: 'Melee attacks have disadvantage UNLESS the weapon is a dagger, javelin, shortsword, spear, or trident (piercing weapons).',
  rangedAttacks: 'Ranged weapon attacks auto-miss beyond normal range. Disadvantage at normal range (except crossbows).',
  spells: 'DM discretion, but fire spells often don\'t work underwater. Lightning may have extended range.',
  movement: 'Without swim speed, each foot costs 2 feet of movement (like difficult terrain).',
  swimSpeed: 'Creatures with swim speed move normally underwater.',
};

export const DROWNING_RULES = {
  breathHolding: 'You can hold breath for 1 + CON modifier minutes (minimum 30 seconds).',
  suffocating: 'When breath runs out, you survive for CON modifier rounds (minimum 1). At 0 rounds, drop to 0 HP and are dying.',
  unconscious: 'If you fall unconscious underwater and can\'t breathe, you start drowning immediately.',
  note: 'In combat, this means CON mod rounds before death. A 10 CON character has 0 extra rounds.',
};

export const UNDERWATER_PREP = [
  { spell: 'Water Breathing (3rd, ritual)', effect: 'Up to 10 creatures can breathe underwater for 24 hours.', priority: 'S', note: 'Ritual = no slot cost. Cast before entering water.' },
  { spell: 'Freedom of Movement (4th)', effect: 'Normal speed underwater. Ignore difficult terrain. Can\'t be restrained.', priority: 'S', note: 'Full speed + no grapple/restrain. Best single-target underwater buff.' },
  { spell: 'Control Water (4th)', effect: 'Part water, create whirlpool, redirect flow.', priority: 'A', note: 'Part the water and fight on dry ground.' },
  { item: 'Cloak of the Manta Ray', effect: 'Swim speed 60ft + breathe underwater.', priority: 'S', note: 'Uncommon magic item. Solves all underwater problems.' },
  { item: 'Cap of Water Breathing', effect: 'Breathe underwater.', priority: 'A', note: 'Uncommon. Breathing only, no swim speed.' },
  { item: 'Ring of Swimming', effect: '40ft swim speed.', priority: 'A', note: 'Uncommon. Swim speed only, no breathing.' },
  { race: 'Triton/Sea Elf/Water Genasi', effect: 'Natural swim speed + water breathing.', priority: 'S', note: 'Built for underwater. No items needed.' },
];

export const EFFECTIVE_UNDERWATER_WEAPONS = [
  { weapon: 'Dagger', damage: '1d4', note: 'Piercing. No disadvantage. Finesse + thrown.' },
  { weapon: 'Shortsword', damage: '1d6', note: 'Piercing. Finesse. Best underwater melee.' },
  { weapon: 'Spear', damage: '1d6/1d8', note: 'Piercing. Versatile. Thrown.' },
  { weapon: 'Trident', damage: '1d6/1d8', note: 'Piercing. Versatile. Thrown. Thematic.' },
  { weapon: 'Javelin', damage: '1d6', note: 'Piercing. Thrown. No melee disadvantage.' },
  { weapon: 'Net', damage: '-', note: 'Restrain creatures. Works underwater.' },
];

export const UNDERWATER_SPELLS = {
  work: ['Lightning Bolt (DM may extend range in water)', 'Thunder spells (sound in water)', 'Cold spells', 'Force damage spells', 'Psychic spells'],
  dontWork: ['Fire spells (most DMs rule they fail underwater)', 'Spells requiring speech (if you can\'t breathe)'],
  excellent: ['Shape Water (cantrip, manipulate the environment)', 'Tidal Wave', 'Maelstrom', 'Control Water'],
};

export function swimMovement(baseSpeed, hasSwimSpeed) {
  return hasSwimSpeed ? baseSpeed : Math.floor(baseSpeed / 2);
}

export function breathDuration(conMod) {
  return Math.max(0.5, 1 + conMod); // minutes
}

export function suffocationRounds(conMod) {
  return Math.max(1, conMod);
}
