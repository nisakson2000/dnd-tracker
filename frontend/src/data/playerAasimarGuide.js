/**
 * playerAasimarGuide.js
 * Player Mode: Aasimar race optimization and transformation mechanics
 * Pure JS — no React dependencies.
 */

export const AASIMAR_TRAITS = {
  source: 'Volo\'s Guide / Mordenkainen\'s Monsters of the Multiverse',
  asi: '+2 CHA, +1 to one other (Volo\'s) OR +2/+1 or +1/+1/+1 (MotM)',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  celestialResistance: 'Resistance to necrotic and radiant damage.',
  healingHands: 'Touch: heal HP = your level. Once per long rest.',
  lightBearer: 'Light cantrip (CHA).',
  celestialRevelation: 'Bonus action transformation at L3. Lasts 1 minute. Once per long rest.',
};

export const AASIMAR_SUBTYPES = [
  {
    subtype: 'Protector (Radiant Soul)',
    effect: 'Fly speed 30ft. Deal extra radiant damage = your level once per turn.',
    bestFor: 'Paladin, Cleric, Warlock — flight + damage + CHA synergy.',
    rating: 'S',
  },
  {
    subtype: 'Scourge (Radiant Consumption)',
    effect: 'Radiant aura: all creatures within 10ft (including you) take your level in radiant damage. Extra radiant = level once per turn.',
    bestFor: 'Barbarian, melee builds — you can tank the self-damage, enemies can\'t.',
    rating: 'A',
  },
  {
    subtype: 'Fallen (Necrotic Shroud)',
    effect: 'All creatures within 10ft must WIS save or be frightened. Extra necrotic = level once per turn.',
    bestFor: 'Oathbreaker Paladin, Conquest Paladin, intimidation builds.',
    rating: 'A',
  },
];

export const AASIMAR_BUILDS = [
  { build: 'Aasimar Paladin', synergy: 'CHA for spellcasting + Smites + transformation damage + flight (Protector). Perfect match.', rating: 'S' },
  { build: 'Aasimar Divine Soul Sorcerer', synergy: 'CHA caster + celestial theme. Extra radiant per turn stacks with spell damage.', rating: 'S' },
  { build: 'Aasimar Conquest Paladin (Fallen)', synergy: 'Necrotic Shroud frightens + Aura of Conquest = speed 0 for frightened enemies.', rating: 'S' },
  { build: 'Aasimar Celestial Warlock', synergy: 'Celestial + celestial patron. Healing Hands + Healing Light. Thematic powerhouse.', rating: 'A' },
  { build: 'Aasimar Barbarian (Scourge)', synergy: 'Rage resistance reduces Scourge self-damage. Radiant aura punishes enemies.', rating: 'A' },
];

export function transformationDamage(level) {
  return level; // Add level to damage once per turn
}

export function scourgeAuraDamage(level, roundsActive, selfTakes) {
  const totalToEnemies = level * roundsActive;
  const totalToSelf = selfTakes ? level * roundsActive : 0;
  return { toEnemies: totalToEnemies, toSelf: totalToSelf };
}
