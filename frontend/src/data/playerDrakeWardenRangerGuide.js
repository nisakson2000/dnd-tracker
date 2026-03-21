/**
 * playerDrakeWardenRangerGuide.js
 * Player Mode: Drakewarden Ranger — the dragon companion
 * Pure JS — no React dependencies.
 */

export const DRAKEWARDEN_BASICS = {
  class: 'Ranger (Drakewarden)',
  source: 'Fizban\'s Treasury of Dragons',
  theme: 'Summon a drake companion that scales with you. Fly on it at L15. Best pet Ranger alongside Beast Master (Tasha\'s).',
  note: 'Drake Companion is a true combat pet that uses your bonus action. Grows from Small to Large (rideable at L15 with flight). Elemental damage on your attacks. Fixed Beast Master\'s problems.',
};

export const DRAKEWARDEN_FEATURES = [
  { feature: 'Draconic Gift', level: 3, effect: 'Learn Thaumaturgy cantrip. Can speak Draconic.', note: 'Minor ribbon. Thaumaturgy is a fun utility cantrip.' },
  { feature: 'Drake Companion', level: 3, effect: 'Summon Small drake (long rest or spell slot). AC 14+PB. HP 5+5×Ranger level. BA: command to attack (1d6+PB damage). Reaction: add 1d6 elemental to your attack.', note: 'At L5: 30 HP, BA attack for 1d6+3, reaction for +1d6 to your attack. Good damage and tanky.' },
  { feature: 'Bond of Fang and Scale', level: 7, effect: 'Drake is Medium (rideable if Small/Medium). Drake bite deals +1d6 elemental. Resistance to drake\'s element (you and drake within 10ft).', note: 'Ride your drake. +1d6 to its bite = 2d6+PB. Elemental resistance for you both.' },
  { feature: 'Drake\'s Breath', level: 11, effect: 'Action (or replace one attack): drake breathes 30ft cone. 8d6 elemental (DEX save, half). Once per long rest free, then costs spell slot.', note: '8d6 AoE = 28 avg damage. Comparable to Fireball. Free once/LR.' },
  { feature: 'Perfected Bond', level: 15, effect: 'Drake is Large (fly 40ft). Drake bite +1d6 more (3d6+PB total). When drake hit: BA empowered bite for extra 1d6.', note: 'Flying mount! Drake attacks for 3d6+PB. You ride and attack from the sky.' },
];

export const DRAKE_SCALING = [
  { level: 3, size: 'Small', hp: 20, biteDamage: '1d6+PB', yourBonus: '1d6 elemental reaction', note: 'Decent pet. BA attack or reaction bonus.' },
  { level: 5, size: 'Small', hp: 30, biteDamage: '1d6+PB', yourBonus: '1d6 elemental reaction', note: 'Scales with proficiency. Solid.' },
  { level: 7, size: 'Medium', hp: 40, biteDamage: '2d6+PB', yourBonus: '1d6 + resistance', note: 'Rideable. More damage. Element resistance.' },
  { level: 11, size: 'Medium', hp: 60, biteDamage: '2d6+PB', yourBonus: '8d6 breath weapon', note: 'Breath weapon = Fireball equivalent.' },
  { level: 15, size: 'Large', hp: 80, biteDamage: '3d6+PB', yourBonus: 'Flight + empowered bite', note: 'Flying mount. Peak power.' },
];

export const DRAKEWARDEN_TACTICS = [
  { tactic: 'Attack + BA drake bite', detail: 'Your 2 attacks + BA drake bite (2d6+PB). Full attack action + companion damage every turn.', rating: 'S' },
  { tactic: 'Drake reaction bonus', detail: 'Drake adds 1d6 elemental to one of your attacks as reaction. Free extra damage.', rating: 'A' },
  { tactic: 'Drake\'s Breath AoE', detail: 'L11: 8d6 cone (28 avg). Use on grouped enemies. Free once/LR.', rating: 'S' },
  { tactic: 'Aerial combat at L15', detail: 'Fly on Large drake. Attack from above. Enemies without ranged attacks can\'t reach you.', rating: 'S' },
  { tactic: 'Drake as tank', detail: 'Drake has decent HP and AC. Position it to absorb hits. Resummon for a spell slot if it dies.', rating: 'A' },
];

export function drakeHP(rangerLevel) {
  return 5 + (5 * rangerLevel);
}

export function drakeAC(profBonus) {
  return 14 + profBonus;
}

export function drakeBiteDamage(rangerLevel, profBonus) {
  const dice = rangerLevel >= 15 ? 3 : rangerLevel >= 7 ? 2 : 1;
  return { damage: `${dice}d6+${profBonus}`, avg: dice * 3.5 + profBonus };
}
