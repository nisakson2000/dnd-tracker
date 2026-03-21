/**
 * playerDragonbornBreathWeapon.js
 * Player Mode: Dragonborn breath weapon tracking and reference
 * Pure JS — no React dependencies.
 */

export const DRACONIC_ANCESTRY = [
  { dragon: 'Black', damageType: 'Acid', breathShape: '5x30 ft line', saveStat: 'DEX' },
  { dragon: 'Blue', damageType: 'Lightning', breathShape: '5x30 ft line', saveStat: 'DEX' },
  { dragon: 'Brass', damageType: 'Fire', breathShape: '5x30 ft line', saveStat: 'DEX' },
  { dragon: 'Bronze', damageType: 'Lightning', breathShape: '5x30 ft line', saveStat: 'DEX' },
  { dragon: 'Copper', damageType: 'Acid', breathShape: '5x30 ft line', saveStat: 'DEX' },
  { dragon: 'Gold', damageType: 'Fire', breathShape: '15 ft cone', saveStat: 'DEX' },
  { dragon: 'Green', damageType: 'Poison', breathShape: '15 ft cone', saveStat: 'CON' },
  { dragon: 'Red', damageType: 'Fire', breathShape: '15 ft cone', saveStat: 'DEX' },
  { dragon: 'Silver', damageType: 'Cold', breathShape: '15 ft cone', saveStat: 'CON' },
  { dragon: 'White', damageType: 'Cold', breathShape: '15 ft cone', saveStat: 'CON' },
];

export const BREATH_WEAPON_DAMAGE = [
  { level: 1, dice: '2d6' },
  { level: 6, dice: '3d6' },
  { level: 11, dice: '4d6' },
  { level: 16, dice: '5d6' },
];

export const BREATH_WEAPON_RULES = {
  action: 'Action',
  recharge: 'Once per short or long rest (PHB). Proficiency bonus times per long rest (Fizban\'s).',
  saveDC: '8 + CON modifier + proficiency bonus',
  halfDamage: 'Targets that succeed on the save take half damage.',
  note: 'Breath weapon is NOT a spell — it can\'t be Counterspelled and works in antimagic fields.',
};

export const FIZBAN_DRAGONBORN = {
  chromatic: { level3Feature: 'Chromatic Warding: Reaction to become immune to your damage type for 1 minute (1/long rest at 5th level).' },
  metallic: { level3Feature: 'Metallic Breath: Second breath option — 15ft cone, CON save. Choose: push 20ft or incapacitate until next turn start (1/long rest at 5th level).' },
  gem: { level3Feature: 'Gem Flight: Bonus action to gain spectral wings, flying speed = walking speed for 1 minute (1/long rest at 5th level).' },
};

export function getBreathDamage(level) {
  for (let i = BREATH_WEAPON_DAMAGE.length - 1; i >= 0; i--) {
    if (level >= BREATH_WEAPON_DAMAGE[i].level) return BREATH_WEAPON_DAMAGE[i].dice;
  }
  return '2d6';
}

export function getAncestry(dragon) {
  return DRACONIC_ANCESTRY.find(d => d.dragon.toLowerCase() === (dragon || '').toLowerCase()) || null;
}

export function getBreathSaveDC(conMod, profBonus) {
  return 8 + conMod + profBonus;
}
