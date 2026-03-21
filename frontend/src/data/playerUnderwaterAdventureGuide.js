/**
 * playerUnderwaterAdventureGuide.js
 * Player Mode: Underwater combat rules, challenges, and optimization
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleeAttacks: 'Disadvantage unless using dagger, javelin, shortsword, spear, or trident.',
  rangedAttacks: 'Auto miss beyond normal range. Disadvantage within normal range unless crossbow, net, or thrown javelin/spear/trident/dart.',
  spells: 'Work normally unless fire-based (DM discretion).',
  swimming: 'Half movement without swim speed.',
  breathing: 'Hold breath for 1 + CON mod minutes (min 30 sec).',
  suffocation: 'Out of breath = 0 HP at start of next turn.',
};

export const UNDERWATER_WEAPONS = [
  { weapon: 'Trident', damage: '1d6/1d8', note: 'No melee or thrown disadvantage. Best option.', rating: 'S' },
  { weapon: 'Spear', damage: '1d6/1d8', note: 'No melee or thrown disadvantage. Cheap.', rating: 'S' },
  { weapon: 'Shortsword', damage: '1d6', note: 'No melee disadvantage. Rogue weapon.', rating: 'A+' },
  { weapon: 'Dagger', damage: '1d4', note: 'No disadvantage either way.', rating: 'A' },
  { weapon: 'Crossbow', damage: '1d6-1d10', note: 'No ranged disadvantage in normal range.', rating: 'A+' },
];

export const UNDERWATER_ESSENTIAL_SPELLS = [
  { spell: 'Water Breathing', level: 3, rating: 'S++', note: 'Ritual. 24hr. 10 creatures. MANDATORY.' },
  { spell: 'Control Water', level: 4, rating: 'S+', note: 'Part water, whirlpool. Incredible control.' },
  { spell: 'Freedom of Movement', level: 4, rating: 'S', note: 'Ignores difficult terrain, grappling, speed reduction.' },
  { spell: 'Lightning Bolt', level: 3, rating: 'S', note: 'Water conducts. DM may expand area.' },
  { spell: 'Shape Water', level: 0, rating: 'A+', note: 'Freeze water, create barriers. Creative uses.' },
];

export const UNDERWATER_TIPS = [
  'Water Breathing is NON-NEGOTIABLE. Ritual = free.',
  'Bring tridents/spears. Most weapons have disadvantage.',
  'Lightning may be enhanced underwater (DM discretion).',
  'Fire spells may be weakened underwater.',
  'Druids: Wild Shape into aquatic forms. Giant Octopus, Shark, etc.',
  'Combat is 3D underwater. Attacks from above and below.',
  'Freedom of Movement negates underwater movement penalties.',
  'Cloak of the Manta Ray: swim 60ft + breathe underwater. No attunement.',
];
