/**
 * playerUnderwaterCombat.js
 * Player Mode: Underwater combat rules and suffocation
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleeAttacks: {
    rule: 'Melee attacks: creatures without swim speed have disadvantage unless using dagger, javelin, shortsword, spear, or trident.',
    immuneWeapons: ['Dagger', 'Javelin', 'Shortsword', 'Spear', 'Trident'],
  },
  rangedAttacks: {
    rule: 'Ranged weapon attacks automatically miss beyond normal range. Within normal range: disadvantage unless weapon is crossbow, net, or javelin/trident (thrown).',
    immuneWeapons: ['Crossbow', 'Net'],
  },
  fireResistance: 'Creatures fully immersed in water have resistance to fire damage.',
  visibility: 'Water is lightly obscured. Beyond 60ft = heavily obscured (clear water) or 30ft (murky water).',
};

export const SUFFOCATION_RULES = {
  holdBreath: 'Can hold breath for 1 + CON modifier minutes (minimum 30 seconds).',
  outOfBreath: 'When out of breath, survive for number of rounds equal to CON modifier (minimum 1 round).',
  suffocating: 'After that, drops to 0 HP and is dying. Cannot regain HP or be stabilized until it can breathe.',
  note: 'Casting verbal component spells underwater is impossible without special means (e.g., Water Breathing).',
};

export const WATER_SPELLS = [
  { name: 'Water Breathing', level: 3, duration: '24 hours (ritual)', effect: 'Up to 10 creatures can breathe underwater.' },
  { name: 'Alter Self', level: 2, duration: '1 hour (concentration)', effect: 'Aquatic Adaptation: swim speed, breathe underwater.' },
  { name: 'Shape Water', level: 0, duration: 'Instant/1 hour', effect: 'Control water in a 5ft cube.' },
  { name: 'Control Water', level: 4, duration: '10 min (concentration)', effect: 'Part water, redirect flow, create whirlpool, etc.' },
];

export function canBreathUnderwater(features = []) {
  const lc = features.map(f => f.toLowerCase());
  return lc.some(f => f.includes('water breathing') || f.includes('amphibious') || f.includes('aquatic'));
}

export function getBreathHoldingTime(conScore) {
  const conMod = Math.floor((conScore - 10) / 2);
  return Math.max(0.5, 1 + conMod); // in minutes
}

export function getSuffocationRounds(conScore) {
  const conMod = Math.floor((conScore - 10) / 2);
  return Math.max(1, conMod);
}
