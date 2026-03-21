/**
 * playerGloomStalkerGuide.js
 * Player Mode: Gloom Stalker Ranger subclass optimization
 * Pure JS — no React dependencies.
 */

export const GLOOM_STALKER_BASICS = {
  class: 'Ranger (Gloom Stalker)',
  theme: 'Ambush predator specializing in darkness and first strikes',
  features: {
    level3: {
      dreadAmbusher: 'First turn: +10ft speed, extra attack dealing +1d8 damage, +WIS to initiative.',
      umbralSight: 'Darkvision 60ft (or +30ft if you have it). Invisible to creatures relying on darkvision.',
    },
    level7: { ironMind: 'WIS save proficiency. If already proficient, INT or CHA instead.' },
    level11: { stalkerFlurry: 'When you miss an attack, make another weapon attack as part of same action.' },
    level15: { shadowyDodge: 'When attacked, use reaction to impose disadvantage. No resource cost.' },
  },
};

export const GLOOM_STALKER_POWER = {
  firstTurnBurst: {
    level5: '3 attacks on turn 1 (Extra Attack + Dread Ambusher). One has +1d8.',
    level11: '3 attacks + Stalker\'s Flurry on miss = near-guaranteed 3 hits.',
    withActionSurge: '6 attacks turn 1 (Fighter 2 multiclass). One of the highest nova rounds in the game.',
  },
  darkvisionInvisibility: {
    effect: 'Creatures with darkvision can\'t see you in darkness. You\'re effectively invisible.',
    advantage: 'Advantage on attacks, disadvantage on attacks against you.',
    counters: 'Light sources, truesight, blindsight, tremorsense.',
  },
};

export const GLOOM_STALKER_BUILDS = [
  { build: 'GS 5 / Fighter 2 / GS X', benefit: 'Action Surge for 6 attacks turn 1. Best nova multiclass.', rating: 'S' },
  { build: 'GS 5 / Assassin 3', benefit: 'Surprise = auto-crits. 6 crit dice on Dread Ambusher attack.', rating: 'S' },
  { build: 'GS 5 / War Cleric 1', benefit: 'Bonus action attack WIS times/day. Heavy armor.', rating: 'A' },
  { build: 'GS 5 / Battle Master 3', benefit: 'Superiority dice on Dread Ambusher attacks. Precision Attack.', rating: 'A' },
  { build: 'Pure GS 20', benefit: 'Stalker\'s Flurry + Shadowy Dodge. Consistent damage and defense.', rating: 'A' },
];

export const GLOOM_STALKER_SPELLS = [
  { spell: 'Disguise Self', level: 1, note: 'Subclass spell. Free infiltration/social tool.' },
  { spell: 'Rope Trick', level: 2, note: 'Subclass spell. Safe short rest in hostile territory.' },
  { spell: 'Fear', level: 3, note: 'Subclass spell. AoE frighten. Enemies drop weapons and dash away.' },
  { spell: 'Pass Without Trace', level: 2, note: '+10 Stealth to whole party. Guarantees surprise.' },
  { spell: 'Spike Growth', level: 2, note: '2d4/5ft moved. Combine with pushes/pulls.' },
  { spell: 'Absorb Elements', level: 1, note: 'Halve damage, add to Dread Ambusher hit for extra burst.' },
];

export function dreadAmbusherDamage(weaponDamageAvg, dexMod, attacks) {
  const normalDmg = (weaponDamageAvg + dexMod) * attacks;
  const dreadExtra = weaponDamageAvg + dexMod + 4.5; // +1d8
  return normalDmg + dreadExtra;
}

export function firstTurnAttacks(hasExtraAttack, hasActionSurge) {
  let attacks = hasExtraAttack ? 2 : 1;
  attacks += 1; // Dread Ambusher
  if (hasActionSurge) attacks *= 2; // Action Surge doubles
  return attacks;
}
