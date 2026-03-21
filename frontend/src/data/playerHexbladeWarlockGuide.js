/**
 * playerHexbladeWarlockGuide.js
 * Player Mode: Hexblade Warlock — the CHA weapon master
 * Pure JS — no React dependencies.
 */

export const HEXBLADE_BASICS = {
  class: 'Warlock (Hexblade)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Shadowfell weapon patron. CHA to weapon attacks. Medium armor + shields. Best martial caster subclass.',
  note: 'Hexblade is widely considered the best Warlock patron AND the best 1-level dip in the game for CHA classes.',
};

export const HEXBLADE_FEATURES = [
  { feature: 'Hexblade\'s Curse', level: 1, effect: 'Bonus action: curse a creature. +PB to damage rolls. Crit on 19-20. Heal PB + CHA mod when it dies. Once per short rest.', note: 'Expanded crit range + bonus damage + healing on kill. Great for focus-fire targets.' },
  { feature: 'Hex Warrior', level: 1, effect: 'Proficiency with medium armor, shields, martial weapons. Use CHA for one weapon\'s attack/damage (or Pact Weapon always).', note: 'THE feature. CHA for attacks. No STR or DEX needed. Shields for AC. Everything keys off CHA.' },
  { feature: 'Accursed Specter', level: 6, effect: 'When you kill a humanoid, raise it as a specter under your control. Gains temp HP = half Warlock level. Once per long rest.', note: 'Free specter ally on humanoid kill. Modest stats but extra actions. Lasts until next long rest.' },
  { feature: 'Armor of Hexes', level: 10, effect: 'Cursed target hits you: roll d6. On 4+: attack misses regardless of roll.', note: '50% chance to negate any attack from your cursed target. Stacks with AC. Very strong defense.' },
  { feature: 'Master of Hexes', level: 14, effect: 'When cursed creature dies: transfer curse to another creature within 30ft (no rest cost).', note: 'Curse chains from enemy to enemy. Never waste your curse. Continuous bonus damage all combat.' },
];

export const HEXBLADE_BUILDS = [
  { build: 'EB + Hexblade', detail: 'Eldritch Blast + Agonizing Blast + Hex + Hexblade\'s Curse. Standard blaster build with medium armor + shield for defense.', rating: 'S' },
  { build: 'Blade Pact Hexblade', detail: 'Pact of the Blade + Thirsting Blade + Lifedrinker. Full melee warrior. CHA to attacks + CHA necrotic per hit.', rating: 'S' },
  { build: 'PAM + GWM Hexblade', detail: 'Polearm Master + Great Weapon Master. CHA for attacks. Bonus action butt-end. -5/+10 with Hexblade\'s Curse crit-on-19.', rating: 'S' },
  { build: 'Shield + Rapier Hexblade', detail: 'One-handed + shield. Dueling Fighting Style (from feat or multiclass). High AC + consistent damage.', rating: 'A' },
];

export const HEXBLADE_DIP_ANALYSIS = {
  whatYouGet: [
    'CHA for weapon attack and damage (one weapon)',
    'Medium armor proficiency',
    'Shield proficiency',
    'Shield spell (L1 slot)',
    'Hexblade\'s Curse (+PB damage, crit on 19-20)',
    'Hex spell (bonus action, 1d6 per hit)',
  ],
  bestDipFor: [
    { class: 'Paladin', reason: 'CHA for everything. Medium armor → heavy (Paladin). Shield spell. Single stat build.' },
    { class: 'Bard (Swords/Valor)', reason: 'Medium armor + shield + CHA weapons. Full martial capability.' },
    { class: 'Sorcerer', reason: 'Armor + Shield spell + CHA weapons if melee. Or just Shield spell for defense.' },
  ],
  note: 'Hexblade 1 is so good that it warps multiclassing. Almost every CHA class benefits from a 1-level dip.',
};

export const HEXBLADES_CURSE_MATH = [
  { level: 1, profBonus: 2, extraDPR: 'Per hit: +2 damage. Crit on 19-20 (10% chance).', note: 'At L1: +2 per hit is significant.' },
  { level: 5, profBonus: 3, extraDPR: '+3 per hit × 2 attacks = +6 per round. 10% crit.', note: 'Starting to add up.' },
  { level: 11, profBonus: 4, extraDPR: '+4 per hit × 3 beams = +12 per round. 10% crit.', note: 'Very strong with EB beams.' },
  { level: 17, profBonus: 6, extraDPR: '+6 per hit × 4 beams = +24 per round. 10% crit.', note: 'Massive bonus damage at high levels.' },
];

export function hexbladesCurseDamagePerRound(profBonus, attacksPerRound) {
  return profBonus * attacksPerRound;
}

export function hexWarriorAC(chaHasMediumArmor = true, hasShield = true) {
  // Half-plate (15 + DEX max 2) + Shield (2)
  const baseAC = chaHasMediumArmor ? 17 : 12; // half-plate vs leather
  return baseAC + (hasShield ? 2 : 0);
}

export function armorOfHexesMissChance() {
  return 0.5; // 50% chance to negate hit (roll 4+ on d6)
}
