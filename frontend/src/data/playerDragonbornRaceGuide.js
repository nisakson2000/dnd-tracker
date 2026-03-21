/**
 * playerDragonbornRaceGuide.js
 * Player Mode: Dragonborn — the draconic warrior
 * Pure JS — no React dependencies.
 */

export const DRAGONBORN_BASICS = {
  race: 'Dragonborn',
  source: 'Player\'s Handbook / Fizban\'s Treasury of Dragons',
  asis: '+2 STR, +1 CHA (PHB) or +2/+1 any (MotM/Fizban\'s)',
  speed: '30ft',
  size: 'Medium',
  note: 'Breath Weapon AoE damage + elemental resistance. PHB version is weak. Fizban\'s versions (Chromatic, Metallic, Gem) are significantly better.',
};

export const DRAGONBORN_VARIANTS = {
  phb: {
    name: 'Standard Dragonborn (PHB)',
    breathWeapon: '2d6 → 3d6 → 4d6 → 5d6 (at L1/6/11/16). Action. DC = 8+CON+PB.',
    resistance: 'Resistance to chosen damage type.',
    note: 'Weak. Breath weapon uses action (competes with Attack). Damage doesn\'t scale well.',
    rating: 'C',
  },
  chromatic: {
    name: 'Chromatic Dragonborn (Fizban\'s)',
    breathWeapon: '1d10 → 2d10 → 3d10 → 4d10. Action (can replace one attack at L5+).',
    chromatic_warding: 'L5: become immune to your damage type for 1 minute. 1/LR.',
    note: 'Much better. Replace one attack with breath. Chromatic Warding = temporary immunity. Fire immune Dragonborn tank.',
    rating: 'A',
  },
  metallic: {
    name: 'Metallic Dragonborn (Fizban\'s)',
    breathWeapon: '1d10 → 2d10 → 3d10 → 4d10. Can replace one attack.',
    metallicBreath: 'L5: second breath type (15ft cone). Enervating (incapacitated, CON save) or Repulsion (push 20ft, STR save). 1/LR.',
    note: 'Incapacitate or push breath. Incredible control. Enervating Breath is like a mini-AoE stun.',
    rating: 'S',
  },
  gem: {
    name: 'Gem Dragonborn (Fizban\'s)',
    breathWeapon: '1d10 → 2d10 → 3d10 → 4d10. Can replace one attack.',
    flight: 'L5: 30ft fly speed for 1 minute (equal to walking speed). PB uses/LR.',
    telepathy: '30ft telepathy.',
    note: 'Flight from L5. PB uses/LR. Psychic/force/radiant/thunder damage types. Excellent mobility.',
    rating: 'A',
  },
};

export const BREATH_WEAPON_TYPES = [
  { color: 'Black/Copper', type: 'Acid', shape: '5×30ft line (or 15ft cone Fizban\'s)', save: 'DEX' },
  { color: 'Blue/Bronze', type: 'Lightning', shape: '5×30ft line (or 15ft cone)', save: 'DEX' },
  { color: 'Green', type: 'Poison', shape: '15ft cone', save: 'CON' },
  { color: 'Red/Gold/Brass', type: 'Fire', shape: '15ft cone (or line)', save: 'DEX' },
  { color: 'White/Silver', type: 'Cold', shape: '15ft cone', save: 'CON' },
];

export const DRAGONBORN_CLASS_SYNERGY = [
  { class: 'Paladin', priority: 'S', reason: 'STR+CHA (PHB). Metallic breath = AoE control on a Paladin. Smite + breath weapon. Perfect thematic fit.' },
  { class: 'Fighter', priority: 'A', reason: 'Replace one attack with breath. No action economy loss at L5+. STR bonus (PHB).' },
  { class: 'Sorcerer (Draconic)', priority: 'A', reason: 'CHA bonus. Dragon theme. Fizban\'s Gem = flight. Thematic and mechanically strong.' },
  { class: 'Barbarian', priority: 'A', reason: 'STR. Breath weapon while raging (not a spell). Fire resistance stacks with Rage.' },
];

export const DRAGONBORN_TACTICS = [
  { tactic: 'Metallic Enervating Breath', detail: 'L5: 15ft cone, CON save or incapacitated. AoE "stun" effect. Devastating opener.', rating: 'S' },
  { tactic: 'Gem flight', detail: 'L5: fly 30ft for 1 minute. PB uses/LR. No armor restriction. Any class can fly.', rating: 'A' },
  { tactic: 'Chromatic Warding', detail: 'L5: immune to fire/cold/lightning/etc for 1 minute. Walk through Fireball. Ignore dragon breath.', rating: 'A' },
  { tactic: 'Replace attack with breath', detail: 'Fizban\'s: use breath instead of one attack. Still get remaining attacks. No action economy loss.', rating: 'A' },
];

export function breathWeaponDamage(characterLevel) {
  const dice = characterLevel >= 17 ? 4 : characterLevel >= 11 ? 3 : characterLevel >= 5 ? 2 : 1;
  return { phb: `${dice + 1}d6`, fizbans: `${dice}d10`, phbAvg: (dice + 1) * 3.5, fizbansAvg: dice * 5.5 };
}

export function breathWeaponDC(conMod, profBonus) {
  return 8 + conMod + profBonus;
}
